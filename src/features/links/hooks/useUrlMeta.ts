"use client";
import { useState, useEffect } from "react";

import { linkMetaService } from "@/services/link-meta.service";

/** Debounce delay in ms before firing the metadata request. */
const DEBOUNCE_MS = 700;

/**
 * Fetches Open Graph metadata for a URL and returns the og:title.
 *
 * Fires `GET /api/links/url-meta` with a 700 ms debounce after the URL
 * stabilises. Only triggers when `url` is a valid absolute URL starting with
 * `http://` or `https://`. All failures are swallowed silently — callers
 * should treat `ogTitle === null` as "no suggestion available".
 *
 * Non-interference rules:
 * - If the URL changes before the debounce fires, the previous timer is
 *   cancelled and a fresh one starts.
 * - If a request is in-flight when the URL changes, its result is discarded
 *   (via a `cancelled` flag) and state is not updated.
 *
 * @param url - The URL string to fetch metadata for.
 * @returns `{ ogTitle, isLoading }` where `ogTitle` is null when unavailable.
 */
export function useUrlMeta(url: string): {
  ogTitle: string | null;
  isLoading: boolean;
} {
  const [ogTitle, setOgTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    /** True when URL is a valid absolute URL the backend can fetch. */
    const valid = (() => {
      try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    })();

    if (!valid) {
      setOgTitle(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    // Show loading immediately so the spinner appears without waiting for
    // the debounce to expire.
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await linkMetaService.fetchUrlMeta(url);
        if (!cancelled) {
          setOgTitle(data?.og_title ?? null);
        }
      } catch {
        if (!cancelled) {
          setOgTitle(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [url]);

  return { ogTitle, isLoading };
}
