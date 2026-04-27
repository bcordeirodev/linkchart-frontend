import { Lightbulb, TrendingUp, Flag, BarChart3 } from 'lucide-react';
import { Box, Grid, Typography } from '@mui/material';

import { ICON_MD, ICON_LG } from '@/lib/theme/iconDefaults';

import { radiusTokens } from '@/lib/theme/designSystem';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import TabDescription from '@/shared/ui/base/TabDescription';

import { useInsightsData } from '../../hooks/useInsightsData';

import { BusinessInsights } from './BusinessInsights';
import { RetentionAnalysisChart } from './RetentionAnalysisChart';
import { SessionDepthChart } from './SessionDepthChart';
import { TrafficSourceChart } from './TrafficSourceChart';

interface InsightsAnalysisProps {
	linkId: string;
	title?: string;
	enableRealtime?: boolean;
	maxInsights?: number;
}

/**
 * 💡 INSIGHTS ANALYSIS - COMPONENTE INTEGRADO
 *
 * @description
 * Componente principal do módulo de insights que usa o hook dedicado
 * useInsightsData para buscar e gerenciar insights de negócio.
 *
 * @features
 * - Hook específico useInsightsData
 * - Filtros interativos por categoria e prioridade
 * - Métricas de confiança e impacto
 * - Insights acionáveis destacados
 * - Estatísticas em tempo real
 *
 * @usage
 * ```tsx
 * // Insights globais com filtros
 * <InsightsAnalysis
 *   showFilters={true}
 *   maxInsights={10}
 * />
 *
 * // Insights de link específico
 * <InsightsAnalysis
 *   linkId="123"
 *   enableRealtime={false}
 * />
 * ```
 */
export function InsightsAnalysis({
	linkId,

	title = 'Insights de Negócio',
	enableRealtime = false,
	maxInsights = 50
}: InsightsAnalysisProps) {
	// Usar hook específico para dados de insights
	const { data, stats, loading, error, refresh, isRealtime } = useInsightsData({
		linkId,
		enableRealtime,
		refreshInterval: 300000 // 5 minutos (insights não mudam frequentemente)
	});

	return (
		<Box>
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon='💡'
					title={title}
					description='Insights automáticos gerados pela análise dos seus dados com recomendações acionáveis.'
					highlight={`${data?.insights?.length || 0} insights disponíveis`}
					metadata={isRealtime ? 'Tempo Real' : 'Análise Inteligente'}
				/>
			</Box>

			{/* 2. CONTEÚDO COM LOADER */}
			<AnalyticsStateManager
				loading={loading}
				error={error}
				hasData={!!data?.insights?.length}
				onRetry={refresh}
				loadingMessage='Gerando insights inteligentes...'
				emptyMessage='Este link ainda não possui dados suficientes para gerar insights.'
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
									title='Total de Insights'
									value={stats?.totalInsights?.toString() || '0'}
									icon={<Lightbulb />}
									color='primary'
									subtitle='insights gerados'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Alta Prioridade'
									value={stats?.highPriorityCount?.toString() || '0'}
									icon={<Flag />}
									color='error'
									subtitle='requerem atenção'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Acionáveis'
									value={stats?.actionableCount?.toString() || '0'}
									icon={<TrendingUp />}
									color='success'
									subtitle='podem ser implementados'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
							>
								<MetricCard
									title='Confiança Média'
									value={`${Math.round((stats?.avgConfidence || 0) * 100)}%`}
									icon={<BarChart3 {...ICON_LG} />}
									color='info'
									subtitle='precisão dos insights'
								/>
							</Grid>
						</Grid>
					</Box>

					{/* RESTANTE DO CONTEÚDO */}
					{/* ETAPA 3: NOVOS COMPONENTES DE INSIGHTS AVANÇADOS */}
					{data?.analytics_data ? (
						<Box sx={{ mb: 4 }}>
							<Grid
								container
								spacing={3}
							>
								{/* Análise de Retenção */}
								{data.analytics_data.retention ? (
									<Grid
										item
										xs={12}
									>
										<RetentionAnalysisChart
											data={data.analytics_data.retention}
											loading={loading}
											showTitle
										/>
									</Grid>
								) : null}

								{/* Análise de Profundidade de Sessão */}
								{data.analytics_data.session_depth ? (
									<Grid
										item
										xs={12}
									>
										<SessionDepthChart
											data={data.analytics_data.session_depth}
											loading={loading}
											showTitle
										/>
									</Grid>
								) : null}

								{/* Análise de Fontes de Tráfego */}
								{data.analytics_data.traffic_sources ? (
									<Grid
										item
										xs={12}
									>
										<TrafficSourceChart
											data={data.analytics_data.traffic_sources}
											loading={loading}
											showTitle
										/>
									</Grid>
								) : null}
							</Grid>
						</Box>
					) : null}

					{/* Lista de Insights Tradicionais */}
					<Box sx={{ mb: 3 }}>
						<Typography
							variant='h6'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							💡 Insights Automáticos
						</Typography>
						<BusinessInsights
							insights={data?.insights || []}
							showTitle={false}
							maxItems={maxInsights}
						/>
					</Box>

					{/* Informações adicionais */}
					{stats ? (
						<Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: `${radiusTokens.md}px` }}>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Categoria principal: {stats.topCategory} • Última geração:{' '}
								{new Date(stats.lastGenerated).toLocaleString()} •{data?.insights?.length || 0} de{' '}
								{stats.totalInsights} insights exibidos
								{isRealtime ? ' • Atualizações automáticas ativas' : null}
							</Typography>
						</Box>
					) : null}
				</Box>
			</AnalyticsStateManager>
		</Box>
	);
}

export default InsightsAnalysis;
