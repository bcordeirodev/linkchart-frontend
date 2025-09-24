import { Email, Refresh } from '@mui/icons-material';
import { Alert, Button, Box, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';
import { authService } from '@/services';

interface EmailVerificationBannerProps {
	onVerificationStatusChange?: (isVerified: boolean) => void;
}

/**
 * Banner de notificação para verificação de email
 * Mostra apenas se o usuário não verificou o email
 */
export function EmailVerificationBanner({ onVerificationStatusChange }: EmailVerificationBannerProps) {
	const dispatch = useAppDispatch();
	const [isVisible, setIsVisible] = useState(false);
	const [canResend, setCanResend] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [isDismissed, setIsDismissed] = useState(false);

	useEffect(() => {
		checkVerificationStatus();
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
			console.warn('Erro ao verificar status de email:', error);
		}
	};

	const handleResendVerification = async () => {
		try {
			setIsResending(true);

			const result = await authService.resendVerificationEmail();

			if (result.success) {
				dispatch(showSuccessMessage(result.message));
				setCanResend(false); // Desabilitar botão temporariamente

				// Reabilitar após 2 minutos
				setTimeout(
					() => {
						setCanResend(true);
					},
					2 * 60 * 1000
				);
			} else {
				dispatch(showErrorMessage(result.message));
			}
		} catch (error) {
			dispatch(showErrorMessage('Erro ao reenviar email de verificação'));
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
			severity='warning'
			icon={<Email />}
			sx={{
				mb: 2,
				'& .MuiAlert-message': {
					width: '100%'
				}
			}}
			action={
				<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
					<Button
						color='inherit'
						size='small'
						onClick={handleResendVerification}
						disabled={!canResend || isResending}
						startIcon={
							isResending ? (
								<CircularProgress
									size={16}
									color='inherit'
								/>
							) : (
								<Refresh />
							)
						}
						sx={{ whiteSpace: 'nowrap' }}
					>
						{isResending ? 'Enviando...' : 'Reenviar'}
					</Button>
					<Button
						color='inherit'
						size='small'
						onClick={handleDismiss}
						sx={{ minWidth: 'auto', px: 1 }}
					>
						×
					</Button>
				</Box>
			}
		>
			<strong>Verifique seu email</strong>
			<br />
			Enviamos um link de verificação para <strong>{userEmail}</strong>. Clique no link para ativar sua conta e
			acessar todos os recursos.
		</Alert>
	);
}

export default EmailVerificationBanner;
