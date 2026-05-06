"use client";
import { Mail, RefreshCw } from "lucide-react";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useEffect, useState } from "react";
import { useNavigate } from "@/shared/hooks";

import { useAuth } from "@/lib/auth/AuthContext";
import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import { authService } from "@/services";
import { PageLoadingSkeleton } from "@/shared/ui/feedback/skeletons";

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

/**
 * Guard que verifica se o email do usuário foi verificado
 * Se não foi verificado, mostra uma tela de verificação
 */
export function EmailVerificationGuard({
  children,
}: EmailVerificationGuardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // null = not yet checked; true/false = result of the check
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    email_verified: boolean;
    can_resend: boolean;
    email: string;
    last_sent?: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setEmailVerified(null);
      return;
    }
    checkEmailVerification();
  }, [isAuthenticated, user]);

  const checkEmailVerification = async () => {
    if (!isAuthenticated || !user) {
      setEmailVerified(null);
      return;
    }

    setChecking(true);
    try {
      const status = await authService.getEmailVerificationStatus();
      setVerificationStatus(status);
      setEmailVerified(status.email_verified);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          status?: number;
          code?: string;
          details?: {
            type?: string;
            email?: string;
            can_resend?: boolean;
            last_sent?: string;
          };
        };

        if (
          apiError.status === 403 &&
          apiError.details?.type === "email_not_verified"
        ) {
          setEmailVerified(false);
          setVerificationStatus({
            email_verified: false,
            can_resend: apiError.details.can_resend || false,
            email: apiError.details.email || user.email,
            last_sent: apiError.details.last_sent,
          });
        } else {
          setEmailVerified(true);
        }
      } else {
        setEmailVerified(true);
      }
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setResendLoading(true);

      const result = await authService.resendVerificationEmail();

      if (result.success) {
        await checkEmailVerification();
      } else {
        dispatch(showErrorMessage(result.message || "Erro ao reenviar email"));
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        dispatch(
          showErrorMessage(
            apiError.response?.data?.message || "Erro ao reenviar email",
          ),
        );
      } else {
        dispatch(showErrorMessage("Erro inesperado ao reenviar email"));
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToInstructions = () => {
    navigate("/email-verification-pending", {
      state: {
        email: verificationStatus?.email || user?.email,
        message: "Verifique seu email para continuar usando o sistema.",
      },
    });
  };

  // While auth context is still initialising, or email check hasn't resolved yet,
  // show the full-page skeleton so the layout structure is visible immediately
  // and there's no visual jump when real content loads.
  if (authLoading || (isAuthenticated && user && (checking || emailVerified === null))) {
    return <PageLoadingSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return children;
  }

  if (!emailVerified) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, mt: 8 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Mail
            {...ICON_LG}
            style={{ color: "var(--palette-warning-main, #ed6c02)" }}
          />

          <Typography variant="h4" fontWeight={600} color="text.primary">
            Verificação de Email Necessária
          </Typography>

          <Alert severity="warning" sx={{ width: "100%" }}>
            <Typography variant="body1">
              Para continuar usando o sistema, você precisa verificar seu
              endereço de email.
              {verificationStatus?.email ? (
                <>
                  <br />
                  Email: <strong>{verificationStatus.email}</strong>
                </>
              ) : null}
            </Typography>
          </Alert>

          <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
            {verificationStatus?.can_resend ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleResendEmail}
                disabled={resendLoading}
                startIcon={
                  resendLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <RefreshCw {...ICON_LG} />
                  )
                }
                sx={{ py: 1.5 }}
              >
                {resendLoading
                  ? "Reenviando..."
                  : "Reenviar Email de Verificação"}
              </Button>
            ) : null}

            <Button
              variant="outlined"
              size="large"
              onClick={handleGoToInstructions}
              sx={{ py: 1.5 }}
            >
              Ver Instruções Detalhadas
            </Button>

            {!verificationStatus?.can_resend && (
              <Alert severity="info">
                <Typography variant="body2">
                  Aguarde alguns minutos antes de solicitar um novo email de
                  verificação.
                </Typography>
              </Alert>
            )}
          </Stack>
        </Stack>
      </Box>
    );
  }

  return children;
}
