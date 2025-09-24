import { BaseService } from './base.service';

/**
 * Serviço para operações públicas de links
 *
 * FUNCIONALIDADE:
 * - Encurtamento de URLs sem autenticação
 * - Analytics básicos públicos
 * - Informações básicas de links públicos
 */
export interface CreatePublicLinkRequest {
	original_url: string;
	title?: string;
	custom_slug?: string;
}

export interface PublicLinkResponse {
	id: string;
	slug: string;
	title: string | null;
	original_url: string;
	short_url: string;
	clicks: number;
	is_active: boolean;
	created_at: string;
	expires_at: string | null;
	is_public: boolean;
	has_analytics: boolean;
	domain: string;
}

export interface BasicAnalyticsResponse {
	total_clicks: number;
	created_at: string;
	is_active: boolean;
	short_url: string;
	has_analytics: boolean;
}

class PublicLinkService extends BaseService {
	/**
	 * Cria um novo link encurtado público
	 */
	async createPublicLink(data: CreatePublicLinkRequest): Promise<PublicLinkResponse> {
		const response = await this.post<any>('/api/public/shorten', data);
		// A resposta da API já vem com os dados diretamente em response.data
		return response.data;
	}

	/**
	 * Obtém informações básicas de um link pelo slug
	 */
	async getLinkBySlug(slug: string): Promise<PublicLinkResponse> {
		const response = await this.get<any>(`/api/public/link/${slug}`);
		return response.data.data;
	}

	/**
	 * Obtém analytics básicos de um link público
	 */
	async getBasicAnalytics(slug: string): Promise<BasicAnalyticsResponse> {
		const response = await this.get<any>(`/api/public/analytics/${slug}`);
		return response.data;
	}

	/**
	 * Valida uma URL antes de encurtar
	 */
	validateUrl(url: string): boolean {
		try {
			const urlObj = new URL(url);
			return ['http:', 'https:'].includes(urlObj.protocol);
		} catch {
			return false;
		}
	}

	/**
	 * Formata uma URL adicionando protocolo se necessário
	 */
	formatUrl(url: string): string {
		if (!url) {
			return '';
		}

		// Remove espaços
		url = url.trim();

		// Adiciona https:// se não tiver protocolo
		if (!/^https?:\/\//i.test(url)) {
			url = `https://${url}`;
		}

		return url;
	}

	/**
	 * Gera URL de analytics básicos
	 */
	getBasicAnalyticsUrl(slug: string): string {
		return `/basic-analytics/${slug}`;
	}

	/**
	 * Copia texto para área de transferência
	 */
	async copyToClipboard(text: string): Promise<boolean> {
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
				return true;
			} else {
				// Fallback para navegadores sem suporte
				const textArea = document.createElement('textarea');
				textArea.value = text;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				const result = document.execCommand('copy');
				textArea.remove();
				return result;
			}
		} catch (error) {
			console.error('Erro ao copiar para área de transferência:', error);
			return false;
		}
	}
}

// Export singleton instance
export const publicLinkService = new PublicLinkService('PublicLinkService');
export default publicLinkService;
