import { IconButton, Tooltip } from '@mui/material';

import { AppIcon } from '@/lib/icons';
import { showSuccessMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/shared/hooks/useClipboard';

interface CopyButtonProps {
	text: string;
	tooltip?: string;
	size?: 'small' | 'medium' | 'large';
}

/**
 * 📋 Botão de Cópia - COMPONENTIZADO
 * Usa hook useClipboard, feedback visual, tooltip
 */
export function CopyButton({ text, tooltip = 'Copiar', size = 'medium' }: CopyButtonProps) {
	const { copied, copy } = useClipboard({
		timeout: 2000,
		onSuccess: () => showSuccessMessage('Copiado com sucesso!')
	});

	const handleCopy = () => {
		copy(text);
	};

	return (
		<Tooltip title={copied ? 'Copiado!' : tooltip}>
			<IconButton
				onClick={handleCopy}
				size={size}
				color={copied ? 'success' : 'primary'}
				sx={{
					transition: 'all 0.2s ease-in-out',
					'&:hover': {
						transform: 'scale(1.1)'
					}
				}}
			>
				<AppIcon intent='copy' />
			</IconButton>
		</Tooltip>
	);
}

export default CopyButton;
