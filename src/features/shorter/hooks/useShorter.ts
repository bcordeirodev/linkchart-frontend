"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@/shared/hooks";

import { publicLinkService } from "@/services/link-public.service";

import type { PublicLinkResponse } from "@/services/link-public.service";

/**
 * Drives the public `/shorter` page state machine: success/error/reset/auth nav.
 *
 * @returns `{ isRedirecting, result, error, handleSuccess, handleError, clearError, handleReset, handleSignUp, handleLogin }`
 *
 * @remarks
 * No direct network calls — receives the `PublicLinkResponse` from `usePublicURLShortener` via `handleSuccess`.
 * `handleSuccess` writes `res.short_url` to the clipboard (best-effort, swallowed on failure) and schedules a 150 ms-delayed `navigate(...)` to `getPublicAnalyticsUrl(slug)` so the exit animation has time to play.
 * The pending nav timer is cleared on unmount and on `handleReset`.
 */
export function useShorter() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [result, setResult] = useState<PublicLinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleSuccess = useCallback(
    (res: PublicLinkResponse) => {
      if (!res?.slug) {
        setError("Erro: Link criado mas sem slug válido");
        return;
      }
      setResult(res);
      setIsRedirecting(true);

      void navigator.clipboard?.writeText(res.short_url).catch(() => undefined);

      // Short delay so the exit animation plays before navigation
      navTimerRef.current = setTimeout(() => {
        try {
          navigate(publicLinkService.getPublicAnalyticsUrl(res.slug), {
            replace: true,
            state: { fromShorter: true, newLink: true, linkData: res },
          });
        } catch (err) {
          console.error("Erro ao redirecionar:", err);
          setError("Erro ao redirecionar para analytics");
          setIsRedirecting(false);
        }
      }, 150);
    },
    [navigate],
  );

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsRedirecting(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleReset = useCallback(() => {
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
    setIsRedirecting(false);
    setResult(null);
    setError(null);
  }, []);

  const handleSignUp = useCallback(() => navigate("/sign-up"), [navigate]);
  const handleLogin = useCallback(() => navigate("/sign-in"), [navigate]);

  return {
    isRedirecting,
    result,
    error,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
    handleSignUp,
    handleLogin,
  };
}
