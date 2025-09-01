'use client';

import React, { useState } from 'react';
import { Box, Tab, Grid } from '@mui/material';
import { Map, Public, Schedule, Devices, Lightbulb, Analytics, Dashboard } from '@mui/icons-material';
import { TabPanel } from '@/shared/ui/base/TabPanel';
import { FuseTabs } from '@/features/analytics/components/specialized/common';
import { LinkAnalyticsData } from '../../types/analytics';

// Importar componentes especializados reutilizáveis
import { RealTimeHeatmapChart } from '@/features/analytics/components/specialized/heatmap';
import { GeographicChart, GeographicInsights } from '@/features/analytics/components/specialized/geographic';
import { TemporalChart, TemporalInsights } from '@/features/analytics/components/specialized/temporal';
import { AudienceChart, AudienceInsights } from '@/features/analytics/components/specialized/audience';
import { BusinessInsights } from '@/features/analytics/components/insights/BusinessInsights';
import { PerformanceAnalysis } from '@/features/analytics/components/analysis/PerformanceAnalysis';

// Importar componentes do dashboard
import { UnifiedMetrics } from '@/features/analytics/components/metrics/UnifiedMetrics';
import { Charts } from '@/features/analytics/components/charts/Charts';
import TabDescription from '@/shared/ui/base/TabDescription';

interface LinkAnalyticsTabsProps {
    data: LinkAnalyticsData | null;
    linkId: string;
    loading?: boolean;
}

/**
 * 📋 Tabs específicas para analytics de link individual
 * Reutiliza componentes especializados do módulo analytics
 * Segue padrões arquiteturais: < 200 linhas, usa TabPanel base
 */
export function LinkAnalyticsTabs({ data, linkId, loading = false }: LinkAnalyticsTabsProps) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!data?.has_data) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Analytics sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Box sx={{ typography: 'h6', mb: 1 }}>🚀 Analytics Detalhados em Preparação</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                    Compartilhe seu link para desbloquear análises geográficas, temporais e de audiência!
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Box>
                <FuseTabs
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab
                        label="Dashboard"
                        icon={<Dashboard />}
                    />
                    <Tab
                        label="Mapa de Calor"
                        icon={<Map />}
                    />
                    <Tab
                        label="Geografia"
                        icon={<Public />}
                    />
                    <Tab
                        label="Temporal"
                        icon={<Schedule />}
                    />
                    <Tab
                        label="Audiência"
                        icon={<Devices />}
                    />
                    <Tab
                        label="Performance"
                        icon={<Analytics />}
                    />
                    <Tab
                        label="Insights"
                        icon={<Lightbulb />}
                    />
                </FuseTabs>
            </Box>

            {/* Tab Panels */}
            {/* Dashboard Tab */}
            <TabPanel
                value={tabValue}
                index={0}
            >
                <Box sx={{ mb: 2 }}>
                    <TabDescription
                        icon="🎯"
                        title="Dashboard do Link"
                        description="Visão geral consolidada do link com métricas essenciais e performance em tempo real."
                        highlight="Perfeito para acompanhar o desempenho individual"
                    />
                </Box>

                <Grid container spacing={3}>
                    {/* Métricas Unificadas */}
                    <Grid item xs={12}>
                        <UnifiedMetrics
                            data={data}
                            linksData={[]} // Para link individual, não precisa de array
                            categories={['analytics']}
                            showTitle={true}
                            title="📊 Métricas Principais"
                            maxCols={4}
                        />
                    </Grid>

                    {/* Charts */}
                    <Grid item xs={12}>
                        <Charts
                            data={data}
                            variant="analytics"
                            height={450}
                            showAllCharts={true}
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Mapa de Calor Tab */}
            <TabPanel
                value={tabValue}
                index={1}
            >
                <RealTimeHeatmapChart
                    linkId={linkId}
                    height={600}
                    title="Mapa de Calor - Visualização em Tempo Real"
                    enableRealtime={true}
                    refreshInterval={30000}
                    showControls={true}
                    showStats={true}
                />
            </TabPanel>

            <TabPanel
                value={tabValue}
                index={2}
            >
                <Box>
                    <GeographicChart
                        countries={
                            data?.geographic?.top_countries?.map((c) => ({
                                ...c,
                                iso_code: c.iso_code || '',
                                currency: c.currency || ''
                            })) || []
                        }
                        states={
                            data?.geographic?.top_states?.map((s) => ({
                                ...s,
                                country: s.country || '',
                                state_name: s.state_name || s.state
                            })) || []
                        }
                        cities={
                            data?.geographic?.top_cities?.map((c) => ({
                                ...c,
                                state: c.state || '',
                                country: c.country || ''
                            })) || []
                        }
                        totalClicks={data?.overview?.total_clicks || 0}
                    />
                    <Box sx={{ mt: 3 }}>
                        <GeographicInsights
                            data={data?.geographic?.heatmap_data || []}
                            countries={
                                data?.geographic?.top_countries?.map((c) => ({
                                    country: c.country,
                                    iso_code: c.iso_code || '',
                                    clicks: c.clicks,
                                    currency: c.currency || ''
                                })) || []
                            }
                            states={
                                data?.geographic?.top_states?.map((s) => ({
                                    country: s.country || '',
                                    state: s.state,
                                    state_name: s.state_name || s.state,
                                    clicks: s.clicks
                                })) || []
                            }
                            cities={
                                data?.geographic?.top_cities?.map((c) => ({
                                    city: c.city,
                                    state: c.state || '',
                                    country: c.country || '',
                                    clicks: c.clicks
                                })) || []
                            }
                        />
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel
                value={tabValue}
                index={3}
            >
                <Box>
                    <TemporalChart
                        hourlyData={data?.temporal?.clicks_by_hour || []}
                        weeklyData={
                            data?.temporal?.clicks_by_day_of_week?.map((d) => ({
                                day: parseInt(d.day) || 0,
                                clicks: d.clicks,
                                day_name: d.day_name || d.day
                            })) || []
                        }
                    />
                    <Box sx={{ mt: 3 }}>
                        <TemporalInsights
                            hourlyData={data?.temporal?.clicks_by_hour || []}
                            weeklyData={
                                data?.temporal?.clicks_by_day_of_week?.map((d) => ({
                                    day: parseInt(d.day) || 0,
                                    clicks: d.clicks,
                                    day_name: d.day_name || d.day
                                })) || []
                            }
                        />
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel
                value={tabValue}
                index={4}
            >
                <Box>
                    <AudienceChart
                        deviceBreakdown={data?.audience?.device_breakdown || []}
                        totalClicks={data?.overview?.total_clicks || 0}
                    />
                    <Box sx={{ mt: 3 }}>
                        <AudienceInsights
                            deviceBreakdown={data?.audience?.device_breakdown || []}
                            totalClicks={data?.overview?.total_clicks || 0}
                        />
                    </Box>
                </Box>
            </TabPanel>

            <TabPanel
                value={tabValue}
                index={5}
            >
                <PerformanceAnalysis
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data={data as any}
                    linksData={[]} // Para link individual, não precisa de array
                />
            </TabPanel>

            <TabPanel
                value={tabValue}
                index={6}
            >
                <BusinessInsights insights={data?.insights || []} />
            </TabPanel>
        </Box>
    );
}

export default LinkAnalyticsTabs;
