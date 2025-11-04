import { Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { usePublicURLShortener } from '@/features/links/hooks/usePublicURLShortener';
import useUser from '@/lib/auth/useUser';
import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';
import { GradientButton } from '@/shared/ui/base/GradientButton';

import { URLInput } from './URLInput';

import type { PublicLinkResponse } from '@/services/link-public.service';

interface IFormData {
	originalUrl: string;
}

interface URLShortenerFormProps {
	onSuccess?: (result: PublicLinkResponse) => void;
	onError?: (error: string) => void;
	loading?: boolean;
}

/**
 * Formulário de encurtamento de URL componentizado
 * Gerencia validação, submissão e estados
 */
export function URLShortenerForm({ onSuccess, onError, loading: externalLoading }: URLShortenerFormProps) {
	const dispatch = useAppDispatch();
	const { data: user } = useUser();
	const {
		handleSubmit,
		register,
		setError,
		formState: { errors }
	} = useForm<IFormData>();

	const { createPublicShortUrl, loading } = usePublicURLShortener();
	const isLoading = loading || externalLoading;

	const onSubmit = async (formData: IFormData) => {
		try {
			const result = await createPublicShortUrl({
				original_url: formData.originalUrl,
				title: user ? `Link de ${user.name}` : undefined
			});

			onSuccess?.(result);
		} catch (_err) {
			const errorMessage = 'Erro ao encurtar a URL. Tente novamente.';
			setError('originalUrl', { type: 'manual', message: errorMessage });
			dispatch(showErrorMessage(errorMessage));
			onError?.(errorMessage);
		}
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit(onSubmit)}
		>
			<Box sx={{ textAlign: 'center', mb: 4 }}>
				<Typography
					variant='h3'
					sx={{
						mb: 2,
						fontWeight: 900,
						color: 'primary.main',
						fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
						letterSpacing: '-0.02em',
						lineHeight: 1.2
					}}
				>
					Encurte sua URL
				</Typography>
				<Typography
					variant='h6'
					color='text.secondary'
					sx={{
						fontWeight: 500,
						fontSize: { xs: '1rem', sm: '1.1rem' },
						maxWidth: 600,
						mx: 'auto',
						opacity: 0.8
					}}
				>
					Transforme URLs longas em links poderosos e rastreáveis em segundos
				</Typography>
			</Box>

			<Box
				sx={{
					display: 'flex',
					gap: { xs: 2, sm: 3 },
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'flex-start' },
					mb: 4,
					maxWidth: { xs: '100%', sm: 700, md: 800, lg: 900 },
					mx: 'auto',
					width: '100%'
				}}
			>
				<Box sx={{ flex: 1 }}>
					<URLInput
						register={register('originalUrl', {
							required: 'A URL é obrigatória',
							pattern: {
								value: /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
								message: 'Insira uma URL válida'
							}
						})}
						error={errors.originalUrl?.message}
					/>
				</Box>

				<GradientButton
					type='submit'
					size='large'
					loading={isLoading}
					shimmerEffect
					sx={{
						minWidth: { xs: '100%', sm: 160 },
						minHeight: 52
					}}
				>
					Encurtar Agora
				</GradientButton>
			</Box>
		</Box>
	);
}

export default URLShortenerForm;
