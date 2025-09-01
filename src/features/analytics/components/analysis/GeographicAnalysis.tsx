import { Grid } from '@mui/material';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatBarChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';
import { AnalyticsData } from '@/features/analytics/types/analytics';

// Reutilizamos os componentes existentes do módulo geographic migrado
import { GeographicChart, GeographicInsights } from '../specialized/geographic';
import { UnifiedMetrics } from '../metrics/UnifiedMetrics';

interface GeographicAnalysisProps {
	data: AnalyticsData;
}

/**
 * Análise geográfica unificada
 * Mantém toda funcionalidade do módulo geographic original
 */
export function GeographicAnalysis({ data }: GeographicAnalysisProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<Grid
			container
			spacing={3}
		>
			{/* Métricas Geográficas */}
			<Grid
				item
				xs={12}
			>
				<UnifiedMetrics
					data={data}
					categories={['geographic']}
					showTitle={true}
					title="🌍 Métricas Geográficas"
				/>
			</Grid>

			{/* Componente original preservado */}
			<Grid
				item
				xs={12}
			>
				<GeographicChart
					countries={data.geographic?.top_countries || []}
					states={data.geographic?.top_states || []}
					cities={data.geographic?.top_cities || []}
					totalClicks={data.overview?.total_clicks || 0}
				/>
			</Grid>

			{/* Insights geográficos preservados */}
			<Grid
				item
				xs={12}
			>
				<GeographicInsights
					data={data?.geographic?.heatmap_data || []}
					countries={data.geographic?.top_countries || []}
					states={data.geographic?.top_states || []}
					cities={data.geographic?.top_cities || []}
				/>
			</Grid>

			{/* Gráficos detalhados adicionais */}
			<Grid
				item
				xs={12}
				md={4}
			>
				<ChartCard title="🏛️ Estados/Regiões">
					<ApexChartWrapper
						type="bar"
						height={300}
						{...formatBarChart(
							(data.geographic?.top_states || []).map((state) => ({
								...state,
								label: `${state.state_name || state.state}`
							})) as Record<string, unknown>[],
							'label',
							'clicks',
							'#2e7d32',
							true,
							isDark
						)}
					/>
				</ChartCard>
			</Grid>

			<Grid
				item
				xs={12}
				md={4}
			>
				<ChartCard title="🏙️ Principais Cidades">
					<ApexChartWrapper
						type="bar"
						height={300}
						{...formatBarChart(
							(data.geographic?.top_cities || []).map((city) => ({
								...city,
								label: city.city
							})) as Record<string, unknown>[],
							'label',
							'clicks',
							'#dc004e',
							true,
							isDark
						)}
					/>
				</ChartCard>
			</Grid>

			<Grid
				item
				xs={12}
				md={4}
			>
				<ChartCard title="🌍 Distribuição Global">
					<ApexChartWrapper
						type="bar"
						height={300}
						{...formatBarChart(
							(data.geographic?.top_countries || []) as Record<string, unknown>[],
							'country',
							'clicks',
							'#1976d2',
							true,
							isDark
						)}
					/>
				</ChartCard>
			</Grid>
		</Grid>
	);
}

export default GeographicAnalysis;
