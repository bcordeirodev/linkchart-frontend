import { Globe } from 'lucide-react';
import { Box } from '@mui/material';

import { ICON_LG } from '@/lib/theme/iconDefaults';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

import { useGeographicData } from '../../hooks/useGeographicData';

import { GeographicChart } from './GeographicChart';
import { GeographicInsights } from './GeographicInsights';
import { GeographicMetrics } from './GeographicMetrics';

interface GeographicAnalysisProps {
	linkId: string;
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

	title = 'Análise Geográfica',
	enableRealtime = false,
	minClicks = 1
}: GeographicAnalysisProps) {
	// Usar hook específico para dados geográficos
	const { data, stats, loading, error, refresh, isRealtime } = useGeographicData({
		linkId,
		enableRealtime,
		minClicks,
		includeHeatmap: true,
		refreshInterval: 30000
	});

	return (
		<Box>
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon={<Globe {...ICON_LG} />}
					title={title}
					description='Distribuição global dos seus cliques com insights detalhados por países, estados e cidades.'
					highlight={`${stats?.totalCountries || 0} países alcançados`}
					metadata={isRealtime ? 'Tempo Real' : undefined}
				/>
			</Box>

			{/* 2. CONTEÚDO COM LOADER */}
			<AnalyticsStateManager
				loading={loading}
				error={error}
				hasData={!!data}
				onRetry={refresh}
				loadingMessage='Carregando dados geográficos...'
				emptyMessage='Dados geográficos indisponíveis'
				minHeight={300}
			>
				<Box>
					{/* MÉTRICAS */}
					<Box sx={{ mb: 3 }}>
						<GeographicMetrics
							data={data}
							stats={stats}
							showTitle
							title='Métricas Geográficas'
						/>
					</Box>

					{/* RESTANTE DO CONTEÚDO */}
					<Box>
						{/* Gráficos Geográficos */}
						<GeographicChart
							countries={data?.top_countries || []}
							states={data?.top_states || []}
							cities={data?.top_cities || []}
							totalClicks={stats?.totalClicks || 0}
						/>

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
				</Box>
			</AnalyticsStateManager>
		</Box>
	);
}

export default GeographicAnalysis;
