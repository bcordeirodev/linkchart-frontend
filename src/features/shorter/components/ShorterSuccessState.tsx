'use client';
import { Box, Typography } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import useClipboard from '@/hooks/useClipboard';
import { ICON_LG } from '@/lib/theme/iconDefaults';

interface ShorterSuccessStateProps {
	shortUrl: string;
	onReset: () => void;
}

export function ShorterSuccessState({ shortUrl, onReset }: ShorterSuccessStateProps) {
	const { t } = useTranslation('public');
	const { copy } = useClipboard({ timeout: 1500 });

	return (
		<Box
			sx={{
				background: 'rgba(255,255,255,0.03)',
				border: '1px solid rgba(16,185,129,0.28)',
				borderRadius: '12px',
				p: { xs: '24px', md: '28px 32px' },
				textAlign: 'center',
				maxWidth: 640,
				mx: 'auto'
			}}
		>
			<Box
				sx={{
					width: 52,
					height: 52,
					borderRadius: '50%',
					background: 'rgba(16,185,129,0.1)',
					border: '1px solid rgba(16,185,129,0.3)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mx: 'auto',
					mb: 2.5
				}}
			>
				<CheckCircle2
					{...ICON_LG}
					color='#10b981'
				/>
			</Box>

			<Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', mb: 0.5 }}>
				{t('shorter.successTitle')}
			</Typography>
			<Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', mb: 3 }}>
				Copie e compartilhe onde quiser
			</Typography>

			<Box
				sx={{
					background: 'rgba(255,255,255,0.04)',
					border: '1px solid rgba(255,255,255,0.12)',
					borderRadius: '8px',
					p: '12px 16px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 2.5,
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
						background: 'rgba(99,102,241,0.15)',
						border: '1px solid rgba(99,102,241,0.35)',
						borderRadius: '6px',
						px: 2,
						py: 0.875,
						fontSize: '0.75rem',
						fontWeight: 600,
						color: '#a5b4fc',
						cursor: 'pointer',
						flexShrink: 0,
						'&:hover': { background: 'rgba(99,102,241,0.28)' }
					}}
				>
					{t('shorter.copyButton')}
				</Box>
			</Box>

			<Box
				sx={{
					height: 2,
					background: 'rgba(255,255,255,0.06)',
					borderRadius: 1,
					overflow: 'hidden',
					mb: 2
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

			<Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.22)', mb: 3 }}>
				Redirecionando para{' '}
				<Box
					component='span'
					sx={{ color: 'rgba(99,102,241,0.65)' }}
				>
					analytics detalhados
				</Box>{' '}
				em 3s...
			</Typography>

			<Box
				component='button'
				onClick={onReset}
				sx={{
					background: 'transparent',
					border: '1px solid rgba(255,255,255,0.12)',
					borderRadius: '6px',
					px: 2.5,
					py: 0.75,
					fontSize: '0.75rem',
					color: 'rgba(255,255,255,0.4)',
					cursor: 'pointer',
					'&:hover': { borderColor: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.65)' }
				}}
			>
				{t('shorter.createAnother')}
			</Box>
		</Box>
	);
}
