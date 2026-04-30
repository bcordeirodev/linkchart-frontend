import { API_BASE_URL, REQUEST_TIMEOUT } from '../api/endpoints';

// NOTA: conversão camelCase <-> snake_case ficou planejada para Onda 0b,
// quando os tipos em src/types/ e features/*/types/ forem migrados. Até lá
// mantemos snake_case puro passando pela fronteira.

/**
 * Estrutura canônica do erro que chega do backend (após Onda 0 do refactor).
 * O middleware NormalizeApiResponse garante este formato para qualquer 4xx/5xx.
 */
export interface ApiErrorPayload {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

/**
 * Erro lançado pelo cliente HTTP. Traz o payload normalizado + status + mensagem
 * pronta para exibição.
 */
export class ApiError extends Error {
	readonly status: number;
	readonly code: string;
	readonly details?: Record<string, unknown>;

	constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
		this.details = details;
	}

	static fromResponse(status: number, body: unknown): ApiError {
		if (body && typeof body === 'object' && 'error' in body) {
			const err = (body as { error: unknown }).error;

			if (err && typeof err === 'object') {
				const e = err as Partial<ApiErrorPayload>;
				return new ApiError(status, e.code ?? 'UNKNOWN_ERROR', e.message ?? `HTTP ${status}`, e.details);
			}
		}

		return new ApiError(status, 'UNKNOWN_ERROR', `HTTP ${status}`, body ? { body } : undefined);
	}
}

// Alias legado — muitos arquivos ainda importam `FetchApiError`.
export { ApiError as FetchApiError };

interface RequestOptions {
	/** Headers extras. */
	headers?: HeadersInit;
	/** Query-string em objeto. */
	query?: Record<string, unknown>;
	/** Se false, não envia o Authorization. Default: true. */
	auth?: boolean;
	/** Desabilita unwrap do envelope {data} (quando você precisa de {data, meta}). */
	rawEnvelope?: boolean;
}

interface RequestBodyInit extends RequestOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
}

/**
 * Cliente HTTP único — todo módulo fala com a API através dele.
 *
 * Responsabilidades:
 * - Autenticação (Bearer via localStorage.token)
 * - Conversão camelCase ⇄ snake_case na fronteira (request out, response in)
 * - Unwrap automático do envelope `{ data }` introduzido na Onda 0
 * - Tradução do envelope de erro `{ error: { code, message, details } }` em ApiError tipado
 * - Timeout configurável
 */
class ApiClient {
	private readonly baseURL: string;
	private readonly timeout: number;
	private readonly globalHeaders: Record<string, string> = {};

	constructor(baseURL: string = API_BASE_URL, timeout: number = REQUEST_TIMEOUT) {
		this.baseURL = baseURL;
		this.timeout = timeout;
	}

	setGlobalHeaders(headers: Record<string, string>): void {
		Object.assign(this.globalHeaders, headers);
	}

	removeGlobalHeaders(headerKeys: string[]): void {
		headerKeys.forEach((key) => delete this.globalHeaders[key]);
	}

	clearGlobalHeaders(): void {
		for (const key of Object.keys(this.globalHeaders)) {
			delete this.globalHeaders[key];
		}
	}

