import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import authService from '@/lib/auth/auth.service';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Save, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação com Zod
const passwordChangeSchema = z
	.object({
		current_password: z.string().min(1, 'Senha atual é obrigatória'),
		new_password: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
		new_password_confirmation: z.string().min(1, 'Confirmação de senha é obrigatória')
	})
	.refine((data) => data.new_password === data.new_password_confirmation, {
		message: 'As senhas não coincidem',
		path: ['new_password_confirmation']
	});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * Formulário de alteração de senha
 * Utiliza Zod para validação e React Hook Form para gerenciamento
 */
export function PasswordChangeForm() {
	const dispatch = useAppDispatch();
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isValid }
	} = useForm<PasswordChangeFormData>({
		resolver: zodResolver(passwordChangeSchema),
		mode: 'onChange'
	});

	const togglePasswordVisibility = useCallback((field: keyof typeof showPasswords) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field]
		}));
	}, []);

	const onSubmit = useCallback(
		async (data: PasswordChangeFormData) => {
			try {
				const response = await authService.changePassword(data);

				dispatch(
					showMessage({
						message: response.message,
						variant: 'success'
					})
				);

				reset(); // Limpa o formulário após sucesso
			} catch (error: unknown) {
				dispatch(
					showMessage({
						message: error instanceof Error ? error.message : 'Erro ao alterar senha. Tente novamente.',
						variant: 'error'
					})
				);
			}
		},
		[dispatch, reset]
	);

	return (
		<EnhancedPaper>
			<Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
				<Stack spacing={{ xs: 2, sm: 3 }}>
					<Box>
						<Typography
							variant="h6"
							sx={{ fontWeight: 700, mb: 1 }}
						>
							🔒 Alterar Senha
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Mantenha sua conta segura alterando sua senha regularmente
						</Typography>
					</Box>

					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
					>
						{/* Senha Atual */}
						<TextField
							{...register('current_password')}
							label="Senha Atual"
							type={showPasswords.current ? 'text' : 'password'}
							error={!!errors.current_password}
							helperText={errors.current_password?.message}
							fullWidth
							disabled={isSubmitting}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock sx={{ color: 'text.secondary' }} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => togglePasswordVisibility('current')}
											edge="end"
											size="small"
											sx={{ color: 'text.secondary' }}
										>
											{showPasswords.current ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>

						{/* Nova Senha */}
						<TextField
							{...register('new_password')}
							label="Nova Senha"
							type={showPasswords.new ? 'text' : 'password'}
							error={!!errors.new_password}
							helperText={errors.new_password?.message}
							fullWidth
							disabled={isSubmitting}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock sx={{ color: 'text.secondary' }} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => togglePasswordVisibility('new')}
											edge="end"
											size="small"
											sx={{ color: 'text.secondary' }}
										>
											{showPasswords.new ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>

						{/* Confirmação da Nova Senha */}
						<TextField
							{...register('new_password_confirmation')}
							label="Confirmar Nova Senha"
							type={showPasswords.confirm ? 'text' : 'password'}
							error={!!errors.new_password_confirmation}
							helperText={errors.new_password_confirmation?.message}
							fullWidth
							disabled={isSubmitting}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock sx={{ color: 'text.secondary' }} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => togglePasswordVisibility('confirm')}
											edge="end"
											size="small"
											sx={{ color: 'text.secondary' }}
										>
											{showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>

						{/* Botão de Submissão */}
						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={!isValid || isSubmitting}
							startIcon={
								isSubmitting ? (
									<CircularProgress
										size={20}
										color="inherit"
									/>
								) : (
									<Save />
								)
							}
							sx={{
								alignSelf: 'flex-start',
								px: 4,
								py: 1.5,
								borderRadius: 2
							}}
						>
							{isSubmitting ? 'Alterando...' : 'Alterar Senha'}
						</Button>
					</Box>

					{/* Dicas de Segurança */}
					<Box
						sx={{
							p: 3,
							backgroundColor: (theme) =>
								theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.04)',
							borderRadius: 2,
							border: '1px solid',
							borderColor: (theme) =>
								theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)'
						}}
					>
						<Typography
							variant="subtitle2"
							sx={{
								fontWeight: 600,
								mb: 1,
								color: 'primary.main'
							}}
						>
							💡 Dicas de Segurança
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							• Use pelo menos 8 caracteres com letras, números e símbolos
							<br />
							• Evite informações pessoais como nome ou data de nascimento
							<br />• Não reutilize senhas de outras contas
						</Typography>
					</Box>
				</Stack>
			</Box>
		</EnhancedPaper>
	);
}

export default PasswordChangeForm;
