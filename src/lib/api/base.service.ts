import { api, FetchApiError } from '@/lib/api/client';

/**
 * Serviço base para todos os services
 *
 * Fornece:
 * - Padronização de chamadas API
 * - Tratamento de erro unificado
 * - Logging centralizado
 * - Type safety
 */
export abstract class BaseService {
	protected readonly serviceName: string;

	constructor(serviceName: string) {
		this.serviceName = serviceName;
	}

	/**
	 * Executa uma requisição GET com tratamento de erro padronizado
	 */
	protected async get<T>(
		endpoint: string,
		options?: {
			fallback?: T;
			context?: string;
		}
	): Promise<T> {
		try {
			const response = await api.get<T>(endpoint);
			this.logSuccess('GET', endpoint);
			return response;
		} catch (error) {
			return this.handleError('GET', endpoint, error, options?.fallback, options?.context);
		}
	}

	/**
	 * Executa uma requisição POST com tratamento de erro padronizado
	 */
	protected async post<T>(
		endpoint: string,
		data: unknown,
		options?: {
			fallback?: T;
			context?: string;
		}
	): Promise<T> {
		try {
			const response = await api.post<T>(endpoint, data);
			this.logSuccess('POST', endpoint);
			return response;
		} catch (error) {
			return this.handleError('POST', endpoint, error, options?.fallback, options?.context);
		}
	}

	/**
	 * Executa uma requisição PUT com tratamento de erro padronizado
	 */
	protected async put<T>(
		endpoint: string,
		data: unknown,
		options?: {
			fallback?: T;
			context?: string;
		}
	): Promise<T> {
		try {
			const response = await api.put<T>(endpoint, data);
			this.logSuccess('PUT', endpoint);
			return response;
		} catch (error) {
			return this.handleError('PUT', endpoint, error, options?.fallback, options?.context);
		}
	}

	/**
	 * Executa uma requisição DELETE com tratamento de erro padronizado
	 */
	protected async delete<T>(
		endpoint: string,
		options?: {
			fallback?: T;
			context?: string;
		}
	): Promise<T> {
		try {
			const response = await api.delete<T>(endpoint);
			this.logSuccess('DELETE', endpoint);
			return response;
		} catch (error) {
			return this.handleError('DELETE', endpoint, error, options?.fallback, options?.context);
		}
	}

	/**
	 * Trata erros de forma padronizada
	 */
	private handleError<T>(method: string, endpoint: string, error: unknown, fallback?: T, context?: string): T {
		const errorMessage = error instanceof FetchApiError ? error.message : String(error);

		// Log do erro em desenvolvimento
		if (import.meta.env.DEV) {
			console.error(`❌ ${this.serviceName} ${method} ${endpoint}:`, error);
		}

		// Se há fallback, usar e logar
		if (fallback !== undefined) {
			if (import.meta.env.DEV) {
				console.warn(`🔄 ${this.serviceName} usando fallback para ${endpoint}`);
			}

			return fallback;
		}

		// Se não há fallback, propagar o erro
		throw error;
	}

	/**
	 * Log de sucesso (apenas em desenvolvimento)
	 */
	private logSuccess(method: string, endpoint: string): void {
		if (import.meta.env.DEV) {
			// eslint-disable-next-line no-console
			console.log(`✅ ${this.serviceName} ${method} ${endpoint} - Success`);
		}
	}

	/**
	 * Cria uma mensagem de erro padronizada
	 */
	protected createErrorMessage(operation: string): string {
		return `Erro ao ${operation}. Tente novamente.`;
	}

	/**
	 * Valida se um ID é válido
	 */
	protected validateId(id: string | number, fieldName = 'ID'): void {
		if (!id || (typeof id === 'string' && id.trim() === '')) {
			throw new Error(`${fieldName} é obrigatório`);
		}
	}

	/**
	 * Valida se dados obrigatórios estão presentes
	 */
	protected validateRequired(data: Record<string, any>, fields: string[]): void {
		const missingFields = fields.filter(
			(field) =>
				data[field] === undefined ||
				data[field] === null ||
				(typeof data[field] === 'string' && (data[field] as string).trim() === '')
		);

		if (missingFields.length > 0) {
			throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
		}
	}
}

/**
 * Tipos base para responses de services
 */
export interface ServiceResponse<T = unknown> {
	success?: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface PaginatedResponse<T = unknown> {
	data: T[];
	total: number;
	page: number;
	per_page: number;
	last_page: number;
}

export interface ErrorResponse {
	error: string;
	message?: string;
	status?: number;
}
