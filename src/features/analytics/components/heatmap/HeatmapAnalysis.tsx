/**
 * @fileoverview Componente principal de análise de heatmap
 * @author Link Chart Team
 * @version 2.0.0
 */

import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import { RealTimeHeatmapChart } from './RealTimeHeatmapChart';
import { HeatmapMetrics } from './HeatmapMetrics';
import { useHeatmapData } from '@/features/analytics/hooks/useHeatmapData';

// Props locais do componente
interface HeatmapAnalysisProps {
	linkId?: string;
	globalMode?: boolean;
	showTitle?: boolean;
	title?: string;
	data?: unknown; // Para compatibilidade com código legado
}

/**
 * Componente de análise de heatmap unificado
 * 
 * @description
 * Este componente fornece uma interface completa para visualização de heatmap:
 * - Métricas agregadas (total de cliques, países, cidades)
 * - Mapa interativo em tempo real
 * - Suporte para modo global e específico por link
 * - Estados de loading e erro
 * 
 * @example
 * ```tsx
 * // Modo global (todos os links)
 * <HeatmapAnalysis globalMode={true} />
 * 
 * // Link específico
 * <HeatmapAnalysis linkId="123" />
 * ```
 */
export function HeatmapAnalysis({
	data: _data, // Dados externos não são usados - o hook gerencia tudo
	linkId,
	globalMode = false
}: HeatmapAnalysisProps) {

	// Determinar modo de operação
	const isGlobalMode = globalMode || !linkId;

	// Hook para gerenciar dados do heatmap
	const {
		stats,
		data: heatmapData,
		loading,
		error,
		refresh
	} = useHeatmapData({
		linkId: isGlobalMode ? undefined : linkId,
		globalMode: isGlobalMode,
		enableRealtime: true,
		refreshInterval: 30000,
		minClicks: 1
	});

	// Estado de loading
	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					p: 4,
					minHeight: 400
				}}
			>
				<CircularProgress size={48} sx={{ mb: 2 }} />
				<Typography variant="h6" color="text.secondary">
					Carregando dados do heatmap...
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					{isGlobalMode ? 'Agregando dados de todos os links' : `Buscando dados do link ${linkId}`}
				</Typography>
			</Box>
		);
	}

	// Estado de erro
	if (error) {
		return (
			<Box sx={{ p: 4 }}>
				<Alert
					severity="error"
					action={
						<button onClick={refresh} style={{ marginLeft: 8 }}>
							Tentar Novamente
						</button>
					}
				>
					<Typography variant="subtitle1" gutterBottom>
						Erro ao carregar heatmap
					</Typography>
					<Typography variant="body2">
						{error}
					</Typography>
				</Alert>
			</Box>
		);
	}

	// Estado vazio (sem dados)
	if (!heatmapData?.length) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					p: 4,
					minHeight: 400
				}}
			>
				<Typography variant="h6" color="text.secondary" gutterBottom>
					📍 Nenhum dado geográfico disponível
				</Typography>
				<Typography variant="body2" color="text.secondary" align="center">
					{isGlobalMode
						? 'Não há cliques registrados em nenhum dos seus links ativos ainda.'
						: 'Este link ainda não recebeu cliques com dados geográficos.'
					}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
					Os dados aparecerão aqui conforme os cliques forem registrados.
				</Typography>
			</Box>
		);
	}

	// Títulos dinâmicos baseados no modo
	const metricsTitle = isGlobalMode
		? '🌍 Métricas Globais do Heatmap'
		: '📍 Métricas do Heatmap';

	const chartTitle = isGlobalMode
		? 'Mapa de Calor Global - Todos os Links Ativos'
		: 'Mapa de Calor - Link Específico';

	return (
		<Box>
			{/* Métricas do Heatmap */}
			<HeatmapMetrics
				stats={stats}
				showTitle={true}
				title={metricsTitle}
			/>

			{/* Mapa Interativo */}
			<Box sx={{ mt: 3 }}>
				<RealTimeHeatmapChart
					data={heatmapData}
					stats={stats}
					loading={loading}
					error={error}
					onRefresh={refresh}
					height={700}
					title={chartTitle}
					showControls={true}
					showStats={false} // Métricas já são mostradas acima
				/>
			</Box>
		</Box>
	);
}

export default HeatmapAnalysis;