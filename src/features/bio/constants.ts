/**
 * Mirrors the backend's per-page item cap (`POST /api/bio/items` answers 422
 * past this count). There is no endpoint that exposes the configured limit
 * to the client, so this constant drives the "N/20" count and the
 * pre-emptive `limitReached` gate in `AddBioItemDialog`. If the backend
 * limit ever changes, update this value too — a mismatch only degrades the
 * UX (the add button hides a step late, or is blocked one step early); the
 * backend's own 422 remains the source of truth for enforcement.
 */
export const MAX_BIO_ITEMS = 20;

/** Server-enforced handle length, mirrored client-side for instant feedback. */
export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 30;

/**
 * `^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$` — lowercase letters, digits and
 * hyphens; must start and end with an alphanumeric char. Total length works
 * out to 3–30 (`1 + [1,28] + 1`), matching `HANDLE_MIN_LENGTH`/`HANDLE_MAX_LENGTH`.
 */
export const HANDLE_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

/** Soft client-side cap for the page title — the API has no documented limit. */
export const TITLE_MAX_LENGTH = 100;

/** Hard cap for the bio/description field, enforced by both form and API. */
export const BIO_DESCRIPTION_MAX_LENGTH = 280;
