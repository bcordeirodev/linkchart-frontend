/**
 * ✏️ EDIT LINK FORM - REFATORADO COM REACT HOOK FORM + ZOD
 * Formulário simplificado para edição de links
 */

import { Typography, Stack, Button, Alert, CircularProgress, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/shared/components';
import { LinkFormFields } from '../../components/forms/LinkFormFields';
import { linkFormSchema, LinkFormData, defaultLinkFormValues } from '../../components/forms/LinkFormSchema';
import { EditLinkFormProps } from '../types';
import { linkService } from '@/services';
import { AppIcon } from '@/lib/icons';
import { ResponsiveContainer } from '@/shared/ui/base/ResponsiveContainer';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import { useAppDispatch } from '@/lib/store/hooks';
import { showSuccessMessage, showErrorMessage } from '@/lib/store/messageSlice';

/**
 * Formulário de edição de links com React Hook Form + Zod
 * Detecta mudanças e oferece reset para valores originais
 */
export function EditLinkForm({ linkId, onSuccess, showBackButton = false }: EditLinkFormProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [fetchingData, setFetchingData] = useState(true);
	const [apiError, setApiError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setError
	} = useForm<LinkFormData>({
		resolver: zodResolver(linkFormSchema),
		defaultValues: defaultLinkFormValues,
		mode: 'onBlur'
	});

	// ✅ Função auxiliar para converter datas de forma segura
	const convertDateToInputFormat = (dateString: string | null | undefined): string => {
		if (!dateString) return '';

		try {
			// Tentar diferentes formatos de data
			let date: Date;

			// Se a data está no formato brasileiro (dd/mm/yyyy hh:mm:ss)
			if (dateString.includes('/')) {
				const [datePart, timePart] = dateString.split(' ');
				const [day, month, year] = datePart.split('/');
				const dateIso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
				date = new Date(timePart ? `${dateIso}T${timePart}` : dateIso);
			} else {
				date = new Date(dateString);
			}

			// Verificar se a data é válida
			if (isNaN(date.getTime())) {
				return '';
			}

			return date.toISOString().slice(0, 16);
		} catch (error) {
			// Erro ao converter data
			return '';
		}
	};

	// ✅ Carregar dados do link
	useEffect(() => {
		const fetchLinkData = async () => {
			try {
				setFetchingData(true);
				const response = await linkService.findOne(linkId);

				if (response && response.data) {
					const linkData = response.data;

					// Converter dados para o formato do formulário
					const formValues: LinkFormData = {
						original_url: linkData.original_url || '',
						title: linkData.title || '',
						custom_slug: linkData.custom_slug || linkData.slug || '',
						description: linkData.description || '',
						is_active: linkData.is_active ?? true,
						expires_at: convertDateToInputFormat(linkData.expires_at),
						starts_in: convertDateToInputFormat(linkData.starts_in),
						click_limit: linkData.click_limit || null,
						utm_source: linkData.utm_source || '',
						utm_medium: linkData.utm_medium || '',
						utm_campaign: linkData.utm_campaign || '',
						utm_term: linkData.utm_term || '',
						utm_content: linkData.utm_content || ''
					};

					reset(formValues);
				} else {
					throw new Error('Link não encontrado');
				}
			} catch (error: unknown) {
				setApiError(error instanceof Error ? error.message : 'Erro ao carregar dados do link');
			} finally {
				setFetchingData(false);
			}
		};

		if (linkId) {
			fetchLinkData();
		}
	}, [linkId, reset]);

	// ✅ Função auxiliar para converter datas para envio
	const convertDateForSubmit = (dateString: string | null | undefined): string | undefined => {
		if (!dateString) return undefined;

		try {
			const date = new Date(dateString);

			// Verificar se a data é válida
			if (isNaN(date.getTime())) {
				// Data inválida para envio
				return undefined;
			}

			return date.toISOString();
		} catch (error) {
			// Erro ao converter data para envio
			return undefined;
		}
	};

	// ✅ Submit Handler
	const onSubmit = async (data: LinkFormData) => {
		try {
			setLoading(true);
			setApiError(null);

			// Preparar dados para envio
			const payload = {
				...data,
				// Converter datas para formato ISO se preenchidas
				expires_at: convertDateForSubmit(data.expires_at),
				starts_in: convertDateForSubmit(data.starts_in),
				// Remover campos UTM vazios
				utm_source: data.utm_source || undefined,
				utm_medium: data.utm_medium || undefined,
				utm_campaign: data.utm_campaign || undefined,
				utm_term: data.utm_term || undefined,
				utm_content: data.utm_content || undefined
			};

			const response = await linkService.update(linkId, payload);

			// Mostrar mensagem de sucesso
			dispatch(showSuccessMessage(`Link "${response.title || payload.title}" atualizado com sucesso!`));

			// O linkService retorna LinkResponse diretamente
			onSuccess?.(response);

			// Resetar formulário com dados atualizados
			reset(data);
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
					'Erro inesperado ao atualizar link';
				setApiError(errorMessage);

				// Mostrar mensagem de erro
				dispatch(showErrorMessage(errorMessage));
			}
		} finally {
			setLoading(false);
		}
	};

	// ✅ Cancel Handler
	const handleCancel = () => {
		if (showBackButton) {
			navigate(-1);
		} else {
			navigate('/links');
		}
	};

	// ✅ Loading State
	if (fetchingData) {
		return (
			<ResponsiveContainer
				variant="form"
				maxWidth="md"
			>
				<EnhancedPaper
					variant="glass"
					animated
					sx={{ p: 4, textAlign: 'center' }}
				>
					<Loading
						size="medium"
						text="Carregando dados do link..."
						fullHeight={false}
					/>
				</EnhancedPaper>
			</ResponsiveContainer>
		);
	}

	// ✅ Error State
	if (apiError) {
		return (
			<ResponsiveContainer
				variant="form"
				maxWidth="md"
			>
				<EnhancedPaper
					variant="glass"
					animated
					sx={{ p: 4 }}
				>
					<Alert
						severity="error"
						action={
							<Button
								size="small"
								onClick={handleCancel}
							>
								Voltar
							</Button>
						}
					>
						<Typography
							variant="h6"
							component="div"
						>
							{apiError ? 'Erro ao carregar' : 'Link não encontrado'}
						</Typography>
						<Typography variant="body2">
							{apiError ||
								'O link solicitado não foi encontrado ou você não tem permissão para editá-lo.'}
						</Typography>
					</Alert>
				</EnhancedPaper>
			</ResponsiveContainer>
		);
	}

	return (
		<ResponsiveContainer
			variant="form"
			maxWidth="md"
		>
			<EnhancedPaper
				variant="glass"
				animated
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Header */}
					<Box sx={{ p: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="flex-start"
						>
							<div>
								<Typography
									variant="h5"
									fontWeight={600}
									gutterBottom
								>
									✏️ Editar Link
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Modifique as configurações do seu link
								</Typography>
							</div>
						</Stack>
					</Box>

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
					<Box sx={{ p: 3 }}>
						<LinkFormFields
							control={control}
							errors={errors}
							isEdit={true}
						/>
					</Box>

					{/* Actions */}
					<Box sx={{ p: 3, pt: 1, borderTop: 1, borderColor: 'divider' }}>
						<Stack
							direction="row"
							spacing={2}
							justifyContent="space-between"
							sx={{ width: '100%' }}
							className="mt-4"
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

							{/* Botão Salvar */}
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={loading}
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
							>
								{loading ? 'Salvando...' : 'Salvar Alterações'}
							</Button>
						</Stack>
					</Box>
				</form>
			</EnhancedPaper>
		</ResponsiveContainer>
	);
}

export default EditLinkForm;
