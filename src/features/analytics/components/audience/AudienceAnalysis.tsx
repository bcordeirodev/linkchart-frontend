/**
 * @fileoverview Componente principal de análise de audiência
 * @author Link Chart Team
 * @version 2.0.0
 */

import { Box, Typography, Grid } from '@mui/material';
import { useAudienceData } from '@/features/analytics/hooks/useAudienceData';
import { AudienceChart, AudienceInsights, AudienceMetrics } from '.';
import { ResponsiveContainer } from '@/shared/ui/base/ResponsiveContainer';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';
import TabDescription from '@/shared/ui/base/TabDescription';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import type { AudienceAnalysisProps } from '@/types/analytics';

// Manter compatibilidade com props antigas
interface LegacyAudienceAnalysisProps {
	data?: unknown;
	linkId?: string;
	globalMode?: boolean;
}

/**
 * 👥 ANÁLISE DE AUDIÊNCIA OTIMIZADA
 *
 * @description
 * Componente integrado para análise de audiência dos cliques.
 * Refatorado para seguir padrões do projeto e usar AnalyticsStateManager.
 *
 * @features
 * - Análise de dispositivos, navegadores e sistemas operacionais
 * - Métricas agregadas e insights estratégicos
 * - Interface consistente com outros módulos
 * - Dados reais do backend
 * - TabDescription sempre visível (independente do carregamento)
 * - Estados de loading/error/empty gerenciados pelo AnalyticsStateManager
 *
 * @example
 * ```tsx
 * // Modo global (todos os links)
 * <AudienceAnalysis globalMode={true} />
 *
 * // Link específico
 * <AudienceAnalysis linkId="123" />
 *
 * // Modo legado (compatibilidade)
 * <AudienceAnalysis data={legacyData} />
 * ```
 */
export function AudienceAnalysis({
	data: legacyData,
	linkId,
	globalMode = false,
	title = 'Análise de Audiência'
}: LegacyAudienceAnalysisProps & Partial<Pick<AudienceAnalysisProps, 'title'>>) {
	// Determinar modo de operação
	const isGlobalMode = globalMode || !linkId;
	const shouldUseHook = !legacyData && (Boolean(linkId) || globalMode);

	// Hook para gerenciar dados de audiência (apenas se não há dados legados)
	const {
		data: hookData,
		stats,
		loading,
		error,
		refresh
	} = useAudienceData({
		linkId: shouldUseHook && !isGlobalMode ? linkId : undefined,
		globalMode: shouldUseHook && isGlobalMode,
		enableRealtime: shouldUseHook,
		refreshInterval: 60000,
		includeDetails: true
	});

	// Usar dados do hook ou dados legados
	const audienceData = shouldUseHook ? hookData : legacyData;
	const deviceBreakdown =
		(audienceData as any)?.audience?.device_breakdown || (audienceData as any)?.device_breakdown || [];
	const totalClicks = (audienceData as any)?.overview?.total_clicks || stats?.totalClicks || 0;

	return (
		<Box>
			{/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon="👥"
					title={title}
					description="Análise detalhada da sua audiência com dados de dispositivos, navegadores e sistemas operacionais."
					highlight={`${deviceBreakdown?.length || 0} tipos de dispositivos detectados`}
					metadata={isGlobalMode ? 'Dados Globais' : 'Link Específico'}
				/>
			</Box>

			{/* 2. CONTEÚDO COM LOADER */}
			<AnalyticsStateManager
				loading={shouldUseHook && loading}
				error={shouldUseHook && error ? error : null}
				hasData={!!deviceBreakdown?.length}
				onRetry={refresh}
				loadingMessage="Carregando dados de audiência..."
				emptyMessage={
					isGlobalMode
						? 'Não há dados de dispositivos registrados em nenhum dos seus links ativos ainda.'
						: 'Este link ainda não recebeu cliques com dados de dispositivos.'
				}
				minHeight={300}
			>
				<ResponsiveContainer style={{ padding: 0 }}>
					{/* MÉTRICAS */}
					{shouldUseHook && stats && (
						<Box sx={{ mb: 3 }}>
							<AudienceMetrics
								data={{ audience: audienceData, stats }}
								showTitle={true}
								title="👥 Métricas de Audiência"
							/>
						</Box>
					)}

					{/* RESTANTE DO CONTEÚDO */}
					<Grid container spacing={2}>
						{/* Gráficos de Audiência */}
						<Grid item xs={12}>
							<EnhancedPaper variant="glass" animated>
								<AudienceChart
									deviceBreakdown={deviceBreakdown}
									browserBreakdown={(audienceData as any)?.browser_breakdown}
									osBreakdown={(audienceData as any)?.os_breakdown}
									totalClicks={totalClicks}
									// NEW: Pass enhanced data to existing component
									browsers={(audienceData as any)?.browsers}
									operatingSystems={(audienceData as any)?.operating_systems}
									devicePerformance={(audienceData as any)?.device_performance}
									languages={(audienceData as any)?.languages}
								/>
							</EnhancedPaper>
						</Grid>

						{/* Insights de Audiência */}
						<Grid item xs={12}>
							<EnhancedPaper variant="glass" animated>
								<AudienceInsights
									deviceBreakdown={deviceBreakdown}
									browserBreakdown={(audienceData as any)?.browser_breakdown}
									totalClicks={totalClicks}
									showAdvancedInsights={shouldUseHook}
								/>
							</EnhancedPaper>
						</Grid>
					</Grid>
				</ResponsiveContainer>
			</AnalyticsStateManager>
		</Box>
	);
}

export default AudienceAnalysis;
