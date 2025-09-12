import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useLinkPerformance } from '@/features/analytics/hooks/useLinkPerformance';
import { CheckCircle, Assessment } from '@mui/icons-material';
import { PerformanceMetrics } from './PerformanceMetrics';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

interface PerformanceAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	title?: string;
	enableRealtime?: boolean;
}

/**
 * 🚀 ANÁLISE DE PERFORMANCE OTIMIZADA
 *
 * @description
 * Componente integrado para análise de performance dos links com métricas reais.
 * Refatorado para seguir padrões do projeto e usar AnalyticsStateManager.
 *
 * @features
 * - Métricas de velocidade e disponibilidade
 * - Monitoramento em tempo real
 * - Interface consistente com outros módulos
 * - Dados reais do backend
 */
export function PerformanceAnalysis({
	linkId,
	globalMode = false,
	title = 'Análise de Performance',
	enableRealtime = false
}: PerformanceAnalysisProps) {
	const { data: performanceData, loading, error, refetch } = useLinkPerformance();

	// Calcular métricas de performance
	const performanceMetrics = {
		totalClicks: performanceData?.total_redirects_24h || 0,
		uniqueVisitors: performanceData?.unique_visitors || 0,
		successRate: performanceData?.success_rate || 100,
		avgResponseTime: performanceData?.avg_response_time || 0,
		uptime: performanceData?.uptime_percentage || 100,
		totalRedirects: performanceData?.total_redirects_24h || 0,
		totalLinks: performanceData?.total_links || 0,
		performanceScore: performanceData?.performance_score || 0,
		clicksPerHour: performanceData?.clicks_per_hour || 0,
		visitorRetention: performanceData?.visitor_retention || 0
	};

	return (
		<Box>
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon="🚀"
					title={title}
					description="Análise completa de performance dos seus links com métricas de velocidade, disponibilidade e otimização."
					highlight={`Score: ${performanceMetrics.performanceScore}/100 - ${performanceMetrics.uptime}% uptime`}
					metadata={enableRealtime ? 'Tempo Real' : 'Dados Atualizados'}
				/>
			</Box>

			{/* 2. CONTEÚDO COM LOADER */}
			<AnalyticsStateManager
				loading={loading}
				error={error}
				hasData={!!performanceData}
				onRetry={refetch}
				loadingMessage="Carregando métricas de performance..."
				emptyMessage={
					globalMode
						? 'Não há dados de performance disponíveis para seus links ativos.'
						: 'Este link ainda não possui dados de performance suficientes.'
				}
				minHeight={300}
			>
				<Box>
					{/* MÉTRICAS DE PERFORMANCE */}
					<PerformanceMetrics
						performanceData={performanceData || undefined}
						showTitle={true}
						title="📊 Métricas de Performance"
					/>

					{/* RESTANTE DO CONTEÚDO */}
					<Grid
						container
						spacing={3}
						sx={{ mt: 2 }}
					>
						{/* Status Atual */}
						<Grid
							item
							xs={12}
							md={6}
						>
							<Card
								sx={{
									borderRadius: 3,
									background:
										'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
									border: '1px solid rgba(76, 175, 80, 0.3)',
									height: '100%'
								}}
							>
								<CardContent sx={{ p: 3 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
										<CheckCircle sx={{ color: 'success.main', mr: 2 }} />
										<Typography
											variant="h6"
											fontWeight={600}
										>
											✅ Status Atual
										</Typography>
									</Box>

									<Box sx={{ mb: 3 }}>
										<Typography
											variant="body1"
											color="text.secondary"
											sx={{ mb: 2 }}
										>
											{performanceMetrics.successRate >= 99
												? 'Todos os seus links estão funcionando perfeitamente'
												: performanceMetrics.successRate >= 95
													? 'Seus links estão funcionando bem'
													: 'Alguns links podem ter problemas de performance'}
										</Typography>

										<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
											<Box
												sx={{
													width: 12,
													height: 12,
													borderRadius: '50%',
													backgroundColor:
														performanceMetrics.successRate >= 99
															? 'success.main'
															: 'warning.main',
													mr: 1
												}}
											/>
											<Typography variant="body2">
												<strong>Uptime:</strong> {performanceMetrics.uptime}%
											</Typography>
										</Box>

										<Box sx={{ display: 'flex', alignItems: 'center' }}>
											<Box
												sx={{
													width: 12,
													height: 12,
													borderRadius: '50%',
													backgroundColor: 'primary.main',
													mr: 1
												}}
											/>
											<Typography variant="body2">
												<strong>Links ativos:</strong> {performanceMetrics.totalLinks}
											</Typography>
										</Box>
									</Box>
								</CardContent>
							</Card>
						</Grid>

						{/* Sistema */}
						<Grid
							item
							xs={12}
							md={6}
						>
							<Card
								sx={{
									borderRadius: 3,
									background:
										'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
									border: '1px solid rgba(33, 150, 243, 0.3)',
									height: '100%'
								}}
							>
								<CardContent sx={{ p: 3 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
										<Assessment sx={{ color: 'info.main', mr: 2 }} />
										<Typography
											variant="h6"
											fontWeight={600}
										>
											⚙️ Sistema
										</Typography>
									</Box>

									<Box sx={{ mb: 3 }}>
										<Typography
											variant="body1"
											color="text.secondary"
											sx={{ mb: 2 }}
										>
											Informações técnicas do sistema de redirecionamento
										</Typography>

										<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
											<Box
												sx={{
													width: 12,
													height: 12,
													borderRadius: '50%',
													backgroundColor: 'warning.main',
													mr: 1
												}}
											/>
											<Typography variant="body2">
												<strong>Resposta média:</strong> {performanceMetrics.avgResponseTime}ms
											</Typography>
										</Box>

										<Box sx={{ display: 'flex', alignItems: 'center' }}>
											<Box
												sx={{
													width: 12,
													height: 12,
													borderRadius: '50%',
													backgroundColor: 'secondary.main',
													mr: 1
												}}
											/>
											<Typography variant="body2">
												<strong>Total redirecionamentos:</strong>{' '}
												{performanceMetrics.totalRedirects.toLocaleString()}
											</Typography>
										</Box>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>

					{/* Insights de performance */}
					<Box sx={{ mt: 4 }}>
						<Card
							sx={{
								borderRadius: 3,
								background:
									'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
								border: '1px solid rgba(33, 150, 243, 0.3)'
							}}
						>
							<CardContent sx={{ p: 3 }}>
								<Typography
									variant="h6"
									sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}
								>
									<Assessment sx={{ mr: 1, color: 'info.main' }} />
									💡 Insights de Performance
								</Typography>
								<Typography
									variant="body2"
									sx={{ lineHeight: 1.6 }}
								>
									• <strong>Score de Performance:</strong> {performanceMetrics.performanceScore}/100 (
									{performanceMetrics.performanceScore >= 90
										? 'Excelente'
										: performanceMetrics.performanceScore >= 70
											? 'Bom'
											: 'Precisa melhorar'}
									)
									<br />• <strong>Uptime Real:</strong> {performanceMetrics.uptime}% de disponibilidade (
									{performanceMetrics.uptime >= 99
										? 'Excelente'
										: performanceMetrics.uptime >= 95
											? 'Bom'
											: 'Crítico'}
									)
									<br />• <strong>Taxa de Cliques:</strong> {performanceMetrics.clicksPerHour}{' '}
									cliques/hora em média
									<br />• <strong>Retenção de Visitantes:</strong> {performanceMetrics.visitorRetention}%
									dos cliques são de visitantes únicos
									<br />• <strong>Tempo de Resposta:</strong> {performanceMetrics.avgResponseTime}ms (
									{performanceMetrics.avgResponseTime < 200
										? 'Excelente'
										: performanceMetrics.avgResponseTime < 500
											? 'Bom'
											: 'Lento'}
									)
								</Typography>
							</CardContent>
						</Card>
					</Box>
				</Box>
			</AnalyticsStateManager>
		</Box>
	);
}

export default PerformanceAnalysis;
