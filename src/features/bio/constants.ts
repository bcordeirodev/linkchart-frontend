/**
 * Mirrors the backend's per-page item cap (`POST /api/bio/items` answers 422
 * past this count). There is no endpoint that exposes the configured limit
 * to the client, so this constant drives the "N/20" count and the
 * pre-emptive `limitReached` gate in `AddBioItemDialog`. If the backend
 * limit ever changes, update this value too — a mismatch only degrades the
 * UX (the add button hides a step late, or is blocked one step early); the
 * backend's own 422 remains the source of truth for enforcement.
 *
 * This number is also PUBLISHED: `/comparar/linktree` states it in the
 * comparison table ("Até 20 itens" / "Up to 20 items", in both locales of
 * `public.json`). Changing the cap without updating that copy turns an
 * indexed page — one that feeds `FAQPage` JSON-LD — into a false claim about
 * our own product, so update the two locale strings in the same change.
 */
export const MAX_BIO_ITEMS = 20;

/** Soft client-side cap for the page title — the API has no documented limit. */
export const TITLE_MAX_LENGTH = 100;

/** Hard cap for the bio/description field, enforced by both form and API. */
export const BIO_DESCRIPTION_MAX_LENGTH = 280;

/**
 * Mirrors `UploadBioAvatarRequest::rules()` (`max:2048` — Laravel's `max`
 * for files is in kilobytes) on the backend. Drives the client-side
 * pre-upload check in `avatarValidation.ts` so an oversized file never
 * leaves the browser; the backend's own 422 remains the source of truth.
 */
export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Mirrors `UploadBioAvatarRequest::rules()` (`mimes:jpeg,png,webp`). Used
 * both for the client-side type check and the file input's `accept`
 * attribute.
 */
export const AVATAR_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** `accept` attribute value for the avatar `<input type="file">`. */
export const AVATAR_ACCEPT_ATTR = AVATAR_ACCEPTED_TYPES.join(",");
