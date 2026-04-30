import { Box, Typography } from '@mui/material';

import { getAdsConfig } from '../config/adsConfig';
import { useGoogleAds, AD_SLOTS } from '../hooks/useGoogleAds';

import type { AdSlotType } from '../hooks/useGoogleAds';

interface GoogleAdProps {
	variant: AdSlotType;
	sx?: any;
	showFallback?: boolean;
}

/**
 * 📢 COMPONENTE REAL DE GOOGLE ADS
 *
 * Renderiza anúncios reais do Google AdSense com fallback para desenvolvimento
 */
export function GoogleAd({ variant, sx, showFallback = false }: GoogleAdProps) {
	const { adRef } = useGoogleAds();
	const adConfig = AD_SLOTS[variant];
	const adsConfig = getAdsConfig();

	// Fallback para desenvolvimento ou quando ads não carregam
	const renderFallback = () => {
		const fallbackConfig = {
			banner: {
				minHeight: '90px',
				text: '[ Google Ads - Banner 728x90 ]',
				description: 'Banner horizontal'
			},
			rectangle: {
				minHeight: '250px',
				text: '[ Google Ads - Rectangle 300x250 ]',
				description: 'Espaço publicitário premium'
			},
			leaderboard: {
				minHeight: '90px',
				text: '[ Google Ads - Leaderboard 728x90 ]',
				description: 'Leaderboard superior'
			},
			sidebar: {
				minHeight: '600px',
				text: '[ Google Ads - Sidebar 160x600 ]',
				description: 'Sidebar vertical'
			}
		};

		const config = fallbackConfig[variant];

		return (
			<Box
				sx={{
					p: 2,
					border: '2px dashed',
					borderColor: 'divider',
					borderRadius: 2,
					textAlign: 'center',
					minHeight: config.minHeight,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'grey.50',
					transition: 'all 0.3s ease',
					'&:hover': {
						bgcolor: 'grey.100',
						borderColor: 'primary.main'
					},
					...sx
				}}
			>
				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ fontWeight: 500 }}
				>
					{config.text}
				</Typography>
				<Typography
					variant='caption'
					color='text.disabled'
					sx={{ mt: 0.5 }}
				>
					{config.description}
				</Typography>
			</Box>
		);
	};

	// Se showFallback for true ou configuração indicar fallback, mostrar fallback
	if (showFallback || adsConfig.shouldShowFallback || !adsConfig.areAdsEnabled) {
		return renderFallback();
	}

	// Renderizar anúncio real do Google AdSense
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: adConfig.style.height,
				...sx
			}}
		>
			<ins
				ref={adRef}
				className='adsbygoogle'
				style={adConfig.style}
				data-ad-client={adsConfig.clientId}
				data-ad-slot={adConfig.slot}
				data-ad-format={adConfig.format}
				data-full-width-responsive={adConfig.responsive}
			/>
		</Box>
	);
}
