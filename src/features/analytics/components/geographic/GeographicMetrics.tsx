import { Grid, Box, Typography, useTheme } from '@mui/material';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { createPresetAnimations } from '@/lib/theme';
import {
    Language,
    LocationCity,
    Public,
    TrendingUp
} from '@mui/icons-material';

interface GeographicMetricsProps {
    data?: any;
    showTitle?: boolean;
    title?: string;
}

/**
 * 🌍 Métricas específicas de Geografia
 * Focado em alcance geográfico e distribuição
 */
export function GeographicMetrics({
    data,
    showTitle = false,
    title = 'Métricas Geográficas'
}: GeographicMetricsProps) {
    const theme = useTheme();
    const animations = createPresetAnimations(theme);

    // Cálculos das métricas
    const countriesReached = data?.geographic?.top_countries?.length || data?.overview?.countries_reached || 0;
    const citiesReached = data?.geographic?.top_cities?.length || 0;
    const statesReached = data?.geographic?.top_states?.length || 0;
    const totalGeographicClicks = data?.geographic?.top_countries?.reduce((sum: number, country: any) => sum + (country.clicks || 0), 0) || 0;

    const metrics = [
        {
            id: 'countries_reached',
            title: 'Países Alcançados',
            value: countriesReached.toString(),
            icon: <Language />,
            color: 'primary' as const,
            subtitle: 'alcance global'
        },
        {
            id: 'cities_reached',
            title: 'Cidades Alcançadas',
            value: citiesReached.toString(),
            icon: <LocationCity />,
            color: 'info' as const,
            subtitle: 'diversidade urbana'
        },
        {
            id: 'states_reached',
            title: 'Estados/Regiões',
            value: statesReached.toString(),
            icon: <Public />,
            color: 'success' as const,
            subtitle: 'cobertura regional'
        },
        {
            id: 'geographic_clicks',
            title: 'Cliques Geográficos',
            value: totalGeographicClicks.toLocaleString(),
            icon: <TrendingUp />,
            color: 'warning' as const,
            subtitle: 'cliques mapeados'
        }
    ];

    return (
        <Box sx={{ mb: 3 }}>
            {showTitle && (
                <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600 }}
                >
                    {title}
                </Typography>
            )}

            <Grid
                container
                spacing={3}
                sx={{ ...animations.fadeIn }}
            >
                {metrics.map((metric) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={metric.id}
                    >
                        <Box sx={{ height: '100%', ...animations.cardHover }}>
                            <MetricCard
                                title={metric.title}
                                value={metric.value}
                                icon={metric.icon}
                                color={metric.color}
                                subtitle={metric.subtitle}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default GeographicMetrics;
