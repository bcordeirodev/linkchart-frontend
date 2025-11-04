import { Box, Fade } from '@mui/material';

import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';

import type { PublicLinkResponse } from '@/services/link-public.service';

interface ShorterFormProps {
	onSuccess: (result: PublicLinkResponse) => void;
	onError: (error: string) => void;
	disabled?: boolean;
}

/**
 * 📝 COMPONENTE DE FORMULÁRIO SHORTER
 *
 * Encapsula o formulário de encurtamento com ads integrados
 * Seguindo padrões arquiteturais do projeto
 */
export function ShorterForm({ onSuccess, onError, disabled: _disabled = false }: ShorterFormProps) {
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
		</Box>
	);
}
