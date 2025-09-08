import { Grid, Box, Typography, useTheme } from '@mui/material';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { createPresetAnimations } from '@/lib/theme';
import {
    TrendingUp,
    Public,
    CheckCircle,
    Speed
} from '@mui/icons-material';

interface PerformanceMetricsProps {
    data?: any;
    performanceData?: any;
    showTitle?: boolean;
    title?: string;
}

/**
 * ⚡ Métricas específicas de Performance
 * Focado em velocidade, disponibilidade e qualidade
 */
export function PerformanceMetrics({
    data,
    performanceData,
    showTitle = false,
    title = 'Métricas de Performance'
}: PerformanceMetricsProps) {
    const theme = useTheme();
    const animations = createPresetAnimations(theme);

    // Cálculos das métricas
    const clicks24h = performanceData?.summary?.total_redirects_24h || 0;
    const uniqueVisitors = performanceData?.summary?.unique_visitors || 0;
    const successRate = Math.round(performanceData?.summary?.success_rate || 100);
    const responseTime = Math.round(performanceData?.summary?.avg_response_time || 0);

    const metrics = [
        {
            id: 'clicks_24h',
            title: 'Cliques (24h)',
            value: clicks24h.toLocaleString(),
            icon: <TrendingUp />,
            color: 'primary' as const,
            subtitle: 'últimas 24 horas'
        },
        {
            id: 'unique_visitors',
            title: 'Visitantes Únicos',
            value: uniqueVisitors.toLocaleString(),
            icon: <Public />,
            color: 'success' as const,
            subtitle: 'usuários únicos'
        },
        {
            id: 'success_rate',
            title: 'Taxa de Sucesso',
            value: `${successRate}%`,
            icon: <CheckCircle />,
            color: 'info' as const,
            subtitle: 'redirecionamentos'
        },
        {
            id: 'response_time',
            title: 'Tempo Resposta',
            value: `${responseTime}ms`,
            icon: <Speed />,
            color: 'warning' as const,
            subtitle: 'tempo médio'
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

export default PerformanceMetrics;
