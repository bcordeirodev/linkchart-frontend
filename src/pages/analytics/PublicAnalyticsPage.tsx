import { Box, Fade, Stack } from '@mui/material';
import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
	PublicAnalyticsHeader,
	LinkInfoCard,
	PublicMetrics,
	PublicCharts,
	AnalyticsInfo,
	ErrorState,
	usePublicAnalytics
} from '@/features/public-analytics';
import { PublicLayout } from '@/shared/layout';
import { ResponsiveContainer } from '@/shared/ui/base';
import { PublicAnalyticsSkeleton } from '@/shared/ui/feedback/skeletons';

/**
 * 📊 PÁGINA DE ANALYTICS PÚBLICOS
 */
function PublicAnalyticsPage() {
	const { slug } = useParams<{ slug: string }>();

	// Hook customizado que gerencia todo o estado e lógica
	const { linkData, analyticsData, loading, error, debugInfo, handleCopyLink, handleCreateLink, handleVisitLink } =
		usePublicAnalytics({ slug });

	// Memoizar ações para evitar re-renders desnecessários
	const actions = useMemo(
		() => ({
			handleCopyLink,
			handleCreateLink,
			handleVisitLink
		}),
		[handleCopyLink, handleCreateLink, handleVisitLink]
	);

	// Memoizar props dos componentes para otimização (com type assertion para garantir que não são null)
	const linkInfoProps = useMemo(
		() => ({
			linkData: linkData!,
			actions
		}),
		[linkData, actions]
	);

	const analyticsInfoProps = useMemo(
		() => ({
			analyticsData: analyticsData!,
			actions
		}),
		[analyticsData, actions]
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
			<ResponsiveContainer
				variant='page'
				maxWidth='lg'
				sx={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<Stack
					spacing={{ xs: 2, sm: 3 }}
					sx={{ width: '100%' }}
				>
					{/* Header com animação */}
					<Fade
						in
						timeout={600}
					>
						<Box>
							<PublicAnalyticsHeader />
						</Box>
					</Fade>

					{/* Link Info Card com animação */}
					<Fade
						in
						timeout={1000}
					>
						<Box>
							<LinkInfoCard {...linkInfoProps} />
						</Box>
					</Fade>

					{/* Metrics com animação */}
					<Fade
						in
						timeout={1200}
					>
						<Box>
							<PublicMetrics analyticsData={analyticsData} />
						</Box>
					</Fade>

					{/* Public Charts com animação */}
					{analyticsData ? (
						<Fade
							in
							timeout={1600}
						>
							<Box>
								<PublicCharts analyticsData={analyticsData} />
							</Box>
						</Fade>
					) : null}

					{/* Analytics Info com animação*/}
					<Fade
						in
						timeout={2000}
					>
						<Box sx={{ mt: 0, mb: 0 }}>
							<AnalyticsInfo {...analyticsInfoProps} />
						</Box>
					</Fade>
				</Stack>
			</ResponsiveContainer>
		</PublicLayout>
	);
}

export default memo(PublicAnalyticsPage);
