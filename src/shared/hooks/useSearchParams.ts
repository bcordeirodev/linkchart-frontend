// src/shared/hooks/useSearchParams.ts
"use client";
import { useSearchParams as useNextSearchParams } from "next/navigation";

/**
 * Drop-in replacement for `react-router-dom`'s `useSearchParams`.
 *
 * @returns a tuple `[URLSearchParams]` so callers can keep using
 *          `const [searchParams] = useSearchParams()` unchanged.
 *
 * @remarks
 * Setter is intentionally omitted. Next's read-only `ReadonlyURLSearchParams`
 * is cast to `URLSearchParams` for read-call ergonomics. To mutate the URL,
 * use `useNavigate` plus the full path with a query string.
 */
export function useSearchParams(): [URLSearchParams] {
  const params = useNextSearchParams();
  // Double cast: next/navigation returns ReadonlyURLSearchParams which is
  // structurally identical to URLSearchParams for reading purposes.
  return [params as unknown as URLSearchParams];
}

export default useSearchParams;
