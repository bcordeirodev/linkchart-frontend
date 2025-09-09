import { Box } from '@mui/material';
import { useGeographicData } from '../../hooks/useGeographicData';
import { GeographicChart } from './GeographicChart';
import { GeographicInsights } from './GeographicInsights';
import { GeographicMetrics } from './GeographicMetrics';
import TabDescription from '@/shared/ui/base/TabDescription';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';

interface GeographicAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	showTitle?: boolean;
	title?: string;
	enableRealtime?: boolean;
	minClicks?: number;
}

/**
 * 🌍 GEOGRAPHIC ANALYSIS - COMPONENTE INTEGRADO
 *
 * @description
 * Componente principal do módulo geográfico que usa o hook dedicado
 * useGeographicData para buscar e gerenciar dados geográficos.
 *
 * @features
 * - Hook específico useGeographicData
 * - Suporte a modo global e link específico
 * - Realtime opcional
 * - Filtros por cliques mínimos
 * - Estados de loading e error integrados
 *
 * @usage
 * ```tsx
 * // Modo global
 * <GeographicAnalysis
 *   globalMode={true}
 *   enableRealtime={true}
 * />
 *
 * // Link específico
 * <GeographicAnalysis
 *   linkId="123"
 *   minClicks={5}
 * />
 * ```
 */
export function GeographicAnalysis({
	linkId,
	globalMode = false,
	showTitle = true,
	title = '🌍 Análise Geográfica',
	enableRealtime = false,
	minClicks = 1
}: GeographicAnalysisProps) {
	// Usar hook específico para dados geográficos
	const { data, stats, loading, error, refresh, isRealtime } = useGeographicData({
		linkId,
		globalMode,
		enableRealtime,
		minClicks,
		includeHeatmap: true,
		refreshInterval: 30000
	});

	// Usar gerenciador de estados unificado
	return (
		<AnalyticsStateManager
			loading={loading}
			error={error}
			hasData={!!data}
			onRetry={refresh}
			loadingMessage="Carregando dados geográficos..."
			emptyMessage="Dados geográficos indisponíveis"
			minHeight={300}
		>
			<Box>
				{/* Título e descrição */}
				{showTitle && (
					<Box sx={{ mb: 2 }}>
						<TabDescription
							icon="🌍"
							title={title}
							description="Distribuição global dos seus cliques com insights detalhados por países, estados e cidades."
							highlight={`${stats?.totalCountries || 0} países alcançados`}
							metadata={isRealtime ? 'Tempo Real' : undefined}
						/>
					</Box>
				)}

				{/* Métricas Geográficas */}
				<Box sx={{ mb: 3 }}>
					<GeographicMetrics
						data={data}
						stats={stats}
						showTitle={true}
						title="🌍 Métricas Geográficas"
					/>
				</Box>

				{/* Gráficos Geográficos */}
				<Box sx={{ mb: 3 }}>
					<GeographicChart
						countries={data?.top_countries || []}
						states={data?.top_states || []}
						cities={data?.top_cities || []}
						totalClicks={stats?.topCountryClicks || 0}
					/>
				</Box>

				{/* Insights Geográficos */}
				<Box>
					<GeographicInsights
						data={data?.heatmap_data || []}
						countries={data?.top_countries || []}
						states={data?.top_states || []}
						cities={data?.top_cities || []}
					/>
				</Box>
			</Box>
		</AnalyticsStateManager>
	);
}

export default GeographicAnalysis;
