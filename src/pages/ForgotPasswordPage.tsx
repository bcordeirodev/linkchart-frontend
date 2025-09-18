import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, TextField, Button, Stack, CircularProgress, InputAdornment, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Email, Send } from '@mui/icons-material';
import { AuthLayout } from '@/shared/layout';
import { authService } from '@/services';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';

// Schema de validação
const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, 'Email é obrigatório')
		.email('Email deve ser válido')
		.max(255, 'Email deve ter no máximo 255 caracteres')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Página de solicitação de recuperação de senha
 */
function ForgotPasswordPage() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [sentEmail, setSentEmail] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: 'onBlur'
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			setLoading(true);

			const result = await authService.forgotPassword(data.email);

			if (result.success) {
				setEmailSent(true);
				setSentEmail(data.email);
				dispatch(showSuccessMessage(result.message));
			} else {
				dispatch(showErrorMessage(result.message));
			}
		} catch (error: unknown) {
			dispatch(showErrorMessage('Erro inesperado. Tente novamente.'));
		} finally {
			setLoading(false);
		}
	};

	if (emailSent) {
		return (
			<AuthLayout
				title="Email enviado!"
				subtitle="Verifique sua caixa de entrada e siga as instruções para redefinir sua senha"
				variant="forgot"
				footerLinks={[
					{
						text: 'Lembrou da senha?',
						linkText: 'Fazer login',
						href: '/sign-in'
					}
				]}
			>
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Stack
						spacing={3}
						alignItems="center"
					>
						<Email sx={{ fontSize: 60, color: 'primary.main' }} />

						<Alert
							severity="success"
							sx={{ width: '100%' }}
						>
							Se o email <strong>{sentEmail}</strong> existir em nossa base de dados, você receberá
							instruções para redefinir sua senha em alguns minutos.
						</Alert>

						<Stack
							spacing={2}
							sx={{ width: '100%' }}
						>
							<Button
								variant="contained"
								onClick={() => {
									setEmailSent(false);
									setSentEmail('');
								}}
								fullWidth
							>
								Enviar para outro email
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
			title="Recuperar senha"
			subtitle="Digite seu email para receber instruções de recuperação de senha"
			variant="forgot"
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
					{/* Email */}
					<TextField
						{...register('email')}
						fullWidth
						type="email"
						label="Email"
						placeholder="Digite seu email"
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
							) : (
								<Send />
							)
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
						{loading ? 'Enviando...' : 'Enviar instruções'}
					</Button>
				</Stack>
			</Box>
		</AuthLayout>
	);
}

export default ForgotPasswordPage;
