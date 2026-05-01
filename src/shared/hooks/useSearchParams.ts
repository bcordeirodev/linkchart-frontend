// src/shared/hooks/useSearchParams.ts
"use client";
import { useSearchParams as useNextSearchParams } from "next/navigation";

/**
 * Drop-in replacement for react-router-dom's useSearchParams.
 * Returns a tuple [URLSearchParams] so callers using
 * const [searchParams] = useSearchParams() work unchanged.
 */
export function useSearchParams(): [URLSearchParams] {
  const params = useNextSearchParams();
  // Double cast: next/navigation returns ReadonlyURLSearchParams which is
  // structurally identical to URLSearchParams for reading purposes.
  return [params as unknown as URLSearchParams];
}

export default useSearchParams;
