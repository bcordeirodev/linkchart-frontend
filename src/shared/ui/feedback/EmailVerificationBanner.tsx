"use client";
import { Mail, RefreshCw } from "lucide-react";
import { Alert, Button, Box, CircularProgress } from "@mui/material";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useState, useEffect } from "react";

import { useMessage } from "@/lib/providers/MessageProvider";
import { authService } from "@/services";

interface EmailVerificationBannerProps {
  /** Fired with the resolved verification status after the initial check. Useful for parent layouts that gate routes on verification. */
  onVerificationStatusChange?: (isVerified: boolean) => void;
}

/**
 * Warning banner that nudges the user to verify their email; renders nothing until verification status is known to be unverified (and not user-dismissed).
 *
 * On mount, calls `authService.getEmailVerificationStatus()`. Renders `null` for verified users or after the user clicks the dismiss "x". The "Reenviar" button is rate-limited client-side: disabled for 2 minutes after a successful `authService.resendVerificationEmail()`.
 */
export function EmailVerificationBanner({
  onVerificationStatusChange,
}: EmailVerificationBannerProps) {
  const { showMessage } = useMessage();
  const [isVisible, setIsVisible] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    checkVerificationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const status = await authService.getEmailVerificationStatus();

      if (status.success) {
        const isVerified = status.email_verified;
        setIsVisible(!isVerified && !isDismissed);
        setCanResend(status.can_resend);
        setUserEmail(status.email);

        onVerificationStatusChange?.(isVerified);
      }
    } catch (error) {
      // Silenciosamente falhar - não é crítico
      console.warn("Erro ao verificar status de email:", error);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);

      const result = await authService.resendVerificationEmail();

      if (result.success) {
        setCanResend(false); // Desabilitar botão temporariamente

        // Reabilitar após 2 minutos
        setTimeout(
          () => {
            setCanResend(true);
          },
          2 * 60 * 1000,
        );
      } else {
        showMessage({ variant: "error", message: result.message });
      }
    } catch {
      showMessage({
        variant: "error",
        message: "Erro ao reenviar email de verificação",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      icon={<Mail {...ICON_MD} />}
      sx={{
        mb: 2,
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
      action={
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            color="inherit"
            size="small"
            onClick={handleResendVerification}
            disabled={!canResend || isResending}
            startIcon={
              isResending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <RefreshCw {...ICON_MD} />
              )
            }
            sx={{ whiteSpace: "nowrap" }}
          >
            {isResending ? "Enviando..." : "Reenviar"}
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={handleDismiss}
            sx={{ minWidth: "auto", px: 1 }}
          >
            ×
          </Button>
        </Box>
      }
    >
      <strong>Verifique seu email</strong>
      <br />
      Enviamos um link de verificação para <strong>{userEmail}</strong>. Clique
      no link para ativar sua conta e acessar todos os recursos.
    </Alert>
  );
}

export default EmailVerificationBanner;
