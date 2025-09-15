import { Box, Fade } from '@mui/material';
import { memo } from 'react';
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { GoogleAdsSpace } from '@/lib/ads';

interface ShorterFormProps {
	onSuccess: (result: any) => void;
	onError: (error: string) => void;
	disabled?: boolean;
}

/**
 * 📝 COMPONENTE DE FORMULÁRIO SHORTER
 *
 * Encapsula o formulário de encurtamento com ads integrados
 * Seguindo padrões arquiteturais do projeto
 */
export function ShorterForm({ onSuccess, onError, disabled = false }: ShorterFormProps) {
	return (
		<Box sx={{ width: '100%' }}>
			{/* Formulário Principal */}
			<Fade
				in
				timeout={800}
			>
				<Box>
					<URLShortenerForm
						onSuccess={onSuccess}
						onError={onError}
					/>
				</Box>
			</Fade>

			{/* Google Ads - Banner Horizontal */}
			<Fade
				in
				timeout={1200}
			>
				<Box sx={{ mt: 4 }}>
					<GoogleAdsSpace variant="banner" />
				</Box>
			</Fade>
		</Box>
	);
}

export default memo(ShorterForm);
