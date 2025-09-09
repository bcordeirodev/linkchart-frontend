import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Typography,
	Box,
	Paper,
	TextField,
	Button,
	Stack,
	CircularProgress,
	InputAdornment,
	IconButton
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Visibility, VisibilityOff, Person, Email, Lock, CheckCircle } from '@mui/icons-material';
import { Link, SvgIcon } from '@/shared/components';
import authRoles from '../lib/auth/authRoles';
import AuthGuardRedirect from '../lib/auth/AuthGuardRedirect';
import { authService } from '@/services';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';

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
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 50%, #002171 100%)',
					overflow: 'hidden'
				}}
			>
				{/* Registration Form Section */}
				<Box
					sx={{
						flex: { xs: 1, md: '0 0 45%' },
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						p: { xs: 3, sm: 4, md: 6 },
						position: 'relative',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `radial-gradient(ellipse at top left, ${alpha('#0A74DA', 0.1)} 0%, transparent 50%)`,
							pointerEvents: 'none'
						}
					}}
				>
					<Paper
						elevation={24}
						sx={{
							width: '100%',
							maxWidth: 480,
							p: { xs: 3, sm: 4, md: 5 },
							background: alpha('#ffffff', 0.95),
							backdropFilter: 'blur(20px)',
							border: `1px solid ${alpha('#ffffff', 0.1)}`,
							borderRadius: 3,
							position: 'relative',
							overflow: 'hidden',
							boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '1px',
								background:
									'linear-gradient(90deg, transparent 0%, rgba(10, 116, 218, 0.5) 50%, transparent 100%)'
							}
						}}
					>
						{/* Logo and Brand */}
						<Box sx={{ mb: 3, textAlign: 'center' }}>
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 2,
									mb: 2
								}}
							>
								<Box
									sx={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 64,
										height: 64,
										borderRadius: 2,
										background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 100%)',
										boxShadow: '0 8px 24px rgba(10, 116, 218, 0.3)',
										transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
										'&:hover': {
											transform: 'scale(1.05)'
										}
									}}
								>
									<SvgIcon
										size={24}
										sx={{ color: 'white' }}
									>
										heroicons-outline:link
									</SvgIcon>
								</Box>

								<Typography
									variant="h5"
									sx={{
										fontWeight: 700,
										color: '#212121',
										fontSize: '1.5rem',
										letterSpacing: '-0.02em'
									}}
								>
									Link Chart
								</Typography>
							</Box>

							<Typography
								variant="h4"
								sx={{
									fontWeight: 600,
									color: '#212121',
									mb: 1,
									fontSize: { xs: '1.5rem', sm: '1.75rem' },
									lineHeight: 1.3
								}}
							>
								Criar nova conta
							</Typography>

							<Typography
								variant="body1"
								sx={{
									color: '#5F6368',
									fontSize: '1rem',
									lineHeight: 1.6
								}}
							>
								Junte-se ao Link Chart e comece a otimizar seus links hoje mesmo
							</Typography>
						</Box>

						{/* Registration Form */}
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

						{/* Sign In Link */}
						<Box
							sx={{
								mt: 3,
								pt: 2,
								borderTop: `1px solid ${alpha('#000000', 0.1)}`,
								textAlign: 'center'
							}}
						>
							<Typography
								variant="body2"
								sx={{ color: '#5F6368' }}
							>
								Já possui uma conta?{' '}
								<Link
									to="/sign-in"
									sx={{
										color: '#0A74DA',
										fontWeight: 600,
										textDecoration: 'none',
										transition: 'all 0.2s ease',
										'&:hover': {
											color: '#0D47A1',
											textDecoration: 'underline'
										}
									}}
								>
									Fazer login
								</Link>
							</Typography>
						</Box>
					</Paper>
				</Box>

				{/* Hero Section - Similar to SignIn */}
				<Box
					sx={{
						flex: { xs: 0, md: '0 0 55%' },
						display: { xs: 'none', md: 'flex' },
						alignItems: 'center',
						justifyContent: 'center',
						p: 6,
						position: 'relative',
						background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%)',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `radial-gradient(ellipse at center, ${alpha('#ffffff', 0.1)} 0%, transparent 70%)`,
							pointerEvents: 'none'
						}
					}}
				>
					{/* Main Content */}
					<Box sx={{ textAlign: 'center', zIndex: 10, maxWidth: 600 }}>
						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
								fontWeight: 900,
								lineHeight: 1.1,
								mb: 3,
								background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							Junte-se a{' '}
							<Box
								component="span"
								sx={{
									background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent'
								}}
							>
								milhares de usuários
							</Box>
						</Typography>

						<Typography
							variant="h5"
							sx={{
								color: alpha('#ffffff', 0.9),
								lineHeight: 1.6,
								mb: 6,
								fontWeight: 400,
								maxWidth: 500,
								mx: 'auto'
							}}
						>
							Transforme seus links em ferramentas poderosas de marketing e análise. Comece gratuitamente
							hoje mesmo.
						</Typography>

						{/* Feature List */}
						<Stack
							spacing={2}
							sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}
						>
							{[
								'✅ Links encurtados ilimitados',
								'✅ Analytics detalhados em tempo real',
								'✅ Personalização completa de URLs',
								'✅ Controle de acesso e expiração',
								'✅ Suporte técnico especializado'
							].map((feature, index) => (
								<Typography
									key={index}
									variant="body1"
									sx={{
										color: alpha('#ffffff', 0.9),
										fontSize: '1.1rem',
										display: 'flex',
										alignItems: 'center',
										gap: 1
									}}
								>
									{feature}
								</Typography>
							))}
						</Stack>
					</Box>
				</Box>
			</Box>
		</AuthGuardRedirect>
	);
}

export default SignUpPage;
