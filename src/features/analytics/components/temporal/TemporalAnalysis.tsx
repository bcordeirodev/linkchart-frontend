import { Box, Grid } from '@mui/material';
import { useTemporalData } from '../../hooks/useTemporalData';
import { TemporalChart } from './TemporalChart';
import TabDescription from '@/shared/ui/base/TabDescription';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { Schedule, TrendingUp, AccessTime, CalendarToday } from '@mui/icons-material';

interface TemporalAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	title?: string;
	enableRealtime?: boolean;
	timeRange?: '24h' | '7d' | '30d' | '90d';
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
 * - Dados avançados carregados automaticamente (quando disponíveis)
 * - Tabs avançadas aparecem automaticamente se houver dados suficientes
 */
export function TemporalAnalysis({
	linkId,
	globalMode = false,
	title = 'Análise Temporal',
	enableRealtime = false,
	timeRange = '7d'
}: TemporalAnalysisProps) {
	// Usar hook específico para dados temporais - SEMPRE incluir dados avançados
	const { data, stats, loading, error, refresh, isRealtime } = useTemporalData({
		linkId,
		globalMode,
		enableRealtime,
		includeAdvanced: true, // ✅ Sempre buscar dados avançados
		timeRange,
		refreshInterval: 30000
	});

	return (
		<Box>
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon="⏰"
					title={title}
					description="Análise de padrões temporais dos seus cliques com identificação de picos e tendências."
					highlight={`Pico: ${stats?.peakHour || '--'}h - ${stats?.peakDay || 'N/A'}`}
					metadata={isRealtime ? 'Tempo Real' : timeRange}
				/>
			</Box>

			{/* 2. CONTEÚDO COM LOADER */}
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
					{/* MÉTRICAS */}
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
					</Box>

					{/* RESTANTE DO CONTEÚDO */}
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
		</Box>
	);
}

export default TemporalAnalysis;
