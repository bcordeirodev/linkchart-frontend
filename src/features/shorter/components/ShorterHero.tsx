'use client';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ShorterHeroProps {
	state: 'idle' | 'success';
}

export function ShorterHero({ state }: ShorterHeroProps) {
	const { t } = useTranslation('public');
	const isSuccess = state === 'success';

	return (
		<Box sx={{ textAlign: 'center', mb: 5, mt: { xs: 5, md: 7 } }}>
			<Box
				sx={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 1,
					background: isSuccess ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.08)',
					border: '1px solid',
					borderColor: isSuccess ? 'rgba(16,185,129,0.22)' : 'rgba(99,102,241,0.22)',
					borderRadius: '6px',
					px: 1.75,
					py: 0.625,
					mb: 3
				}}
			>
				<Box
					sx={{
						width: 6,
						height: 6,
						borderRadius: '50%',
						bgcolor: isSuccess ? '#10b981' : '#6366f1',
						'@keyframes pulse': {
							'0%,100%': { opacity: 1 },
							'50%': { opacity: 0.4 }
						},
						animation: 'pulse 2s infinite'
					}}
				/>
				<Typography
					sx={{
						fontSize: '0.6875rem',
						fontWeight: 600,
						letterSpacing: '0.5px',
						color: isSuccess ? '#6ee7b7' : '#a5b4fc'
					}}
				>
					{isSuccess ? t('shorter.linkCreated') : t('shorter.freeNoSignup')}
				</Typography>
			</Box>

			<Typography
				component='h1'
				sx={{
					fontSize: { xs: '2rem', md: '2.75rem' },
					fontWeight: 800,
					letterSpacing: '-0.03em',
					lineHeight: 1.15,
					color: 'white',
					mb: 2.5
				}}
			>
				{isSuccess ? (
					<>
						{t('shorter.readyToSharePrefix')}{' '}
						<Box
							component='span'
							sx={{
								background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#10b981)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							{t('shorter.readyToShareSuffix')}
						</Box>
					</>
				) : (
					t('shorter.heroTitle')
				)}
			</Typography>

			<Typography
				sx={{
					fontSize: '0.9375rem',
					color: 'rgba(255,255,255,0.4)',
					lineHeight: 1.65,
					maxWidth: 480,
					mx: 'auto'
				}}
			>
				{isSuccess ? t('shorter.autoRedirect') : t('shorter.heroSubtitle')}
			</Typography>
		</Box>
	);
}
