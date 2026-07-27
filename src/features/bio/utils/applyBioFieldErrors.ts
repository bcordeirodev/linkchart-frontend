import { ApiError } from "@/lib/api/client";

import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Maps a `422 {error: {details: {errors: {field: string[]}}}}` response onto
 * react-hook-form field errors, so a taken/reserved handle (or any other
 * server-side validation failure) surfaces inline on the exact field instead
 * of only as a generic toast.
 *
 * Deliberately duplicated from
 * `@/features/links/utils/applyBackendFieldErrors` (same shape, same logic)
 * rather than imported — the bio feature stays self-contained and does not
 * reach into `features/links` internals.
 *
 * @param error - the error thrown by the mutation; ignored unless it is an
 * `ApiError` carrying `details.errors`.
 * @param setError - react-hook-form's `setError` for the form being validated.
 * @returns `true` if at least one field error was applied.
 */
export function applyBioFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!(error instanceof ApiError) || !error.details?.errors) {
    return false;
  }

  const fieldErrors = error.details.errors as Record<string, string[]>;
  let applied = false;

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const message = messages?.[0];
    if (message) {
      setError(field as Path<T>, { message });
      applied = true;
    }
  }

  return applied;
}
