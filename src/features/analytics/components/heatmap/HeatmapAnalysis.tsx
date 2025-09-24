import { Box } from '@mui/material';

import { useHeatmapData } from '@/features/analytics/hooks/useHeatmapData';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

import { HeatmapMetrics } from './HeatmapMetrics';
import { HeatmapStats } from './HeatmapStats';
import { RealTimeHeatmapChart } from './RealTimeHeatmapChart';

interface HeatmapAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	title?: string;
	enableRealtime?: boolean;
	minClicks?: number;
}

/**
 * Componente de análise de heatmap com visualização geográfica interativa
 */
export function HeatmapAnalysis({
	linkId,
	globalMode = false,
	title = 'Análise de Heatmap',
	enableRealtime = true,
	minClicks = 1
}: HeatmapAnalysisProps) {
	const isGlobalMode = globalMode || !linkId;

	const {
		stats,
		data: heatmapData,
		loading,
		error,
		refresh,
		lastUpdate
	} = useHeatmapData({
		linkId: isGlobalMode ? undefined : linkId,
		globalMode: isGlobalMode,
		enableRealtime,
		refreshInterval: 30000,
		minClicks
	});

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon='🗺️'
					title={title}
					description='Visualização geográfica interativa dos cliques com densidade de calor, coordenadas precisas e informações detalhadas por localização.'
					highlight={`${stats?.totalPoints || 0} localizações mapeadas`}
					metadata={
						enableRealtime
							? 'Tempo Real'
							: lastUpdate
								? `Atualizado: ${lastUpdate.toLocaleTimeString()}`
								: undefined
					}
				/>
			</Box>

			<AnalyticsStateManager
				loading={loading}
				error={error}
				hasData={!!heatmapData?.length}
				onRetry={refresh}
				loadingMessage={
					isGlobalMode ? 'Agregando dados de todos os links...' : 'Carregando dados do heatmap...'
				}
				emptyMessage={
					isGlobalMode
						? 'Não há cliques registrados em nenhum dos seus links ativos ainda.'
						: 'Este link ainda não recebeu cliques com dados geográficos.'
				}
				minHeight={400}
			>
				<Box>
					<Box sx={{ mb: 3 }}>
						<HeatmapMetrics
							stats={stats}
							showTitle
							title={isGlobalMode ? 'Métricas Globais do Heatmap' : 'Métricas do Heatmap'}
						/>

						<Box sx={{ mt: 3 }}>
							<HeatmapStats
								data={heatmapData || []}
								stats={stats || undefined}
								globalMode={isGlobalMode}
								showTitle
								title='Estatísticas Detalhadas'
							/>
						</Box>
					</Box>

					<Box>
						<RealTimeHeatmapChart
							data={heatmapData || []}
							stats={stats}
							loading={loading}
							error={error}
							onRefresh={refresh}
							height={700}
							title={
								isGlobalMode
									? 'Mapa de Calor Global - Todos os Links Ativos'
									: 'Mapa de Calor - Link Específico'
							}
							showControls
							showStats={false}
						/>
					</Box>
				</Box>
			</AnalyticsStateManager>
		</Box>
	);
}

export default HeatmapAnalysis;
