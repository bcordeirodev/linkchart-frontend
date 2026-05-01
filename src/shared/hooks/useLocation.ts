// src/shared/hooks/useLocation.ts
"use client";
import { usePathname } from "next/navigation";

interface Location {
  pathname: string;
  state: Record<string, unknown> | null;
}

/**
 * Minimal shim for react-router-dom's useLocation.
 * Next.js App Router has no history.state; state is always null here.
 * Callers using location.pathname work correctly.
 */
export function useLocation(): Location {
  const pathname = usePathname();
  return { pathname, state: null };
}

export default useLocation;
