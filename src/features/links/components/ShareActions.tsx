import { Box, IconButton, Tooltip } from '@mui/material';
import { AppIcon } from '@/lib/icons';
import { useShareAPI } from '@/features/links/hooks/useShareAPI';

interface ShareActionsProps {
	url: string;
	title?: string;
	text?: string;
}

/**
 * Componente de ações de compartilhamento
 * Inclui botões para abrir link e compartilhar
 */
export function ShareActions({
	url,
	title = 'Link Encurtado - LinkChart',
	text = 'Confira este link encurtado:'
}: ShareActionsProps) {
	const { shareOrCopy } = useShareAPI();

	const handleShare = () => {
		shareOrCopy({ url, title, text });
	};

	const handleOpenLink = () => {
		window.open(url, '_blank');
	};

	return (
		<Box sx={{ display: 'flex', gap: 1 }}>
			<Tooltip title="Abrir link">
				<IconButton
					color="primary"
					onClick={handleOpenLink}
					sx={{
						bgcolor: 'primary.main',
						color: 'primary.contrastText',
						'&:hover': { bgcolor: 'primary.dark' }
					}}
				>
					<AppIcon intent="url" />
				</IconButton>
			</Tooltip>

			<Tooltip title="Compartilhar">
				<IconButton
					color="secondary"
					onClick={handleShare}
					sx={{
						bgcolor: 'secondary.main',
						color: 'secondary.contrastText',
						'&:hover': { bgcolor: 'secondary.dark' }
					}}
				>
					<AppIcon intent="share" />
				</IconButton>
			</Tooltip>
		</Box>
	);
}

export default ShareActions;
