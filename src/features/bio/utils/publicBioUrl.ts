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
