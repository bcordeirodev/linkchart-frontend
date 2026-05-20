/**
 * API response shape for a claimed subdomain.
 */
export interface SubdomainResponse {
  /** The label only, e.g. "acme". Does not include the domain suffix. */
  subdomain: string;
  /** Full URL including scheme, e.g. "https://acme.linkcharts.com.br". */
  full_url: string;
  /** Current status. Active subdomains are in use; inactive have been released. */
  status: "active" | "inactive";
  /** ISO-8601 timestamp of when the subdomain was claimed. */
  created_at: string;
}

/**
 * Response from the availability check endpoint.
 */
export interface SubdomainAvailability {
  /** True when the label can be claimed. */
  available: boolean;
}
