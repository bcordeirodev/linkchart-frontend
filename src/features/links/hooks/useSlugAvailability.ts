"use client";
import { useState, useEffect } from "react";

import { ApiError } from "@/lib/api/client";
import { publicLinkService } from "@/services/link-public.service";

export type SlugAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken";

const SLUG_PATTERN = /^[a-z0-9-]{3,50}$/;

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
