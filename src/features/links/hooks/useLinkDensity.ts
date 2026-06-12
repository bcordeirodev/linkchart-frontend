"use client";

import { useCallback, useEffect, useState } from "react";

/** Row density for the desktop links list. */
export type LinkDensity = "comfortable" | "compact";

const STORAGE_KEY = "links:density";
const DEFAULT_DENSITY: LinkDensity = "comfortable";

/**
 * Type guard narrowing an arbitrary string to a valid {@link LinkDensity}.
 *
 * @param value - candidate read from `localStorage`.
 * @returns `true` when `value` is `"comfortable"` or `"compact"`.
 */
function isLinkDensity(value: string | null): value is LinkDensity {
  return value === "comfortable" || value === "compact";
}

/**
 * Persisted row-density preference for the links list (Gmail/Linear-style
 * compact toggle).
 *
 * The state starts at {@link DEFAULT_DENSITY} on the server and the first client
 * render, then hydrates from `localStorage` in an effect — this avoids an SSR
 * hydration mismatch while still restoring the user's choice across reloads.
 *
 * @returns the current `density` and a `setDensity` setter that also persists.
 */
export function useLinkDensity(): {
  density: LinkDensity;
  setDensity: (next: LinkDensity) => void;
} {
  const [density, setDensityState] = useState<LinkDensity>(DEFAULT_DENSITY);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLinkDensity(stored)) {
        setDensityState(stored);
      }
    } catch {
      // localStorage unavailable (private mode / SSR) — keep the default.
    }
  }, []);

  const setDensity = useCallback((next: LinkDensity) => {
    setDensityState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; the in-memory state still updates.
    }
  }, []);

  return { density, setDensity };
}

export default useLinkDensity;
