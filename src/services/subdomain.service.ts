import { BaseService } from "./base.service";
import type { SubdomainAvailability } from "@/features/profile/types/subdomain";
import type { SubdomainItem } from "@/features/subdomains/types";

/**
 * Raw shape of a subdomain record as returned by the plural `/api/subdomains`
 * endpoints (snake_case, straight off the Laravel resource).
 */
interface RawSubdomainRecord {
  id: number;
  subdomain: string;
  full_url: string;
  status: "active" | "inactive";
  created_at: string;
}

/**
 * Maps a raw backend subdomain record to the camelCase `SubdomainItem` shape
 * consumed by `useSubdomains()` and the `/subdomains` module UI.
 */
function mapSubdomainRecord(raw: RawSubdomainRecord): SubdomainItem {
  return {
    id: raw.id,
    subdomain: raw.subdomain,
    fullUrl: raw.full_url,
    status: "active",
    createdAt: raw.created_at,
  };
}

/**
 * HTTP client for the subdomain management API.
 *
 * All methods require an authenticated session (Bearer token in ApiClient).
 *
 * @remarks
 * All methods use the plural `/api/subdomains` endpoints (N subdomains per
 * user, limit enforced server-side). The legacy singular `/api/subdomain/*`
 * endpoints were removed from the backend after this service migrated.
 */
export class SubdomainService extends BaseService {
  constructor() {
    super("SubdomainService");
  }

  /**
   * Lists the authenticated user's active subdomains, ordered oldest first
   * (the ordering the backend uses to pick the default at link creation).
   */
  async list(): Promise<SubdomainItem[]> {
    const raw = await this.get<RawSubdomainRecord[]>("/api/subdomains", {
      fallback: [],
    });
    return raw.map(mapSubdomainRecord);
  }

  /**
   * Claims a new subdomain for the authenticated user (in addition to any
   * they already hold).
   *
   * @param name - the desired label (e.g. "acme").
   * @throws On 422 (`SUBDOMAIN_LIMIT_REACHED`, taken, or invalid format).
   */
  async claimNew(name: string): Promise<SubdomainItem> {
    const raw = await this.post<RawSubdomainRecord>("/api/subdomains", {
      subdomain: name,
    });
    return mapSubdomainRecord(raw);
  }

  /**
   * Releases (soft-deletes) one specific subdomain by id.
   *
   * @param id - the subdomain's numeric id (from `SubdomainItem.id`).
   * @throws On 404 when the id doesn't belong to the authenticated user or
   * is already inactive.
   */
  async releaseById(id: number): Promise<void> {
    return this.delete<void>(`/api/subdomains/${id}`);
  }

  /**
   * Check whether a given subdomain label is available to claim.
   *
   * @param name - The label to check (e.g. "acme").
   */
  async checkAvailability(name: string): Promise<SubdomainAvailability> {
    return this.get<SubdomainAvailability>(
      `/api/subdomains/check?name=${encodeURIComponent(name)}`,
    );
  }
}

/** Singleton instance for use in hooks and server actions. */
export const subdomainService = new SubdomainService();
