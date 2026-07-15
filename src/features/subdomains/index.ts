/**
 * SUBDOMAINS FEATURE EXPORTS
 * Barrel exports for the multi-subdomain module (`/subdomains` page + the
 * link-creation selector).
 */

export { SubdomainList } from "./components/SubdomainList";
export { SubdomainClaimForm } from "./components/SubdomainClaimForm";
export { SubdomainSelect } from "./components/SubdomainSelect";

export { useSubdomains } from "./hooks/useSubdomains";
export { useSubdomainSelection } from "./hooks/useSubdomainSelection";

export { MAX_SUBDOMAINS_PER_USER } from "./constants";

export type { SubdomainItem, SubdomainAvailabilityResult } from "./types";
