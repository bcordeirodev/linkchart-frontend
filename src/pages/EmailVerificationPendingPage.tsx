import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Typography,
    Button,
    Stack,
    CircularProgress,
    Alert,
    Paper,
    Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Email, CheckCircle, Refresh, ArrowBack } from '@mui/icons-material';
import { authService } from '@/services';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';
import { AuthLayout } from '@/shared/layout';

interface LocationState {
    email?: string;
    message?: string;
}

/**
 * Página de verificação de email pendente
 * Exibida após o registro para instruir o usuário sobre a verificação
 */
function EmailVerificationPendingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const [resendLoading, setResendLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<{
        email_verified: boolean;
        can_resend: boolean;
        last_sent?: string;
    } | null>(null);

    // Obter dados do estado da navegação
    const state = location.state as LocationState;
    const email = state?.email || '';
    const message = state?.message || 'Verifique seu email para ativar sua conta.';

    // Verificar status de verificação ao carregar a página
    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                const status = await authService.getEmailVerificationStatus();
                setVerificationStatus(status);

                // Se já está verificado, redirecionar
                if (status.email_verified) {
                    dispatch(showSuccessMessage('Email já verificado! Redirecionando...'));
                    setTimeout(() => navigate('/analytics'), 1500);
                }
            } catch (error) {
                // Usuário não autenticado, pode continuar na página
            }
        };

        checkVerificationStatus();
    }, [dispatch, navigate]);


    const handleResendEmail = async () => {
        try {
            setResendLoading(true);

            const result = await authService.resendVerificationEmail();

            if (result.success) {
                dispatch(showSuccessMessage('Email de verificação reenviado com sucesso!'));
                // Atualizar status
                const status = await authService.getEmailVerificationStatus();
                setVerificationStatus(status);
            } else {
                dispatch(showErrorMessage(result.message || 'Erro ao reenviar email'));
            }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                dispatch(showErrorMessage(apiError.response?.data?.message || 'Erro ao reenviar email'));
            } else {
                dispatch(showErrorMessage('Erro inesperado ao reenviar email'));
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/sign-in');
    };


    return (
        <AuthLayout
            title="Verifique seu email"
            subtitle="Enviamos um link de verificação para o seu email"
            variant="verify"
            footerLinks={[
                {
                    text: 'Já possui uma conta verificada?',
                    linkText: 'Fazer login',
                    href: '/sign-in'
                }
            ]}
        >
            <Stack spacing={3}>
                {/* Status da verificação */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: alpha('#0A74DA', 0.05),
                        border: `1px solid ${alpha('#0A74DA', 0.2)}`
                    }}
                >
                    <Stack spacing={2} alignItems="center" textAlign="center">
                        <Email sx={{ fontSize: 48, color: '#0A74DA' }} />

                        <Typography variant="h6" color="#0A74DA" fontWeight={600}>
                            Verificação de Email Necessária
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {message}
                        </Typography>

                        {email && (
                            <Typography variant="body2" fontWeight={500}>
                                Email enviado para: <strong>{email}</strong>
                            </Typography>
                        )}
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
                    {verificationStatus && !verificationStatus.email_verified && (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleResendEmail}
                            disabled={resendLoading || !verificationStatus.can_resend}
                            startIcon={
                                resendLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <Refresh />
                                )
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0D47A1 0%, #002171 100%)'
                                },
                                '&:disabled': {
                                    background: '#E0E0E0'
                                }
                            }}
                        >
                            {resendLoading ? 'Reenviando...' : 'Reenviar email de verificação'}
                        </Button>
                    )}

                    {/* Informação sobre rate limiting */}
                    {verificationStatus && !verificationStatus.can_resend && (
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                            <Typography variant="body2">
                                Aguarde alguns minutos antes de solicitar um novo email de verificação.
                            </Typography>
                        </Alert>
                    )}

                    {/* Voltar para login */}
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleBackToLogin}
                        startIcon={<ArrowBack />}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderColor: '#0A74DA',
                            color: '#0A74DA',
                            '&:hover': {
                                borderColor: '#0D47A1',
                                backgroundColor: alpha('#0A74DA', 0.05)
                            }
                        }}
                    >
                        Voltar para o login
                    </Button>
                </Stack>

                {/* Email já verificado */}
                {verificationStatus?.email_verified && (
                    <Alert
                        severity="success"
                        sx={{ borderRadius: 2 }}
                        icon={<CheckCircle />}
                    >
                        <Typography variant="body2">
                            <strong>Email já verificado!</strong> Você pode fazer login normalmente.
                        </Typography>
                    </Alert>
                )}
            </Stack>
        </AuthLayout>
    );
}

export default EmailVerificationPendingPage;
