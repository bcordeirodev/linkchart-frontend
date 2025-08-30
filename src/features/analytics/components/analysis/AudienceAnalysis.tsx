import { Grid } from '@mui/material';
import { AnalyticsData } from '../../types/analytics';

// Reutilizamos os componentes existentes do módulo audience migrado
import { AudienceChart, AudienceInsights } from '../specialized/audience';
import { UnifiedMetrics } from '../metrics/UnifiedMetrics';

interface AudienceAnalysisProps {
    data: AnalyticsData;
}

/**
 * Análise de audiência unificada
 * Mantém toda funcionalidade do módulo audience original
 */
export function AudienceAnalysis({ data }: AudienceAnalysisProps) {
    return (
        <Grid container spacing={3}>
            {/* Métricas de Audiência */}
            <Grid item xs={12}>
                <UnifiedMetrics
                    data={data}
                    categories={['audience']}
                    showTitle={true}
                    title="👥 Métricas de Audiência"
                />
            </Grid>

            {/* Componente original preservado */}
            <Grid item xs={12}>
                <AudienceChart
                    deviceBreakdown={data.audience?.device_breakdown || []}
                    totalClicks={data.overview?.total_clicks || 0}
                />
            </Grid>

            {/* Insights de audiência preservados */}
            <Grid item xs={12}>
                <AudienceInsights
                    deviceBreakdown={data.audience?.device_breakdown || []}
                    totalClicks={data.overview?.total_clicks || 0}
                />
            </Grid>
        </Grid>
    );
}

export default AudienceAnalysis;
