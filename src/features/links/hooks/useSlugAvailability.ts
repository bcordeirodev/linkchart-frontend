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
 * @param mode - `"public"` (the `/shorter` box) or `"auth"` (create/edit forms).
 * @param excludeSlug - edit mode only: the slug the link being edited
 *   *already owns*. When `slug` matches it, the result is forced to
 *   `"available"` instead of being checked against the API — see
 *   {@link checkSlugAvailabilityOnce} for why the check can't tell the
 *   difference on its own. Pass `null`/omit in create mode.
 * @returns one of `"idle" | "checking" | "available" | "taken"`
 *
 * @remarks
 * Endpoint: `GET /api/public/links/{slug}` (via `publicLinkService.getLinkBySlug()`).
 * Treats HTTP 404 as `"available"` and any other `ApiError` as `"idle"` (network/unknown error — don't block the form).
 * Debounced 500 ms after the last `slug` change; invalid slugs short-circuit to `"idle"` without a request.
 *
 * `"checking"` is entered as soon as the slug looks valid, *before* the debounce
 * elapses. It used to be set only when the request fired, which left the field
 * showing the previous verdict — a stale green check on a name that had already
 * been edited — for half a second on every keystroke.
 *
 * Without `excludeSlug`, loading the edit form for a link with an active
 * custom slug always flagged that link's own slug as `"taken"`: the endpoint
 * this calls (`GET /api/public/link/{slug}`) matches on the slug alone, with
 * no notion of "the link asking IS the match". Every active, non-expired,
 * already-started link reproduced this on mount; a paused/expired/scheduled
 * one masked it (the same lookup 404s for those), which is why the false
 * positive read as intermittent rather than a hard rule.
 */
export function useSlugAvailability(
  slug: string,
  mode: SlugValidationMode = "auth",
  excludeSlug?: string | null,
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
    setStatus("checking");

    const timer = setTimeout(async () => {
      if (cancelled) return;
      const result = await checkSlugAvailabilityOnce(slug, mode, excludeSlug);
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
  }, [slug, mode, excludeSlug, pattern]);

  return status;
}
