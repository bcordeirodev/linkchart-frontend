/**
 * Base origin for short links (`/{slug}` — the backend's clean-URL alias,
 * same handler and tracking as the internal `/r/{slug}` route); reads
 * `NEXT_PUBLIC_REDIRECT_URL` with a local-dev fallback. Trailing slashes are
 * stripped.
 */
const REDIRECT_BASE =
  process.env.NEXT_PUBLIC_REDIRECT_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

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
 * `"http://localhost:8000/"`). Useful as a `startAdornment` next to a slug
 * input so the user sees the full URL being composed.
 *
 * @returns the redirect base with a trailing slash.
 */
export const getShortUrlPrefix = (): string => `${REDIRECT_BASE}/`;

/**
 * Apex domain suffix for custom subdomains (e.g. `".linkcharts.com.br"`),
 * derived from `NEXT_PUBLIC_APP_URL`'s hostname so production doesn't hardcode
 * it. Falls back to the production apex when the env var is missing or points
 * at `localhost` (there's no real wildcard DNS in local dev to preview
 * against, so the fallback keeps the claim form's example URL meaningful).
 *
 * @returns the domain suffix including the leading dot.
 */
export function getSubdomainDomainSuffix(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    try {
      const hostname = new URL(appUrl).hostname;
      if (hostname && hostname !== "localhost") {
        return `.${hostname}`;
      }
    } catch {
      // fall through to the default below
    }
  }

  return ".linkcharts.com.br";
}

/**
 * Minimal shape of a subdomain that can be picked while DRAFTING a link —
 * one item from `useSubdomains()` (`SubdomainItem`), or `null`/`undefined`
 * for the default domain. Not for existing links: those must read
 * `link.short_url` instead (see `getShortUrlForLink`) — with multiple
 * subdomains per user, "currently selected in the form" and "domain this
 * link was actually created with" are no longer the same thing.
 */
type SelectableSubdomain = { fullUrl: string };

/**
 * Prefix for the slug input while DRAFTING a link: base of the subdomain
 * currently selected in `SubdomainSelect`, or `/r/` when none is selected
 * (or the user has no subdomains).
 */
export function getShortUrlPrefixForSubdomain(
  subdomain?: SelectableSubdomain | null,
): string {
  if (subdomain?.fullUrl) {
    return `${subdomain.fullUrl.replace(/\/$/, "")}/`;
  }
  return getShortUrlPrefix();
}

/**
 * Builds the short URL preview for a slug while DRAFTING a link, using
 * whichever subdomain is currently selected in `SubdomainSelect` (or the
 * default domain when none is selected).
 */
export function buildShortUrlForSlug(
  slug: string,
  subdomain?: SelectableSubdomain | null,
): string {
  if (!slug?.trim()) {
    return "";
  }

  if (subdomain?.fullUrl) {
    return `${subdomain.fullUrl.replace(/\/$/, "")}/${slug}`;
  }

  return getShortUrl(slug);
}

type LinkShortUrlFields = {
  slug?: string;
  custom_slug?: string;
  short_url?: string;
};

/**
 * Resolves the short URL to copy/share/display for an EXISTING link.
 *
 * Always trusts `link.short_url` — computed server-side from the link's own
 * immutable `short_domain`, recorded once at creation — rather than the
 * viewer's currently active subdomain(s). With multiple subdomains per user,
 * "the account's current subdomain" and "the domain this particular link was
 * created with" can differ (a link keeps its domain even after the owner
 * claims or releases others), so only the link's own recorded value is ever
 * correct to show.
 */
export function getShortUrlForLink(link: LinkShortUrlFields): string {
  if (link.short_url) {
    return link.short_url;
  }

  const slug = (link.custom_slug || link.slug || "").trim();
  return buildShortUrlForSlug(slug, null);
}

/**
 * Derives the display prefix (everything before the slug, trailing slash
 * included) from an EXISTING link's own `short_url` — for the edit form,
 * where the domain is immutable and shown as read-only text next to the slug
 * input rather than picked via `SubdomainSelect`.
 *
 * Strips only the last path segment (the slug itself), so it correctly
 * preserves an intermediate path when present (e.g. a legacy
 * `http://localhost:8000/r/abc123` → `http://localhost:8000/r/`) as well as
 * a bare custom-subdomain or clean redirect host with no extra path
 * (e.g. `https://acme.linkcharts.com.br/abc123` → `https://acme.linkcharts.com.br/`).
 *
 * @param shortUrl - the link's own `short_url` (e.g. `link.short_url`).
 * @returns the prefix ending in `/`, or the default redirect prefix if `shortUrl` can't be parsed.
 */
export function getShortUrlPrefixFromShortUrl(shortUrl: string): string {
  try {
    const parsed = new URL(shortUrl);
    const segments = parsed.pathname.split("/").filter(Boolean);
    segments.pop();
    const path = segments.length > 0 ? `/${segments.join("/")}` : "";
    return `${parsed.origin}${path}/`;
  } catch {
    return getShortUrlPrefix();
  }
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
