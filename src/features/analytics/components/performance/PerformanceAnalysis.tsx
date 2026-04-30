import { CheckCircle, BarChart3, Zap } from 'lucide-react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ICON_LG } from '@/lib/theme/iconDefaults';
import { useTheme } from '@mui/material/styles';

import { useLinkPerformance } from '@/features/analytics/hooks/useLinkPerformance';
import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';

import { PerformanceMetrics } from './PerformanceMetrics';

interface PerformanceAnalysisProps {
	linkId: string;
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
export function PerformanceAnalysis({ linkId, title, enableRealtime = false }: PerformanceAnalysisProps) {
	const { t } = useTranslation('analytics');
	const displayTitle = title ?? t('performance.title');
	const theme = useTheme();
	const cardShadow = theme.palette.mode === 'dark' ? elevationTokens.xs : elevationLightTokens.xs;
	const cardShadowHover = theme.palette.mode === 'dark' ? elevationTokens.sm : elevationLightTokens.sm;
	const cardSx = {
		borderRadius: `${radiusTokens.lg}px`,
		boxShadow: cardShadow,
		transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
		'&:hover': {
			boxShadow: cardShadowHover
		},
		height: '100%'
	} as const;

	const {
		data: performanceData,
		loading,
		error,
		refetch
	} = useLinkPerformance({
		linkId,
		enableRealtime,
		refreshInterval: 60000
	});

	// Calcular métricas de performance
	const performanceMetrics = {
		totalClicks: performanceData?.total_redirects_24h || 0,
		uniqueVisitors: performanceData?.unique_visitors || 0,
		successRate: performanceData?.success_rate || 100,
		avgResponseTime: performanceData?.avg_response_time || 0,
		totalRedirects: performanceData?.total_redirects_24h || 0,
		totalLinks: performanceData?.total_links || 0
	};

	return (
		<Box>
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon={<Zap {...ICON_LG} />}
					title={displayTitle}
					description={t('performance.description')}
					highlight={`Sucesso: ${performanceMetrics.successRate}% • Resposta média: ${performanceMetrics.avgResponseTime}ms`}
					metadata={enableRealtime ? 'Tempo Real' : 'Dados Atualizados'}
				/>
			</Box>

			{/* 2. CONTEÚDO COM LOADER */}
			<AnalyticsStateManager
				loading={loading}
				error={error}
				hasData={!!performanceData}
				onRetry={refetch}
				loadingMessage={t('performance.loading')}
				emptyMessage='Este link ainda não possui dados de performance suficientes.'
				minHeight={300}
			>
				<Box>
					{/* MÉTRICAS DE PERFORMANCE */}
					<PerformanceMetrics
						performanceData={performanceData || undefined}
						showTitle
						title='Métricas de Performance'
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
							<Card sx={cardSx}>
								<CardContent sx={{ p: 3 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
										<CheckCircle
											{...ICON_LG}
											style={{ color: 'var(--mui-palette-success-main)', marginRight: 16 }}
										/>
										<Typography
											variant='h6'
											fontWeight={600}
										>
											Status Atual
										</Typography>
									</Box>

									<Box sx={{ mb: 3 }}>
										<Typography
											variant='body1'
											color='text.secondary'
											sx={{ mb: 2 }}
										>
											{performanceMetrics.successRate >= 99
												? 'Todos os seus links estão funcionando perfeitamente'
												: performanceMetrics.successRate >= 95
													? 'Seus links estão funcionando bem'
													: 'Alguns links podem ter problemas de performance'}
										</Typography>

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
											<Typography variant='body2'>
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
							<Card sx={cardSx}>
								<CardContent sx={{ p: 3 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
										<BarChart3
											{...ICON_LG}
											style={{ color: 'var(--mui-palette-info-main)', marginRight: 16 }}
										/>
										<Typography
											variant='h6'
											fontWeight={600}
										>
											Sistema
										</Typography>
									</Box>

									<Box sx={{ mb: 3 }}>
										<Typography
											variant='body1'
											color='text.secondary'
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
											<Typography variant='body2'>
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
											<Typography variant='body2'>
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
						<Card sx={cardSx}>
							<CardContent sx={{ p: 3 }}>
								<Typography
									variant='h6'
									sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}
								>
									<BarChart3
										{...ICON_LG}
										style={{ marginRight: 8, color: 'var(--mui-palette-info-main)' }}
									/>
									Insights de Performance
								</Typography>
								<Typography
									variant='body2'
									sx={{ lineHeight: 1.6 }}
								>
									• <strong>Taxa de Sucesso:</strong> {performanceMetrics.successRate}% dos
									redirecionamentos
									<br />• <strong>Tempo de Resposta:</strong> {performanceMetrics.avgResponseTime}ms (
									{performanceMetrics.avgResponseTime < 200
										? 'Excelente'
										: performanceMetrics.avgResponseTime < 500
											? 'Bom'
											: 'Lento'}
									)
									<br />• <strong>Total de Redirecionamentos (24h):</strong>{' '}
									{performanceMetrics.totalRedirects.toLocaleString()}
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
