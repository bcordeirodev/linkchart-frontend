import { Box, Grid, Typography } from '@mui/material';
import { useInsightsData } from '../../hooks/useInsightsData';
import { BusinessInsights } from './BusinessInsights';
import TabDescription from '@/shared/ui/base/TabDescription';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { Lightbulb, TrendingUp, Flag, Assessment } from '@mui/icons-material';

interface InsightsAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	showTitle?: boolean;
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
 *   globalMode={true}
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
	globalMode = false,
	showTitle = true,
	title = '💡 Insights de Negócio',
	enableRealtime = false,
	maxInsights = 50
}: InsightsAnalysisProps) {
	// Usar hook específico para dados de insights
	const { data, stats, loading, error, refresh, isRealtime } = useInsightsData({
		linkId,
		globalMode,
		enableRealtime,
		refreshInterval: 300000 // 5 minutos (insights não mudam frequentemente)
	});

	return (
		<AnalyticsStateManager
			loading={loading}
			error={error}
			hasData={!!data?.insights?.length}
			onRetry={refresh}
			loadingMessage="Gerando insights inteligentes..."
			emptyMessage={
				globalMode
					? 'Não há insights suficientes para seus links ativos. Mais dados são necessários para gerar análises.'
					: 'Este link ainda não possui dados suficientes para gerar insights.'
			}
			minHeight={300}
		>
			<Box>
				{/* Título e descrição */}
				{showTitle && (
					<Box sx={{ mb: 2 }}>
						<TabDescription
							icon="💡"
							title={title}
							description="Insights automáticos gerados pela análise dos seus dados com recomendações acionáveis."
							highlight={`${data?.insights?.length || 0} insights disponíveis`}
							metadata={isRealtime ? 'Tempo Real' : 'Análise Inteligente'}
						/>
					</Box>
				)}

				{/* Métricas de Insights */}
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
							title="Total de Insights"
							value={stats?.totalInsights?.toString() || '0'}
							icon={<Lightbulb />}
							color="primary"
							subtitle="insights gerados"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Alta Prioridade"
							value={stats?.highPriorityCount?.toString() || '0'}
							icon={<Flag />}
							color="error"
							subtitle="requerem atenção"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Acionáveis"
							value={stats?.actionableCount?.toString() || '0'}
							icon={<TrendingUp />}
							color="success"
							subtitle="podem ser implementados"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Confiança Média"
							value={`${Math.round((stats?.avgConfidence || 0) * 100)}%`}
							icon={<Assessment />}
							color="info"
							subtitle="precisão dos insights"
						/>
					</Grid>
				</Grid>

				{/* Lista de Insights */}
				<BusinessInsights
					insights={data?.insights || []}
					showTitle={false}
					maxItems={maxInsights}
				/>

				{/* Informações adicionais */}
				{stats && (
					<Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Categoria principal: {stats.topCategory} • Última geração:{' '}
							{new Date(stats.lastGenerated).toLocaleString()} •{data?.insights?.length || 0} de{' '}
							{stats.totalInsights} insights exibidos
							{isRealtime && ' • Atualizações automáticas ativas'}
						</Typography>
					</Box>
				)}
			</Box>
		</AnalyticsStateManager>
	);
}

export default InsightsAnalysis;
