import { API_BASE_URL, REQUEST_TIMEOUT } from '../api/endpoints';

export interface ApiResponse<T = unknown> {
	data?: T;
	message?: string;
	error?: string;
}

export interface ApiError extends Error {
	status: number;
	response?: unknown;
}

export class FetchApiError extends Error {
	status: number;
	data: unknown;

	constructor(status: number, data: unknown) {
		super(`API Error: ${status}`);
		this.status = status;
		this.data = data;
		this.name = 'FetchApiError';
	}
}

/**
 * Cliente API
 *
 * Funcionalidades:
 * - Autenticação automática via localStorage
 * - Tratamento de erros padronizado
 * - Timeout configurável
 * - Headers globais
 * - Type safety completo
 */
class ApiClient {
	private baseURL: string;
	private timeout: number;
	private globalHeaders: Record<string, string> = {};

	constructor(baseURL: string = API_BASE_URL, timeout: number = REQUEST_TIMEOUT) {
		this.baseURL = baseURL;
		this.timeout = timeout;
	}

	/**
	 * Define headers globais que serão incluídos em todas as requisições
	 */
	setGlobalHeaders(headers: Record<string, string>): void {
		Object.assign(this.globalHeaders, headers);
	}

	/**
	 * Remove headers globais específicos
	 */
	removeGlobalHeaders(headerKeys: string[]): void {
		headerKeys.forEach((key) => {
			delete this.globalHeaders[key];
		});
	}

	/**
	 * Limpa todos os headers globais
	 */
	clearGlobalHeaders(): void {
		this.globalHeaders = {};
	}

	/**
	 * Obtém o token de autenticação do localStorage
	 */
	private async getAuthToken(): Promise<string | null> {
		try {
			// Cliente (Browser)
			if (typeof window !== 'undefined') {
				// Primeiro tenta buscar o token diretamente
				const token = localStorage.getItem('token');

				if (token) {
					return token;
				}

				// Fallback: busca no objeto user (para compatibilidade)
				const user = localStorage.getItem('user');

				if (user) {
					const userData = JSON.parse(user);
					return userData.token || userData.accessToken || null;
				}
			}

			return null;
		} catch (error) {
			console.error('Erro ao obter token de autenticação:', error);
			return null;
		}
	}

