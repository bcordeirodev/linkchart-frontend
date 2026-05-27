"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@/shared/hooks";
import { useAuth } from "@/lib/auth/AuthContext";
import { publicLinkService } from "@/services/link-public.service";
import { useTranslation } from "react-i18next";

import type { PublicLinkResponse } from "@/services/link-public.service";

/**
 * Drives the public `/shorter` page state machine: success/error/reset/auth nav.
 *
 * @returns `{ isRedirecting, result, error, formKey, handleSuccess, handleError, clearError, handleReset, handleSignUp, handleLogin }`
 *
 * @remarks
 * No direct network calls — receives the `PublicLinkResponse` from `usePublicURLShortener` via `handleSuccess`.
 * `handleSuccess` writes `res.short_url` to the clipboard (best-effort, swallowed on failure) and schedules a 150 ms-delayed `navigate(...)` so the exit animation has time to play.
 * Authenticated users are sent to the private analytics dashboard (`/links/analytics/{id}`); guests stay on `/shorter?slug=…` with the public analytics stack.
 * The pending nav timer is cleared on unmount and on `handleReset`.
 *
 * `formKey` is a monotonically-increasing counter that increments every time `handleReset` is
 * called. Consumers should pass it as the React `key` prop to `URLShortenerForm` so the form
 * is fully unmounted and remounted on reset — clearing all `useForm` field values, cancelling
 * in-flight slug/safety hooks, and preventing stale spinners from persisting.
 * `isRedirecting` is also reset to `false` immediately after `navigate()` fires so the form
 * button never stays blocked if the user returns to the landing section after navigation.
 */
export function useShorter() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("public");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [result, setResult] = useState<PublicLinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleSuccess = useCallback(
    (res: PublicLinkResponse) => {
      if (!res?.slug) {
        setError(t("shorter.errors.invalidSlug"));
        return;
      }
      setResult(res);
      setIsRedirecting(true);

      void publicLinkService.copyToClipboard(res.short_url);

      // Short delay so the exit animation plays before navigation
      navTimerRef.current = setTimeout(() => {
        try {
          const destination = isAuthenticated
            ? `/links/analytics/${res.id}`
            : `/shorter?slug=${encodeURIComponent(res.slug)}`;
          navigate(destination, {
            replace: true,
            state: { fromShorter: true, newLink: true, linkData: res },
          });
          // Always clear the redirecting flag once navigation is scheduled.
          // For authenticated users the component unmounts anyway; for guests
          // (who stay on the same /shorter route with ?slug=…) the state would
          // otherwise persist and block the form if the user ever returns to
          // the landing section without going through handleReset.
          setIsRedirecting(false);
        } catch (err) {
          console.error("Erro ao redirecionar:", err);
          setError("Erro ao redirecionar para analytics");
          setIsRedirecting(false);
        }
      }, 150);
    },
    [navigate, isAuthenticated, t],
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
    // Increment formKey so URLShortenerForm is force-remounted, clearing all
    // internal useForm fields, slug suggestion state, and safety-check hooks.
    setFormKey((k) => k + 1);
  }, []);

  const handleSignUp = useCallback(() => navigate("/auth/login"), [navigate]);
  const handleLogin = useCallback(() => navigate("/sign-in"), [navigate]);

  return {
    isRedirecting,
    result,
    error,
    formKey,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
    handleSignUp,
    handleLogin,
  };
}
