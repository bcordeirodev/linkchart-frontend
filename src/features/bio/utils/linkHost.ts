/**
 * Extracts just the host from an absolute URL, e.g.
 * `"https://acme.linkcharts.com.br/abc123"` → `"acme.linkcharts.com.br"`.
 *
 * Used to label which domain a bio-page button's underlying link actually
 * opens at — a user's links can be shortened under any of their active
 * subdomains (or the default domain), so the item list and the "add link"
 * picker both surface it per-row rather than assuming one shared domain.
 *
 * @param url - absolute URL (a link's `short_url`, or a `BioItem.url`).
 * @returns the bare host, or the original string (best-effort, scheme
 * stripped) if it isn't a parseable absolute URL.
 */
export function getUrlHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] ?? url;
  }
}
