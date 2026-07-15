import { api } from "../lib/api/client";
import { API_CONFIG } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

import type {
  LinkClicksListParams,
  LinkClicksListResponse,
} from "@/features/links/types/click";
import type {
  LinkBulkAction,
  LinkBulkActionResult,
} from "@/features/links/types/link";
import type { LinksMeta, LinksSearchParams } from "@/lib/query/keys";
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
 * Envelope returned by the server-side paginated/filtered links search.
 *
 * @remarks Mirrors `LinkClicksListResponse` — `data` + `meta`, no extra
 * `links.{first,last,...}` navigation block (unlike the legacy `LinksListResponse`).
 */
export interface LinksSearchResponse {
  data: LinkResponse[];
  meta: LinksMeta;
}

/**
 * REST client for `/api/links` (authenticated CRUD) and the per-link
 * analytics + clicks-list endpoints.
 *
 * Wraps `BaseService` and inherits envelope unwrap + JWT injection from `ApiClient`.
 */
export default class LinkService extends BaseService {
  constructor() {
    super("LinkService");
  }

  /**
   * Creates a new shortened link for the authenticated user.
   *
   * @param body - link payload; `original_url` is required.
   * @returns the created `LinkResponse`.
   * @endpoint `POST /api/links`
   */
  async save(body: LinkCreateRequestExtended): Promise<LinkResponse> {
    this.validateRequired(body, ["original_url"]);

    return this.post<LinkResponse>(API_CONFIG.ENDPOINTS.CREATE_LINK, body, {
      context: "create_link",
    });
  }

  /**
   * Updates an existing link owned by the authenticated user.
   *
   * @param id - link id.
   * @param body - partial link payload.
   * @returns the updated `LinkResponse`.
   * @endpoint `PUT /api/links/{id}`
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
   * Lists every link owned by the authenticated user.
   *
   * @returns array of `LinkResponse` (already unwrapped from the `{data}` envelope).
   * @endpoint `GET /api/links`
   */
  async all(): Promise<LinkResponse[]> {
    return this.get<LinkResponse[]>(API_CONFIG.ENDPOINTS.LINKS, {
      context: "get_all_links",
    });
  }

  /**
   * Server-side paginated/filtered/sorted search over the user's links.
   *
   * @param params - page/perPage plus optional `q`, `status`, `sort`, `order`.
   * @returns the raw `{data, meta}` envelope (pagination metadata preserved).
   * @endpoint `GET /api/links?page=…&per_page=…&q=…&status=…&sort=…&order=…`
   *
   * @remarks
   * Uses `api.get` directly with `rawEnvelope: true` — same pattern as
   * `getClicksList` — because the caller needs `meta.{current_page,total,last_page}`
   * alongside `data`, which the envelope-unwrapping `BaseService.get` would discard.
   * Sending `?page=` opts into the paginated response shape; the plain `all()`
   * call above (no query params) keeps receiving the legacy full-array response.
   */
  async search(params: LinksSearchParams): Promise<LinksSearchResponse> {
    return api.get<LinksSearchResponse>(API_CONFIG.ENDPOINTS.LINKS, {
      rawEnvelope: true,
      query: {
        page: params.page,
        per_page: params.perPage,
        q: params.q,
        status: params.status,
        sort: params.sort,
        order: params.order,
      },
    });
  }

  /**
   * Fetches a single link by id.
   *
   * @param id - link id.
   * @returns the matching `LinkResponse`.
   * @endpoint `GET /api/links/{id}`
   */
  async findOne(id: string): Promise<LinkResponse> {
    this.validateId(id, "Link ID");

    return this.get<LinkResponse>(API_CONFIG.ENDPOINTS.LINK(id), {
      context: "get_link_by_id",
    });
  }

  /**
   * Deletes a link owned by the authenticated user.
   *
   * @param id - link id.
   * @returns `{message}` confirmation envelope.
   * @endpoint `DELETE /api/links/{id}`
   */
  async remove(id: string): Promise<{ message: string }> {
    this.validateId(id, "Link ID");

    return this.delete<{ message: string }>(
      API_CONFIG.ENDPOINTS.DELETE_LINK(id),
      { context: "delete_link" },
    );
  }

  /**
   * Runs an activate/deactivate/delete action over up to 50 links at once.
   *
   * @param action - `"activate" | "deactivate" | "delete"`.
   * @param ids - numeric link ids (max 50; ids the user doesn't own are silently skipped).
   * @returns `{affected, requested}` — `affected` may be lower than `requested`
   * when some ids didn't belong to the caller.
   * @endpoint `POST /api/links/bulk-action`
   */
  async bulkAction(
    action: LinkBulkAction["action"],
    ids: number[],
  ): Promise<LinkBulkActionResult> {
    return this.post<LinkBulkActionResult>(
      API_CONFIG.ENDPOINTS.LINKS_BULK_ACTION,
      { action, ids },
      { context: "bulk_action_links" },
    );
  }

  /**
   * Returns the legacy analytics payload for a link (by id, despite the parameter name).
   *
   * @param slug - link id passed straight into the route.
   * @returns the raw analytics payload; falls back to `{}` on error.
   * @endpoint `GET /api/links/{id}/analytics`
   */
  async getAnalytics(slug: string): Promise<unknown> {
    this.validateId(slug, "Link slug");

    return this.get<unknown>(API_CONFIG.ENDPOINTS.LINK_ANALYTICS(slug), {
      fallback: {},
      context: "get_link_analytics",
    });
  }

  /**
   * Returns a paginated list of clicks for a link (used by the analytics "Cliques" tab).
   *
   * @param id - link id.
   * @param params - paging/sort/filter query options.
   * @returns the raw `{data, meta}` envelope so the caller can render pagination.
   * @endpoint `GET /api/link/{id}/clicks-list`
   *
   * @remarks
   * Uses `api.get` directly (with `rawEnvelope: true`) instead of the `BaseService`
   * helpers so the `meta` block is preserved alongside `data`.
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
export const search = linkService.search.bind(linkService);
export const findOne = linkService.findOne.bind(linkService);
export const remove = linkService.remove.bind(linkService);
export const bulkAction = linkService.bulkAction.bind(linkService);
export const getAnalytics = linkService.getAnalytics.bind(linkService);
export const getClicksList = linkService.getClicksList.bind(linkService);

// Export da instância do serviço
export { linkService };