	/**
	 * Cria headers padrão para requisições
	 */
	private async createHeaders(customHeaders: HeadersInit = {}): Promise<Record<string, string>> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...this.globalHeaders,
			...(customHeaders as Record<string, string>)
		};

		// Garantir que o header Origin seja sempre enviado para CORS
		if (typeof window !== 'undefined' && window.location) {
			headers['Origin'] = window.location.origin;
		}

		const token = await this.getAuthToken();

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	/** Helper: monta URLSearchParams a partir de um objeto simples */
	private buildFormUrlEncoded(params: Record<string, string>): URLSearchParams {
		const usp = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				usp.append(key, String(value));
			}
		});
		return usp;
	}

	/**
	 * Processa e padroniza erros de resposta
	 */
	private async handleError(response: Response): Promise<never> {
		let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
		let errorData: unknown = null;

		try {
			const contentType = response.headers.get('content-type');

			if (contentType?.includes('application/json')) {
				errorData = await response.json();

				if (typeof errorData === 'object' && errorData !== null) {
					const data = errorData as {
						message?: string;
						error?: string;
						errors?: Record<string, string[]>;
					};

					// Se há erros específicos de validação, formatá-los
					if (data.errors && typeof data.errors === 'object') {
						const validationErrors = Object.entries(data.errors)
							.map(
								([field, messages]) =>
									`${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
							)
							.join('; ');
						errorMessage = `Erros de validação: ${validationErrors}`;
					} else {
						errorMessage = data.message || data.error || errorMessage;
					}
				}
			} else {
				const textError = await response.text();

				if (textError) {
					errorMessage = textError;
				}
			}
		} catch {
			// Ignora erros de parsing, mantém mensagem padrão
		}

		const error = new FetchApiError(response.status, errorData);
		error.message = errorMessage;

		throw error;
	}

	/**
	 * Executa uma requisição HTTP com todas as funcionalidades
	 */
	private async request<T>(
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
		endpoint: string,
		data: unknown = null,
		customHeaders: HeadersInit = {}
	): Promise<T> {
		const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;
		const headers = await this.createHeaders(customHeaders);

		// Request preparado

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method,
				headers,
				body: data ? JSON.stringify(data) : null,
				signal: controller.signal
			});

			// Response recebido

			clearTimeout(timeoutId);

			if (!response.ok) {
				await this.handleError(response);
			}

			// Verifica se há conteúdo para parsear
			const contentLength = response.headers.get('content-length');

			if (contentLength === '0' || response.status === 204) {
				return {} as T;
			}

			const contentType = response.headers.get('content-type');

			if (contentType?.includes('application/json')) {
				return await response.json();
			}

			return (await response.text()) as unknown as T;
		} catch (error) {
			clearTimeout(timeoutId);

			throw error;
		}
	}

	/**
	 * Requisição GET
	 */
	async get<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
		return this.request<T>('GET', endpoint, null, customHeaders);
	}

	/**
	 * Requisição POST
	 */
	async post<T>(endpoint: string, data: unknown, customHeaders?: HeadersInit): Promise<T> {
		return this.request<T>('POST', endpoint, data, customHeaders);
	}

	/**
	 * Requisição POST via application/x-www-form-urlencoded (evita preflight)
	 */
	async postForm<T>(endpoint: string, form: Record<string, string>): Promise<T> {
		const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		const body = this.buildFormUrlEncoded(form);

		// Usar somente headers simples para evitar preflight
		const headers: HeadersInit = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body,
				signal: controller.signal,
				credentials: 'include'
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				await this.handleError(response);
			}

			const contentType = response.headers.get('content-type');
			if (contentType?.includes('application/json')) {
				return await response.json();
			}

			return (await response.text()) as unknown as T;
		} catch (error) {
			clearTimeout(timeoutId);

			throw error;
		}
	}

	/**
	 * Requisição PUT
	 */
	async put<T>(endpoint: string, data: unknown, customHeaders?: HeadersInit): Promise<T> {
		return this.request<T>('PUT', endpoint, data, customHeaders);
	}

	/**
	 * Requisição PATCH
	 */
	async patch<T>(endpoint: string, data: unknown, customHeaders?: HeadersInit): Promise<T> {
		return this.request<T>('PATCH', endpoint, data, customHeaders);
	}

	/**
	 * Requisição DELETE
	 */
	async delete<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
		return this.request<T>('DELETE', endpoint, null, customHeaders);
	}

	/**
	 * Função utilitária para fazer upload de arquivos
	 */
	async upload<T>(endpoint: string, formData: FormData, customHeaders?: HeadersInit): Promise<T> {
		const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;

		// Para upload, não definimos Content-Type para permitir boundary automático
		const headers = await this.createHeaders({});
		delete (headers as Record<string, string>)['Content-Type'];

		// Garantir Origin para uploads também
		if (typeof window !== 'undefined' && window.location) {
			(headers as Record<string, string>)['Origin'] = window.location.origin;
		}

		// Adiciona headers customizados (exceto Content-Type)
		if (customHeaders) {
			Object.entries(customHeaders).forEach(([key, value]) => {
				if (key.toLowerCase() !== 'content-type') {
					(headers as Record<string, string>)[key] = value as string;
				}
			});
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: formData,
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				await this.handleError(response);
			}

			const contentType = response.headers.get('content-type');
			if (contentType?.includes('application/json')) {
				return await response.json();
			}

			return (await response.text()) as unknown as T;
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error('Tempo limite da requisição excedido');
			}

			throw error;
		}
	}
}

// Instância singleton do cliente API
export const api = new ApiClient();

// Exportações para compatibilidade
export const apiClient = api;
export const apiService = api;

// Export default para compatibilidade com imports existentes
export default api;
