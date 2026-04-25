/**
 * ℹ️ LINK INFO CARD - Card de Informações do Link
 */

import { Box, Typography } from '@mui/material';

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
	return (
		<Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
			<Typography
				variant='h6'
				sx={{ mb: 1 }}
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
						color: 'white',
						borderRadius: 1
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
