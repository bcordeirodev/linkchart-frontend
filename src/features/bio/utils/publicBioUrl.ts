/**
 * Apex origin the public bio page is served from, derived from
 * `NEXT_PUBLIC_APP_URL` so production never hardcodes it. Falls back to the
 * production apex when the env var is missing or unparsable — mirrors the
 * same fallback used by `src/lib/seo/landingMetadata.ts` and
 * `structuredData.ts` for the same variable.
 */
const APP_ORIGIN_ENV =
  process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

function resolveAppOrigin(): string {
  try {
    return new URL(APP_ORIGIN_ENV).origin;
  } catch {
    return "https://linkcharts.com.br";
  }
}

/**
 * Builds the absolute public URL for a bio page handle, e.g.
 * `https://linkcharts.com.br/@acme`.
 *
 * @param handle - the page's handle, without the leading `@`.
 * @returns the absolute URL, or `""` when `handle` is empty.
 */
export function getPublicBioUrl(handle: string): string {
  if (!handle) return "";
  return `${resolveAppOrigin()}/@${handle}`;
}

/**
 * Host + `@` prefix shown next to the handle input while editing, e.g.
 * `"linkcharts.com.br/@"`.
 */
export function getPublicBioUrlPrefix(): string {
  try {
    return `${new URL(resolveAppOrigin()).host}/@`;
  } catch {
    return "linkcharts.com.br/@";
  }
}

/**
 * Resolves the backend's `BioPage.url` field to an absolute address the
 * browser can open. The backend returns either an absolute origin URL
 * (`https://acme.linkcharts.com.br`, when a subdomain is associated) or a
 * path relative to this app's own origin (`/@handle`, the default address)
 * — this composes the relative case with `resolveAppOrigin()` so callers
 * never need to branch on the shape themselves.
 *
 * @param url - the raw `url` field from `GET`/`PUT /api/bio`.
 * @returns the absolute URL, or `""` when `url` is empty.
 */
export function resolvePublicPageUrl(url: string): string {
  if (!url) return "";
  return /^https?:\/\//.test(url) ? url : `${resolveAppOrigin()}${url}`;
}
