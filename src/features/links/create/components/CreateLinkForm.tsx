
import { Typography, Button, CircularProgress, Stack, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkFormFields } from '../../components/forms/LinkFormFields';
import { linkFormSchema, LinkFormData, defaultLinkFormValues } from '../../components/forms/LinkFormSchema';
import { CreateLinkFormProps } from '../types';
import { linkService } from '@/services';
import { AppIcon } from '@/lib/icons';
import {
	FormPaper,
	FormHeader,
	FormFieldsContainer,
	FormActionsContainer,
	SuccessPaper
} from '../../components/styles/FormSections.styled';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';

/**
 * Formulário de criação de links com React Hook Form + Zod
 * Validação robusta e interface simplificada
 */
export function CreateLinkForm({ onSuccess, showBackButton = false }: CreateLinkFormProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		reset,
		setError
	} = useForm<LinkFormData>({
		resolver: zodResolver(linkFormSchema),
		defaultValues: defaultLinkFormValues,
		mode: 'onChange'
	});

	const convertDateForSubmit = (dateString: string | null | undefined): string | undefined => {
		if (!dateString) return undefined;

		try {
			const date = new Date(dateString);

			if (isNaN(date.getTime())) {
				return undefined;
			}

			return date.toISOString();
		} catch (error) {
			return undefined;
		}
	};

	const onSubmit = async (data: LinkFormData) => {
		try {
			setLoading(true);
			setApiError(null);

			const payload = {
				...data,
				expires_at: convertDateForSubmit(data.expires_at),
				starts_in: convertDateForSubmit(data.starts_in),

				// Remover campos UTM vazios
				utm_source: data.utm_source || undefined,
				utm_medium: data.utm_medium || undefined,
				utm_campaign: data.utm_campaign || undefined,
				utm_term: data.utm_term || undefined,
				utm_content: data.utm_content || undefined
			};

			const response = await linkService.save(payload);

			// O linkService retorna LinkResponse diretamente
			setSuccess(true);

			// Mostrar mensagem de sucesso
			dispatch(showSuccessMessage(`Link "${response.title || payload.title}" criado com sucesso!`));

			onSuccess?.(response);

			// Redirecionar após 2 segundos
			setTimeout(() => {
				navigate('/links');
			}, 2000);
		} catch (error: unknown) {
			// Tratar erros de validação do backend
			if (
				error &&
				typeof error === 'object' &&
				'response' in error &&
				(error as { response?: { data?: { errors?: Record<string, string[]> } } }).response?.data?.errors
			) {
				const backendErrors = (error as { response: { data: { errors: Record<string, string[]> } } }).response
					.data.errors;
				Object.keys(backendErrors).forEach((field) => {
					setError(field as keyof LinkFormData, {
						message: backendErrors[field][0]
					});
				});
			} else {
				const errorMessage =
					(error && typeof error === 'object' && 'message' in error ? (error.message as string) : null) ||
					'Erro inesperado ao criar link';
				setApiError(errorMessage);

				// Mostrar mensagem de erro
				dispatch(showErrorMessage(errorMessage));
			}
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		reset(defaultLinkFormValues);
		setApiError(null);
	};

	const handleCancel = () => {
		if (showBackButton) {
			navigate(-1);
		} else {
			navigate('/links');
		}
	};

	if (success) {
		return (
			<SuccessPaper elevation={2}>
				<Typography
					variant="h5"
					color="success.main"
					gutterBottom
				>
					✅ Link criado com sucesso!
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
				>
					Redirecionando para a lista de links...
				</Typography>
			</SuccessPaper>
		);
	}

	return (
		<FormPaper elevation={2}>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Header */}
				<FormHeader>
					<Typography
						variant="h5"
						fontWeight={600}
						gutterBottom
					>
						🔗 Criar Novo Link
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Transforme URLs longas em links curtos e rastreáveis
					</Typography>
				</FormHeader>

				{/* API Error */}
				{apiError && (
					<Alert
						severity="error"
						sx={{ mb: 3 }}
					>
						{apiError}
					</Alert>
				)}

				{/* Form Fields */}
				<FormFieldsContainer>
					<LinkFormFields
						control={control}
						errors={errors}
						isEdit={false}
					/>
				</FormFieldsContainer>

				{/* Actions */}
				<FormActionsContainer sx={{ mt: 3 }}>
					<Stack
						direction="row"
						spacing={2}
						justifyContent="space-between"
						sx={{ width: '100%' }}
					>
						{/* Botão Cancelar */}
						<Button
							variant="outlined"
							onClick={handleCancel}
							disabled={loading}
							startIcon={<AppIcon intent="cancel" />}
						>
							Cancelar
						</Button>

						{/* Ações do lado direito */}
						<Stack
							direction="row"
							spacing={2}
						>
							{/* Botão Reset (apenas se há mudanças) */}
							{isDirty && (
								<Button
									variant="outlined"
									color="warning"
									onClick={handleReset}
									disabled={loading}
									startIcon={<AppIcon intent="reset" />}
								>
									Resetar
								</Button>
							)}

							{/* Botão Criar */}
							<Button
								type="submit"
								variant="contained"
								color="success"
								disabled={!isValid || loading}
								startIcon={
									loading ? (
										<CircularProgress
											size={16}
											color="inherit"
										/>
									) : (
										<AppIcon intent="save" />
									)
								}
								sx={{ ml: 2 }}
							>
								{loading ? 'Criando...' : 'Criar Link'}
							</Button>
						</Stack>
					</Stack>
				</FormActionsContainer>
			</form>
		</FormPaper>
	);
}

export default CreateLinkForm;
