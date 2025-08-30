import { Grid } from '@mui/material';
import { AnalyticsData } from '@/features/analytics/types/analytics';

// Reutilizamos os componentes existentes do módulo temporal migrado
import { TemporalChart, TemporalInsights } from '../specialized/temporal';

interface TemporalAnalysisProps {
    data: AnalyticsData;
}

/**
 * Análise temporal unificada
 * Mantém toda funcionalidade do módulo temporal original
 */
export function TemporalAnalysis({ data }: TemporalAnalysisProps) {
    return (
        <Grid container spacing={3}>
            {/* Componente original preservado */}
            <Grid item xs={12}>
                <TemporalChart
                    hourlyData={data.temporal?.clicks_by_hour || []}
                    weeklyData={data.temporal?.clicks_by_day_of_week || []}
                />
            </Grid>

            {/* Insights temporais preservados */}
            <Grid item xs={12}>
                <TemporalInsights
                    hourlyData={data.temporal?.clicks_by_hour || []}
                    weeklyData={data.temporal?.clicks_by_day_of_week || []}
                />
            </Grid>
        </Grid>
    );
}

export default TemporalAnalysis;
