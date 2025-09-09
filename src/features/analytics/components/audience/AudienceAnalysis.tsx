/**
 * @fileoverview Componente principal de análise de audiência
 * @author Link Chart Team
 * @version 2.0.0
 */

import { Box, Alert, CircularProgress, Typography, Grid } from '@mui/material';
import { useAudienceData } from '@/features/analytics/hooks/useAudienceData';
import { AudienceChart, AudienceInsights, AudienceMetrics } from '.';
import type { AudienceAnalysisProps } from '@/types/analytics';

// Manter compatibilidade com props antigas
interface LegacyAudienceAnalysisProps {
	data?: unknown;
	linkId?: string;
	globalMode?: boolean;
}

/**
 * Componente de análise de audiência unificado
 *
 * @description
 * Este componente fornece uma interface completa para visualização de audiência:
 * - Métricas agregadas (dispositivos, navegadores, sistemas operacionais)
 * - Gráficos interativos de distribuição
 * - Insights estratégicos baseados nos dados
 * - Suporte para modo global e específico por link
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
	showTitle = true,
	title = '👥 Análise de Audiência'
}: LegacyAudienceAnalysisProps & Partial<AudienceAnalysisProps>) {
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

	// Estado de loading (apenas para modo hook)
	if (shouldUseHook && loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					p: 4,
					minHeight: 300
				}}
			>
				<CircularProgress
					size={48}
					sx={{ mb: 2 }}
				/>
				<Typography
					variant="h6"
					color="text.secondary"
				>
					Carregando dados de audiência...
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mt: 1 }}
				>
					{isGlobalMode ? 'Agregando dados de todos os links' : `Buscando dados do link ${linkId}`}
				</Typography>
			</Box>
		);
	}

	// Estado de erro (apenas para modo hook)
	if (shouldUseHook && error) {
		return (
			<Box sx={{ p: 4 }}>
				<Alert
					severity="error"
					action={
						<button
							onClick={refresh}
							style={{ marginLeft: 8 }}
						>
							Tentar Novamente
						</button>
					}
				>
					<Typography
						variant="subtitle1"
						gutterBottom
					>
						Erro ao carregar dados de audiência
					</Typography>
					<Typography variant="body2">{error}</Typography>
				</Alert>
			</Box>
		);
	}

	// Estado vazio
	if (!deviceBreakdown?.length) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					p: 4,
					minHeight: 300
				}}
			>
				<Typography
					variant="h6"
					color="text.secondary"
					gutterBottom
				>
					👥 Nenhum dado de audiência disponível
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					align="center"
				>
					{isGlobalMode
						? 'Não há dados de dispositivos registrados em nenhum dos seus links ativos ainda.'
						: 'Este link ainda não recebeu cliques com dados de dispositivos.'}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ mt: 2 }}
				>
					Os dados aparecerão aqui conforme os cliques forem registrados.
				</Typography>
			</Box>
		);
	}

	return (
		<Box>
			{showTitle && (
				<Typography
					variant="h6"
					gutterBottom
					sx={{ mb: 3, fontWeight: 600 }}
				>
					{title}
				</Typography>
			)}

			<Grid
				container
				spacing={3}
			>
				{/* Métricas de Audiência */}
				{shouldUseHook && stats && (
					<Grid
						item
						xs={12}
					>
						<AudienceMetrics
							data={{ audience: audienceData, stats }}
							showTitle={false}
						/>
					</Grid>
				)}

				{/* Gráficos de Audiência */}
				<Grid
					item
					xs={12}
				>
					<AudienceChart
						deviceBreakdown={deviceBreakdown}
						browserBreakdown={(audienceData as any)?.browser_breakdown}
						osBreakdown={(audienceData as any)?.os_breakdown}
						totalClicks={totalClicks}
					/>
				</Grid>

				{/* Insights de Audiência */}
				<Grid
					item
					xs={12}
				>
					<AudienceInsights
						deviceBreakdown={deviceBreakdown}
						browserBreakdown={(audienceData as any)?.browser_breakdown}
						totalClicks={totalClicks}
						showAdvancedInsights={shouldUseHook}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default AudienceAnalysis;
