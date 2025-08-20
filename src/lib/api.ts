import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/constants/api';

export type RequestContext = {
	req: NextApiRequest | NextRequest;
};

export interface ApiResponse<T = unknown> {
	data?: T;
	message?: string;
	error?: string;
}

export interface ApiError extends Error {
	status: number;
	response?: unknown;
}

/**
 * Classe de erro personalizada para requisições da API
 */
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
 * Cliente API consolidado e centralizado
 *
 * Funcionalidades:
 * - Autenticação automática via NextAuth
 * - Tratamento de erros padronizado
 * - Timeout configurável
 * - Headers globais
 * - Suporte a Server-Side e Client-Side
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
	 * Obtém o token de autenticação do NextAuth
	 */
	private async getAuthToken(ctx?: RequestContext): Promise<string | null> {
		try {
			// Servidor (SSR/API Routes)
			if (ctx?.req) {
				const token = await getToken({
					req: ctx.req as Parameters<typeof getToken>[0]['req'],
					secret: process.env.NEXTAUTH_SECRET!
				});
				return (token as { accessToken?: string })?.accessToken ?? null;
			}

			// Cliente (Browser)
			if (typeof window !== 'undefined') {
				const session = await getSession();
				return session?.accessToken ?? null;
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
	private async createHeaders(customHeaders: HeadersInit = {}, ctx?: RequestContext): Promise<HeadersInit> {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...this.globalHeaders,
			...customHeaders
		};

		const token = await this.getAuthToken(ctx);

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
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
					const data = errorData as { message?: string; error?: string };
					errorMessage = data.message || data.error || errorMessage;
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
		customHeaders: HeadersInit = {},
		ctx?: RequestContext
	): Promise<T> {
		const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;
		const headers = await this.createHeaders(customHeaders, ctx);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method,
				headers,
				body: data ? JSON.stringify(data) : null,
				signal: controller.signal
			});

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

			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error('Tempo limite da requisição excedido');
			}

			throw error;
		}
	}

	/**
	 * Requisição GET
	 */
	async get<T>(endpoint: string, customHeaders?: HeadersInit, ctx?: RequestContext): Promise<T> {
		return this.request<T>('GET', endpoint, null, customHeaders, ctx);
	}

	/**
	 * Requisição POST
	 */
	async post<T>(endpoint: string, data: unknown, customHeaders?: HeadersInit, ctx?: RequestContext): Promise<T> {
		return this.request<T>('POST', endpoint, data, customHeaders, ctx);
	}

	/**
	 * Requisição PUT
	 */
	async put<T>(endpoint: string, data: unknown, customHeaders?: HeadersInit, ctx?: RequestContext): Promise<T> {
		return this.request<T>('PUT', endpoint, data, customHeaders, ctx);
	}

	/**
	 * Requisição PATCH
	 */
	async patch<T>(endpoint: string, data: unknown, customHeaders?: HeadersInit, ctx?: RequestContext): Promise<T> {
		return this.request<T>('PATCH', endpoint, data, customHeaders, ctx);
	}

	/**
	 * Requisição DELETE
	 */
	async delete<T>(endpoint: string, customHeaders?: HeadersInit, ctx?: RequestContext): Promise<T> {
		return this.request<T>('DELETE', endpoint, null, customHeaders, ctx);
	}

	/**
	 * Função utilitária para fazer upload de arquivos
	 */
	async upload<T>(
		endpoint: string,
		formData: FormData,
		customHeaders?: HeadersInit,
		ctx?: RequestContext
	): Promise<T> {
		const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;

		// Para upload, não definimos Content-Type para permitir boundary automático
		const headers = await this.createHeaders({}, ctx);
		delete (headers as Record<string, string>)['Content-Type'];

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
