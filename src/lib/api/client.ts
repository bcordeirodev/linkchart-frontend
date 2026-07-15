import { API_BASE_URL, REQUEST_TIMEOUT } from "../api/endpoints";

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
 * pronta para exibição. Também propaga `X-Request-Id` do backend para correlacionar
 * com os logs (`AssignRequestId` middleware no Laravel grava o mesmo id em todo log
 * da request — veja `backend/CLAUDE.md` seção Logging).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }

  static fromResponse(
    status: number,
    body: unknown,
    requestId?: string,
  ): ApiError {
    if (body && typeof body === "object" && "error" in body) {
      const err = (body as { error: unknown }).error;

      if (err && typeof err === "object") {
        const e = err as Partial<ApiErrorPayload>;
        return new ApiError(
          status,
          e.code ?? "UNKNOWN_ERROR",
          e.message ?? `HTTP ${status}`,
          e.details,
          requestId,
        );
      }
    }

    return new ApiError(
      status,
      "UNKNOWN_ERROR",
      `HTTP ${status}`,
      body ? { body } : undefined,
      requestId,
    );
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
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
}

/**
 * HTTP client used by every `BaseService`.
 *
 * Responsibilities:
 * - Inject `Authorization: Bearer <token>` from `localStorage.token` (browser-only).
 * - Unwrap the `{data, meta?, message?}` success envelope (toggle off with `rawEnvelope: true`).
 * - Normalize errors into `ApiError` from the `{error: {code, message, details?}}` envelope.
 * - Apply an `AbortController` timeout (default `REQUEST_TIMEOUT`).
 *
 * Use relative paths (`/api/...`) — Next.js `next.config.ts` rewrites proxy them
 * to `process.env.API_URL`, eliminating CORS entirely in development.
 */
class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly globalHeaders: Record<string, string> = {};

  constructor(
    baseURL: string = API_BASE_URL,
    timeout: number = REQUEST_TIMEOUT,
  ) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Merges extra headers that will be sent with every subsequent request.
   *
   * @param headers - header name -> value map.
   */
  setGlobalHeaders(headers: Record<string, string>): void {
    Object.assign(this.globalHeaders, headers);
  }

  /**
   * Removes specific global headers previously set by `setGlobalHeaders`.
   *
   * @param headerKeys - header names to drop.
   */
  removeGlobalHeaders(headerKeys: string[]): void {
    headerKeys.forEach((key) => delete this.globalHeaders[key]);
  }

  /**
   * Drops all globally-merged headers, leaving only per-request defaults.
   */
  clearGlobalHeaders(): void {
    for (const key of Object.keys(this.globalHeaders)) {
      delete this.globalHeaders[key];
    }
  }

  /**
   * Performs a `GET` request and returns the unwrapped response body.
   *
   * @param endpoint - relative path (e.g. `/api/links`).
   * @param options - per-request `query`, `headers`, `auth`, `rawEnvelope`.
   * @returns the unwrapped response body of type `T`.
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ method: "GET", ...options }, endpoint);
  }

  /**
   * Performs a JSON-bodied `POST` request and returns the unwrapped response body.
   *
   * @param endpoint - relative path.
   * @param body - JSON-serializable payload.
   * @param options - per-request `query`, `headers`, `auth`, `rawEnvelope`.
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>({ method: "POST", body, ...options }, endpoint);
  }

  /**
   * Performs a JSON-bodied `PUT` request.
   *
   * @param endpoint - relative path.
   * @param body - JSON-serializable payload.
   * @param options - per-request `query`, `headers`, `auth`, `rawEnvelope`.
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>({ method: "PUT", body, ...options }, endpoint);
  }

  /**
   * Performs a JSON-bodied `PATCH` request.
   *
   * @param endpoint - relative path.
   * @param body - JSON-serializable payload.
   * @param options - per-request `query`, `headers`, `auth`, `rawEnvelope`.
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>({ method: "PATCH", body, ...options }, endpoint);
  }

  /**
   * Performs a `DELETE` request, optionally with a JSON body.
   *
   * @param endpoint - relative path.
   * @param body - optional JSON-serializable payload (e.g. a password/confirmation
   * for account deletion). Most `DELETE` calls omit this.
   * @param options - per-request `query`, `headers`, `auth`, `rawEnvelope`.
   */
  async delete<T>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>({ method: "DELETE", body, ...options }, endpoint);
  }

  /**
   * Performs an `application/x-www-form-urlencoded` `POST` to skip the CORS preflight.
   *
   * @param endpoint - relative path.
   * @param form - flat string -> string map serialized with `URLSearchParams`.
   * @param options - per-request options (unwrap still applies; sent without `Authorization`).
   *
   * @remarks Used by legacy auth flows (`signIn`) where the preflight would block the request.
   */
  async postForm<T>(
    endpoint: string,
    form: Record<string, string>,
    options: RequestOptions = {},
  ): Promise<T> {
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
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timer);
      return this.handleResponse<T>(res, options);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Performs a `multipart/form-data` upload; lets `fetch` set the multipart boundary.
   *
   * @param endpoint - relative path.
   * @param formData - browser `FormData` payload (sent as-is).
   * @param options - per-request options; envelope unwrap still applies.
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = await this.buildHeaders(options.headers, options.auth);
    delete headers["Content-Type"]; // boundary automático
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timer);
      return this.handleResponse<T>(res, options);
    } finally {
      clearTimeout(timer);
    }
  }

  private async request<T>(
    init: RequestBodyInit,
    endpoint: string,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, init.query);
    const headers = await this.buildHeaders(init.headers, init.auth);

    let body: BodyInit | null = null;

    if (init.body !== undefined && init.body !== null) {
      body = JSON.stringify(init.body);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method: init.method,
        headers,
        body,
        // Send the httpOnly auth_token cookie (set by the backend on
        // auth0-exchange) so requests authenticate without a JS-readable token.
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timer);
      return this.handleResponse<T>(res, init);
    } catch (err) {
      clearTimeout(timer);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(
          0,
          "TIMEOUT",
          "Tempo limite da requisição excedido.",
        );
      }

      throw err;
    }
  }

  private async handleResponse<T>(
    res: Response,
    options: RequestOptions,
  ): Promise<T> {
    const raw = await this.parseBody(res);
    const requestId = res.headers.get("X-Request-Id") ?? undefined;

    if (!res.ok) {
      throw ApiError.fromResponse(res.status, raw, requestId);
    }

    if (raw === null || raw === undefined) {
      return undefined as T;
    }

    // Unwrap do envelope { data } introduzido na Onda 0.
    if (options.rawEnvelope) {
      return raw as T;
    }

    if (
      raw &&
      typeof raw === "object" &&
      "data" in (raw as Record<string, unknown>)
    ) {
      return (raw as { data: T }).data;
    }

    return raw as T;
  }

  private async parseBody(res: Response): Promise<unknown> {
    const len = res.headers.get("content-length");

    if (len === "0" || res.status === 204) {
      return null;
    }

    const type = res.headers.get("content-type") ?? "";

    if (type.includes("application/json")) {
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
    const path = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}/${endpoint.replace(/^\//, "")}`;

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

  private async buildHeaders(
    custom?: HeadersInit,
    // Retained for call-site compatibility. Authentication now travels via the
    // httpOnly `auth_token` cookie (sent with `credentials: "include"`), so no
    // Authorization header is built from client-readable storage.
    _auth = true,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...this.globalHeaders,
      ...(custom as Record<string, string> | undefined),
    };

    if (typeof window !== "undefined" && window.location) {
      headers["Origin"] = window.location.origin;
    }

    return headers;
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
