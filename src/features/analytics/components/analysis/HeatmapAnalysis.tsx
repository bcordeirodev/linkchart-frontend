import { Grid, Box, Typography } from '@mui/material';
import { AnalyticsData } from '@/features/analytics/types/analytics';

// Usar o novo componente de tempo real
import { RealTimeHeatmapChart } from '../specialized/heatmap';

interface HeatmapAnalysisProps {
    data: AnalyticsData;
    linkId?: string;
    globalMode?: boolean;
}

/**
 * Análise de heatmap unificada com tempo real
 * Usa o novo componente RealTimeHeatmapChart para funcionalidade completa
 * Sempre mostra heatmap: específico se linkId fornecido, global caso contrário
 */
export function HeatmapAnalysis({ data, linkId, globalMode = false }: HeatmapAnalysisProps) {
    // Se temos linkId, mostrar heatmap específico do link
    if (linkId) {
        return (
            <Box>
                <RealTimeHeatmapChart
                    linkId={linkId}
                    height={700}
                    title="Mapa de Calor - Link Específico"
                    enableRealtime={true}
                    refreshInterval={30000}
                    showControls={true}
                    showStats={true}
                    globalMode={false}
                />
            </Box>
        );
    }

    // Se não temos linkId, sempre mostrar heatmap global
    return (
        <Box>
            <RealTimeHeatmapChart
                globalMode={true}
                height={700}
                title="Mapa de Calor Global - Todos os Links Ativos"
                enableRealtime={true}
                refreshInterval={30000}
                showControls={true}
                showStats={true}
            />
        </Box>
    );
}

export default HeatmapAnalysis;
