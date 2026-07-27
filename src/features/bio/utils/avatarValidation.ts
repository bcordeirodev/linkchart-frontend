import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_SIZE_BYTES } from "../constants";

type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * Validates a candidate avatar file client-side, BEFORE it ever leaves the
 * browser — mirrors `UploadBioAvatarRequest::rules()` on the backend
 * (`mimes:jpeg,png,webp`, `max:2048`), minus the minimum-dimensions check
 * (100x100), which is left to the server's own 422: decoding an image just
 * to measure it is more cost than this quick pre-flight is meant to carry,
 * and a too-small image is a rare mistake compared to picking the wrong
 * file type or an oversized photo straight off a phone camera.
 *
 * @param file - the file the user picked.
 * @param t - translation function scoped to the `bio` namespace.
 * @returns a translated error message, or `null` when the file passes.
 */
export function validateAvatarFile(file: File, t: Translate): string | null {
  if (
    !AVATAR_ACCEPTED_TYPES.includes(
      file.type as (typeof AVATAR_ACCEPTED_TYPES)[number],
    )
  ) {
    return t("form.avatar.errors.invalidType");
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return t("form.avatar.errors.tooLarge");
  }

  return null;
}
