import { Box, Typography } from '@mui/material';

import useClipboard from '@/hooks/useClipboard';

import type { PublicLinkData, PublicAnalyticsActions } from '../../types';

interface LinkInfoCardProps {
	linkData: PublicLinkData;
	actions: PublicAnalyticsActions;
}

export function LinkInfoCard({ linkData, actions }: LinkInfoCardProps) {
	const { handleCreateLink, handleVisitLink } = actions;
	const { copy } = useClipboard({ timeout: 1500 });

	return (
		<Box
			sx={{
				background: 'rgba(255,255,255,0.04)',
				border: '1px solid rgba(255,255,255,0.09)',
				borderRadius: '16px',
				p: { xs: 3, md: 3.5 },
				backdropFilter: 'blur(20px)'
			}}
		>
			{/* URL box */}
			<Box
				sx={{
					background: 'rgba(99,102,241,0.08)',
					border: '1px solid rgba(99,102,241,0.2)',
					borderRadius: '10px',
					p: '14px 18px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 2,
					gap: 2
				}}
			>
				<Typography
					sx={{
						fontFamily: 'monospace',
						fontSize: { xs: '1rem', md: '1.25rem' },
						fontWeight: 800,
						color: '#a5b4fc',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap'
					}}
				>
					{linkData.short_url}
				</Typography>
				<Box
					component='button'
					onClick={() => copy(linkData.short_url)}
					sx={{
						background: 'rgba(99,102,241,0.2)',
						border: '1px solid rgba(99,102,241,0.4)',
						borderRadius: '8px',
						px: 2.25,
						py: 1,
						fontSize: '0.8125rem',
						fontWeight: 600,
						color: '#a5b4fc',
						cursor: 'pointer',
						flexShrink: 0,
						'&:hover': { background: 'rgba(99,102,241,0.35)' }
					}}
				>
					Copiar
				</Box>
			</Box>

			{/* URL original */}
			<Typography
				title={linkData.original_url}
				sx={{
					fontFamily: 'monospace',
					fontSize: '0.8125rem',
					color: 'rgba(255,255,255,0.3)',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					mb: 2.5
				}}
			>
				→ {linkData.original_url}
			</Typography>

			{/* Ações */}
			<Box sx={{ display: 'flex', gap: 1 }}>
				{[
					{ label: 'Encurtar outro link', onClick: handleCreateLink },
					{ label: 'Visitar destino', onClick: handleVisitLink }
				].map(({ label, onClick }) => (
					<Box
						key={label}
						component='button'
						onClick={onClick}
						sx={{
							flex: 1,
							p: '10px',
							borderRadius: '8px',
							fontSize: '0.75rem',
							fontWeight: 600,
							textAlign: 'center',
							cursor: 'pointer',
							border: '1px solid rgba(255,255,255,0.08)',
							background: 'rgba(255,255,255,0.04)',
							color: 'rgba(255,255,255,0.5)',
							'&:hover': { borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }
						}}
					>
						{label}
					</Box>
				))}
			</Box>
		</Box>
	);
}
