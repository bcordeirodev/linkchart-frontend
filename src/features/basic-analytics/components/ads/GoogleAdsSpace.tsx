import { Box, Typography } from '@mui/material';

interface GoogleAdsSpaceProps {
	variant: 'banner' | 'rectangle' | 'leaderboard' | 'sidebar';
	sx?: any;
}

/**
 * 📢 ESPAÇO PARA GOOGLE ADS
 *
 * Componente para reservar espaços estratégicos para anúncios do Google
 * Diferentes variantes para diferentes posições na página
 */
export function GoogleAdsSpace({ variant, sx }: GoogleAdsSpaceProps) {
	const getAdConfig = () => {
		switch (variant) {
			case 'banner':
				return {
					minHeight: '120px',
					text: '[ Google Ads - Banner 728x90 ]',
					description: 'Banner horizontal',
					width: '100%',
					maxWidth: '100%'
				};
			case 'rectangle':
				return {
					minHeight: '280px',
					text: '[ Google Ads - Rectangle 300x250 ]',
					description: 'Espaço publicitário premium',
					width: '100%',
					maxWidth: '100%'
				};
			case 'leaderboard':
				return {
					minHeight: '100px',
					text: '[ Google Ads - Leaderboard 728x90 ]',
					description: 'Leaderboard superior',
					width: '100%',
					maxWidth: '100%'
				};
			case 'sidebar':
				return {
					minHeight: '320px',
					text: '[ Google Ads - Sidebar 160x600 ]',
					description: 'Sidebar vertical',
					width: '100%',
					maxWidth: '100%'
				};
			default:
				return {
					minHeight: '120px',
					text: '[ Google Ads Space ]',
					description: 'Espaço publicitário',
					width: '100%',
					maxWidth: '100%'
				};
		}
	};

	const config = getAdConfig();

	return (
		<Box
			sx={{
				p: 2,
				border: '2px dashed',
				borderColor: 'divider',
				borderRadius: 2,
				textAlign: 'center',
				minHeight: config.minHeight,
				width: config.width || 'auto',
				maxWidth: config.maxWidth || '100%',
				mx: variant === 'rectangle' ? 'auto' : 'inherit', // Centralizar rectangle
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: 'grey.50',
				transition: 'all 0.3s ease',
				position: 'relative',
				overflow: 'hidden',
				'&:hover': {
					bgcolor: 'grey.100',
					borderColor: 'primary.main',
					transform: 'translateY(-2px)',
					boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
				},
				'&::before':
					variant === 'rectangle'
						? {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '4px',
								background: 'linear-gradient(90deg, #1976d2, #2e7d32, #dc004e)',
								opacity: 0.6
							}
						: {},
				...sx
			}}
		>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ fontWeight: 500 }}
			>
				{config.text}
			</Typography>
			<Typography
				variant="caption"
				color="text.disabled"
				sx={{ mt: 0.5 }}
			>
				{config.description}
			</Typography>
		</Box>
	);
}
