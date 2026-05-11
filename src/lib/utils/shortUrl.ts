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
 * @param slug - link slug (without leading slash).
 * @returns the absolute short URL (`{REDIRECT_BASE}/{slug}`).
 */
export const getShortUrl = (slug: string): string => `${REDIRECT_BASE}/${slug}`;
