import { Email, Refresh } from '@mui/icons-material';
import { Box, CircularProgress, Alert, Typography, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/lib/auth/AuthContext';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';
import { authService } from '@/services';

interface EmailVerificationGuardProps {
	children: React.ReactNode;
}

/**
 * Guard que verifica se o email do usuário foi verificado
 * Se não foi verificado, mostra uma tela de verificação
 */
export function EmailVerificationGuard({ children }: EmailVerificationGuardProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user, isAuthenticated } = useAuth();

	const [loading, setLoading] = useState(true);
	const [emailVerified, setEmailVerified] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [verificationStatus, setVerificationStatus] = useState<{
		email_verified: boolean;
		can_resend: boolean;
		email: string;
		last_sent?: string;
	} | null>(null);

	useEffect(() => {
		checkEmailVerification();
	}, [isAuthenticated, user]);

	const checkEmailVerification = async () => {
		if (!isAuthenticated || !user) {
			setLoading(false);
			return;
		}

		try {
			const status = await authService.getEmailVerificationStatus();
			setVerificationStatus(status);
			setEmailVerified(status.email_verified);
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'response' in error) {
				const apiError = error as {
					response?: {
						status?: number;
						data?: {
							type?: string;
							email?: string;
							can_resend?: boolean;
							last_sent?: string;
						};
					};
				};

				if (apiError.response?.status === 403 && apiError.response.data?.type === 'email_not_verified') {
					setEmailVerified(false);
					setVerificationStatus({
						email_verified: false,
						can_resend: apiError.response.data.can_resend || false,
						email: apiError.response.data.email || user.email,
						last_sent: apiError.response.data.last_sent
					});
				} else {
					setEmailVerified(true);
				}
			} else {
				setEmailVerified(true);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleResendEmail = async () => {
		try {
			setResendLoading(true);

			const result = await authService.resendVerificationEmail();

			if (result.success) {
				dispatch(showSuccessMessage('Email de verificação reenviado com sucesso!'));
				await checkEmailVerification();
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

	const handleGoToInstructions = () => {
		navigate('/email-verification-pending', {
			state: {
				email: verificationStatus?.email || user?.email,
				message: 'Verifique seu email para continuar usando o sistema.'
			}
		});
	};

	if (!isAuthenticated || !user) {
		return children;
	}

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '50vh'
				}}
			>
				<CircularProgress size={48} />
			</Box>
		);
	}

	if (!emailVerified) {
		return (
			<Box sx={{ maxWidth: 600, mx: 'auto', p: 3, mt: 8 }}>
				<Stack
					spacing={4}
					alignItems='center'
					textAlign='center'
				>
					<Email sx={{ fontSize: 64, color: 'warning.main' }} />

					<Typography
						variant='h4'
						fontWeight={600}
						color='text.primary'
					>
						Verificação de Email Necessária
					</Typography>

					<Alert
						severity='warning'
						sx={{ width: '100%' }}
					>
						<Typography variant='body1'>
							Para continuar usando o sistema, você precisa verificar seu endereço de email.
							{verificationStatus?.email ? (
								<>
									<br />
									Email: <strong>{verificationStatus.email}</strong>
								</>
							) : null}
						</Typography>
					</Alert>

					<Stack
						spacing={2}
						sx={{ width: '100%', maxWidth: 400 }}
					>
						{verificationStatus?.can_resend ? (
							<Button
								variant='contained'
								size='large'
								onClick={handleResendEmail}
								disabled={resendLoading}
								startIcon={
									resendLoading ? (
										<CircularProgress
											size={20}
											color='inherit'
										/>
									) : (
										<Refresh />
									)
								}
								sx={{ py: 1.5 }}
							>
								{resendLoading ? 'Reenviando...' : 'Reenviar Email de Verificação'}
							</Button>
						) : null}

						<Button
							variant='outlined'
							size='large'
							onClick={handleGoToInstructions}
							sx={{ py: 1.5 }}
						>
							Ver Instruções Detalhadas
						</Button>

						{!verificationStatus?.can_resend && (
							<Alert severity='info'>
								<Typography variant='body2'>
									Aguarde alguns minutos antes de solicitar um novo email de verificação.
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
