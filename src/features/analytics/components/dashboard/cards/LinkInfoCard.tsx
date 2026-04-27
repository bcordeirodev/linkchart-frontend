/**
 * ℹ️ LINK INFO CARD - Card de Informações do Link
 */

import { Box, Typography, useTheme } from '@mui/material';

import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';

interface LinkInfo {
	id: number;
	title: string;
	original_url: string;
	clicks: number;
	is_active: boolean;
}

interface LinkInfoCardProps {
	linkInfo: LinkInfo;
}

export function LinkInfoCard({ linkInfo }: LinkInfoCardProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<Box
			sx={{
				mt: 2,
				p: 2,
				bgcolor: 'background.paper',
				borderRadius: `${radiusTokens.lg}px`,
				boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
				transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`
			}}
		>
			<Typography
				variant='h6'
				sx={{ mb: 1, fontWeight: 600 }}
			>
				{linkInfo.title || 'Link sem título'}
			</Typography>
			<Typography
				variant='body2'
				color='text.secondary'
				sx={{ mb: 1 }}
			>
				{linkInfo.original_url}
			</Typography>
			<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
				<Typography
					variant='caption'
					sx={{
						px: 1,
						py: 0.5,
						bgcolor: linkInfo.is_active ? 'success.main' : 'error.main',
						color: 'common.white',
						borderRadius: `${radiusTokens.md}px`,
						fontWeight: 600
					}}
				>
					{linkInfo.is_active ? '✅ Ativo' : '❌ Inativo'}
				</Typography>
				<Typography
					variant='caption'
					color='text.secondary'
				>
					📊 {linkInfo.clicks} cliques
				</Typography>
			</Box>
		</Box>
	);
}

export default LinkInfoCard;
