"use client";
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react";
import {
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ICON_MD, ICON_LG, ICON_XL } from "@/lib/theme/iconDefaults";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "@/shared/hooks";

import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/lib/store/hooks";
import { showErrorMessage } from "@/lib/store/messageSlice";
import { authService } from "@/services";
import { AuthLayout } from "@/shared/layout";

interface LocationState {
  email?: string;
  message?: string;
}

/**
 * Página de verificação de email pendente
 * Exibida após o registro para instruir o usuário sobre a verificação
 */
function EmailVerificationPendingPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [resendLoading, setResendLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    email_verified: boolean;
    can_resend: boolean;
    last_sent?: string;
  } | null>(null);

  // Obter dados do estado da navegação
  const state = location.state as LocationState;
  const email = state?.email || "";
  const message =
    state?.message || "Verifique seu email para ativar sua conta.";

  // Verificar status de verificação ao carregar a página
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const status = await authService.getEmailVerificationStatus();
        setVerificationStatus(status);

        // Se já está verificado, redirecionar
        if (status.email_verified) {
          setTimeout(() => navigate("/link"), 1500);
        }
      } catch (_error) {
        // Usuário não autenticado, pode continuar na página
      }
    };

    checkVerificationStatus();
  }, [navigate]);

  const handleResendEmail = async () => {
    try {
      setResendLoading(true);

      const result = await authService.resendVerificationEmail();

      if (result.success) {
        // Atualizar status
        const status = await authService.getEmailVerificationStatus();
        setVerificationStatus(status);
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

  const handleBackToLogin = () => {
    navigate("/sign-in");
  };

  return (
    <AuthLayout
      title={t("emailVerificationPending.title")}
      subtitle={t("emailVerificationPending.message")}
      variant="verify"
      footerLinks={[
        {
          text: "Já possui uma conta verificada?",
          linkText: "Fazer login",
          href: "/sign-in",
        },
      ]}
    >
      <Stack spacing={3}>
        {/* Status da verificação */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Mail {...ICON_XL} style={{ color: theme.palette.primary.main }} />

            <Typography variant="h6" color="primary" fontWeight={600}>
              Verificação de Email Necessária
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>

            {email ? (
              <Typography variant="body2" fontWeight={500}>
                Email enviado para: <strong>{email}</strong>
              </Typography>
            ) : null}
          </Stack>
        </Paper>

        {/* Instruções */}
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Próximos passos:</strong>
            <br />
            1. Verifique sua caixa de entrada (e spam)
            <br />
            2. Clique no link de verificação no email
            <br />
            3. Você será redirecionado automaticamente
          </Typography>
        </Alert>

        <Divider />

        {/* Ações */}
        <Stack spacing={2}>
          {/* Reenviar email */}
          {verificationStatus && !verificationStatus.email_verified ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleResendEmail}
              disabled={resendLoading || !verificationStatus.can_resend}
              startIcon={
                resendLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RefreshCw {...ICON_MD} />
                )
              }
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {t("emailVerificationPending.resendButton")}
            </Button>
          ) : null}

          {/* Informação sobre rate limiting */}
          {verificationStatus && !verificationStatus.can_resend ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Aguarde alguns minutos antes de solicitar um novo email de
                verificação.
              </Typography>
            </Alert>
          ) : null}

          {/* Voltar para login */}
          <Button
            variant="outlined"
            size="large"
            onClick={handleBackToLogin}
            startIcon={<ArrowLeft {...ICON_MD} />}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {t("emailVerificationPending.signOutButton")}
          </Button>
        </Stack>

        {/* Email já verificado */}
        {verificationStatus?.email_verified ? (
          <Alert
            severity="success"
            sx={{ borderRadius: 2 }}
            icon={<CheckCircle {...ICON_LG} />}
          >
            <Typography variant="body2">
              <strong>Email já verificado!</strong> Você pode fazer login
              normalmente.
            </Typography>
          </Alert>
        ) : null}
      </Stack>
    </AuthLayout>
  );
}

export default EmailVerificationPendingPage;
