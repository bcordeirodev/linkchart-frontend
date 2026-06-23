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
 * @returns `{ isRedirecting, error, formKey, handleSuccess, handleError, clearError, handleReset, handleSignUp, handleLogin }`
 *
 * @remarks
 * No direct network calls — receives the `PublicLinkResponse` from `usePublicURLShortener` via `handleSuccess`.
 * `handleSuccess` writes `res.short_url` to the clipboard (best-effort, swallowed on failure) and stores the created link in `createdLink`.
 * Authenticated users are still sent to the private analytics dashboard (`/links/analytics/{id}`) after a 150 ms-delayed `navigate(...)` so the exit animation can play.
 * Guests are **not** redirected — they stay on the landing and see the inline success card (`ShorterSuccessCard`) rendered from `createdLink`; viewing the public analytics is an explicit opt-in from there.
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
  const [createdLink, setCreatedLink] = useState<PublicLinkResponse | null>(
    null,
  );
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
      // `isRedirecting` doubles as the landing's "success" flag: it swaps the
      // hero/badges into success mode and (for guests) keeps the success card
      // mounted. It stays true until `handleReset`.
      setIsRedirecting(true);
      setCreatedLink(res);

      void publicLinkService.copyToClipboard(res.short_url);

      // Guests stay on the landing and see the inline success card — no
      // navigation. Only authenticated users are sent to the private dashboard,
      // after a short delay so the exit animation plays first.
      if (!isAuthenticated) return;

      navTimerRef.current = setTimeout(() => {
        try {
          navigate(`/links/analytics/${res.id}`, {
            replace: true,
            state: { fromShorter: true, newLink: true, linkData: res },
          });
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
    setCreatedLink(null);
    setError(null);
    // Increment formKey so URLShortenerForm is force-remounted, clearing all
    // internal useForm fields, slug suggestion state, and safety-check hooks.
    setFormKey((k) => k + 1);
  }, []);

  /** Navigates to Auth0 signup screen. */
  const handleSignUp = useCallback(
    () => navigate("/auth/login?screen_hint=signup"),
    [navigate],
  );
  /** Navigates to Auth0 login screen. */
  const handleLogin = useCallback(() => navigate("/auth/login"), [navigate]);

  return {
    isRedirecting,
    createdLink,
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
