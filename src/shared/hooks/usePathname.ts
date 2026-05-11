"use client";
import { usePathname as useNextPathname } from "next/navigation";

/**
 * Returns the current URL pathname (e.g. `/links/123`).
 *
 * @returns the pathname string from Next.js's `usePathname`.
 *
 * @remarks
 * Re-exported from `@/shared/hooks` so legacy imports stay consistent with the
 * `useNavigate` / `useLocation` shims that mimic `react-router-dom`.
 */
export default function usePathname(): string {
  return useNextPathname();
}
