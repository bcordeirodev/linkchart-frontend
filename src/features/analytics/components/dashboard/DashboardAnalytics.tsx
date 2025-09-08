import { Box, Typography, Alert, CircularProgress, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DashboardMetrics } from './DashboardMetrics';
import { TopLinks } from './TopLinks';
import { Charts } from './charts/Charts';
import TabDescription from '@/shared/ui/base/TabDescription';

interface DashboardAnalysisProps {
    linkId?: string;
    globalMode?: boolean;
    showTitle?: boolean;
    title?: string;
    enableRealtime?: boolean;
    showTimeframeSelector?: boolean;
    compact?: boolean;
}

/**
 * 🎯 DASHBOARD ANALYSIS ENHANCED - COMPONENTE INTEGRADO
 * 
 * @description
 * Versão melhorada do dashboard que usa o hook dedicado
 * useDashboardData para buscar e gerenciar dados agregados.
 * 
 * @features
 * - Hook específico useDashboardData
 * - Seletor de timeframe interativo
 * - Adaptação automática de endpoints
 * - Métricas unificadas
 * - Top links e gráficos integrados
 * 
 * @usage
 * ```tsx
 * // Dashboard global completo
 * <DashboardAnalysisEnhanced 
 *   globalMode={true}
 *   showTimeframeSelector={true}
 *   enableRealtime={true}
 * />
 * 
 * // Dashboard de link específico compacto
 * <DashboardAnalysisEnhanced 
 *   linkId="123"
 *   compact={true}
 * />
 * ```
 */
export function DashboardAnalytics({
    linkId,
    globalMode = true,
    showTitle = true,
    title = "🎯 Dashboard Principal",
    enableRealtime = false,
    showTimeframeSelector = true,
    compact = false
}: DashboardAnalysisProps) {

    const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

    // Usar APENAS o hook do dashboard - como era originalmente
    const {
        data,
        stats,
        loading,
        error,
        refresh,
        isRealtime
    } = useDashboardData({
        linkId,
        globalMode,
        enableRealtime,
        timeframe,
        refreshInterval: 60000 // 1 minuto para dashboard
    });

    const handleTimeframeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newTimeframe: '1h' | '24h' | '7d' | '30d' | null,
    ) => {
        if (newTimeframe !== null) {
            setTimeframe(newTimeframe);
        }
    };

    // Estado de loading
    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: compact ? 200 : 400,
                gap: 2
            }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Carregando dashboard...
                </Typography>
            </Box>
        );
    }

    // Estado de error
    if (error) {
        return (
            <Alert
                severity="error"
                action={
                    <button onClick={refresh}>
                        Tentar Novamente
                    </button>
                }
            >
                {error}
            </Alert>
        );
    }

    // Debug dos dados do dashboard
    if (import.meta.env.DEV) {
        console.log('🎯 DashboardAnalytics - Dados recebidos:', {
            data,
            hasData: !!data,
            temporal_data: data?.temporal_data,
            geographic_data: data?.geographic_data,
            audience_data: data?.audience_data,
            summary: data?.summary
        });

        // Debug específico dos dados problemáticos
        console.log('🔍 Debug específico - Dados para gráficos:', {
            'clicks_by_day_of_week': data?.temporal_data?.clicks_by_day_of_week,
            'top_countries': data?.geographic_data?.top_countries,
            'clicks_by_day_length': data?.temporal_data?.clicks_by_day_of_week?.length,
            'top_countries_length': data?.geographic_data?.top_countries?.length
        });
    }

    // Estado sem dados
    if (!data) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    📊 Dashboard Indisponível
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Não há dados suficientes para o dashboard.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Título e controles */}
            {showTitle && (
                <Box sx={{ mb: 2 }}>
                    <TabDescription
                        icon="🎯"
                        title={title}
                        description="Visão geral consolidada dos seus links com métricas essenciais e performance em tempo real."
                        highlight={`${data.summary?.total_links || 0} links ativos`}
                        metadata={isRealtime ? "Tempo Real" : timeframe}
                    />

                    {/* Seletor de timeframe */}
                    {showTimeframeSelector && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <ToggleButtonGroup
                                value={timeframe}
                                exclusive
                                onChange={handleTimeframeChange}
                                size="small"
                            >
                                <ToggleButton value="1h">
                                    Última Hora
                                </ToggleButton>
                                <ToggleButton value="24h">
                                    24 Horas
                                </ToggleButton>
                                <ToggleButton value="7d">
                                    7 Dias
                                </ToggleButton>
                                <ToggleButton value="30d">
                                    30 Dias
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    )}
                </Box>
            )}

            <Grid container spacing={3}>
                {/* Métricas Principais */}
                <Grid item xs={12}>
                    <DashboardMetrics
                        summary={data.summary}
                        linksData={data.top_links}
                        showTitle={!compact}
                        title="📊 Métricas Principais"
                        variant={compact ? 'compact' : 'detailed'}
                    />
                </Grid>

                {!compact && (
                    <>
                        {/* Charts e Top Links */}
                        <Grid item xs={12} lg={8}>
                            <Charts
                                data={{
                                    has_data: true,
                                    overview: {
                                        total_clicks: data?.summary?.total_clicks || 0,
                                        unique_visitors: data?.summary?.unique_visitors || 0,
                                        avg_daily_clicks: 0,
                                        conversion_rate: 0,
                                        countries_reached: data?.summary?.countries_reached || 0
                                    },
                                    temporal: {
                                        clicks_by_hour: data?.temporal_data?.clicks_by_hour || [],
                                        clicks_by_day_of_week: data?.temporal_data?.clicks_by_day_of_week || []
                                    },
                                    geographic: {
                                        top_countries: (data?.geographic_data?.top_countries || []).map(country => ({
                                            ...country,
                                            iso_code: country.country.substring(0, 2).toUpperCase(),
                                            currency: 'USD'
                                        })),
                                        top_states: [],
                                        top_cities: (data?.geographic_data?.top_cities || []).map(city => ({
                                            ...city,
                                            state: 'Unknown',
                                            country: 'Unknown'
                                        })),
                                        heatmap_data: []
                                    },
                                    audience: {
                                        device_breakdown: data?.audience_data?.device_breakdown || []
                                    },
                                    insights: []
                                }}
                                variant="dashboard"
                                height={300}
                                showAllCharts={false}
                            />
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <TopLinks
                                links={(data?.top_links || []).map(link => ({
                                    id: link.id,
                                    title: link.title,
                                    slug: link.short_url || `link-${link.id}`,
                                    original_url: link.original_url || '',
                                    shorted_url: link.short_url,
                                    clicks: link.clicks,
                                    is_active: link.is_active
                                }))}
                                maxItems={5}
                                title="🏆 Top Links"
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Informações de qualidade dos dados */}
            {stats && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Qualidade dos dados: {stats.dataQuality} •
                        Última atualização: {new Date(stats.lastUpdate).toLocaleTimeString()} •
                        {stats.totalMetrics} métricas disponíveis
                        {isRealtime && " • Tempo real ativo"}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default DashboardAnalytics;
