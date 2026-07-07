import { API_CONFIG } from "@/lib/api/endpoints";

import { BaseService } from "./base.service";

/**
 * Request payload for the public shorten endpoint.
 */
export interface CreatePublicLinkRequest {
  original_url: string;
  title?: string;
  custom_slug?: string;
}

/**
 * Public-facing representation of a link returned by the unauthenticated endpoints.
 */
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

/**
 * Result of the public slug-suggestion endpoint: an available slug plus the
 * page's og:title (so the public form can fill both from one request).
 */
export interface SlugSuggestionResponse {
  slug: string;
  og_title: string | null;
}

/**
 * Lightweight analytics payload exposed for public links.
 */
export interface PublicAnalyticsResponse {
  total_clicks: number;
  created_at: string;
  is_active: boolean;
  short_url: string;
  has_analytics: boolean;
}

/**
 * REST client for the public (unauthenticated) `/api/public/*` endpoints
 * plus a few client-side URL helpers used by the `/shorter` page.
 *
 * Wraps `BaseService` and inherits envelope unwrap from `ApiClient`.
 */
class PublicLinkService extends BaseService {
  /**
   * Shortens a URL without authentication (rate-limited per IP on the backend).
   *
   * @param data - `{original_url, title?, custom_slug?}`.
   * @returns the created `PublicLinkResponse`.
   * @endpoint `POST /api/public/shorten`
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
   * Resolves a public-facing link by its short slug.
   *
   * @param slug - short slug (without leading `/r/`).
   * @returns the matching `PublicLinkResponse`.
   * @endpoint `GET /api/public/link/{slug}`
   */
  async getLinkBySlug(slug: string): Promise<PublicLinkResponse> {
    return this.get<PublicLinkResponse>(
      API_CONFIG.ENDPOINTS.PUBLIC.LINK_BY_SLUG(slug),
    );
  }

  /**
   * Resolves a single available slug for a target URL in one request, along with
   * the page's og:title.
   *
   * The backend derives a human-friendly base from the page's og:title (falling
   * back to the URL path/host) and guarantees availability, replacing the old
   * client-side loop that issued one round-trip per candidate. Returning the
   * og:title too lets the public form fill the title without a second request.
   *
   * @param url - target URL (with or without scheme; the backend normalizes it).
   * @returns `{ slug, og_title }` — an available slug and the page title (or null).
   * @endpoint `GET /api/public/links/suggest-slug`
   */
  async suggestSlug(url: string): Promise<SlugSuggestionResponse> {
    const path = `${API_CONFIG.ENDPOINTS.PUBLIC.SUGGEST_SLUG}?url=${encodeURIComponent(url)}`;
    return this.get<SlugSuggestionResponse>(path);
  }

  /**
   * Returns the public analytics payload for a link.
   *
   * @param slug - short slug.
   * @returns aggregated counters suitable for the public analytics page.
   * @endpoint `GET /api/public/analytics/{slug}`
   */
  async getPublicAnalytics(slug: string): Promise<PublicAnalyticsResponse> {
    return this.get<PublicAnalyticsResponse>(
      API_CONFIG.ENDPOINTS.PUBLIC.ANALYTICS(slug),
    );
  }

  /**
   * Cheap client-side validator that checks for an `http(s)` URL.
   *
   * @param url - candidate URL string.
   * @returns `true` if it parses and uses `http:` or `https:`.
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
   * Trims whitespace and prefixes `https://` if no scheme is present.
   *
   * @param url - raw URL input from the user.
   * @returns a normalized URL string (empty string preserved as empty).
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
   * Builds the relative URL for the public analytics page (`/public-analytics/{slug}`).
   *
   * @param slug - short slug.
   * @returns the relative path used by `next/link`.
   */
  getPublicAnalyticsUrl(slug: string): string {
    return `/public-analytics/${slug}`;
  }

  /**
   * Copies text to the clipboard with a `document.execCommand` fallback.
   *
   * @param text - text to copy.
   * @returns `true` when the copy succeeded.
   *
   * @remarks
   * Prefer `useClipboard` from `src/shared/hooks/` in React components.
   * This method exists for non-React code paths.
   */
  async copyToClipboard(text: string): Promise<boolean> {
    // Preferred async Clipboard API — requires a secure context and clipboard
    // permission. When it is blocked (NotAllowedError: no user activation,
    // permission denied, insecure context) fall through to the execCommand
    // path instead of surfacing an error: a denied clipboard is an expected
    // browser condition, not an application fault, and console.error here is
    // captured by Faro as kind=exception, polluting RUM error metrics.
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall through to the legacy fallback below.
      }
    }

    return this.legacyCopy(text);
  }

  /**
   * Legacy clipboard copy via a hidden textarea and `document.execCommand`.
   *
   * Fallback for non-secure contexts and browsers where the async Clipboard
   * API is unavailable or was denied.
   *
   * @param text - text to copy.
   * @returns `true` when the copy command succeeded, `false` otherwise (never throws).
   */
  private legacyCopy(text: string): boolean {
    try {
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
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const publicLinkService = new PublicLinkService("PublicLinkService");
export default publicLinkService;
