"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { RefObject } from "react";

/** Maximum accepted length for a `?url=` prefill candidate. */
const MAX_PREFILL_URL_LENGTH = 2048;

/**
 * Validates a raw `?url=` query value into a safe prefill candidate.
 *
 * Accepts only absolute `http:`/`https:` URLs up to
 * {@link MAX_PREFILL_URL_LENGTH} characters. Anything else — other schemes
 * (`javascript:`, `data:` …), relative paths, unparsable strings, oversized
 * values — is silently discarded so a malformed deep link degrades to the
 * normal empty form instead of surfacing an error.
 *
 * @param raw - the raw query-string value, or `null` when the param is absent
 * @returns the trimmed URL string, or `null` when the value was rejected
 */
export function sanitizePrefillUrl(raw: string | null): string | null {
  const candidate = raw?.trim();
  if (!candidate || candidate.length > MAX_PREFILL_URL_LENGTH) {
    return null;
  }
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }
  return candidate;
}

/** Return shape of {@link useShortenerPrefill}. */
export interface ShortenerPrefillResult {
  /**
   * Validated `?url=` value captured on mount, or `null` when the param was
   * absent or rejected. Stays `null` forever once {@link ShortenerPrefillResult.clearPrefill}
   * runs, even if the query string still carries the param.
   */
  prefillUrl: string | null;
  /**
   * Drops the captured prefill. Call it alongside the landing's form reset so
   * the remounted `URLShortenerForm` starts blank instead of re-applying the
   * original deep-link URL.
   */
  clearPrefill: () => void;
  /**
   * Attach to the element wrapping the shortener form; when a prefill is
   * applied the hook scrolls this element into view (no-op when it is already
   * visible).
   */
  formAnchorRef: RefObject<HTMLDivElement | null>;
}

/**
 * Funnel entry for `/?url=<long-url>` deep links (e.g. the UTM generator's
 * "shorten this URL" CTA): captures a validated `?url=` value once on mount so
 * `URLShortenerForm` can pre-fill its URL field — pre-fill only, never
 * auto-submit.
 *
 * @returns see {@link ShortenerPrefillResult}
 *
 * @remarks
 * - Uses `useSearchParams`, so callers must render below a `<Suspense>`
 *   boundary. `ShorterLanding` (the intended consumer) already sits under the
 *   boundary in `ShorterPage`, which is also the tree served on `/`.
 * - The value is captured in a lazy `useState` initializer: later query
 *   mutations (e.g. the `/shorter?slug=` analytics round-trip) never
 *   resurrect a cleared prefill.
 * - When a prefill is applied, the anchor element is scrolled into view with
 *   `block: "nearest"` — a no-op when the form is already above the fold —
 *   and smooth scrolling is disabled for `prefers-reduced-motion` visitors.
 */
export function useShortenerPrefill(): ShortenerPrefillResult {
  const searchParams = useSearchParams();
  const formAnchorRef = useRef<HTMLDivElement | null>(null);
  const [prefillUrl, setPrefillUrl] = useState<string | null>(() =>
    sanitizePrefillUrl(searchParams.get("url")),
  );

  /** Forgets the captured prefill so form resets start from a blank field. */
  const clearPrefill = useCallback(() => setPrefillUrl(null), []);

  useEffect(() => {
    if (!prefillUrl || !formAnchorRef.current) {
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    formAnchorRef.current.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [prefillUrl]);

  return { prefillUrl, clearPrefill, formAnchorRef };
}
