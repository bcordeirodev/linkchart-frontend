"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

/**
 * Drop-in replacement for react-router-dom's useNavigate.
 * Supports:
 *   navigate("/path")
 *   navigate("/path", { replace: true, state: {...} })
 *   navigate(-1)  — maps to router.back()
 */
export function useNavigate() {
  const router = useRouter();
  const navigate = useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        // Only -1 (go back) is supported in Next.js App Router
        if (to < 0) {
          router.back();
        } else {
          router.forward();
        }
        return;
      }
      // state is intentionally not passed — Next.js App Router has no history.state.
      // Callers depending on location.state must be migrated to URL search params.
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router],
  );
  return navigate;
}

export default useNavigate;
