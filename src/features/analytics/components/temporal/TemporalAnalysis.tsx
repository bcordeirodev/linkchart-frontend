import { Box, Grid, Switch, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useTemporalData } from '../../hooks/useTemporalData';
import { TemporalChart } from './TemporalChart';
import TabDescription from '@/shared/ui/base/TabDescription';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { Schedule, TrendingUp, AccessTime, CalendarToday } from '@mui/icons-material';

interface TemporalAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	showTitle?: boolean;
	title?: string;
	enableRealtime?: boolean;
	timeRange?: '24h' | '7d' | '30d' | '90d';
	showAdvancedControls?: boolean;
}

/**
 * ⏰ ANÁLISE TEMPORAL OTIMIZADA
 *
 * @description
 * Componente integrado para análise de padrões temporais dos cliques.
 * Refatorado para seguir padrões do projeto e usar AnalyticsStateManager.
 *
 * @features
 * - Análise de cliques por hora e dia da semana
 * - Métricas de picos e tendências
 * - Interface consistente com outros módulos
 * - Dados reais do backend
 * - Controles avançados opcionais
 */
export function TemporalAnalysis({
	linkId,
	globalMode = false,
	showTitle = true,
	title = '⏰ Análise Temporal',
	enableRealtime = false,
	timeRange = '7d',
	showAdvancedControls = false
}: TemporalAnalysisProps) {
	const [includeAdvanced, setIncludeAdvanced] = useState(false);

	// Usar hook específico para dados temporais
	const { data, stats, loading, error, refresh, isRealtime } = useTemporalData({
		linkId,
		globalMode,
		enableRealtime,
		includeAdvanced,
		timeRange,
		refreshInterval: 30000
	});

	return (
		<AnalyticsStateManager
			loading={loading}
			error={error}
			hasData={!!data}
			onRetry={refresh}
			loadingMessage="Analisando padrões temporais..."
			emptyMessage={
				globalMode
					? 'Não há dados temporais disponíveis para seus links ativos.'
					: 'Este link ainda não possui dados temporais suficientes para análise.'
			}
			minHeight={300}
		>
			<Box>
				{/* Título e descrição */}
				{showTitle && (
					<Box sx={{ mb: 3 }}>
						<TabDescription
							icon="⏰"
							title={title}
							description="Análise de padrões temporais dos seus cliques com identificação de picos e tendências."
							highlight={`Pico: ${stats?.peakHour}h - ${stats?.peakDay}`}
							metadata={isRealtime ? 'Tempo Real' : timeRange}
						/>
					</Box>
				)}

				{/* Controles avançados */}
				{showAdvancedControls && (
					<Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
						<FormControlLabel
							control={
								<Switch
									checked={includeAdvanced}
									onChange={(e) => setIncludeAdvanced(e.target.checked)}
								/>
							}
							label="Análise Avançada (Timezone, Sazonalidade)"
						/>
					</Box>
				)}

				{/* Métricas Temporais */}
				<Grid
					container
					spacing={3}
					sx={{ mb: 3 }}
				>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Pico de Hora"
							value={`${stats?.peakHour}h`}
							icon={<AccessTime />}
							color="primary"
							subtitle="maior atividade"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Pico de Dia"
							value={stats?.peakDay || 'N/A'}
							icon={<CalendarToday />}
							color="secondary"
							subtitle="dia mais ativo"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Média/Hora"
							value={stats?.averageHourlyClicks?.toString() || '0'}
							icon={<Schedule />}
							color="info"
							subtitle="cliques por hora"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Tendência"
							value={
								stats?.trendDirection === 'up'
									? '📈 Crescendo'
									: stats?.trendDirection === 'down'
										? '📉 Declinando'
										: '📊 Estável'
							}
							icon={<TrendingUp />}
							color={
								stats?.trendDirection === 'up'
									? 'success'
									: stats?.trendDirection === 'down'
										? 'error'
										: 'warning'
							}
							subtitle="direção atual"
						/>
					</Grid>
				</Grid>

				{/* Gráficos Temporais */}
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
							// NEW: Pass enhanced temporal data
							hourlyPatternsLocal={(data as any)?.hourly_patterns_local}
							weekendVsWeekday={(data as any)?.weekend_vs_weekday}
							businessHoursAnalysis={(data as any)?.business_hours_analysis}
						/>
					</Grid>
				</Grid>
			</Box>
		</AnalyticsStateManager>
	);
}

export default TemporalAnalysis;
