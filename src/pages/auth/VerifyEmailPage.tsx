import { CheckCircle, Error, Email, Refresh } from '@mui/icons-material';
import { Box, Typography, CircularProgress, Button, Alert, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';
import { authService } from '@/services';
import { AuthLayout } from '@/shared/layout';

type VerificationStatus = 'loading' | 'success' | 'error' | 'already_verified' | 'invalid_token';

/**
 * Página de verificação de email
 */
function VerifyEmailPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState<VerificationStatus>('loading');
	const [message, setMessage] = useState('');
	const [isResending, setIsResending] = useState(false);

	const token = searchParams.get('token');

	useEffect(() => {
		if (!token) {
			setStatus('invalid_token');
			setMessage('Token de verificação não encontrado na URL');
			return;
		}

		verifyEmailToken(token);
	}, [token]);

	const verifyEmailToken = async (verificationToken: string) => {
		try {
			setStatus('loading');

			const result = await authService.verifyEmail(verificationToken);

			if (result.success) {
				setStatus(result.type === 'already_verified' ? 'already_verified' : 'success');
				setMessage(result.message);

				dispatch(showSuccessMessage(result.message));

				// Redirecionar após 3 segundos
				setTimeout(() => {
					navigate('/analytics');
				}, 3000);
			} else {
				setStatus('error');
				setMessage(result.message);
			}
		} catch (error: unknown) {
			setStatus('error');
			setMessage('Erro inesperado ao verificar email');
			console.error('Erro na verificação:', error);
		}
	};

	const handleResendVerification = async () => {
		try {
			setIsResending(true);

			const result = await authService.resendVerificationEmail();

			if (result.success) {
				dispatch(showSuccessMessage(result.message));
			} else {
				dispatch(showErrorMessage(result.message));
			}
		} catch (error) {
			dispatch(showErrorMessage('Erro ao reenviar email de verificação'));
		} finally {
			setIsResending(false);
		}
	};

	const getStatusIcon = () => {
		switch (status) {
			case 'loading':
				return (
					<CircularProgress
						size={60}
						color='primary'
					/>
				);
			case 'success':
			case 'already_verified':
				return <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />;
			case 'error':
			case 'invalid_token':
				return <Error sx={{ fontSize: 60, color: 'error.main' }} />;
			default:
				return <Email sx={{ fontSize: 60, color: 'primary.main' }} />;
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case 'success':
			case 'already_verified':
				return 'success';
			case 'error':
			case 'invalid_token':
				return 'error';
			default:
				return 'info';
		}
	};

	const getTitle = () => {
		switch (status) {
			case 'loading':
				return 'Verificando email...';
			case 'success':
				return 'Email verificado com sucesso!';
			case 'already_verified':
				return 'Email já verificado';
			case 'error':
			case 'invalid_token':
				return 'Erro na verificação';
			default:
				return 'Verificação de Email';
		}
	};

	const getSubtitle = () => {
		switch (status) {
			case 'loading':
				return 'Aguarde enquanto verificamos seu email';
			case 'success':
				return 'Sua conta foi ativada. Redirecionando...';
			case 'already_verified':
				return 'Sua conta já estava ativa';
			case 'error':
			case 'invalid_token':
				return 'Não foi possível verificar seu email';
			default:
				return 'Verificando sua conta';
		}
	};

	return (
		<AuthLayout
			title={getTitle()}
			subtitle={getSubtitle()}
			variant='verify'
			footerLinks={[
				{
					text: 'Voltar para',
					linkText: 'página inicial',
					href: '/'
				}
			]}
		>
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<Stack
					spacing={4}
					alignItems='center'
				>
					{/* Ícone de status */}
					<Box>{getStatusIcon()}</Box>

					{/* Mensagem */}
					{message ? (
						<Alert
							severity={getStatusColor()}
							sx={{ width: '100%', textAlign: 'left' }}
						>
							{message}
						</Alert>
					) : null}

					{/* Ações baseadas no status */}
					{status === 'success' && (
						<Typography
							variant='body2'
							color='text.secondary'
						>
							Redirecionando para o painel em alguns segundos...
						</Typography>
					)}

					{status === 'already_verified' && (
						<Button
							variant='contained'
							onClick={() => navigate('/analytics')}
							sx={{ mt: 2 }}
						>
							Ir para o Painel
						</Button>
					)}

					{(status === 'error' || status === 'invalid_token') && (
						<Stack
							spacing={2}
							sx={{ width: '100%' }}
						>
							<Button
								variant='contained'
								startIcon={
									isResending ? (
										<CircularProgress
											size={20}
											color='inherit'
										/>
									) : (
										<Refresh />
									)
								}
								onClick={handleResendVerification}
								disabled={isResending}
								fullWidth
							>
								{isResending ? 'Reenviando...' : 'Reenviar Email de Verificação'}
							</Button>

							<Button
								variant='outlined'
								onClick={() => navigate('/sign-in')}
								fullWidth
							>
								Fazer Login
							</Button>
						</Stack>
					)}

					{status === 'loading' && (
						<Typography
							variant='body2'
							color='text.secondary'
						>
							Por favor, aguarde...
						</Typography>
					)}
				</Stack>
			</Box>
		</AuthLayout>
	);
}

export default VerifyEmailPage;
