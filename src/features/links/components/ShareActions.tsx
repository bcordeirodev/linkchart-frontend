import { Box, IconButton, Tooltip } from '@mui/material';
import { Launch, Share } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
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
	const theme = useTheme();
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
					onClick={handleOpenLink}
					sx={{
						bgcolor: alpha(theme.palette.primary.main, 0.1),
						'&:hover': {
							bgcolor: alpha(theme.palette.primary.main, 0.2),
							transform: 'translateY(-1px)'
						},
						transition: 'all 0.2s ease'
					}}
				>
					<Launch />
				</IconButton>
			</Tooltip>

			<Tooltip title="Compartilhar">
				<IconButton
					onClick={handleShare}
					sx={{
						bgcolor: alpha(theme.palette.secondary.main, 0.1),
						'&:hover': {
							bgcolor: alpha(theme.palette.secondary.main, 0.2),
							transform: 'translateY(-1px)'
						},
						transition: 'all 0.2s ease'
					}}
				>
					<Share />
				</IconButton>
			</Tooltip>
		</Box>
	);
}

export default ShareActions;
