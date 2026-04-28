import { Box, Container, Fade, Stack, Typography } from '@mui/material';
import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
	LinkInfoCard,
	PublicMetrics,
	PublicAnalyticsCtaStrip,
	ErrorState,
	usePublicAnalytics
} from '@/features/public-analytics';
import { PublicLayout } from '@/shared/layout';
import { PublicAnalyticsSkeleton } from '@/shared/ui/feedback/skeletons';

function PublicAnalyticsPage() {
	const { slug } = useParams<{ slug: string }>();
	const { linkData, analyticsData, loading, error, debugInfo, handleCopyLink, handleCreateLink, handleVisitLink } =
		usePublicAnalytics({ slug });

	const actions = useMemo(
		() => ({ handleCopyLink, handleCreateLink, handleVisitLink }),
		[handleCopyLink, handleCreateLink, handleVisitLink]
	);

	if (loading) {
		return <PublicAnalyticsSkeleton />;
	}

	if (error || !linkData || !analyticsData) {
		return (
			<ErrorState
				error={error || 'Link não encontrado'}
				debugInfo={debugInfo}
				onCreateLink={handleCreateLink}
			/>
		);
	}

	return (
		<PublicLayout
			variant='shorter'
			showHeader
			showFooter
		>
			<Box sx={{ position: 'relative', minHeight: '100vh', background: '#060610' }}>
				{/* Glow índigo — top right */}
				<Box
					sx={{
						position: 'fixed',
						top: '-20%',
						right: '-10%',
						width: 500,
						height: 500,
						borderRadius: '50%',
						pointerEvents: 'none',
						zIndex: 0,
						background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)'
					}}
				/>
				{/* Glow esmeralda — bottom left */}
				<Box
					sx={{
						position: 'fixed',
						bottom: '-20%',
						left: '-10%',
						width: 400,
						height: 400,
						borderRadius: '50%',
						pointerEvents: 'none',
						zIndex: 0,
						background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)'
					}}
				/>

				<Container
					maxWidth='md'
					sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 6 }, pb: 8 }}
				>
					<Stack spacing={2}>
						<Fade
							in
							timeout={400}
						>
							<Typography
								sx={{
									fontSize: '0.6875rem',
									fontWeight: 600,
									color: 'rgba(255,255,255,0.3)',
									letterSpacing: '1px',
									textTransform: 'uppercase'
								}}
							>
								Analytics do link
							</Typography>
						</Fade>

						<Fade
							in
							timeout={600}
						>
							<Box>
								<LinkInfoCard
									linkData={linkData}
									actions={actions}
								/>
							</Box>
						</Fade>

						<Fade
							in
							timeout={900}
						>
							<Box>
								<PublicMetrics analyticsData={analyticsData} />
							</Box>
						</Fade>

						<Fade
							in
							timeout={1200}
						>
							<Box>
								<PublicAnalyticsCtaStrip />
							</Box>
						</Fade>
					</Stack>
				</Container>
			</Box>
		</PublicLayout>
	);
}

export default memo(PublicAnalyticsPage);
