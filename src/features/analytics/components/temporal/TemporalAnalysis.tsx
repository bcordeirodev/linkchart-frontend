import { Schedule, TrendingUp, AccessTime, CalendarToday } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';

import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import TabDescription from '@/shared/ui/base/TabDescription';

import { useTemporalData } from '../../hooks/useTemporalData';

import { TemporalChart } from './TemporalChart';

interface TemporalAnalysisProps {
	linkId: string;
	title?: string;
	enableRealtime?: boolean;
}

/**
 * Componente de análise temporal com padrões de cliques por hora e dia da semana
 */
export function TemporalAnalysis({
	linkId,
	title = 'Análise Temporal',
	enableRealtime = false
}: TemporalAnalysisProps) {
	const { data, stats, loading, error, refresh, isRealtime } = useTemporalData({
		linkId,
		enableRealtime,
		includeAdvanced: false, // Deprecated - endpoint sempre inclui dados advanced
		refreshInterval: 30000
	});

	// Priorizar dados de peak_analysis do back-end quando disponíveis
	const peakHour =
		data?.advanced?.peak_analysis?.peak_hour !== undefined
			? `${data.advanced.peak_analysis.peak_hour.toString().padStart(2, '0')}h`
			: stats?.peakHour
				? `${stats.peakHour}h`
				: '--';

	const peakDay = data?.advanced?.peak_analysis?.peak_day || stats?.peakDay || 'N/A';

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon='⏰'
					title={title}
					description='Análise de padrões temporais dos seus cliques com identificação de picos e tendências. Todos os dados desde o início.'
					highlight={`Pico: ${peakHour} - ${peakDay}`}
					metadata={isRealtime ? 'Tempo Real' : 'Todos os dados'}
				/>
			</Box>

			<AnalyticsStateManager
				loading={loading}
				error={error}
				hasData={!!data}
				onRetry={refresh}
				loadingMessage='Analisando padrões temporais...'
				emptyMessage='Este link ainda não possui dados temporais suficientes para análise.'
				minHeight={300}
			>
				<Box>
					<Box sx={{ mb: 3 }}>
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Pico de Hora'
									value={peakHour}
									icon={<AccessTime />}
									color='primary'
									subtitle='maior atividade'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Pico de Dia'
									value={peakDay}
									icon={<CalendarToday />}
									color='secondary'
									subtitle='dia mais ativo'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Média/Hora'
									value={stats?.averageHourlyClicks?.toString() || '0'}
									icon={<Schedule />}
									color='info'
									subtitle='cliques por hora'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Tendência'
									value={
										stats?.trendDirection === 'up'
											? 'Crescendo'
											: stats?.trendDirection === 'down'
												? 'Declinando'
												: 'Estável'
									}
									icon={<TrendingUp />}
									color={
										stats?.trendDirection === 'up'
											? 'success'
											: stats?.trendDirection === 'down'
												? 'error'
												: 'warning'
									}
									subtitle='direção atual'
								/>
							</Grid>
						</Grid>
					</Box>

					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
						>
							<TemporalChart
								hourlyData={data?.clicks_by_hour || []}
								weeklyData={data?.clicks_by_day_of_week || []}
								hourlyPatternsLocal={(data as any)?.hourly_patterns_local}
								weekendVsWeekday={(data as any)?.weekend_vs_weekday}
								businessHoursAnalysis={(data as any)?.business_hours_analysis}
								advancedData={data?.advanced}
							/>
						</Grid>
					</Grid>
				</Box>
			</AnalyticsStateManager>
		</Box>
	);
}

export default TemporalAnalysis;
