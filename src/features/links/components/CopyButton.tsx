import { Button } from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';
import { useClipboard } from '@/shared/hooks';

interface CopyButtonProps {
	text: string;
	variant?: 'contained' | 'outlined' | 'text';
	size?: 'small' | 'medium' | 'large';
	onCopy?: () => void;
}

/**
 * Botão de copiar reutilizável com estado visual
 * Gerencia automaticamente o estado de copiado
 */
export function CopyButton({ text, variant = 'contained', size = 'medium', onCopy }: CopyButtonProps) {
	const { copied, copy } = useClipboard({
		onSuccess: onCopy
	});

	const handleCopy = () => {
		copy(text);
	};

	return (
		<Button
			variant={variant}
			size={size}
			startIcon={copied ? <CheckCircle /> : <ContentCopy />}
			onClick={handleCopy}
			disabled={copied}
			sx={{
				borderRadius: 2,
				textTransform: 'none',
				fontWeight: 600,
				...(copied && {
					bgcolor: 'success.main',
					'&:hover': {
						bgcolor: 'success.dark'
					}
				})
			}}
		>
			{copied ? 'Copiado!' : 'Copiar'}
		</Button>
	);
}

export default CopyButton;
