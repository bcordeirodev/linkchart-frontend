'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    Button,
    Tabs,
    Tab,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import {
    ArrowBack,
    Analytics,
    TrendingUp,
    Public,
    Devices,
    Schedule,
    Lightbulb,
    Map
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import MetricCard from '@/components/ui/MetricCard';
import PageBreadcrumb from '@/components/utilities/PageBreadcrumb';
import { EnhancedHeatmapChart } from '../specialized/heatmap';
import { GeographicChart, GeographicInsights } from '../specialized/geographic';
import { TemporalChart, TemporalInsights } from '../specialized/temporal';
import { AudienceChart, AudienceInsights } from '../specialized/audience';
import { BusinessInsights } from '../specialized/insights';

interface EnhancedAnalyticsProps {
    linkId: string;
}

export function EnhancedAnalytics({ linkId }: EnhancedAnalyticsProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const { data, loading, error, refetch } = useEnhancedAnalytics(linkId);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Carregando analytics avançados...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button onClick={refetch} variant="contained">
                    Tentar Novamente
                </Button>
            </Box>
        );
    }

    if (!data || !data.has_data) {
        return (
            <Box sx={{ p: 3 }}>
                {/* Breadcrumb */}
                <Box sx={{ mb: 2 }}>
                    <PageBreadcrumb skipHome />
                </Box>

                {/* Header */}
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            📊 Analytics Avançados
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {data?.link_info?.title || 'Link Analytics'}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/link')}
                    >
                        Voltar para Lista
                    </Button>
                </Box>

                {/* Estado sem dados */}
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Analytics sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            🚀 Analytics Avançados em Preparação
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Compartilhe seu link para desbloquear insights geográficos, temporais e de audiência!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Em breve você terá acesso a mapas de calor, análise por países, horários de pico e muito mais.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Box sx={{ mb: 2 }}>
                <PageBreadcrumb skipHome />
            </Box>

            {/* Header */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        📊 Analytics
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {data?.link_info?.title || data?.link_info?.original_url}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/link')}
                >
                    Voltar para Lista
                </Button>
            </Box>

            {/* Métricas Principais */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total de Cliques"
                        value={String(data?.overview?.total_clicks || 0)}
                        icon={<TrendingUp />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Visitantes Únicos"
                        value={String(data?.overview?.unique_visitors || 0)}
                        icon={<Public />}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Países Alcançados"
                        value={String(data?.overview?.countries_reached || 0)}
                        icon={<Public />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Cliques/Dia"
                        value={String(data?.overview?.avg_daily_clicks || 0)}
                        subtitle="Média diária"
                        icon={<Analytics />}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Tabs de Analytics */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Mapa de Calor" icon={<Map />} />
                    <Tab label="Geografia" icon={<Public />} />
                    <Tab label="Temporal" icon={<Schedule />} />
                    <Tab label="Audiência" icon={<Devices />} />
                    <Tab label="Insights" icon={<Lightbulb />} />
                </Tabs>
            </Box>

            {/* Conteúdo das Tabs */}
            {tabValue === 0 && (
                <EnhancedHeatmapChart data={data?.geographic?.heatmap_data || []} />
            )}

            {tabValue === 1 && (
                <Box>
                    <GeographicChart
                        countries={data?.geographic?.top_countries || []}
                        states={data?.geographic?.top_states || []}
                        cities={data?.geographic?.top_cities || []}
                        totalClicks={data?.overview?.total_clicks || 0}
                    />
                    <GeographicInsights
                        data={data?.geographic?.heatmap_data || []}
                        countries={data?.geographic?.top_countries || []}
                        states={data?.geographic?.top_states || []}
                        cities={data?.geographic?.top_cities || []}
                    />
                </Box>
            )}

            {tabValue === 2 && (
                <Box>
                    <TemporalChart
                        hourlyData={data?.temporal?.clicks_by_hour || []}
                        weeklyData={data?.temporal?.clicks_by_day_of_week || []}
                    />
                    <TemporalInsights
                        hourlyData={data?.temporal?.clicks_by_hour || []}
                        weeklyData={data?.temporal?.clicks_by_day_of_week || []}
                    />
                </Box>
            )}

            {tabValue === 3 && (
                <Box>
                    <AudienceChart
                        deviceBreakdown={data?.audience?.device_breakdown || []}
                        totalClicks={data?.overview?.total_clicks || 0}
                    />
                    <AudienceInsights
                        deviceBreakdown={data?.audience?.device_breakdown || []}
                        totalClicks={data?.overview?.total_clicks || 0}
                    />
                </Box>
            )}

            {tabValue === 4 && (
                <BusinessInsights insights={data?.insights || []} />
            )}
        </Box>
    );
}
