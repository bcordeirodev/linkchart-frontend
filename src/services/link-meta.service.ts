import { API_CONFIG } from "../lib/api/endpoints";
import { BaseService } from "./base.service";
import type { BatchMetaResponse } from "@/types";

/**
 * REST client for the `links` batch metadata endpoint.
 *
 * Used by the links list to fetch sparkline + trend data for many links at once,
 * avoiding N requests when rendering the table.
 */
class LinkMetaService extends BaseService {
  constructor() {
    super("LinkMetaService");
  }

  /**
   * Fetches sparkline/trend metadata for a batch of links over a time window.
   *
   * @param ids - array of link ids (coerced to numbers before sending).
   * @param days - look-back window, defaults to 7.
   * @returns map of link id -> meta payload; falls back to `{}` on error.
   * @endpoint `POST /api/links/batch-meta`
   */
  async batchMeta(ids: string[], days = 7): Promise<BatchMetaResponse> {
    return this.post<BatchMetaResponse>(
      API_CONFIG.ENDPOINTS.LINKS_BATCH_META,
      { ids: ids.map(Number), days },
      { fallback: {}, context: "batch_meta" },
    );
  }
}

export const linkMetaService = new LinkMetaService();
