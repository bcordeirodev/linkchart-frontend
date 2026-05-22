"use client";

import { useEffect, useState } from "react";

import {
  resolveAvailableSlug,
  type SlugValidationMode,
} from "@/features/links/utils/slugAvailabilityCheck";

export type AvailableSlugSuggestionStatus =
  | "idle"
  | "resolving"
  | "ready"
  | "unavailable";

const DEBOUNCE_MS = 500;

/**
 * Resolves the first available slug from a base (og:title or URL path): base, `-2`…`-999`,
 * then short random suffixes on the same prefix. Pass `null` while the slug field is filled.
 */
export type UseAvailableSlugSuggestionOptions = {
  excludeSlug?: string | null;
  /** `public` = /shorter (`[a-z0-9-]`, max 50); `auth` = create/edit forms. */
  mode?: SlugValidationMode;
};

export function useAvailableSlugSuggestion(
  baseSlug: string | null,
  options: UseAvailableSlugSuggestionOptions = {},
): {
  availableSlug: string | null;
  status: AvailableSlugSuggestionStatus;
} {
  const { excludeSlug = null, mode = "auth" } = options;
  const [availableSlug, setAvailableSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<AvailableSlugSuggestionStatus>("idle");

  useEffect(() => {
    if (!baseSlug) {
      setAvailableSlug(null);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setAvailableSlug(null);
    setStatus("resolving");

    const timer = setTimeout(async () => {
      const found = await resolveAvailableSlug(baseSlug, { excludeSlug, mode });
      if (cancelled) {
        return;
      }
      setAvailableSlug(found);
      setStatus(found ? "ready" : "unavailable");
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [baseSlug, excludeSlug, mode]);

  return { availableSlug, status };
}
