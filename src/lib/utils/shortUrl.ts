/**
 * Base origin for short links (`/r/{slug}`); reads `NEXT_PUBLIC_REDIRECT_URL`
 * with a local-dev fallback. Trailing slashes are stripped.
 */
const REDIRECT_BASE =
  process.env.NEXT_PUBLIC_REDIRECT_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/r";

/**
 * Builds the public short URL displayed in the UI and copied to the clipboard.
 *
 * Idempotent: accepts either a bare slug (`"abc123"`) or an already-resolved
 * short URL (`"https://api.linkcharts.com.br/r/abc123"`). The returned URL is
 * always rooted at `NEXT_PUBLIC_REDIRECT_URL`, so the redirect host shown to
 * users stays consistent regardless of which host the backend served.
 *
 * @param slugOrUrl - link slug or already-resolved short URL.
 * @returns the absolute short URL on the canonical redirect host, or `""` if input is empty.
 */
export const getShortUrl = (slugOrUrl: string): string => {
  if (!slugOrUrl) return "";
  try {
    const parsed = new URL(slugOrUrl);
    const slug = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
    return slug ? `${REDIRECT_BASE}/${slug}` : "";
  } catch {
    return `${REDIRECT_BASE}/${slugOrUrl}`;
  }
};

/**
 * Returns the canonical prefix shown in the UI for short URLs (e.g.
 * `"http://localhost:8000/r/"`). Useful as a `startAdornment` next to a slug
 * input so the user sees the full URL being composed.
 *
 * @returns the redirect base with a trailing slash.
 */
export const getShortUrlPrefix = (): string => `${REDIRECT_BASE}/`;

type ActiveSubdomain = {
  full_url: string;
  status: "active" | "inactive";
};

/**
 * Builds the public short URL for a slug, using a custom subdomain when active.
 */
export function buildShortUrlForSlug(
  slug: string,
  subdomain?: ActiveSubdomain | null,
): string {
  if (!slug?.trim()) {
    return "";
  }

  if (subdomain?.status === "active" && subdomain.full_url) {
    return `${subdomain.full_url.replace(/\/$/, "")}/${slug}`;
  }

  return getShortUrl(slug);
}

type LinkShortUrlFields = {
  slug?: string;
  custom_slug?: string;
  short_url?: string;
};

/**
 * Resolves the short URL to copy/share for a link record (subdomain-aware).
 */
export function getShortUrlForLink(
  link: LinkShortUrlFields,
  subdomain?: ActiveSubdomain | null,
): string {
  const slug = (link.custom_slug || link.slug || "").trim();

  if (subdomain?.status === "active") {
    return buildShortUrlForSlug(slug, subdomain);
  }

  if (link.short_url) {
    return getShortUrl(link.short_url);
  }

  return buildShortUrlForSlug(slug, null);
}

/** Writes text to the clipboard; returns false when unavailable or denied. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text || typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
