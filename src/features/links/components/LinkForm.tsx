import { Box, Typography, CircularProgress } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LinkFormFields } from './LinkFormFields';
import { useLinkForm } from '@/features/links/hooks/useLinkForm';
import { LinkFormData } from './LinkFormSchema';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

// Styled Components
import {
	FormContainer,
	FormHeader,
	FormTitle,
	BackButton,
	FormContent,
	FormFieldsContainer,
	FormActionsContainer,
	CancelButton,
	SubmitButton,
	FormAlert,
	FormBadge,
	LoadingOverlay,
	FormProgress
} from './styles/Forms.styled';

interface LinkFormProps {
	mode: 'create' | 'edit';
	linkId?: string;
	initialData?: Partial<LinkFormData>;
	title?: string;
	onSuccess?: (data: any) => void;
	showBackButton?: boolean;
}

/**
 * Formulário de link unificado
 * Usado tanto para criação quanto edição
 */
export function LinkForm({ mode, linkId, initialData, title, onSuccess, showBackButton = true }: LinkFormProps) {
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState,
		loading,
		showAdvanced,
		showUTM,
		setShowAdvanced,
		setShowUTM,
		handleUrlChange
	} = useLinkForm({
		mode,
		linkId,
		initialData,
		onSuccess,
		redirectOnSuccess: mode === 'create' ? '/link' : undefined
	});

	const { errors, isValid, isDirty } = formState;

	const formTitle = title || (mode === 'create' ? 'Criar Novo Link' : 'Editar Link');

	return (
		<FormContainer>
			{/* Progress bar */}
			<FormProgress>
				<Box
					className="progress-bar"
					sx={{
						width: loading ? '100%' : isDirty ? '60%' : '20%'
					}}
				/>
			</FormProgress>

			{/* Header - apenas quando não há título customizado */}
			{!title && (
				<FormHeader>
					{showBackButton && (
						<BackButton
							startIcon={<ArrowBack />}
							onClick={() => navigate(-1)}
							variant="outlined"
						>
							Voltar
						</BackButton>
					)}
					<FormTitle>{formTitle}</FormTitle>
				</FormHeader>
			)}

			<EnhancedPaper variant="glass">
				<FormContent>
					{loading && (
						<LoadingOverlay>
							<Box className="loading-content">
								<CircularProgress size={40} />
								<Typography className="loading-text">
									{mode === 'create' ? 'Criando link...' : 'Salvando alterações...'}
								</Typography>
							</Box>
						</LoadingOverlay>
					)}

					<FormBadge mode={mode}>{mode === 'create' ? 'Novo' : 'Edição'}</FormBadge>

					<form onSubmit={handleSubmit}>
						<FormFieldsContainer>
							<LinkFormFields
								control={control}
								errors={errors}
								showAdvanced={showAdvanced}
								onToggleAdvanced={setShowAdvanced}
								showUTM={showUTM}
								onToggleUTM={setShowUTM}
								onUrlChange={handleUrlChange}
								isEdit={mode === 'edit'}
							/>
						</FormFieldsContainer>

						{/* Actions */}
						<FormActionsContainer>
							<CancelButton
								variant="outlined"
								onClick={() => navigate(-1)}
								disabled={loading}
							>
								Cancelar
							</CancelButton>
							<SubmitButton
								type="submit"
								variant="contained"
								startIcon={
									loading ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : (
										<Save />
									)
								}
								disabled={!isValid || loading || (mode === 'edit' && !isDirty)}
								mode={mode}
								isLoading={loading}
							>
								{loading ? 'Salvando...' : mode === 'create' ? 'Criar Link' : 'Salvar Alterações'}
							</SubmitButton>
						</FormActionsContainer>

						{mode === 'edit' && !isDirty && (
							<FormAlert severity="info">
								Nenhuma alteração detectada. Modifique os campos para habilitar o salvamento.
							</FormAlert>
						)}
					</form>
				</FormContent>
			</EnhancedPaper>
		</FormContainer>
	);
}

export default LinkForm;
