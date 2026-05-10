"use client";
import { useCallback, useState } from "react";
import { useNavigate } from "@/shared/hooks";

import { resetSessionRedirectUrl } from "@/lib/auth/sessionRedirectUrl";

interface UseRedirectWithDelayOptions {
  delay?: number;
  clearSession?: boolean;
  onRedirect?: () => void;
}

/**
 * Schedules an in-app navigation after a configurable delay, with optional countdown.
 *
 * @param targetUrl - destination passed to `useNavigate()` (does not hit `/r/{slug}` — that's a backend route)
 * @param options.delay - milliseconds before navigating (default `1000`); delays `> 1000` expose a per-second countdown
 * @param options.clearSession - when true, calls `resetSessionRedirectUrl()` immediately before navigating (default `false`)
 * @param options.onRedirect - optional callback fired right before navigation
 * @returns `{ isRedirecting, countdown, startRedirect, cancelRedirect, redirectImmediately }`
 *
 * @remarks
 * This hook is a UX wrapper around `useNavigate()` — it does NOT interact with the Laravel `/r/{slug}` redirect or its tracking pipeline.
 * The actual public redirect flow lives in `app/(public)/r/[slug]/page.tsx` and `RedirectDynamic.tsx`, which are forbidden zones.
 */
export function useRedirectWithDelay(
  targetUrl: string,
  options: UseRedirectWithDelayOptions = {},
) {
  const { delay = 1000, clearSession = false, onRedirect } = options;
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startRedirect = useCallback(() => {
    setIsRedirecting(true);

    if (delay > 1000) {
      // Show countdown for delays longer than 1 second
      const countdownSeconds = Math.ceil(delay / 1000);
      setCountdown(countdownSeconds);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    const timer = setTimeout(() => {
      if (clearSession) {
        resetSessionRedirectUrl();
      }

      onRedirect?.();
      navigate(targetUrl);
    }, delay);

    return () => {
      clearTimeout(timer);

      if (delay > 1000) {
        setCountdown(0);
      }
    };
  }, [targetUrl, delay, clearSession, navigate, onRedirect]);

  const cancelRedirect = useCallback(() => {
    setIsRedirecting(false);
    setCountdown(0);
  }, []);

  const redirectImmediately = useCallback(() => {
    if (clearSession) {
      resetSessionRedirectUrl();
    }

    onRedirect?.();
    navigate(targetUrl);
  }, [targetUrl, clearSession, navigate, onRedirect]);

  return {
    isRedirecting,
    countdown,
    startRedirect,
    cancelRedirect,
    redirectImmediately,
  };
}

export default useRedirectWithDelay;
