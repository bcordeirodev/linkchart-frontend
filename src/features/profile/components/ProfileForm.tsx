import { Cancel, Email, Person, PhotoCamera, Save } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import { profileService } from '@/services';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

// Styled Components
import {
	ActionButtonsContainer,
	AvatarContainer,
	AvatarSection,
	CancelButton,
	FormFieldsContainer,
	LoadingOverlay,
	PhotoUploadButton,
	ProfileBadge,
	ProfileContainer,
	ProfileGrid,
	ProfileHeader,
	ProfileTitle,
	SaveButton,
	StyledAvatar,
	StyledTextField
} from './styles/Profile.styled';

import type { UserProfile } from '@/services';

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

	const handleReset = useCallback(() => {
		setFormData({
			name: user.name || '',
			email: user.email || ''
		});
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
			<ProfileContainer>
				{saving ? (
					<LoadingOverlay>
						<CircularProgress size={40} />
					</LoadingOverlay>
				) : null}

				<ProfileBadge>Ativo</ProfileBadge>

				<ProfileHeader>
					<ProfileTitle>Informações Pessoais</ProfileTitle>
				</ProfileHeader>

				<ProfileGrid>
					<AvatarSection>
						<AvatarContainer>
							<StyledAvatar>{formData.name?.[0]?.toUpperCase()}</StyledAvatar>
							<PhotoUploadButton onClick={handlePhotoUpload}>
								<PhotoCamera />
							</PhotoUploadButton>
						</AvatarContainer>
					</AvatarSection>

					<FormFieldsContainer>
						<StyledTextField
							label='Nome Completo'
							value={formData.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							fullWidth
							isEditing
							InputProps={{
								startAdornment: <Person sx={{ mr: 1.5 }} />
							}}
						/>
						<StyledTextField
							label='Email'
							value={formData.email}
							onChange={(e) => handleInputChange('email', e.target.value)}
							fullWidth
							type='email'
							isEditing
							InputProps={{
								startAdornment: <Email sx={{ mr: 1.5 }} />
							}}
						/>
					</FormFieldsContainer>
				</ProfileGrid>

				<ActionButtonsContainer>
					<CancelButton
						variant='outlined'
						startIcon={<Cancel />}
						onClick={handleReset}
						disabled={saving}
					>
						Resetar
					</CancelButton>
					<SaveButton
						variant='contained'
						startIcon={
							saving ? (
								<CircularProgress
									size={20}
									color='inherit'
								/>
							) : (
								<Save />
							)
						}
						onClick={handleSave}
						disabled={saving || !isFormValid || !hasChanges}
						hasChanges={hasChanges}
						isLoading={saving}
					>
						{saving ? 'Salvando...' : 'Salvar Alterações'}
					</SaveButton>
				</ActionButtonsContainer>
			</ProfileContainer>
		</EnhancedPaper>
	);
}

export default ProfileForm;
