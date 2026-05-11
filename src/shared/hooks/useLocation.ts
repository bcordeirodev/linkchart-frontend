// src/shared/hooks/useLocation.ts
"use client";
import { usePathname } from "next/navigation";

interface Location {
  pathname: string;
  state: Record<string, unknown> | null;
}

/**
 * Minimal shim for `react-router-dom`'s `useLocation` so legacy components keep working.
 *
 * @returns `{pathname, state}` — `pathname` comes from Next's `usePathname`;
 *          `state` is always `null` because the App Router doesn't expose
 *          `history.state` to client components.
 *
 * @remarks Code that only reads `location.pathname` works as-is; anything
 * relying on router state should be migrated to a real Next.js primitive.
 */
export function useLocation(): Location {
  const pathname = usePathname();
  return { pathname, state: null };
}

export default useLocation;
