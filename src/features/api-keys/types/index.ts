/**
 * A single API key owned by the authenticated user, as consumed by the UI
 * (camelCase). Mapped from the backend's snake_case payload in
 * `api-key.service.ts` — see `GET /api/api-keys`.
 *
 * The full token is never present here: the list endpoint only exposes
 * `tokenPreview` (e.g. `"…a1b2"`). The complete token appears exactly once,
 * in the `POST /api/api-keys` response ({@link CreatedApiKey}).
 */
export interface ApiKeyItem {
  /** Numeric id — what `DELETE /api/api-keys/{id}` references. */
  id: number;
  /** User-chosen label identifying where the key is used (max 60 chars). */
  name: string;
  /** Masked tail of the token, e.g. `"…a1b2"` — enough to tell keys apart. */
  tokenPreview: string;
  /** ISO-8601 timestamp of the last authenticated call, or `null` if never used. */
  lastUsedAt: string | null;
  /** ISO-8601 timestamp of when the key was created. */
  createdAt: string;
}

/**
 * The `POST /api/api-keys` response: the ONLY moment the full `token` exists
 * client-side. It is held in transient component state for the reveal dialog
 * and discarded when the dialog closes — never cached, stored, or logged.
 */
export interface CreatedApiKey {
  /** Numeric id of the newly created key. */
  id: number;
  /** The name the user gave the key. */
  name: string;
  /** The complete Bearer token — shown once, never recoverable afterwards. */
  token: string;
}
