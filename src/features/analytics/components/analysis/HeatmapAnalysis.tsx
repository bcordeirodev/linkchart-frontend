import { Grid } from '@mui/material';
import { AnalyticsData } from '@/features/analytics/types/analytics';

// Reutilizamos os componentes existentes do módulo heatmap migrado
import { EnhancedHeatmapChart } from '../specialized/heatmap';

interface HeatmapAnalysisProps {
    data: AnalyticsData;
}

/**
 * Análise de heatmap unificada
 * Mantém toda funcionalidade do módulo heatmap original
 */
export function HeatmapAnalysis({ data }: HeatmapAnalysisProps) {
    return (
        <Grid container spacing={3}>
            {/* Componente original preservado */}
            <Grid item xs={12}>
                <EnhancedHeatmapChart data={data.geographic?.heatmap_data || []} />
            </Grid>
        </Grid>
    );
}

export default HeatmapAnalysis;
