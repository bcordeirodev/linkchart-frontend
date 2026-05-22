"use client";
import { useState, useEffect } from "react";

import {
  checkSlugAvailabilityOnce,
  PUBLIC_SLUG_PATTERN,
  SLUG_AVAILABILITY_PATTERN,
  type SlugValidationMode,
} from "@/features/links/utils/slugAvailabilityCheck";

export type SlugAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken";

/**
 * Debounced check that returns whether a custom slug is available.
 *
 * @param slug - the candidate slug (must match `^[a-z0-9-]{3,50}$`)
 * @returns one of `"idle" | "checking" | "available" | "taken"`
 *
 * @remarks
 * Endpoint: `GET /api/public/links/{slug}` (via `publicLinkService.getLinkBySlug()`).
 * Treats HTTP 404 as `"available"` and any other `ApiError` as `"idle"` (network/unknown error — don't block the form).
 * Debounced 500 ms after the last `slug` change; invalid slugs short-circuit to `"idle"` without a request.
 */
export function useSlugAvailability(
  slug: string,
  mode: SlugValidationMode = "auth",
): SlugAvailabilityStatus {
  const [status, setStatus] = useState<SlugAvailabilityStatus>("idle");
  const pattern =
    mode === "public" ? PUBLIC_SLUG_PATTERN : SLUG_AVAILABILITY_PATTERN;

  useEffect(() => {
    if (!slug || !pattern.test(slug)) {
      setStatus("idle");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;
      setStatus("checking");
      const result = await checkSlugAvailabilityOnce(slug, mode);
      if (cancelled) return;
      setStatus(
        result === "available"
          ? "available"
          : result === "taken"
            ? "taken"
            : "idle",
      );
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug, mode, pattern]);

  return status;
}
