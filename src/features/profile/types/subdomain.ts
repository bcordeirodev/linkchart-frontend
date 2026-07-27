/**
 * Response from the availability check endpoint.
 */
export interface SubdomainAvailability {
  /** True when the label can be claimed. */
  available: boolean;
}
