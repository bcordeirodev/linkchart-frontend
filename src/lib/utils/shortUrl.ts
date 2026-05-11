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
