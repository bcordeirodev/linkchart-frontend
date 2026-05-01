'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Send } from 'lucide-react';
import { Box, TextField, Button, Stack, CircularProgress, InputAdornment, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ICON_LG } from '@/lib/theme/iconDefaults';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';
import { authService } from '@/services';
import { authTextFieldSx } from '@/lib/auth/forms/authFieldStyles';
import { AuthLayout } from '@/shared/layout';

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
	const { t } = useTranslation('auth');
	const dispatch = useAppDispatch();
	const theme = useTheme();
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
				title={t('forgotPassword.title')}
				subtitle={t('forgotPassword.successMessage')}
				variant='forgot'
				footerLinks={[
					{
						text: '',
						linkText: t('forgotPassword.backToSignIn'),
						href: '/sign-in'
					}
				]}
			>
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Stack
						spacing={3}
						alignItems='center'
					>
						<Mail
							{...ICON_LG}
							style={{ color: theme.palette.primary.main }}
						/>

						<Alert
							severity='success'
							sx={{ width: '100%' }}
						>
							{t('forgotPassword.successMessage')}
						</Alert>

						<Stack
							spacing={2}
							sx={{ width: '100%' }}
						>
							<Button
								variant='contained'
								onClick={() => {
									setEmailSent(false);
									setSentEmail('');
								}}
								fullWidth
							>
								Enviar para outro email
							</Button>

							<Button
								variant='outlined'
								href='/sign-in'
								fullWidth
							>
								{t('forgotPassword.backToSignIn')}
							</Button>
						</Stack>
					</Stack>
				</Box>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title={t('forgotPassword.title')}
			subtitle={t('forgotPassword.subtitle')}
			variant='forgot'
			footerLinks={[
				{
					text: '',
					linkText: t('forgotPassword.backToSignIn'),
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
					{/* Email */}
					<TextField
						{...register('email')}
						fullWidth
						type='email'
						label={t('forgotPassword.emailLabel')}
						placeholder={t('forgotPassword.emailLabel')}
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
							) : (
								<Send {...ICON_LG} />
							)
						}
						sx={{
							mt: 2,
							py: 1.5,
							fontSize: '1.1rem',
							fontWeight: 600
						}}
					>
						{t('forgotPassword.submitButton')}
					</Button>
				</Stack>
			</Box>
		</AuthLayout>
	);
}

export default ForgotPasswordPage;
