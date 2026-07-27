import { api } from "../lib/api/client";

/**
 * Abstract base class for every concrete service in `src/services/`.
 *
 * Wraps the singleton `ApiClient` (`api`) with typed `get/post/put/delete` helpers
 * that share a uniform error-handling surface. Subclasses receive:
 *
 * - Envelope unwrap (`{data, meta?, message?}` -> `T`) inherited from `ApiClient`.
 * - Optional `fallback` value returned when a request throws (graceful degradation).
 * - Lightweight ID/required-field validation helpers (`validateId`, `validateRequired`).
 *
 * Subclasses pass a `serviceName` to `super(...)` for identification only — it is
 * not currently surfaced in logs but kept for forward compatibility.
 */
export abstract class BaseService {
  protected readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Performs a `GET` request via the shared `ApiClient`.
   *
   * @param endpoint - relative path (e.g. `/api/links`); resolved against the Next.js rewrite proxy.
   * @param options - optional `fallback` returned on error and `context` tag for debugging.
   * @returns the unwrapped response body of type `T`.
   *
   * @remarks
   * If `options.fallback` is provided, errors are swallowed and the fallback is returned;
   * otherwise the original error propagates so callers can react.
   */
  protected async get<T>(
    endpoint: string,
    options?: {
      fallback?: T;
      context?: string;
    },
  ): Promise<T> {
    try {
      const response = await api.get<T>(endpoint);
      this.logSuccess("GET", endpoint);
      return response;
    } catch (error) {
      return this.handleError(
        "GET",
        endpoint,
        error,
        options?.fallback,
        options?.context,
      );
    }
  }

  /**
   * Performs a `POST` request with a JSON body via the shared `ApiClient`.
   *
   * @param endpoint - relative path (e.g. `/api/links`).
   * @param data - JSON-serializable payload sent as the request body.
   * @param options - optional `fallback` returned on error and `context` tag for debugging.
   * @returns the unwrapped response body of type `T`.
   */
  protected async post<T>(
    endpoint: string,
    data: unknown,
    options?: {
      fallback?: T;
      context?: string;
    },
  ): Promise<T> {
    try {
      const response = await api.post<T>(endpoint, data);
      this.logSuccess("POST", endpoint);
      return response;
    } catch (error) {
      return this.handleError(
        "POST",
        endpoint,
        error,
        options?.fallback,
        options?.context,
      );
    }
  }

  /**
   * Performs a `PUT` request with a JSON body via the shared `ApiClient`.
   *
   * @param endpoint - relative path (e.g. `/api/links/{id}`).
   * @param data - JSON-serializable payload sent as the request body.
   * @param options - optional `fallback` returned on error and `context` tag for debugging.
   * @returns the unwrapped response body of type `T`.
   */
  protected async put<T>(
    endpoint: string,
    data: unknown,
    options?: {
      fallback?: T;
      context?: string;
    },
  ): Promise<T> {
    try {
      const response = await api.put<T>(endpoint, data);
      this.logSuccess("PUT", endpoint);
      return response;
    } catch (error) {
      return this.handleError(
        "PUT",
        endpoint,
        error,
        options?.fallback,
        options?.context,
      );
    }
  }

  /**
   * Performs a `multipart/form-data` upload via the shared `ApiClient`.
   *
   * @param endpoint - relative path (e.g. `/api/bio/avatar`).
   * @param formData - browser `FormData` payload; the client lets `fetch`
   *   set the multipart boundary itself.
   * @param options - optional `fallback` returned on error and `context` tag for debugging.
   * @returns the unwrapped response body of type `T`.
   */
  protected async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: {
      fallback?: T;
      context?: string;
    },
  ): Promise<T> {
    try {
      const response = await api.upload<T>(endpoint, formData);
      this.logSuccess("POST", endpoint);
      return response;
    } catch (error) {
      return this.handleError(
        "POST",
        endpoint,
        error,
        options?.fallback,
        options?.context,
      );
    }
  }

  /**
   * Performs a `DELETE` request via the shared `ApiClient`, optionally with a
   * JSON body (e.g. the password/confirmation required by account deletion).
   *
   * @param endpoint - relative path (e.g. `/api/links/{id}`).
   * @param options - optional `data` (JSON body, e.g. the password/confirmation
   *   required by account deletion), `fallback` returned on error, and `context`
   *   tag for debugging. Keeping the body inside `options` preserves the original
   *   two-argument call shape used by existing callers.
   * @returns the unwrapped response body of type `T`.
   */
  protected async delete<T>(
    endpoint: string,
    options?: {
      data?: unknown;
      fallback?: T;
      context?: string;
    },
  ): Promise<T> {
    try {
      const response = await api.delete<T>(endpoint, options?.data);
      this.logSuccess("DELETE", endpoint);
      return response;
    } catch (error) {
      return this.handleError(
        "DELETE",
        endpoint,
        error,
        options?.fallback,
        options?.context,
      );
    }
  }

  /**
   * Centralised error handler used by `get/post/put/delete`.
   *
   * If `fallback` is defined, returns it instead of throwing — used by services
   * that prefer empty/default data over a hard failure (e.g. analytics widgets).
   * Otherwise rethrows the original error for the caller to handle.
   */
  private handleError<T>(
    _method: string,
    _endpoint: string,
    error: unknown,
    fallback?: T,
    _context?: string,
  ): T {
    // Erro registrado

    // Se há fallback, usar
    if (fallback !== undefined) {
      return fallback;
    }

    // Se não há fallback, propagar o erro
    throw error;
  }

  /**
   * Hook reserved for success-path logging.
   *
   * Currently a no-op; kept so subclasses or middleware can route success metrics
   * through a single seam in the future without touching every service.
   */
  private logSuccess(_method: string, _endpoint: string): void {
    // Success registrado silenciosamente
  }

  /**
   * Builds a localized, user-facing error message for an operation label.
   *
   * @param operation - short description of the action that failed (e.g. `"salvar link"`).
   * @returns a Portuguese sentence suitable for toast notifications.
   */
  protected createErrorMessage(operation: string): string {
    return `Erro ao ${operation}. Tente novamente.`;
  }

  /**
   * Throws if `id` is missing or an empty string.
   *
   * @param id - identifier to validate (string or number).
   * @param fieldName - human-readable label used in the error message.
   */
  protected validateId(id: string | number, fieldName = "ID"): void {
    if (!id || (typeof id === "string" && id.trim() === "")) {
      throw new Error(`${fieldName} é obrigatório`);
    }
  }

  /**
   * Throws if any field in `fields` is missing, `null`, or an empty string in `data`.
   *
   * @param data - object whose keys will be checked.
   * @param fields - list of required field names.
   */
  protected validateRequired(
    data: Record<string, unknown>,
    fields: string[],
  ): void {
    const missingFields = fields.filter(
      (field) =>
        data[field] === undefined ||
        data[field] === null ||
        (typeof data[field] === "string" &&
          (data[field] as string).trim() === ""),
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Campos obrigatórios faltando: ${missingFields.join(", ")}`,
      );
    }
  }
}

/**
 * Generic envelope for a single-resource service response.
 */
export interface ServiceResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Standard pagination envelope returned by Laravel paginators.
 */
export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

/**
 * Standard error envelope surfaced by `ApiClient` after normalization.
 */
export interface ErrorResponse {
  error: string;
  message?: string;
  status?: number;
}
