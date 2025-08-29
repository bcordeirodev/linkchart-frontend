'use client';

import { Grid, Box, Typography } from '@mui/material';
import MetricCard from '@/components/ui/MetricCard';
import { MetricsProps } from '@/types';
import {
    TrendingUp,
    Visibility,
    Public,
    Analytics as AnalyticsIcon,
    DevicesOther,
    Language,
    Schedule,
    Speed,
    Link as LinkIcon,
    CheckCircle,
    Assessment
} from '@mui/icons-material';

interface MetricDefinition {
    id: string;
    title: string;
    getValue: (data: any, linksData?: any[], performanceData?: any) => string | number;
    icon: React.ReactNode;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
    subtitle?: string;
    category: 'analytics' | 'dashboard' | 'performance' | 'geographic' | 'audience';
}

interface UnifiedMetricsProps {
    data?: any;
    linksData?: any[];
    performanceData?: any;
    categories: ('analytics' | 'dashboard' | 'performance' | 'geographic' | 'audience')[];
    showTitle?: boolean;
    title?: string;
    maxCols?: number;
}

// Definições centralizadas de todas as métricas
const METRIC_DEFINITIONS: MetricDefinition[] = [
    // Analytics Metrics
    {
        id: 'total_clicks_analytics',
        title: 'Total de Cliques',
        getValue: (data) => data?.overview?.total_clicks?.toLocaleString() || '0',
        icon: <TrendingUp />,
        color: 'primary',
        subtitle: 'cliques acumulados',
        category: 'analytics'
    },
    {
        id: 'unique_visitors_analytics',
        title: 'Visitantes Únicos',
        getValue: (data) => data?.overview?.unique_visitors?.toLocaleString() || '0',
        icon: <Public />,
        color: 'success',
        subtitle: 'usuários únicos',
        category: 'analytics'
    },
    {
        id: 'conversion_rate',
        title: 'Taxa de Conversão',
        getValue: (data) => {
            const clicks = data?.overview?.total_clicks || 0;
            const visitors = data?.overview?.unique_visitors || 0;
            return clicks > 0 ? `${((visitors / clicks) * 100).toFixed(1)}%` : '0%';
        },
        icon: <Visibility />,
        color: 'info',
        subtitle: 'visitantes vs cliques',
        category: 'analytics'
    },
    {
        id: 'avg_daily_clicks',
        title: 'Média Diária',
        getValue: (data) => data?.overview?.avg_daily_clicks?.toFixed(1) || '0',
        icon: <AnalyticsIcon />,
        color: 'warning',
        subtitle: 'cliques por dia',
        category: 'analytics'
    },

    // Dashboard Metrics
    {
        id: 'total_links',
        title: 'Total de Links',
        getValue: (data, linksData) => (linksData?.length || 0).toString(),
        icon: <LinkIcon />,
        color: 'primary',
        subtitle: 'links criados',
        category: 'dashboard'
    },
    {
        id: 'active_links',
        title: 'Links Ativos',
        getValue: (data, linksData) => (linksData?.filter(link => link.is_active)?.length || 0).toString(),
        icon: <CheckCircle />,
        color: 'success',
        subtitle: 'links funcionando',
        category: 'dashboard'
    },
    {
        id: 'total_clicks_dashboard',
        title: 'Total de Cliques',
        getValue: (data, linksData) => (linksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0).toLocaleString(),
        icon: <TrendingUp />,
        color: 'info',
        subtitle: 'cliques acumulados',
        category: 'dashboard'
    },
    {
        id: 'avg_clicks_per_link',
        title: 'Média por Link',
        getValue: (data, linksData) => {
            const totalLinks = linksData?.length || 0;
            const totalClicks = linksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
            return totalLinks > 0 ? Math.round(totalClicks / totalLinks).toString() : '0';
        },
        icon: <Assessment />,
        color: 'warning',
        subtitle: 'cliques por link',
        category: 'dashboard'
    },

    // Performance Metrics
    {
        id: 'performance_clicks',
        title: 'Cliques (24h)',
        getValue: (data, linksData, performanceData) => (performanceData?.summary?.total_redirects_24h || 0).toLocaleString(),
        icon: <TrendingUp />,
        color: 'primary',
        subtitle: 'últimas 24 horas',
        category: 'performance'
    },
    {
        id: 'performance_visitors',
        title: 'Visitantes Únicos',
        getValue: (data, linksData, performanceData) => (performanceData?.summary?.unique_visitors || 0).toLocaleString(),
        icon: <Public />,
        color: 'success',
        subtitle: 'usuários únicos',
        category: 'performance'
    },
    {
        id: 'success_rate',
        title: 'Taxa de Sucesso',
        getValue: (data, linksData, performanceData) => `${Math.round(performanceData?.summary?.success_rate || 100)}%`,
        icon: <CheckCircle />,
        color: 'info',
        subtitle: 'redirecionamentos',
        category: 'performance'
    },
    {
        id: 'response_time',
        title: 'Tempo Resposta',
        getValue: (data, linksData, performanceData) => `${Math.round(performanceData?.summary?.avg_response_time || 0)}ms`,
        icon: <Speed />,
        color: 'warning',
        subtitle: 'tempo médio',
        category: 'performance'
    },

    // Geographic Metrics
    {
        id: 'countries_reached',
        title: 'Países Alcançados',
        getValue: (data) => (data?.geographic?.top_countries?.length || data?.overview?.countries_reached || 0).toString(),
        icon: <Language />,
        color: 'secondary',
        subtitle: 'alcance global',
        category: 'geographic'
    },
    {
        id: 'cities_reached',
        title: 'Cidades Alcançadas',
        getValue: (data) => (data?.geographic?.top_cities?.length || 0).toString(),
        icon: <Schedule />,
        color: 'info',
        subtitle: 'diversidade urbana',
        category: 'geographic'
    },

    // Audience Metrics
    {
        id: 'device_types',
        title: 'Tipos de Dispositivos',
        getValue: (data) => (data?.audience?.device_breakdown?.length || 0).toString(),
        icon: <DevicesOther />,
        color: 'success',
        subtitle: 'dispositivos únicos',
        category: 'audience'
    }
];

/**
 * Componente unificado de métricas que elimina duplicação
 * Centraliza todas as definições de métricas e permite composição flexível
 */
export function UnifiedMetrics({
    data,
    linksData = [],
    performanceData,
    categories,
    showTitle = false,
    title = 'Métricas',
    maxCols = 4
}: UnifiedMetricsProps) {
    // Filtrar métricas baseado nas categorias solicitadas
    const relevantMetrics = METRIC_DEFINITIONS.filter(metric => categories.includes(metric.category));

    if (relevantMetrics.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    📊 Carregando métricas...
                </Typography>
            </Box>
        );
    }

    // Calcular grid responsivo baseado no número de métricas
    const gridSize = Math.min(12 / Math.min(relevantMetrics.length, maxCols), 12);

    return (
        <Box>
            {showTitle && (
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    {title}
                </Typography>
            )}

            <Grid container spacing={3} mb={2}>
                {relevantMetrics.map((metric) => {
                    const value = metric.getValue(data, linksData, performanceData);

                    return (
                        <Grid item xs={12} sm={6} md={gridSize} key={metric.id}>
                            <MetricCard
                                title={metric.title}
                                value={value}
                                icon={metric.icon}
                                color={metric.color}
                                subtitle={metric.subtitle}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}

export default UnifiedMetrics;
