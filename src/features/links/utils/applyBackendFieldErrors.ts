import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { ApiError } from "@/lib/api/client";

/**
 * Maps Laravel-style 422 validation errors carried by an {@link ApiError}
 * onto react-hook-form field errors.
 *
 * The backend's `NormalizeApiResponse` middleware emits validation failures as
 * `{ error: { code, message, details: { errors: { field: string[] } } } }`,
 * which `ApiClient` normalizes into `ApiError` with `details.errors`. This
 * helper is the single source of truth for turning that envelope into inline
 * field errors so every link form (create, edit, public shorten) behaves
 * identically.
 *
 * @param error - the value thrown by a service/mutation call.
 * @param setError - react-hook-form's `setError` for the form being submitted.
 * @returns `true` when at least one field error was applied, allowing callers
 *   to skip a generic toast when the failure was a field-level validation error.
 */
export function applyBackendFieldErrors<T extends FieldValues>(
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
