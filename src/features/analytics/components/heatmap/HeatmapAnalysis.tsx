/**
 * @fileoverview Componente principal de análise de heatmap
 * @author Link Chart Team
 * @version 2.0.0
 */

import { Box } from '@mui/material';
import { RealTimeHeatmapChart } from './RealTimeHeatmapChart';
import { HeatmapMetrics } from './HeatmapMetrics';
import { HeatmapStats } from './HeatmapStats';
import { useHeatmapData } from '@/features/analytics/hooks/useHeatmapData';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

// Props locais do componente
interface HeatmapAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	title?: string;
	enableRealtime?: boolean;
	minClicks?: number;
}

/**
 * Componente de análise de heatmap unificado
 *
 * @description
 * Este componente fornece uma interface completa para visualização de heatmap:
 * - Métricas agregadas (total de cliques, países, cidades)
 * - Mapa interativo em tempo real
 * - Suporte para modo global e específico por link
 * - Estados de loading e erro
 *
 * @example
 * ```tsx
 * // Modo global (todos os links)
 * <HeatmapAnalysis globalMode={true} />
 *
 * // Link específico
 * <HeatmapAnalysis linkId="123" />
 * ```
 */
export function HeatmapAnalysis({
	linkId,
	globalMode = false,
	title = 'Análise de Heatmap',
	enableRealtime = true,
	minClicks = 1
}: HeatmapAnalysisProps) {
	// Determinar modo de operação
	const isGlobalMode = globalMode || !linkId;

	// Hook para gerenciar dados do heatmap
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
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon="🗺️"
					title={title}
					description="Visualização geográfica interativa dos cliques com densidade de calor, coordenadas precisas e informações detalhadas por localização."
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

			{/* 2. CONTEÚDO COM LOADER */}
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
					{/* MÉTRICAS */}
					<Box sx={{ mb: 3 }}>
						<HeatmapMetrics
							stats={stats}
							showTitle={true}
							title={isGlobalMode ? '🌍 Métricas Globais do Heatmap' : '📍 Métricas do Heatmap'}
						/>

						{/* Estatísticas Avançadas */}
						<Box sx={{ mt: 3 }}>
							<HeatmapStats
								data={heatmapData || []}
								stats={stats || undefined}
								globalMode={isGlobalMode}
								showTitle={true}
								title="📊 Estatísticas Detalhadas"
							/>
						</Box>
					</Box>

					{/* RESTANTE DO CONTEÚDO */}
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
							showControls={true}
							showStats={false} // Métricas já são mostradas acima
						/>
					</Box>
				</Box>
			</AnalyticsStateManager>
		</Box>
	);
}

export default HeatmapAnalysis;
