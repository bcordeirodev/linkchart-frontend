'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography, Stack, Button, Alert, CircularProgress, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { AppIcon } from '@/shared/ui/icons';
import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';
import { linkService } from '@/services';
import { LinkFormSkeleton } from '@/shared/ui/feedback/skeletons';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

import { LinkFormFields } from '../../components/forms/LinkFormFields';
import { linkFormSchema, defaultLinkFormValues } from '../../components/forms/LinkFormSchema';

import type { LinkFormData } from '../../components/forms/LinkFormSchema';
import type { EditLinkFormProps } from '../../types/forms';

export function EditLinkForm({ linkId, onSuccess, showBackButton = false }: EditLinkFormProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation('links');
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
		mode: 'onChange'
	});

	const convertApiDateToDayjs = (dateString: string | null | undefined): Dayjs | null => {
		if (!dateString) {
			return null;
		}

		try {
			let date: Date;

			if (dateString.includes('/')) {
				const [datePart, timePart] = dateString.split(' ');
				const [day, month, year] = datePart.split('/');
				const dateIso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
				date = new Date(timePart ? `${dateIso}T${timePart}` : dateIso);
			} else {
				date = new Date(dateString);
			}

			if (isNaN(date.getTime())) {
				return null;
			}

			return dayjs(date);
		} catch {
			return null;
		}
	};

	useEffect(() => {
		const fetchLinkData = async () => {
			try {
				setFetchingData(true);
				const linkData = await linkService.findOne(linkId);

				if (linkData) {
					const formValues: LinkFormData = {
						original_url: linkData.original_url || '',
						title: linkData.title || '',
						custom_slug: linkData.custom_slug || linkData.slug || '',
						description: linkData.description || '',
						is_active: linkData.is_active ?? true,
						expires_at: convertApiDateToDayjs(linkData.expires_at),
						starts_in: convertApiDateToDayjs(linkData.starts_in),
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

	const convertDateForSubmit = (dateValue: Dayjs | null | undefined): string | undefined => {
		if (!dateValue) {
			return undefined;
		}

		try {
			if (dayjs.isDayjs(dateValue)) {
				return dateValue.toISOString();
			}

			// Fallback para string ISO se por algum motivo não for DayJS
			if (typeof dateValue === 'string') {
				return dateValue;
			}
		} catch (_error) {
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
				utm_source: data.utm_source || undefined,
				utm_medium: data.utm_medium || undefined,
				utm_campaign: data.utm_campaign || undefined,
				utm_term: data.utm_term || undefined,
				utm_content: data.utm_content || undefined
			};

			const response = await linkService.update(linkId, payload);

			onSuccess?.(response);

			reset(data);
		} catch (error: unknown) {
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

				dispatch(showErrorMessage(errorMessage));
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (showBackButton) {
			navigate(-1);
		} else {
			navigate('/links');
		}
	};

	if (fetchingData) {
		return <LinkFormSkeleton isEdit />;
	}

	if (apiError) {
		return (
			<EnhancedPaper
				variant='glass'
				animated
				sx={{ p: 4 }}
			>
				<Alert
					severity='error'
					action={
						<Button
							size='small'
							onClick={handleCancel}
						>
							Voltar
						</Button>
					}
				>
					<Typography
						variant='h6'
						component='div'
					>
						{apiError ? 'Erro ao carregar' : 'Link não encontrado'}
					</Typography>
					<Typography variant='body2'>
						{apiError || 'O link solicitado não foi encontrado ou você não tem permissão para editá-lo.'}
					</Typography>
				</Alert>
			</EnhancedPaper>
		);
	}

	return (
		<EnhancedPaper
			variant='glass'
			animated
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Box sx={{ p: 3, pb: 2 }}>
					<Typography
						variant='h5'
						fontWeight={600}
						gutterBottom
					>
						{t('form.editTitle')}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
					>
						Modifique as configurações do seu link
					</Typography>
				</Box>

				{apiError ? (
					<Box sx={{ px: 3, pb: 2 }}>
						<Alert severity='error'>{apiError}</Alert>
					</Box>
				) : null}

				<Box sx={{ px: 3, pb: 3 }}>
					<LinkFormFields
						control={control}
						errors={errors}
						isEdit
					/>
				</Box>

				<Box
					sx={{
						px: 3,
						py: 2.5,
						borderTop: 1,
						borderColor: 'divider',
						backgroundColor: 'action.hover'
					}}
				>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={2}
						justifyContent='space-between'
						sx={{ width: '100%' }}
					>
						<Button
							variant='outlined'
							onClick={handleCancel}
							disabled={loading}
						>
							Cancelar
						</Button>

						<Button
							type='submit'
							variant='contained'
							color='primary'
							disabled={loading}
							startIcon={
								loading ? (
									<CircularProgress
										size={16}
										color='inherit'
									/>
								) : (
									<AppIcon intent='save' />
								)
							}
						>
							{t('form.submitEdit')}
						</Button>
					</Stack>
				</Box>
			</form>
		</EnhancedPaper>
	);
}

export default EditLinkForm;
