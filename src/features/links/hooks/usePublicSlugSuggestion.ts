"use client";

import { useEffect, useState } from "react";

import { publicLinkService } from "@/services/link-public.service";

export type PublicSlugSuggestionStatus = "idle" | "resolving" | "ready";

/** Debounce delay in ms before firing the slug suggestion request. */
const DEBOUNCE_MS = 500;

/**
 * Resolves a single available slug for a URL via the public, unauthenticated
 * `GET /api/public/links/suggest-slug` endpoint.
 *
 * This replaces the previous client-side approach (`useAvailableSlugSuggestion`)
 * where the browser derived a base from og:title and then issued one HTTP call
 * per candidate (`base`, `base-2`, …) until a free slug was found. Derivation and
 * availability now happen server-side in a single request, so the hook only needs
 * the raw URL — no client-side slugification.
 *
 * Behaviour:
 * - Only fires when `url` parses as an `http(s)` URL (scheme is added if missing).
 * - 500 ms debounce after the URL stabilises; a newer URL cancels the pending call.
 * - In-flight results for a stale URL are discarded via a `cancelled` flag.
 * - All failures are swallowed silently — callers treat `slug === null` as
 *   "no suggestion available".
 *
 * @param url - the target URL, or `null` to stay idle (e.g. while the slug field
 *   is already filled by the user).
 * @returns `{ slug, status }` where `slug` is null unless `status === "ready"`.
 */
export function usePublicSlugSuggestion(url: string | null): {
  slug: string | null;
  status: PublicSlugSuggestionStatus;
} {
  const [slug, setSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<PublicSlugSuggestionStatus>("idle");

  useEffect(() => {
    const formatted = publicLinkService.formatUrl(url ?? "");

    if (!formatted || !publicLinkService.validateUrl(formatted)) {
      setSlug(null);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setSlug(null);
    setStatus("resolving");

    const timer = setTimeout(async () => {
      try {
        const resolved = await publicLinkService.suggestSlug(formatted);
        if (cancelled) {
          return;
        }
        setSlug(resolved || null);
        setStatus(resolved ? "ready" : "idle");
      } catch {
        if (cancelled) {
          return;
        }
        setSlug(null);
        setStatus("idle");
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [url]);

  return { slug, status };
}
