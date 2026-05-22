import { API_CONFIG } from "../lib/api/endpoints";
import { BaseService } from "./base.service";
import type { BatchMetaResponse } from "@/types";

/** Shape returned by `GET /api/links/url-meta`. */
export interface UrlMetaResponse {
  og_title: string | null;
  og_image_url: string | null;
  favicon_url: string | null;
}

/**
 * REST client for the `links` batch metadata endpoint and URL-meta lookup.
 *
 * Used by the links list to fetch sparkline + trend data for many links at once,
 * and by the create-link form to derive a slug suggestion from a pasted URL's
 * Open Graph title.
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

  /**
   * Fetches Open Graph metadata for an arbitrary URL.
   *
   * Used by the create-link form and the public shortener to derive a slug
   * suggestion from the page's `og:title`. Always returns `null` fields on
   * any failure — callers must treat this as a best-effort hint, never a
   * hard requirement.
   *
   * @param url - Absolute URL to fetch metadata for (must start with http/https).
   * @returns `UrlMetaResponse` with nullable fields; falls back to all-null on error.
   * @endpoint `GET /api/links/url-meta?url=<encoded>`
   */
  async fetchUrlMeta(url: string): Promise<UrlMetaResponse> {
    const fallback: UrlMetaResponse = {
      og_title: null,
      og_image_url: null,
      favicon_url: null,
    };
    const encoded = encodeURIComponent(url);
    return this.get<UrlMetaResponse>(
      `${API_CONFIG.ENDPOINTS.LINK_URL_META}?url=${encoded}`,
      { fallback, context: "url_meta" },
    );
  }
}

export const linkMetaService = new LinkMetaService();
