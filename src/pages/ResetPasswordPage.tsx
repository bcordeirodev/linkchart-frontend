import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, Stack, CircularProgress, InputAdornment, IconButton, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material';
import { AuthLayout } from '@/shared/layout';
import { authService } from '@/services';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';

// Schema de validação
const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, 'Senha deve ter pelo menos 6 caracteres')
			.max(100, 'Senha deve ter no máximo 100 caracteres')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'
			),
		password_confirmation: z.string().min(6, 'Confirmação de senha é obrigatória')
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Senhas não coincidem',
		path: ['password_confirmation']
	});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Página de redefinição de senha
 */
function ResetPasswordPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [tokenValid, setTokenValid] = useState<boolean | null>(null);

	const token = searchParams.get('token');

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: 'onBlur'
	});

	useEffect(() => {
		if (!token) {
			setTokenValid(false);
			return;
		}

		// Token presente, assumir válido até tentativa de reset
		setTokenValid(true);
	}, [token]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		if (!token) {
			dispatch(showErrorMessage('Token de recuperação não encontrado'));
			return;
		}

		try {
			setLoading(true);

			const result = await authService.resetPassword({
				token,
				password: data.password,
				password_confirmation: data.password_confirmation
			});

			if (result.success) {
				dispatch(showSuccessMessage(result.message));

				// Redirecionar para login após sucesso
				setTimeout(() => {
					navigate('/sign-in', {
						state: { message: 'Senha redefinida com sucesso! Faça login com sua nova senha.' }
					});
				}, 2000);
			} else {
				if (result.type === 'invalid_token') {
					setTokenValid(false);
				}
				dispatch(showErrorMessage(result.message));
			}
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'response' in error) {
				const apiError = error as { response?: { data?: { errors?: Record<string, string[]> } } };

				if (apiError.response?.data?.errors) {
					// Tratar erros de validação do backend
					const backendErrors = apiError.response.data.errors;
					Object.keys(backendErrors).forEach((field) => {
						setError(field as keyof ResetPasswordFormData, {
							message: backendErrors[field][0]
						});
					});
				} else {
					dispatch(showErrorMessage('Erro ao redefinir senha. Tente novamente.'));
				}
			} else {
				dispatch(showErrorMessage('Erro inesperado. Tente novamente.'));
			}
		} finally {
			setLoading(false);
		}
	};

	// Token inválido ou não encontrado
	if (tokenValid === false) {
		return (
			<AuthLayout
				title="Link inválido"
				subtitle="O link de recuperação de senha é inválido ou expirou"
				variant="reset"
				footerLinks={[
					{
						text: 'Precisa de ajuda?',
						linkText: 'Solicitar nova recuperação',
						href: '/forgot-password'
					}
				]}
			>
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Stack
						spacing={3}
						alignItems="center"
					>
						<Alert
							severity="error"
							sx={{ width: '100%' }}
						>
							O link de recuperação de senha é inválido ou expirou. Solicite um novo link de recuperação.
						</Alert>

						<Stack
							spacing={2}
							sx={{ width: '100%' }}
						>
							<Button
								variant="contained"
								href="/forgot-password"
								fullWidth
							>
								Solicitar nova recuperação
							</Button>

							<Button
								variant="outlined"
								href="/sign-in"
								fullWidth
							>
								Voltar ao Login
							</Button>
						</Stack>
					</Stack>
				</Box>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Redefinir senha"
			subtitle="Digite sua nova senha para completar a recuperação"
			variant="reset"
			footerLinks={[
				{
					text: 'Lembrou da senha?',
					linkText: 'Fazer login',
					href: '/sign-in'
				}
			]}
		>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Stack spacing={3}>
					{/* Nova Senha */}
					<TextField
						{...register('password')}
						fullWidth
						type={showPassword ? 'text' : 'password'}
						label="Nova senha"
						error={!!errors.password}
						helperText={
							errors.password?.message ||
							'Mínimo 6 caracteres com letras maiúsculas, minúsculas e números'
						}
						disabled={loading}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock sx={{ color: '#5F6368' }} />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
										disabled={loading}
										sx={{ color: '#5F6368' }}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							)
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								backgroundColor: '#ffffff',
								'& input': {
									color: '#212121',
									'&::placeholder': {
										color: '#5F6368',
										opacity: 1
									}
								},
								'& fieldset': {
									borderColor: alpha('#000000', 0.2)
								},
								'&:hover fieldset': {
									borderColor: '#0A74DA'
								},
								'&.Mui-focused fieldset': {
									borderColor: '#0A74DA'
								},
								'&.Mui-error fieldset': {
									borderColor: '#d32f2f'
								}
							},
							'& .MuiInputLabel-root': {
								color: '#5F6368',
								'&.Mui-focused': {
									color: '#0A74DA'
								},
								'&.Mui-error': {
									color: '#d32f2f'
								}
							},
							'& .MuiFormHelperText-root': {
								color: '#5F6368',
								'&.Mui-error': {
									color: '#d32f2f'
								}
							}
						}}
					/>

					{/* Confirmar Nova Senha */}
					<TextField
						{...register('password_confirmation')}
						fullWidth
						type={showConfirmPassword ? 'text' : 'password'}
						label="Confirmar nova senha"
						error={!!errors.password_confirmation}
						helperText={errors.password_confirmation?.message}
						disabled={loading}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<CheckCircle sx={{ color: '#5F6368' }} />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										edge="end"
										disabled={loading}
										sx={{ color: '#5F6368' }}
									>
										{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							)
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								backgroundColor: '#ffffff',
								'& input': {
									color: '#212121',
									'&::placeholder': {
										color: '#5F6368',
										opacity: 1
									}
								},
								'& fieldset': {
									borderColor: alpha('#000000', 0.2)
								},
								'&:hover fieldset': {
									borderColor: '#0A74DA'
								},
								'&.Mui-focused fieldset': {
									borderColor: '#0A74DA'
								},
								'&.Mui-error fieldset': {
									borderColor: '#d32f2f'
								}
							},
							'& .MuiInputLabel-root': {
								color: '#5F6368',
								'&.Mui-focused': {
									color: '#0A74DA'
								},
								'&.Mui-error': {
									color: '#d32f2f'
								}
							},
							'& .MuiFormHelperText-root': {
								color: '#5F6368',
								'&.Mui-error': {
									color: '#d32f2f'
								}
							}
						}}
					/>

					{/* Submit Button */}
					<Button
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						disabled={loading || !isValid}
						startIcon={
							loading ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : null
						}
						sx={{
							mt: 2,
							py: 1.5,
							borderRadius: 2,
							fontSize: '1.1rem',
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
						{loading ? 'Redefinindo...' : 'Redefinir senha'}
					</Button>
				</Stack>
			</Box>
		</AuthLayout>
	);
}

export default ResetPasswordPage;
