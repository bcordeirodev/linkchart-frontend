'use client';

import { useState, useCallback, useMemo } from 'react';
import { Box, Typography, Grid, TextField, Button, Avatar, CircularProgress, IconButton, Stack } from '@mui/material';
import { Edit, Save, Cancel, Person, Email, PhotoCamera } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import EnhancedPaper from '@/components/ui/EnhancedPaper';
import { profileService, UserProfile } from '@/services';

interface ProfileFormData {
	name: string;
	email: string;
}

interface ProfileFormProps {
	user: UserProfile;
	onUserUpdate: (user: UserProfile) => void;
}

/**
 * Formulário de edição do perfil
 * Permite editar nome e email do usuário
 */
export function ProfileForm({ user, onUserUpdate }: ProfileFormProps) {
	const dispatch = useAppDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<ProfileFormData>({
		name: user.name || '',
		email: user.email || ''
	});
	const [saving, setSaving] = useState(false);

	// Handlers otimizados
	const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	}, []);

	const handleSave = useCallback(async () => {
		setSaving(true);
		try {
			const response = await profileService.updateProfile({
				name: formData.name,
				email: formData.email
			});

			onUserUpdate(response.user);
			dispatch(
				showMessage({
					message: response.message,
					variant: 'success'
				})
			);
			setIsEditing(false);
		} catch (error: unknown) {
			dispatch(
				showMessage({
					message: error instanceof Error ? error.message : 'Erro ao atualizar perfil. Tente novamente.',
					variant: 'error'
				})
			);
		} finally {
			setSaving(false);
		}
	}, [formData.name, formData.email, dispatch, onUserUpdate]);

	const handleCancel = useCallback(() => {
		setFormData({
			name: user.name || '',
			email: user.email || ''
		});
		setIsEditing(false);
	}, [user]);

	const handlePhotoUpload = useCallback(() => {
		dispatch(
			showMessage({
				message: 'Funcionalidade de upload de foto será implementada em breve',
				variant: 'info'
			})
		);
	}, [dispatch]);

	// Validações memoizadas
	const isFormValid = useMemo(
		() => formData.name.trim().length > 0 && formData.email.trim().length > 0,
		[formData.name, formData.email]
	);

	const hasChanges = useMemo(
		() => formData.name !== user.name || formData.email !== user.email,
		[user, formData.name, formData.email]
	);

	return (
		<EnhancedPaper>
			<Box sx={{ p: 4 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
					<Typography
						variant="h5"
						sx={{ fontWeight: 600 }}
					>
						Informações Pessoais
					</Typography>
					{!isEditing && (
						<Button
							variant="contained"
							startIcon={<Edit />}
							onClick={() => setIsEditing(true)}
						>
							Editar
						</Button>
					)}
				</Box>

				<Grid
					container
					spacing={4}
				>
					<Grid
						item
						xs={12}
						sm={4}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
								<Avatar
									sx={{
										width: 120,
										height: 120,
										fontSize: '3rem',
										fontWeight: 600,
										bgcolor: 'primary.main'
									}}
								>
									{formData.name?.[0]?.toUpperCase()}
								</Avatar>
								{isEditing && (
									<IconButton
										sx={{
											position: 'absolute',
											bottom: 8,
											right: 8,
											bgcolor: 'primary.main',
											color: 'white',
											'&:hover': { bgcolor: 'primary.dark' }
										}}
										onClick={handlePhotoUpload}
									>
										<PhotoCamera />
									</IconButton>
								)}
							</Box>
						</Box>
					</Grid>

					<Grid
						item
						xs={12}
						sm={8}
					>
						<Stack spacing={3}>
							<TextField
								label="Nome Completo"
								value={formData.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								disabled={!isEditing}
								fullWidth
								variant={isEditing ? 'outlined' : 'filled'}
								InputProps={{
									startAdornment: <Person sx={{ mr: 1.5, color: 'text.secondary' }} />
								}}
							/>
							<TextField
								label="Email"
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								disabled={!isEditing}
								fullWidth
								type="email"
								variant={isEditing ? 'outlined' : 'filled'}
								InputProps={{
									startAdornment: <Email sx={{ mr: 1.5, color: 'text.secondary' }} />
								}}
							/>
						</Stack>
					</Grid>
				</Grid>

				{isEditing && (
					<Box
						sx={{
							display: 'flex',
							gap: 2,
							justifyContent: 'flex-end',
							mt: 4,
							pt: 3,
							borderTop: 1,
							borderColor: 'divider'
						}}
					>
						<Button
							variant="outlined"
							startIcon={<Cancel />}
							onClick={handleCancel}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button
							variant="contained"
							startIcon={
								saving ? (
									<CircularProgress
										size={20}
										color="inherit"
									/>
								) : (
									<Save />
								)
							}
							onClick={handleSave}
							disabled={saving || !isFormValid || !hasChanges}
						>
							{saving ? 'Salvando...' : 'Salvar Alterações'}
						</Button>
					</Box>
				)}
			</Box>
		</EnhancedPaper>
	);
}

export default ProfileForm;
