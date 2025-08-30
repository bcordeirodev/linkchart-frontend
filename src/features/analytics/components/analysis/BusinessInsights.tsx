import { Grid } from '@mui/material';
import { AnalyticsData } from '@/features/analytics/types/analytics';

// Reutilizamos os componentes existentes do módulo insights migrado
import { BusinessInsights as OriginalBusinessInsights } from '../specialized/insights';

interface BusinessInsightsProps {
    data: AnalyticsData;
    linkId?: string;
}

/**
 * Insights de negócio unificados
 * Mantém toda funcionalidade do módulo insights original
 */
export function BusinessInsights({ data, linkId }: BusinessInsightsProps) {
    return (
        <Grid container spacing={3}>
            {/* Componente original preservado */}
            <Grid item xs={12}>
                <OriginalBusinessInsights insights={data.insights || []} />
            </Grid>
        </Grid>
    );
}

export default BusinessInsights;
