"use client";

import { useEffect, useState } from "react";

import { publicLinkService } from "@/services/link-public.service";

export type PublicSlugSuggestionStatus = "idle" | "resolving" | "ready";

/**
 * Debounce delay in ms before firing the slug suggestion request.
 *
 * Kept short on purpose: the request itself is slow (the server fetches the
 * destination page to read its og:title, ~1s), so every ms spent waiting here is
 * added straight onto a wait the user already feels. 300ms still coalesces a
 * burst of typing into one call.
 */
const DEBOUNCE_MS = 300;

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
 * @param url - the target URL, or `null` to stay idle.
 * @returns `{ slug, ogTitle, status }` — `slug` is null unless `status === "ready"`;
 *   `ogTitle` is the page title when available (independent of the slug field).
 */
export function usePublicSlugSuggestion(url: string | null): {
  slug: string | null;
  ogTitle: string | null;
  status: PublicSlugSuggestionStatus;
} {
  const [slug, setSlug] = useState<string | null>(null);
  const [ogTitle, setOgTitle] = useState<string | null>(null);
  const [status, setStatus] = useState<PublicSlugSuggestionStatus>("idle");

  useEffect(() => {
    const formatted = publicLinkService.formatUrl(url ?? "");

    if (!formatted || !publicLinkService.validateUrl(formatted)) {
      setSlug(null);
      setOgTitle(null);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setSlug(null);
    setOgTitle(null);
    setStatus("resolving");

    const timer = setTimeout(async () => {
      try {
        const resolved = await publicLinkService.suggestSlug(formatted);
        if (cancelled) {
          return;
        }
        setSlug(resolved.slug || null);
        setOgTitle(resolved.og_title ?? null);
        setStatus(resolved.slug ? "ready" : "idle");
      } catch {
        if (cancelled) {
          return;
        }
        setSlug(null);
        setOgTitle(null);
        setStatus("idle");
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [url]);

  return { slug, ogTitle, status };
}
