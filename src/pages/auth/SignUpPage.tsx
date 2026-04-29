import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { Box, TextField, Button, Stack, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ICON_MD, ICON_LG } from '@/lib/theme/iconDefaults';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';
import { authService } from '@/services';
import { AuthLayout } from '@/shared/layout';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';
import authRoles from '../../lib/auth/authRoles';
import { authTextFieldSx } from '@/lib/auth/forms/authFieldStyles';

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
	const theme = useTheme();
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

			// Redirecionar para página de instruções de verificação
			navigate('/email-verification-pending', {
				state: {
					email: data.email,
					message: 'Verifique seu email para ativar sua conta.'
				}
			});
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'code' in error) {
				const apiError = error as { code?: string; details?: { fields?: Record<string, string[]> } };

				if (apiError.code === 'VALIDATION_FAILED' && apiError.details?.fields) {
					const backendErrors = apiError.details.fields;
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
				title='Criar nova conta'
				subtitle='Junte-se ao Link Charts e comece a otimizar seus links hoje mesmo'
				variant='signup'
				footerLinks={[
					{
						text: 'Já possui uma conta?',
						linkText: 'Fazer login',
						href: '/sign-in'
					}
				]}
			>
				<Box
					component='form'
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<Stack spacing={3}>
						{/* Nome */}
						<TextField
							{...register('name')}
							fullWidth
							label='Nome completo'
							error={!!errors.name}
							helperText={errors.name?.message}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<User {...ICON_LG} />
									</InputAdornment>
								)
							}}
							sx={authTextFieldSx(theme)}
						/>

						{/* Email */}
						<TextField
							{...register('email')}
							fullWidth
							type='email'
							label='Email'
							error={!!errors.email}
							helperText={errors.email?.message}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Mail {...ICON_LG} />
									</InputAdornment>
								)
							}}
							sx={authTextFieldSx(theme)}
						/>

						{/* Senha */}
						<TextField
							{...register('password')}
							fullWidth
							type={showPassword ? 'text' : 'password'}
							label='Senha'
							error={!!errors.password}
							helperText={
								errors.password?.message ||
								'Mínimo 6 caracteres com letras maiúsculas, minúsculas e números'
							}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Lock {...ICON_LG} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											onClick={() => setShowPassword(!showPassword)}
											edge='end'
											disabled={loading}
											sx={{ color: theme.palette.text.secondary }}
										>
											{showPassword ? <EyeOff {...ICON_MD} /> : <Eye {...ICON_MD} />}
										</IconButton>
									</InputAdornment>
								)
							}}
							sx={authTextFieldSx(theme)}
						/>

						{/* Confirmar Senha */}
						<TextField
							{...register('password_confirmation')}
							fullWidth
							type={showConfirmPassword ? 'text' : 'password'}
							label='Confirmar senha'
							error={!!errors.password_confirmation}
							helperText={errors.password_confirmation?.message}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<CheckCircle {...ICON_LG} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											edge='end'
											disabled={loading}
											sx={{ color: theme.palette.text.secondary }}
										>
											{showConfirmPassword ? <EyeOff {...ICON_MD} /> : <Eye {...ICON_MD} />}
										</IconButton>
									</InputAdornment>
								)
							}}
							sx={authTextFieldSx(theme)}
						/>

						{/* Submit Button */}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							size='large'
							disabled={loading || !isValid}
							startIcon={
								loading ? (
									<CircularProgress
										size={20}
										color='inherit'
									/>
								) : null
							}
							sx={{
								mt: 2,
								py: 1.5,
								fontSize: '1.1rem',
								fontWeight: 600
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
