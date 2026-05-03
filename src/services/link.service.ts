import { api } from "../lib/api/client";
import { API_CONFIG } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

import type {
  LinkClicksListParams,
  LinkClicksListResponse,
} from "@/features/links/types/click";
import type {
  LinkCreateRequest,
  LinkResponse,
  LinkUpdateRequest,
} from "@/types";

// Extend types to match Record<string, unknown>
interface LinkCreateRequestExtended
  extends LinkCreateRequest,
    Record<string, unknown> {}
interface LinkUpdateRequestExtended
  extends LinkUpdateRequest,
    Record<string, unknown> {}

/**
 * Serviço para gerenciamento de links
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

// Tipos centralizados importados de @/types

/**
 * Classe de serviço para links usando BaseService
 */
export default class LinkService extends BaseService {
  constructor() {
    super("LinkService");
  }

  /**
   * Cria um novo link encurtado
   */
  async save(body: LinkCreateRequestExtended): Promise<LinkResponse> {
    this.validateRequired(body, ["original_url"]);

    return this.post<LinkResponse>(API_CONFIG.ENDPOINTS.CREATE_LINK, body, {
      context: "create_link",
    });
  }

  /**
   * Atualiza um link existente
   */
  async update(
    id: string,
    body: LinkUpdateRequestExtended,
  ): Promise<LinkResponse> {
    this.validateId(id, "Link ID");

    return this.put<LinkResponse>(API_CONFIG.ENDPOINTS.UPDATE_LINK(id), body, {
      context: "update_link",
    });
  }

  /**
   * Busca todos os links do usuário
   */
  async all(): Promise<LinkResponse[]> {
    return this.get<LinkResponse[]>(API_CONFIG.ENDPOINTS.LINKS, {
      context: "get_all_links",
    });
  }

  /**
   * Busca um link específico por ID
   */
  async findOne(id: string): Promise<LinkResponse> {
    this.validateId(id, "Link ID");

    return this.get<LinkResponse>(API_CONFIG.ENDPOINTS.LINK(id), {
      context: "get_link_by_id",
    });
  }

  /**
   * Remove um link
   */
  async remove(id: string): Promise<{ message: string }> {
    this.validateId(id, "Link ID");

    return this.delete<{ message: string }>(
      API_CONFIG.ENDPOINTS.DELETE_LINK(id),
      { context: "delete_link" },
    );
  }

  /**
   * Busca analytics de um link
   */
  async getAnalytics(slug: string): Promise<unknown> {
    this.validateId(slug, "Link slug");

    return this.get<unknown>(API_CONFIG.ENDPOINTS.LINK_ANALYTICS(slug), {
      fallback: {},
      context: "get_link_analytics",
    });
  }

  /**
   * Lista paginada de cliques de um link, usada na tab "Cliques" do analytics.
   * Usa rawEnvelope para preservar `data` + `meta` (paginação) no payload.
   */
  async getClicksList(
    id: string,
    params: LinkClicksListParams = {},
  ): Promise<LinkClicksListResponse> {
    this.validateId(id, "Link ID");

    return api.get<LinkClicksListResponse>(
      API_CONFIG.ENDPOINTS.LINK_CLICKS_LIST(id),
      {
        rawEnvelope: true,
        query: params as Record<string, unknown>,
      },
    );
  }
}

// Instância singleton do serviço
const linkService = new LinkService();

// Exports das funções para compatibilidade com código existente
export const save = linkService.save.bind(linkService);
export const update = linkService.update.bind(linkService);
export const all = linkService.all.bind(linkService);
export const findOne = linkService.findOne.bind(linkService);
export const remove = linkService.remove.bind(linkService);
export const getAnalytics = linkService.getAnalytics.bind(linkService);
export const getClicksList = linkService.getClicksList.bind(linkService);

// Export da instância do serviço
export { linkService };