	async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
		return this.request<T>({ method: 'GET', ...options }, endpoint);
	}

	async post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
		return this.request<T>({ method: 'POST', body, ...options }, endpoint);
	}

	async put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
		return this.request<T>({ method: 'PUT', body, ...options }, endpoint);
	}

	async patch<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
		return this.request<T>({ method: 'PATCH', body, ...options }, endpoint);
	}

	async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
		return this.request<T>({ method: 'DELETE', ...options }, endpoint);
	}

	/**
	 * POST form-urlencoded (evita preflight CORS). Usado em fluxos de auth
	 * legados. Aplica unwrap do envelope, mas sem Authorization header.
	 */
	async postForm<T>(endpoint: string, form: Record<string, string>, options: RequestOptions = {}): Promise<T> {
		const url = this.buildUrl(endpoint);
		const body = new URLSearchParams();
		for (const [k, v] of Object.entries(form)) {
			if (v !== undefined && v !== null) {
				body.append(k, String(v));
			}
		}
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), this.timeout);
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body,
				credentials: 'include',
				signal: controller.signal
			});
			clearTimeout(timer);
			return this.handleResponse<T>(res, options);
		} finally {
			clearTimeout(timer);
		}
	}

	/**
	 * Upload multipart. Envia FormData cru (sem case conversion) e unwrap
	 * padrão na resposta.
	 */
	async upload<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
		const url = this.buildUrl(endpoint);
		const headers = await this.buildHeaders(options.headers, options.auth);
		delete headers['Content-Type']; // boundary automático
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), this.timeout);
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers,
				body: formData,
				signal: controller.signal
			});
			clearTimeout(timer);
			return this.handleResponse<T>(res, options);
		} finally {
			clearTimeout(timer);
		}
	}

	private async request<T>(init: RequestBodyInit, endpoint: string): Promise<T> {
		const url = this.buildUrl(endpoint, init.query);
		const headers = await this.buildHeaders(init.headers, init.auth);

		let body: BodyInit | null = null;

		if (init.body !== undefined && init.body !== null) {
			body = JSON.stringify(init.body);
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), this.timeout);

		try {
			const res = await fetch(url, { method: init.method, headers, body, signal: controller.signal });
			clearTimeout(timer);
			return this.handleResponse<T>(res, init);
		} catch (err) {
			clearTimeout(timer);

			if (err instanceof ApiError) {
				throw err;
			}

			if (err instanceof Error && err.name === 'AbortError') {
				throw new ApiError(0, 'TIMEOUT', 'Tempo limite da requisição excedido.');
			}

			throw err;
		}
	}

	private async handleResponse<T>(res: Response, options: RequestOptions): Promise<T> {
		const raw = await this.parseBody(res);

		if (!res.ok) {
			throw ApiError.fromResponse(res.status, raw);
		}

		if (raw === null || raw === undefined) {
			return undefined as T;
		}

		// Unwrap do envelope { data } introduzido na Onda 0.
		if (options.rawEnvelope) {
			return raw as T;
		}

		if (raw && typeof raw === 'object' && 'data' in (raw as Record<string, unknown>)) {
			return (raw as { data: T }).data;
		}

		return raw as T;
	}

	private async parseBody(res: Response): Promise<unknown> {
		const len = res.headers.get('content-length');

		if (len === '0' || res.status === 204) {
			return null;
		}

		const type = res.headers.get('content-type') ?? '';

		if (type.includes('application/json')) {
			try {
				return await res.json();
			} catch {
				return null;
			}
		}

		const text = await res.text();
		return text.length > 0 ? text : null;
	}

	private buildUrl(endpoint: string, query?: Record<string, unknown>): string {
		const path = endpoint.startsWith('http') ? endpoint : `${this.baseURL}/${endpoint.replace(/^\//, '')}`;

		if (!query || Object.keys(query).length === 0) {
			return path;
		}

		const params = new URLSearchParams();
		for (const [k, v] of Object.entries(query)) {
			if (v === undefined || v === null) {
				continue;
			}

			if (Array.isArray(v)) {
				v.forEach((item) => params.append(k, String(item)));
			} else {
				params.append(k, String(v));
			}
		}
		const qs = params.toString();
		return qs ? `${path}?${qs}` : path;
	}

	private async buildHeaders(custom?: HeadersInit, auth = true): Promise<Record<string, string>> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...this.globalHeaders,
			...(custom as Record<string, string> | undefined)
		};

		if (typeof window !== 'undefined' && window.location) {
			headers['Origin'] = window.location.origin;
		}

		if (auth) {
			const token = await this.readToken();

			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}

		return headers;
	}

	private async readToken(): Promise<string | null> {
		if (typeof window === 'undefined') {
			return null;
		}

		try {
			const direct = localStorage.getItem('token');

			if (direct) {
				return direct;
			}

			const user = localStorage.getItem('user');

			if (user) {
				const parsed = JSON.parse(user) as { token?: string; accessToken?: string };
				return parsed.token ?? parsed.accessToken ?? null;
			}
		} catch {
			/* ignore */
		}
		return null;
	}
}

export const api = new ApiClient();
export const apiClient = api;
export const apiService = api;
export default api;

// Compat: tipo ApiResponse<T> antigo. Usado só por código legado; novos módulos
// tipam o retorno diretamente (o cliente já fez o unwrap).
export interface ApiResponse<T = unknown> {
	data?: T;
	message?: string;
	error?: ApiErrorPayload | string;
}
