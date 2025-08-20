'use client';

import { useState } from 'react';
import { Box, Tabs, Tab, Alert, CircularProgress, Button } from '@mui/material';
import { Header } from './Header';
import { UnifiedMetrics } from './metrics/UnifiedMetrics';
import { Charts } from './charts/Charts';
import { GeographicAnalysis } from './analysis/GeographicAnalysis';
import { TemporalAnalysis } from './analysis/TemporalAnalysis';
import { AudienceAnalysis } from './analysis/AudienceAnalysis';
import { HeatmapAnalysis } from './analysis/HeatmapAnalysis';
import { BusinessInsights } from './analysis/BusinessInsights';
import { PerformanceAnalysis } from './analysis/PerformanceAnalysis';
import { TopLinks } from './dashboard/TopLinks';
import { TabPanel } from '../ui/TabPanel';
import TabDescription from '../ui/TabDescription';
import { AnalyticsProps } from './types';
import { Grid } from '@mui/material';

/**
 * Analytics unificado com todas as funcionalidades avançadas
 * Mantém especialização em análises detalhadas
 */
export function Analytics({
    data,
    loading = false,
    error = null,
    linkId,
    showHeader = true,
    showTabs = true,
    linksData = [],
    showDashboardTab = true
}: AnalyticsProps) {
    const [tabValue, setTabValue] = useState(0);

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
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    📊 Carregando analytics avançados...
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained">
                    Tentar Novamente
                </Button>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ p: 3 }}>
                {showHeader && (
                    <Header
                        variant="analytics"
                        title="Analytics"
                        subtitle="Aguardando dados para análise detalhada"
                    />
                )}
                <Alert severity="info">
                    📈 Analytics em preparação. Compartilhe seus links para desbloquear insights detalhados!
                </Alert>
            </Box>
        );
    }

    const tabLabels = [
        ...(showDashboardTab ? [{ label: 'Dashboard', icon: '🎯' }] : []),
        { label: 'Visão Geral', icon: '📊' },
        { label: 'Performance', icon: '⚡' },
        { label: 'Geografia', icon: '🌍' },
        { label: 'Temporal', icon: '⏰' },
        { label: 'Audiência', icon: '👥' },
        { label: 'Heatmap', icon: '🔥' },
        { label: 'Insights', icon: '💡' }
    ];

    // Calcular métricas dos links para Dashboard tab
    const totalLinks = linksData.length;
    const activeLinks = linksData.filter((link) => link.is_active).length;
    const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const avgClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header unificado com tema de analytics */}
            {showHeader && (
                <Header
                    variant="analytics"
                    title="Analytics "
                    subtitle="Análise detalhada e insights de performance"
                />
            )}

            {/* Tabs para diferentes análises */}
            {showTabs ? (
                <Box>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': {
                                minHeight: 56,
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }
                        }}
                    >
                        {tabLabels.map((tab, index) => (
                            <Tab
                                key={index}
                                label={tab.label}
                                icon={<span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>}
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>

                    {/* Painéis das tabs */}
                    {showDashboardTab && (
                        <TabPanel value={tabValue} index={0}>
                            {/* Descrição da Tab Dashboard */}
                            <TabDescription
                                icon="heroicons-outline:chart-pie"
                                title="Dashboard Principal"
                                description="Visão geral consolidada dos seus links com métricas essenciais e performance em tempo real."
                                highlight="Perfeito para acompanhar o desempenho geral."
                            />

                            {/* Tab Dashboard - Funcionalidades do dashboard integradas */}
                            <Grid container spacing={3}>
                                {/* Métricas dos Links */}
                                <Grid item xs={12}>
                                    <UnifiedMetrics
                                        data={data}
                                        linksData={linksData}
                                        categories={['dashboard', 'analytics']}
                                        showTitle={true}
                                        title="📊 Visão Geral do Dashboard"
                                    />
                                </Grid>

                                {/* Primeira linha - Gráficos e Top Links */}
                                <Grid item xs={12} lg={8}>
                                    <Charts
                                        data={data}
                                        variant="dashboard"
                                        height={350}
                                        showAllCharts={false}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={4}>
                                    <TopLinks
                                        links={linksData}
                                        maxItems={5}
                                        title="🏆 Top Links"
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                    )}

                    <TabPanel value={tabValue} index={showDashboardTab ? 1 : 0}>
                        {/* Descrição da Tab Visão Geral */}
                        <TabDescription
                            icon="heroicons-outline:chart-bar"
                            title="Visão Geral Analytics"
                            description="Análise completa dos dados dos seus links com gráficos detalhados e tendências de cliques."
                            highlight="Ideal para análises profundas."
                        />

                        <Charts
                            data={data}
                            variant="analytics"
                            height={350}
                            showAllCharts={true}
                        />
                    </TabPanel>

                    <TabPanel value={tabValue} index={showDashboardTab ? 2 : 1}>
                        {/* Descrição da Tab Performance */}
                        <TabDescription
                            icon="heroicons-outline:bolt"
                            title="Performance dos Links"
                            description="Monitoramento em tempo real da velocidade e disponibilidade dos seus links encurtados."
                            highlight="Essencial para garantir qualidade."
                        />

                        <PerformanceAnalysis data={data} linksData={linksData} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={showDashboardTab ? 3 : 2}>
                        <TabDescription
                            icon="heroicons-outline:globe-alt"
                            title="Análise Geográfica"
                            description="Mapeamento global dos seus cliques por países, estados e cidades."
                            highlight="Descubra onde estão seus usuários."
                        />

                        <GeographicAnalysis data={data} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={showDashboardTab ? 4 : 3}>
                        <TabDescription
                            icon="heroicons-outline:clock"
                            title="Análise Temporal"
                            description="Tendências de cliques ao longo do tempo com padrões horários, diários e semanais."
                            highlight="Entenda quando seus links são mais acessados."
                        />

                        <TemporalAnalysis data={data} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={showDashboardTab ? 5 : 4}>
                        <TabDescription
                            icon="heroicons-outline:users"
                            title="Análise de Audiência"
                            description="Perfil dos usuários que clicam nos seus links: dispositivos, navegadores e comportamento."
                            highlight="Conheça melhor sua audiência."
                        />

                        <AudienceAnalysis data={data} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={showDashboardTab ? 6 : 5}>
                        <TabDescription
                            icon="heroicons-outline:fire"
                            title="Mapa de Calor"
                            description="Visualização em tempo real das áreas de maior engajamento nos seus links."
                            highlight="Spots de alta atividade."
                        />

                        <HeatmapAnalysis data={data} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={showDashboardTab ? 7 : 6}>
                        <TabDescription
                            icon="heroicons-outline:light-bulb"
                            title="Insights de Negócio"
                            description="Análises avançadas e recomendações inteligentes baseadas nos dados dos seus links."
                            highlight="Transforme dados em estratégia."
                        />

                        <BusinessInsights data={data} linkId={linkId} />
                    </TabPanel>
                </Box>
            ) : (
                // Sem tabs - mostrar tudo em uma visão
                <Box>
                    <Charts
                        data={data}
                        variant="full"
                        height={300}
                        showAllCharts={true}
                    />
                </Box>
            )}
        </Box>
    );
}

export default Analytics;
