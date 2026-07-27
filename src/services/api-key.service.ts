import { BaseService } from "./base.service";

import type { ApiKeyItem, CreatedApiKey } from "@/features/api-keys/types";

/**
 * Raw shape of an API key record as returned by `GET /api/api-keys`
 * (snake_case, straight off the Laravel resource). The full token is never
 * present in this shape.
 */
interface RawApiKeyRecord {
  id: number;
  name: string;
  token_preview: string;
  last_used_at: string | null;
  created_at: string;
}

/**
 * Raw shape of the `POST /api/api-keys` 201 response — the only payload that
 * ever carries the complete `token`.
 */
interface RawCreatedApiKey {
  id: number;
  name: string;
  token: string;
}

/**
 * Maps a raw backend API key record to the camelCase `ApiKeyItem` shape
 * consumed by `useApiKeys()` and the `/api-keys` module UI.
 *
 * @param raw - snake_case record from the Laravel resource.
 * @returns the camelCase item for UI consumption.
 */
function mapApiKeyRecord(raw: RawApiKeyRecord): ApiKeyItem {
  return {
    id: raw.id,
    name: raw.name,
    tokenPreview: raw.token_preview,
    lastUsedAt: raw.last_used_at,
    createdAt: raw.created_at,
  };
}

/**
 * HTTP client for the API key management endpoints (`/api/api-keys`).
 *
 * All methods require an authenticated session (Bearer token in ApiClient).
 * These keys in turn authenticate the public `/api/v1/*` API — they are a
 * credential for machine access, so `create` is the only place the full token
 * surfaces and nothing here persists it.
 */
export class ApiKeyService extends BaseService {
  constructor() {
    super("ApiKeyService");
  }

  /**
   * Lists the authenticated user's API keys (masked previews only).
   *
   * @returns the user's keys; an empty array on request failure (graceful
   * degradation, matching the sibling subdomain list behaviour).
   */
  async list(): Promise<ApiKeyItem[]> {
    const raw = await this.get<RawApiKeyRecord[]>("/api/api-keys", {
      fallback: [],
    });
    return raw.map(mapApiKeyRecord);
  }

  /**
   * Creates a new API key.
   *
   * @param name - user-chosen label (required, max 60 chars).
   * @returns the created key INCLUDING the full token — the only time it is
   * ever available. Callers must show it immediately and discard it.
   * @throws `ApiError` on 422 (key limit reached / validation) or 429
   * (rate limit, 10/min).
   */
  async create(name: string): Promise<CreatedApiKey> {
    const raw = await this.post<RawCreatedApiKey>("/api/api-keys", { name });
    return { id: raw.id, name: raw.name, token: raw.token };
  }

  /**
   * Revokes (deletes) one API key by id. Immediate and irreversible: calls
   * authenticated with that key start failing right away.
   *
   * @param id - the key's numeric id (from `ApiKeyItem.id`).
   * @throws `ApiError` on 404 when the id doesn't belong to the user.
   */
  async revoke(id: number): Promise<void> {
    await this.delete<{ deleted: boolean }>(`/api/api-keys/${id}`);
  }
}

/** Singleton instance for use in hooks. */
export const apiKeyService = new ApiKeyService();
