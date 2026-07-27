"use client";

import { useEffect, useState } from "react";

import { HANDLE_PATTERN } from "../constants";
import { checkHandleAvailabilityOnce } from "../utils/handleAvailabilityCheck";

export type HandleAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken";

/**
 * Debounced check for whether a candidate bio-page handle is available.
 * Mirrors `@/features/links/hooks/useSlugAvailability`'s debounce shape,
 * scoped to `GET /api/bio/handle-available` and `HANDLE_PATTERN`.
 *
 * @param handle - candidate handle (already lowercased by the field's
 * `onChange`, e.g. via `sanitizeHandleInput`).
 * @param currentHandle - the page's own handle when editing an existing
 * page. Re-typing the same handle short-circuits to `"available"` without a
 * network round trip — otherwise saving without changing the handle would
 * transiently show "checking"/read as taken depending on how the server
 * implements the self-exclusion.
 * @returns one of `"idle" | "checking" | "available" | "taken"`.
 */
export function useHandleAvailability(
  handle: string,
  currentHandle?: string | null,
): HandleAvailabilityStatus {
  const [status, setStatus] = useState<HandleAvailabilityStatus>("idle");

  useEffect(() => {
    if (!handle || !HANDLE_PATTERN.test(handle)) {
      setStatus("idle");
      return;
    }

    if (currentHandle && handle === currentHandle) {
      setStatus("available");
      return;
    }

    let cancelled = false;
    setStatus("checking");

    const timer = setTimeout(async () => {
      if (cancelled) return;
      const result = await checkHandleAvailabilityOnce(handle);
      if (cancelled) return;
      setStatus(result);
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [handle, currentHandle]);

  return status;
}
