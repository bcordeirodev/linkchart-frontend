"use client";
import { useEffect, useRef, useState } from "react";

export type UrlSafetyStatus = "idle" | "checking" | "safe" | "unsafe" | "error";

export interface UrlSafetyCheckResult {
  status: UrlSafetyStatus;
  threats: string[];
}

/**
 * Debounced safety check against the Next.js-internal Safe Browsing proxy.
 *
 * @param url - candidate destination URL (must match `^https?://.+`)
 * @param debounceMs - debounce delay before firing the request (default `700`)
 * @returns `{ status, threats }` where status is `"idle" | "checking" | "safe" | "unsafe" | "error"`
 *
 * @remarks
 * Endpoint: `POST /api/check-url` — a Next.js route handler (NOT the Laravel API), so the rewrite in `next.config.ts` is bypassed for this exact path.
 * Aborts in-flight requests when `url` or `debounceMs` changes; ignores `AbortError`.
 * Invalid/empty `url` resets to `"idle"` without firing a request.
 */
export function useUrlSafetyCheck(
  url: string,
  debounceMs = 700,
): UrlSafetyCheckResult {
  const [status, setStatus] = useState<UrlSafetyStatus>("idle");
  const [threats, setThreats] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url || !/^https?:\/\/.+/.test(url)) {
      setStatus("idle");
      setThreats([]);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("checking");

      try {
        const response = await fetch("/api/check-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });

        if (!response.ok) {
          setStatus("error");
          return;
        }

        const data = await response.json();
        setThreats(data.threats ?? []);
        setStatus(data.isSafe ? "safe" : "unsafe");
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setStatus("error");
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [url, debounceMs]);

  return { status, threats };
}
