import { API_CONFIG } from "@/lib/api/endpoints";

import { BaseService } from "./base.service";

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

export interface PublicAnalyticsResponse {
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
  async createPublicLink(
    data: CreatePublicLinkRequest,
  ): Promise<PublicLinkResponse> {
    return this.post<PublicLinkResponse>(
      API_CONFIG.ENDPOINTS.PUBLIC.SHORTEN,
      data,
    );
  }

  /**
   * Obtém informações básicas de um link pelo slug
   */
  async getLinkBySlug(slug: string): Promise<PublicLinkResponse> {
    return this.get<PublicLinkResponse>(
      API_CONFIG.ENDPOINTS.PUBLIC.LINK_BY_SLUG(slug),
    );
  }

  /**
   * Obtém analytics públicos de um link
   */
  async getPublicAnalytics(slug: string): Promise<PublicAnalyticsResponse> {
    return this.get<PublicAnalyticsResponse>(
      API_CONFIG.ENDPOINTS.PUBLIC.ANALYTICS(slug),
    );
  }

  /**
   * Valida uma URL antes de encurtar
   */
  validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ["http:", "https:"].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Formata uma URL adicionando protocolo se necessário
   */
  formatUrl(url: string): string {
    if (!url) {
      return "";
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
   * Gera URL de analytics públicos
   */
  getPublicAnalyticsUrl(slug: string): string {
    return `/public-analytics/${slug}`;
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
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand("copy");
        textArea.remove();
        return result;
      }
    } catch (error) {
      console.error("Erro ao copiar para área de transferência:", error);
      return false;
    }
  }
}

// Export singleton instance
export const publicLinkService = new PublicLinkService("PublicLinkService");
export default publicLinkService;
