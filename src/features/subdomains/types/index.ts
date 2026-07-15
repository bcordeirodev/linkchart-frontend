/**
 * A single active subdomain owned by the authenticated user, as consumed by
 * the UI (camelCase). Mapped from the backend's snake_case payload in
 * `subdomain.service.ts` — see `GET /api/subdomains`.
 */
export interface SubdomainItem {
  /** Numeric id — stable identity across renames is not supported, but this
   * is what `DELETE /api/subdomains/{id}` and link creation's `subdomain_id`
   * reference. */
  id: number;
  /** The label only, e.g. "acme" (no domain suffix). */
  subdomain: string;
  /** Full absolute URL, e.g. "https://acme.linkcharts.com.br". */
  fullUrl: string;
  /** Always "active" — the list endpoint only ever returns active rows. */
  status: "active";
  /** ISO-8601 timestamp of when the subdomain was claimed. */
  createdAt: string;
}

/**
 * Result of an availability check for a candidate subdomain label.
 */
export interface SubdomainAvailabilityResult {
  /** True when the label can be claimed. */
  available: boolean;
}
