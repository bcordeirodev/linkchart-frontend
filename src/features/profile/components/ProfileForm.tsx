import { useState, useCallback, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { Edit, Save, Cancel, Person, Email, PhotoCamera } from '@mui/icons-material';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import { profileService, UserProfile } from '../../../lib/services';

// Styled Components
import {
	ProfileContainer,
	ProfileHeader,
	ProfileTitle,
	AvatarSection,
	AvatarContainer,
	StyledAvatar,
	PhotoUploadButton,
	FormFieldsContainer,
	StyledTextField,
	EditButton,
	ActionButtonsContainer,
	CancelButton,
	SaveButton,
	ProfileGrid,
	LoadingOverlay,
	ProfileBadge
} from './styles/Profile.styled';

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
			<ProfileContainer>
				{saving && (
					<LoadingOverlay>
						<CircularProgress size={40} />
					</LoadingOverlay>
				)}

				<ProfileBadge>Ativo</ProfileBadge>

				<ProfileHeader>
					<ProfileTitle>Informações Pessoais</ProfileTitle>
					{!isEditing && (
						<EditButton
							variant="contained"
							startIcon={<Edit />}
							onClick={() => setIsEditing(true)}
						>
							Editar
						</EditButton>
					)}
				</ProfileHeader>

				<ProfileGrid>
					<AvatarSection>
						<AvatarContainer>
							<StyledAvatar>{formData.name?.[0]?.toUpperCase()}</StyledAvatar>
							{isEditing && (
								<PhotoUploadButton onClick={handlePhotoUpload}>
									<PhotoCamera />
								</PhotoUploadButton>
							)}
						</AvatarContainer>
					</AvatarSection>

					<FormFieldsContainer>
						<StyledTextField
							label="Nome Completo"
							value={formData.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							disabled={!isEditing}
							fullWidth
							isEditing={isEditing}
							InputProps={{
								startAdornment: <Person sx={{ mr: 1.5 }} />
							}}
						/>
						<StyledTextField
							label="Email"
							value={formData.email}
							onChange={(e) => handleInputChange('email', e.target.value)}
							disabled={!isEditing}
							fullWidth
							type="email"
							isEditing={isEditing}
							InputProps={{
								startAdornment: <Email sx={{ mr: 1.5 }} />
							}}
						/>
					</FormFieldsContainer>
				</ProfileGrid>

				{isEditing && (
					<ActionButtonsContainer>
						<CancelButton
							variant="outlined"
							startIcon={<Cancel />}
							onClick={handleCancel}
							disabled={saving}
						>
							Cancelar
						</CancelButton>
						<SaveButton
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
							hasChanges={hasChanges}
							isLoading={saving}
						>
							{saving ? 'Salvando...' : 'Salvar Alterações'}
						</SaveButton>
					</ActionButtonsContainer>
				)}
			</ProfileContainer>
		</EnhancedPaper>
	);
}

export default ProfileForm;
