import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const badgeSx = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 0.75,
	background: 'rgba(255,255,255,0.03)',
	border: '1px solid rgba(255,255,255,0.1)',
	borderRadius: '6px',
	px: 1.5,
	py: 0.625,
	fontSize: '0.6875rem',
	color: 'rgba(255,255,255,0.4)',
	letterSpacing: '0.2px'
};

interface BenefitBadgesProps {
	state: 'idle' | 'success';
	onReset: () => void;
}

export function BenefitBadges({ state, onReset }: BenefitBadgesProps) {
	const { t } = useTranslation('public');
	const isSuccess = state === 'success';
	return (
		<Box
			sx={{
				display: 'flex',
				gap: 1,
				justifyContent: 'center',
				flexWrap: 'wrap',
				mt: 2.5,
				maxWidth: 640,
				mx: 'auto'
			}}
		>
			{isSuccess ? (
				<>
					<Box sx={badgeSx}>
						<Typography
							component='span'
							sx={{ color: '#10b981', fontSize: '0.625rem' }}
						>
							&#x2713;
						</Typography>{' '}
						{t('benefits.active')}
					</Box>
					<Box sx={badgeSx}>
						<Typography
							component='span'
							sx={{ color: '#10b981', fontSize: '0.625rem' }}
						>
							&#x2713;
						</Typography>{' '}
						{t('benefits.analytics')}
					</Box>
					<Box
						component='button'
						onClick={onReset}
						sx={{
							...badgeSx,
							cursor: 'pointer',
							border: '1px solid rgba(99,102,241,0.28)',
							color: 'rgba(165,180,252,0.75)',
							background: 'transparent',
							'&:hover': { borderColor: 'rgba(99,102,241,0.45)' }
						}}
					>
						{t('benefits.shortenAnother')}
					</Box>
				</>
			) : (
				<>
					<Box sx={badgeSx}>
						<Typography
							component='span'
							sx={{ color: '#10b981', fontSize: '0.625rem' }}
						>
							&#x2713;
						</Typography>{' '}
						{t('benefits.realtimeAnalytics')}
					</Box>
					<Box sx={badgeSx}>
						<Typography
							component='span'
							sx={{ color: '#10b981', fontSize: '0.625rem' }}
						>
							&#x2713;
						</Typography>{' '}
						{t('benefits.freeQr')}
					</Box>
					<Box sx={badgeSx}>
						<Typography
							component='span'
							sx={{ color: '#10b981', fontSize: '0.625rem' }}
						>
							&#x2713;
						</Typography>{' '}
						{t('benefits.noExpiration')}
					</Box>
					<Box sx={badgeSx}>
						<Typography
							component='span'
							sx={{ color: '#10b981', fontSize: '0.625rem' }}
						>
							&#x2713;
						</Typography>{' '}
						{t('benefits.customSlug')}
					</Box>
				</>
			)}
		</Box>
	);
}
