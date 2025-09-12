import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, Stack, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Visibility, VisibilityOff, Person, Email, Lock, CheckCircle } from '@mui/icons-material';
import authRoles from '../lib/auth/authRoles';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { authService } from '@/services';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';
import { AuthLayout } from '@/shared/layout';

// Schema de validação com Zod
const signUpSchema = z
	.object({
		name: z
			.string()
			.min(2, 'Nome deve ter pelo menos 2 caracteres')
			.max(255, 'Nome deve ter no máximo 255 caracteres')
			.regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
		email: z
			.string()
			.min(1, 'Email é obrigatório')
			.email('Email deve ser válido')
			.max(255, 'Email deve ter no máximo 255 caracteres'),
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

type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * The sign up page.
 */
function SignUpPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		mode: 'onBlur'
	});

	const onSubmit = async (data: SignUpFormData) => {
		try {
			setLoading(true);

			await authService.signUp({
				name: data.name,
				email: data.email,
				password: data.password,
				password_confirmation: data.password_confirmation
			});

			dispatch(showSuccessMessage('Conta criada com sucesso! Redirecionando...'));

			// Redirecionar após sucesso
			setTimeout(() => {
				navigate('/analytics');
			}, 1500);
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'response' in error) {
				const apiError = error as { response?: { data?: { errors?: Record<string, string[]> } } };

				if (apiError.response?.data?.errors) {
					// Tratar erros de validação do backend
					const backendErrors = apiError.response.data.errors;
					Object.keys(backendErrors).forEach((field) => {
						setError(field as keyof SignUpFormData, {
							message: backendErrors[field][0]
						});
					});
				} else {
					dispatch(showErrorMessage('Erro ao criar conta. Tente novamente.'));
				}
			} else {
				dispatch(showErrorMessage('Erro inesperado. Tente novamente.'));
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthGuardRedirect auth={authRoles.onlyGuest}>
			<AuthLayout
				title="Criar nova conta"
				subtitle="Junte-se ao Link Chart e comece a otimizar seus links hoje mesmo"
				variant="signup"
				footerLinks={[
					{
						text: 'Já possui uma conta?',
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
						{/* Nome */}
						<TextField
							{...register('name')}
							fullWidth
							label="Nome completo"
							error={!!errors.name}
							helperText={errors.name?.message}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Person sx={{ color: '#5F6368' }} />
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

						{/* Email */}
						<TextField
							{...register('email')}
							fullWidth
							type="email"
							label="Email"
							error={!!errors.email}
							helperText={errors.email?.message}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Email sx={{ color: '#5F6368' }} />
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

						{/* Senha */}
						<TextField
							{...register('password')}
							fullWidth
							type={showPassword ? 'text' : 'password'}
							label="Senha"
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

						{/* Confirmar Senha */}
						<TextField
							{...register('password_confirmation')}
							fullWidth
							type={showConfirmPassword ? 'text' : 'password'}
							label="Confirmar senha"
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
							{loading ? 'Criando conta...' : 'Criar conta gratuita'}
						</Button>
					</Stack>
				</Box>
			</AuthLayout>
		</AuthGuardRedirect>
	);
}

export default SignUpPage;
