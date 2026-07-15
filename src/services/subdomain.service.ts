import { BaseService } from "./base.service";
import type {
  SubdomainAvailability,
  SubdomainResponse,
} from "@/features/profile/types/subdomain";
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
 * `getCurrent`/`checkAvailability`/`claim`/`release` talk to the legacy
 * singular `/api/subdomain` endpoints (one subdomain per user) and are kept
 * only for the not-yet-migrated `SubdomainSettings` profile section —
 * expand/contract compat during the multi-subdomain rollout. New code should
 * use `list`/`claimNew`/`releaseById`, which talk to the plural
 * `/api/subdomains` endpoints (N subdomains per user, limit enforced
 * server-side).
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
