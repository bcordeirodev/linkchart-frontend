import { BaseService } from "./base.service";
import type {
  SubdomainAvailability,
  SubdomainResponse,
} from "@/features/profile/types/subdomain";

/**
 * HTTP client for the subdomain management API.
 *
 * All methods require an authenticated session (Bearer token in ApiClient).
 */
export class SubdomainService extends BaseService {
  constructor() {
    super("SubdomainService");
  }

  /**
   * Fetch the authenticated user's current subdomain.
   *
   * @returns The active subdomain record, or null if the user has none.
   */
  async getCurrent(): Promise<SubdomainResponse | null> {
    return this.get<SubdomainResponse | null>("/api/subdomain", {
      fallback: null,
    });
  }

  /**
   * Check whether a given subdomain label is available to claim.
   *
   * @param name - The label to check (e.g. "acme").
   */
  async checkAvailability(name: string): Promise<SubdomainAvailability> {
    return this.get<SubdomainAvailability>(
      `/api/subdomain/check?name=${encodeURIComponent(name)}`,
    );
  }

  /**
   * Claim a subdomain for the authenticated user.
   *
   * @param name - The desired label (e.g. "acme").
   * @throws On 409 (already has one) or 422 (taken / invalid format).
   */
  async claim(name: string): Promise<SubdomainResponse> {
    return this.post<SubdomainResponse>("/api/subdomain", {
      subdomain: name,
    });
  }

  /**
   * Release the authenticated user's current subdomain.
   *
   * Sets status to inactive on the server; future links will use the default domain.
   */
  async release(): Promise<void> {
    return this.delete<void>("/api/subdomain");
  }
}

/** Singleton instance for use in hooks and server actions. */
export const subdomainService = new SubdomainService();
