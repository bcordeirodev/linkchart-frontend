'use client';
import type React from 'react';
import { Box, Typography } from '@mui/material';
import { Globe, Pencil, Link2, ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { usePublicURLShortener } from '@/features/links/hooks/usePublicURLShortener';
import { useUrlSafetyCheck } from '@/features/links/hooks/useUrlSafetyCheck';
import { ApiError } from '@/lib/api/client';
import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';
import { GradientButton } from '@/shared/ui/base/GradientButton';
import { ICON_SM } from '@/lib/theme/iconDefaults';

import type { UrlSafetyStatus } from '@/features/links/hooks/useUrlSafetyCheck';
import type { PublicLinkResponse } from '@/services/link-public.service';

interface IFormData {
	originalUrl: string;
	title: string;
	customSlug: string;
}

interface URLShortenerFormProps {
	onSuccess?: (result: PublicLinkResponse) => void;
	onError?: (error: string) => void;
	loading?: boolean;
}

const fieldSx = {
	background: 'rgba(255,255,255,0.05)',
	border: '1px solid rgba(255,255,255,0.1)',
	borderRadius: '10px',
	px: 2,
	py: 1.5,
	display: 'flex',
	alignItems: 'center',
	gap: 1.5,
	transition: 'border-color 0.2s',
	'&:focus-within': { borderColor: 'rgba(99,102,241,0.5)', background: 'rgba(99,102,241,0.05)' }
};

const inputSx = {
	flex: 1,
	background: 'transparent',
	border: 'none',
	outline: 'none',
	color: 'white',
	fontSize: '0.875rem',
	fontFamily: 'inherit',
	'&::placeholder': { color: 'rgba(255,255,255,0.25)' }
};

const safetyColors: Record<UrlSafetyStatus, string> = {
	idle: 'transparent',
	checking: 'rgba(255,255,255,0.3)',
	safe: '#34d399',
	unsafe: '#f87171',
	error: 'rgba(255,255,255,0.2)',
};

const safetyIcons: Record<UrlSafetyStatus, React.ReactNode> = {
	idle: null,
	checking: null,
	safe: <ShieldCheck {...ICON_SM} color='#34d399' />,
	unsafe: <ShieldAlert {...ICON_SM} color='#f87171' />,
	error: <ShieldOff {...ICON_SM} color='rgba(255,255,255,0.2)' />,
};

const safetyLabels: Record<UrlSafetyStatus, string> = {
	idle: '',
	checking: 'Verificando segurança...',
	safe: 'URL segura',
	unsafe: '',
	error: 'Verificação indisponível',
};

export function URLShortenerForm({ onSuccess, onError, loading: externalLoading }: URLShortenerFormProps) {
	const dispatch = useAppDispatch();
	const { t } = useTranslation('public');
	const {
		handleSubmit,
		register,
		watch,
		setError,
		formState: { errors }
	} = useForm<IFormData>({ defaultValues: { originalUrl: '', title: '', customSlug: '' } });

	const { createPublicShortUrl, loading } = usePublicURLShortener();
	const isLoading = loading || externalLoading;

	const urlValue = watch('originalUrl');
	const { status: safetyStatus, threats } = useUrlSafetyCheck(urlValue ?? '');

	const onSubmit = async (formData: IFormData) => {
		try {
			const result = await createPublicShortUrl({
				original_url: formData.originalUrl,
				title: formData.title.trim() || undefined,
				custom_slug: formData.customSlug.trim() || undefined
			});
			onSuccess?.(result);
		} catch (err) {
			if (err instanceof ApiError && err.details?.errors) {
				const fieldErrors = err.details.errors as Record<string, string[]>;

				if (fieldErrors.custom_slug) {
					setError('customSlug', { message: fieldErrors.custom_slug[0] });
					return;
				}
			}

			const msg = t('shorter.form.errorMessage');
			dispatch(showErrorMessage(msg));
			onError?.(msg);
		}
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				background: 'rgba(255,255,255,0.04)',
				border: '1px solid rgba(255,255,255,0.09)',
				borderRadius: '18px',
				p: { xs: 3, md: 3.5 },
				backdropFilter: 'blur(20px)',
				boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
				maxWidth: 640,
				mx: 'auto'
			}}
		>
			{/* URL field */}
			<Box sx={{ mb: 1.5 }}>
				<Typography
					sx={{
						fontSize: '0.6875rem',
						fontWeight: 600,
						color: 'rgba(255,255,255,0.4)',
						letterSpacing: '0.5px',
						textTransform: 'uppercase',
						mb: 0.75
					}}
				>
					{t('shorter.form.urlLabel')}{' '}
					<Box
						component='span'
						sx={{ color: '#6366f1' }}
					>
						*
					</Box>
				</Typography>
				<Box sx={fieldSx}>
					<Globe
						{...ICON_SM}
						color='rgba(255,255,255,0.3)'
					/>
					<Box
						component='input'
						{...register('originalUrl', {
							required: t('shorter.form.urlRequired'),
							pattern: {
								value: /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
								message: t('shorter.form.urlInvalid')
							}
						})}
						placeholder={t('shorter.form.urlPlaceholder')}
						sx={inputSx}
					/>
				</Box>
				{errors.originalUrl ? (
					<Typography sx={{ fontSize: '0.75rem', color: '#f87171', mt: 0.5, pl: 0.5 }}>
						{errors.originalUrl.message}
					</Typography>
				) : safetyStatus !== 'idle' ? (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5, pl: 0.5 }}>
						{safetyIcons[safetyStatus]}
						<Typography
							sx={{
								fontSize: '0.75rem',
								color: safetyColors[safetyStatus],
								fontWeight: safetyStatus === 'unsafe' ? 600 : 400
							}}
						>
							{safetyStatus === 'unsafe'
								? `URL bloqueada: ${threats.join(', ')}`
								: safetyLabels[safetyStatus]}
						</Typography>
					</Box>
				) : null}
			</Box>

			{/* Título + Slug — grid 2 colunas */}
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
				{/* Título */}
				<Box>
					<Typography
						sx={{
							fontSize: '0.6875rem',
							fontWeight: 600,
							color: 'rgba(255,255,255,0.4)',
							letterSpacing: '0.5px',
							textTransform: 'uppercase',
							mb: 0.75
						}}
					>
						{t('shorter.form.titleLabel')}{' '}
						<Box
							component='span'
							sx={{
								fontSize: '0.625rem',
								fontWeight: 400,
								textTransform: 'none',
								letterSpacing: 0,
								color: 'rgba(255,255,255,0.2)'
							}}
						>
							{t('shorter.form.optional')}
						</Box>
					</Typography>
					<Box sx={fieldSx}>
						<Pencil
							{...ICON_SM}
							color='rgba(255,255,255,0.3)'
						/>
						<Box
							component='input'
							{...register('title')}
							placeholder={t('shorter.form.titlePlaceholder')}
							sx={inputSx}
						/>
					</Box>
				</Box>

				{/* Slug */}
				<Box>
					<Typography
						sx={{
							fontSize: '0.6875rem',
							fontWeight: 600,
							color: 'rgba(255,255,255,0.4)',
							letterSpacing: '0.5px',
							textTransform: 'uppercase',
							mb: 0.75
						}}
					>
						{t('shorter.form.slugLabel')}{' '}
						<Box
							component='span'
							sx={{
								fontSize: '0.625rem',
								fontWeight: 400,
								textTransform: 'none',
								letterSpacing: 0,
								color: 'rgba(255,255,255,0.2)'
							}}
						>
							{t('shorter.form.optional')}
						</Box>
					</Typography>
					<Box
						sx={{
							...fieldSx,
							'&:focus-within': {
								borderColor: 'rgba(99,102,241,0.5)',
								background: 'rgba(99,102,241,0.05)'
							}
						}}
					>
						<Link2
							{...ICON_SM}
							color='rgba(255,255,255,0.3)'
						/>
						<Typography
							sx={{
								fontSize: '0.75rem',
								color: 'rgba(255,255,255,0.2)',
								whiteSpace: 'nowrap',
								flexShrink: 0
							}}
						>
							lnk.ch/
						</Typography>
						<Box
							component='input'
							{...register('customSlug', {
								pattern: {
									value: /^[a-z0-9-]{3,50}$/,
									message: t('shorter.form.slugInvalid')
								}
							})}
							placeholder={t('shorter.form.slugPlaceholder')}
							sx={inputSx}
						/>
					</Box>
					{errors.customSlug ? (
						<Typography sx={{ fontSize: '0.6875rem', color: '#f87171', mt: 0.5, pl: 0.5 }}>
							{errors.customSlug.message}
						</Typography>
					) : null}
				</Box>
			</Box>

			{/* Botão */}
			<GradientButton
				type='submit'
				size='large'
				loading={isLoading}
				shimmerEffect
				sx={{ width: '100%', minHeight: 52, fontWeight: 700 }}
			>
				{t('shorter.form.submitButton')}
			</GradientButton>
		</Box>
	);
}

export default URLShortenerForm;
