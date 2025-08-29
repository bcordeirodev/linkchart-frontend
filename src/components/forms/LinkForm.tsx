'use client';

import { Box, Typography, Button, Alert } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LinkFormFields } from './LinkFormFields';
import { useLinkForm } from '@/hooks/useLinkForm';
import { LinkFormData } from './LinkFormSchema';
import EnhancedPaper from '@/components/ui/EnhancedPaper';

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
		<Box>
			{/* Header - apenas quando não há título customizado */}
			{!title && (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						mb: 3,
						gap: 2
					}}
				>
					{showBackButton && (
						<Button
							startIcon={<ArrowBack />}
							onClick={() => navigate(-1)}
							variant="outlined"
							sx={{ borderRadius: 2 }}
						>
							Voltar
						</Button>
					)}
					<Typography
						variant="h4"
						sx={{ fontWeight: 'bold' }}
					>
						{formTitle}
					</Typography>
				</Box>
			)}

			<EnhancedPaper
				variant="glass"
				sx={{
					p: 4,
					borderRadius: 3,
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
					border: '1px solid rgba(255, 255, 255, 0.2)'
				}}
			>
				<form onSubmit={handleSubmit}>
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

					{/* Actions */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							gap: 2,
							mt: 4,
							pt: 3,
							borderTop: '1px solid',
							borderColor: 'divider'
						}}
					>
						<Button
							variant="outlined"
							onClick={() => navigate(-1)}
							disabled={loading}
							sx={{
								borderRadius: 3,
								textTransform: 'none',
								fontWeight: 500,
								px: 3
							}}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="contained"
							startIcon={<Save />}
							disabled={!isValid || loading || (mode === 'edit' && !isDirty)}
							sx={{
								minWidth: 140,
								borderRadius: 3,
								textTransform: 'none',
								fontWeight: 600,
								px: 4,
								py: 1.2,
								background: (theme) =>
									mode === 'create'
										? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`
										: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
								boxShadow: (theme) =>
									mode === 'create'
										? `0 4px 15px ${theme.palette.secondary.main}4D`
										: `0 4px 15px ${theme.palette.primary.main}4D`,
								transition: 'all 0.3s ease-in-out',
								'&:hover': {
									transform: 'translateY(-1px)',
									boxShadow: (theme) =>
										mode === 'create'
											? `0 6px 20px ${theme.palette.secondary.main}66`
											: `0 6px 20px ${theme.palette.primary.main}66`,
									background: (theme) =>
										mode === 'create'
											? `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`
											: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
								}
							}}
						>
							{loading ? 'Salvando...' : mode === 'create' ? 'Criar Link' : 'Salvar Alterações'}
						</Button>
					</Box>

					{mode === 'edit' && !isDirty && (
						<Alert
							severity="info"
							sx={{ mt: 2 }}
						>
							Nenhuma alteração detectada. Modifique os campos para habilitar o salvamento.
						</Alert>
					)}
				</form>
			</EnhancedPaper>
		</Box>
	);
}

export default LinkForm;
