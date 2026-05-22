"use client";
import { useState, useEffect } from "react";

import { ApiError } from "@/lib/api/client";
import { publicLinkService } from "@/services/link-public.service";

export type SlugAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken";

// Matches slugify() output: lowercase letters, digits, hyphens, underscores.
// Underscores are valid in slugs (form regex allows them via /^[a-zA-Z0-9\-_]+$/)
// and slugify() preserves them when present in the source title.
const SLUG_PATTERN = /^[a-z0-9_-]{3,50}$/;

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
export function useSlugAvailability(slug: string): SlugAvailabilityStatus {
  const [status, setStatus] = useState<SlugAvailabilityStatus>("idle");

  useEffect(() => {
    if (!slug || !SLUG_PATTERN.test(slug)) {
      setStatus("idle");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;
      setStatus("checking");
      try {
        await publicLinkService.getLinkBySlug(slug);
        if (!cancelled) setStatus("taken");
      } catch (err) {
        if (cancelled) return;
        setStatus(
          err instanceof ApiError && err.status === 404 ? "available" : "idle",
        );
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug]);

  return status;
}
