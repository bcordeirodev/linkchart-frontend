"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { authService } from "@/services";

/** Cool-down client-side (ms) entre reenvios do e-mail de verificação. */
const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

/**
 * Controla a ação de reenviar o e-mail de verificação no perfil.
 *
 * Encapsula `authService.resendVerificationEmail()` com estado de envio,
 * toasts de sucesso/erro via `messageSlice` e cool-down client-side de
 * 2 minutos após um envio bem-sucedido (o backend aplica rate limit próprio).
 */
export function useResendVerification() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("profile");
  const [isSending, setIsSending] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /** Dispara o reenvio do e-mail de verificação e agenda o cool-down. */
  const resend = useCallback(async () => {
    setIsSending(true);
    try {
      const result = await authService.resendVerificationEmail();
      if (result.success) {
        dispatch(
          showMessage({
            message: t("sidebar.resendSuccess"),
            variant: "success",
          }),
        );
        setIsCoolingDown(true);
        timeoutRef.current = window.setTimeout(() => {
          setIsCoolingDown(false);
        }, RESEND_COOLDOWN_MS);
      } else {
        dispatch(
          showMessage({
            message: result.message || t("sidebar.resendError"),
            variant: "error",
          }),
        );
      }
    } catch {
      dispatch(
        showMessage({
          message: t("sidebar.resendError"),
          variant: "error",
        }),
      );
    } finally {
      setIsSending(false);
    }
  }, [dispatch, t]);

  return { resend, isSending, isCoolingDown };
}
