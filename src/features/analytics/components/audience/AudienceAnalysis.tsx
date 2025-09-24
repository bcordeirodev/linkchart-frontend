import { Box, Grid } from '@mui/material';

import { useAudienceData } from '@/features/analytics/hooks/useAudienceData';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import { ResponsiveContainer } from '@/shared/ui/base/ResponsiveContainer';
import TabDescription from '@/shared/ui/base/TabDescription';
import { AudienceChart } from './AudienceChart';
import { AudienceInsights } from './AudienceInsights';
import { AudienceMetrics } from './AudienceMetrics';

import type { AudienceAnalysisProps } from '@/types/analytics';

interface LegacyAudienceAnalysisProps {
	data?: unknown;
	linkId?: string;
	globalMode?: boolean;
}

/**
 * Componente de análise de audiência com dados de dispositivos, navegadores e sistemas operacionais
 */
export function AudienceAnalysis({
	data: legacyData,
	linkId,
	globalMode = false,
	title = 'Análise de Audiência'
}: LegacyAudienceAnalysisProps & Partial<Pick<AudienceAnalysisProps, 'title'>>) {
	const isGlobalMode = globalMode || !linkId;
	const shouldUseHook = !legacyData && (Boolean(linkId) || globalMode);

	const {
		data: hookData,
		stats,
		loading,
		error,
		refresh
	} = useAudienceData({
		linkId: shouldUseHook && !isGlobalMode ? linkId : undefined,
		globalMode: shouldUseHook && isGlobalMode,
		enableRealtime: shouldUseHook,
		refreshInterval: 60000,
		includeDetails: true
	});

	const audienceData = shouldUseHook ? hookData : legacyData;
	const deviceBreakdown =
		(audienceData as Record<string, any>)?.audience?.device_breakdown ||
		(audienceData as Record<string, any>)?.device_breakdown ||
		[];
	const totalClicks = (audienceData as Record<string, any>)?.overview?.total_clicks || stats?.totalClicks || 0;

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon='👥'
					title={title}
					description='Análise detalhada da sua audiência com dados de dispositivos, navegadores e sistemas operacionais.'
					highlight={`${deviceBreakdown?.length || 0} tipos de dispositivos detectados`}
					metadata={isGlobalMode ? 'Dados Globais' : 'Link Específico'}
				/>
			</Box>

			<AnalyticsStateManager
				loading={shouldUseHook ? loading : false}
				error={shouldUseHook && error ? error : null}
				hasData={!!deviceBreakdown?.length}
				onRetry={refresh}
				loadingMessage='Carregando dados de audiência...'
				emptyMessage={
					isGlobalMode
						? 'Não há dados de dispositivos registrados em nenhum dos seus links ativos ainda.'
						: 'Este link ainda não recebeu cliques com dados de dispositivos.'
				}
				minHeight={300}
			>
				<ResponsiveContainer style={{ padding: 0 }}>
					{shouldUseHook && stats ? (
						<Box sx={{ mb: 3 }}>
							<AudienceMetrics
								data={{ audience: audienceData, stats }}
								showTitle
								title='Métricas de Audiência'
							/>
						</Box>
					) : null}

					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
						>
							<EnhancedPaper
								variant='glass'
								animated
							>
								<AudienceChart
									deviceBreakdown={deviceBreakdown}
									browserBreakdown={(audienceData as Record<string, any>)?.browser_breakdown}
									osBreakdown={(audienceData as Record<string, any>)?.os_breakdown}
									totalClicks={totalClicks}
									browsers={(audienceData as Record<string, any>)?.browsers}
									operatingSystems={(audienceData as Record<string, any>)?.operating_systems}
									devicePerformance={(audienceData as Record<string, any>)?.device_performance}
									languages={(audienceData as Record<string, any>)?.languages}
								/>
							</EnhancedPaper>
						</Grid>

						<Grid
							item
							xs={12}
						>
							<AudienceInsights
								deviceBreakdown={deviceBreakdown}
								browserBreakdown={(audienceData as Record<string, any>)?.browser_breakdown}
								totalClicks={totalClicks}
								showAdvancedInsights={shouldUseHook}
							/>
						</Grid>
					</Grid>
				</ResponsiveContainer>
			</AnalyticsStateManager>
		</Box>
	);
}

export default AudienceAnalysis;
