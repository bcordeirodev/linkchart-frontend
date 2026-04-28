import { Box, Typography } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

import useClipboard from '@/hooks/useClipboard';
import { ICON_LG } from '@/lib/theme/iconDefaults';

interface ShorterSuccessStateProps {
	shortUrl: string;
	onReset: () => void;
}

export function ShorterSuccessState({ shortUrl, onReset }: ShorterSuccessStateProps) {
	const { copy } = useClipboard({ timeout: 1500 });

	return (
		<Box
			sx={{
				background: 'rgba(255,255,255,0.04)',
				border: '1px solid rgba(16,185,129,0.25)',
				borderRadius: '18px',
				p: { xs: 3, md: 4 },
				backdropFilter: 'blur(20px)',
				boxShadow: '0 0 60px rgba(16,185,129,0.08)',
				textAlign: 'center',
				maxWidth: 640,
				mx: 'auto'
			}}
		>
			{/* Ícone */}
			<Box
				sx={{
					width: 56,
					height: 56,
					borderRadius: '50%',
					background: 'rgba(16,185,129,0.12)',
					border: '2px solid rgba(16,185,129,0.4)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mx: 'auto',
					mb: 2
				}}
			>
				<CheckCircle2
					{...ICON_LG}
					color='#10b981'
				/>
			</Box>

			<Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', mb: 0.5 }}>
				Link encurtado!
			</Typography>
			<Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', mb: 2.5 }}>
				Copie e compartilhe onde quiser
			</Typography>

			{/* Box do link */}
			<Box
				sx={{
					background: 'rgba(255,255,255,0.05)',
					border: '1px solid rgba(255,255,255,0.1)',
					borderRadius: '10px',
					p: '12px 16px',
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
						fontSize: '0.9375rem',
						fontWeight: 700,
						color: '#a5b4fc',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap'
					}}
				>
					{shortUrl}
				</Typography>
				<Box
					component='button'
					onClick={() => copy(shortUrl)}
					sx={{
						background: 'rgba(99,102,241,0.2)',
						border: '1px solid rgba(99,102,241,0.4)',
						borderRadius: '7px',
						px: 2,
						py: 0.875,
						fontSize: '0.75rem',
						fontWeight: 600,
						color: '#a5b4fc',
						cursor: 'pointer',
						flexShrink: 0,
						'&:hover': { background: 'rgba(99,102,241,0.35)' }
					}}
				>
					📋 Copiar
				</Box>
			</Box>

			{/* Barra de progresso */}
			<Box
				sx={{
					height: 3,
					background: 'rgba(255,255,255,0.08)',
					borderRadius: 1,
					overflow: 'hidden',
					mb: 1.5
				}}
			>
				<Box
					sx={{
						height: '100%',
						background: 'linear-gradient(90deg,#6366f1,#10b981)',
						borderRadius: 1,
						'@keyframes progress': { from: { width: '0%' }, to: { width: '100%' } },
						animation: 'progress 3s linear forwards'
					}}
				/>
			</Box>

			<Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.25)', mb: 2.5 }}>
				Redirecionando para{' '}
				<Box
					component='span'
					sx={{ color: 'rgba(99,102,241,0.7)' }}
				>
					analytics detalhados
				</Box>{' '}
				em 3s...
			</Typography>

			{/* Encurtar outro */}
			<Box
				component='button'
				onClick={onReset}
				sx={{
					background: 'transparent',
					border: '1px solid rgba(255,255,255,0.1)',
					borderRadius: '20px',
					px: 2,
					py: 0.625,
					fontSize: '0.75rem',
					color: 'rgba(255,255,255,0.4)',
					cursor: 'pointer',
					'&:hover': { borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }
				}}
			>
				🔗 Encurtar outro link
			</Box>
		</Box>
	);
}
