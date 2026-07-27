import { bioService } from "@/services/bio.service";

import { HANDLE_MAX_LENGTH, HANDLE_PATTERN } from "../constants";

/**
 * Sanitizes free-typed input toward a valid handle as the user types:
 * lowercases, strips characters outside `[a-z0-9-]`, collapses repeated
 * hyphens and caps the length. Does NOT guarantee the result matches
 * `HANDLE_PATTERN` (e.g. a leading/trailing hyphen can still slip through
 * mid-edit) — that's enforced at submit time by the zod schema.
 *
 * @param raw - raw input value from the handle field.
 * @returns the sanitized candidate (may be shorter than `raw`).
 */
export function sanitizeHandleInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, HANDLE_MAX_LENGTH);
}

export type HandleAvailabilityCheckResult = "idle" | "available" | "taken";

/**
 * Single request: is this handle free to claim?
 * `GET /api/bio/handle-available` — network/validation failures fall back to
 * `"idle"` so a flaky check never blocks the form with a false "taken".
 *
 * @param handle - candidate handle; short-circuits to `"idle"` when it
 * doesn't already match `HANDLE_PATTERN` (no point spending a request).
 */
export async function checkHandleAvailabilityOnce(
  handle: string,
): Promise<HandleAvailabilityCheckResult> {
  if (!handle || !HANDLE_PATTERN.test(handle)) {
    return "idle";
  }

  try {
    const { available } = await bioService.checkHandleAvailability(handle);
    return available ? "available" : "taken";
  } catch {
    return "idle";
  }
}
