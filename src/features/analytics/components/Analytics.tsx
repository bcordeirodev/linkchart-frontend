import { useState } from 'react';
import { Box, Alert, CircularProgress, Button, useTheme, Fade, Tab, Typography } from '@mui/material';
import { Header } from './Header';
import { UnifiedMetrics } from './metrics/UnifiedMetrics';
import { Charts } from './charts/Charts';
import { GeographicAnalysis } from './analysis/GeographicAnalysis';
import { TemporalAnalysis } from './analysis/TemporalAnalysis';
import { AudienceAnalysis } from './analysis/AudienceAnalysis';
import { HeatmapAnalysis } from './analysis/HeatmapAnalysis';
import { BusinessInsights } from './insights/BusinessInsights';
import { PerformanceAnalysis } from './analysis/PerformanceAnalysis';
import { TopLinks } from './dashboard/TopLinks';
import { TabPanel } from '@/shared/ui/base/TabPanel';
import TabDescription from '@/shared/ui/base/TabDescription';
import { AnalyticsProps } from './types';
import { Grid } from '@mui/material';

// Styled Components
import {
    AnalyticsContainer,
    AnalyticsContent,
    TabPanelContainer,
    LoadingStateContainer,
    LoadingIcon,
    LoadingContent,
    ErrorStateContainer,
    EmptyStateContainer,
    TabsContainer,
    StyledTabs,
    TabLabel,
    SectionContainer,
    GridSection,
    FadeInBox
} from './styles/Analytics.styled';

/**
 * 🎨 ANALYTICS COMPLETAMENTE REDESENHADO
 * Interface moderna com melhor organização visual e UX
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
    const theme = useTheme();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Loading state melhorado
    if (loading) {
        return (
            <AnalyticsContainer maxWidth="xl">
                <FadeInBox>
                    <LoadingStateContainer elevation={0}>
                        <LoadingIcon>
                            <CircularProgress
                                size={80}
                                thickness={4}
                            />
                        </LoadingIcon>
                        <LoadingContent>
                            <Box className="loading-title">
                                📊 Carregando Analytics Avançados
                            </Box>
                            <Box className="loading-subtitle">
                                Preparando insights detalhados dos seus dados...
                            </Box>
                        </LoadingContent>
                    </LoadingStateContainer>
                </FadeInBox>
            </AnalyticsContainer>
        );
    }

    // Error state melhorado
    if (error) {
        return (
            <AnalyticsContainer maxWidth="xl">
                <FadeInBox>
                    <ErrorStateContainer>
                        <Alert severity="error">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Box>
                                    <Box className="error-header">
                                        ❌ Erro ao carregar Analytics
                                    </Box>
                                    <Box>{error}</Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ ml: 2, flexShrink: 0 }}
                                >
                                    Tentar Novamente
                                </Button>
                            </Box>
                        </Alert>
                    </ErrorStateContainer>
                </FadeInBox>
            </AnalyticsContainer>
        );
    }

    // No data state melhorado
    if (!data) {
        return (
            <AnalyticsContainer maxWidth="xl">
                <AnalyticsContent>
                    {showHeader && (
                        <FadeInBox>
                            <Header
                                variant="analytics"
                                title="Analytics"
                                subtitle="Aguardando dados para análise detalhada"
                            />
                        </FadeInBox>
                    )}
                    <FadeInBox>
                        <EmptyStateContainer elevation={0}>
                            <Box className="empty-icon">📈</Box>
                            <Box className="empty-title">
                                Analytics em Preparação
                            </Box>
                            <Box className="empty-description">
                                Compartilhe seus links para desbloquear insights detalhados sobre performance,
                                audiência e muito mais!
                            </Box>
                        </EmptyStateContainer>
                    </FadeInBox>
                </AnalyticsContent>
            </AnalyticsContainer>
        );
    }

    const tabLabels = [
        ...(showDashboardTab ? [{ label: 'Dashboard', icon: '🎯', description: 'Visão geral consolidada' }] : []),
        { label: 'Visão Geral', icon: '📊', description: 'Métricas principais' },
        { label: 'Performance', icon: '⚡', description: 'Velocidade e disponibilidade' },
        { label: 'Geografia', icon: '🌍', description: 'Análise geográfica' },
        { label: 'Temporal', icon: '⏰', description: 'Tendências temporais' },
        { label: 'Audiência', icon: '👥', description: 'Perfil da audiência' },
        { label: 'Heatmap', icon: '🔥', description: 'Mapa de calor' },
        { label: 'Insights', icon: '💡', description: 'Insights de negócio' }
    ];

    // Calcular métricas dos links para Dashboard tab
    const totalLinks = linksData.length;
    const activeLinks = linksData.filter((link) => link.is_active).length;
    const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const avgClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

    return (
        <AnalyticsContainer maxWidth="xl">
            <AnalyticsContent>
                {/* Header compacto */}
                {showHeader && (
                    <FadeInBox>
                        <Header
                            variant="analytics"
                            title="Analytics Dashboard"
                            subtitle="Análise detalhada e insights de performance dos seus links"
                        />
                    </FadeInBox>
                )}

                {/* Tabs Navigation compacta */}
                {showTabs && (
                    <FadeInBox>
                        <TabsContainer elevation={0}>
                            <StyledTabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                {tabLabels.map((tab, index) => (
                                    <Tab
                                        key={index}
                                        label={
                                            <TabLabel>
                                                <Box className="tab-icon">{tab.icon}</Box>
                                                <Box className="tab-text">{tab.label}</Box>
                                            </TabLabel>
                                        }
                                    />
                                ))}
                            </StyledTabs>
                        </TabsContainer>
                    </FadeInBox>
                )}

                {/* Content Panels */}
                <TabPanelContainer>
                    {/* Dashboard Tab */}
                    {showDashboardTab && (
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ mb: 2 }}>
                                <TabDescription
                                    icon="🎯"
                                    title="Dashboard Principal"
                                    description="Visão geral consolidada dos seus links com métricas essenciais e performance em tempo real."
                                    highlight="Perfeito para acompanhar o desempenho geral"
                                />
                            </Box>

                            <GridSection>
                                <Grid container spacing={2}>
                                    {/* Métricas Unificadas */}
                                    <Grid item xs={12}>
                                        <SectionContainer elevation={0}>
                                            <Box sx={{ p: 2 }}>
                                                <UnifiedMetrics
                                                    data={data}
                                                    linksData={linksData}
                                                    categories={['dashboard']}
                                                    showTitle={true}
                                                    title="📊 Métricas Principais"
                                                    maxCols={4}
                                                />
                                            </Box>
                                        </SectionContainer>
                                    </Grid>

                                    {/* Charts e Top Links */}
                                    <Grid item xs={12} lg={8}>
                                        <SectionContainer elevation={0}>
                                            <Charts
                                                data={data}
                                                variant="dashboard"
                                                height={300}
                                                showAllCharts={false}
                                            />
                                        </SectionContainer>
                                    </Grid>

                                    <Grid item xs={12} lg={4}>
                                        <SectionContainer elevation={0}>
                                            <TopLinks
                                                links={linksData}
                                                maxItems={4}
                                                title="🏆 Top Links"
                                            />
                                        </SectionContainer>
                                    </Grid>
                                </Grid>
                            </GridSection>
                        </TabPanel>
                    )}

                    {/* Visão Geral Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 1 : 0}>
                        <Box sx={{ mb: 2 }}>
                            <TabDescription
                                icon="📊"
                                title="Visão Geral Analytics"
                                description="Métricas detalhadas e análise completa do desempenho dos seus links."
                                highlight="Dados essenciais para tomada de decisão"
                            />
                        </Box>

                        <GridSection>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <SectionContainer elevation={0}>
                                        <Box sx={{ p: 2 }}>
                                            <UnifiedMetrics
                                                data={data}
                                                linksData={linksData}
                                                categories={['analytics']}
                                                showTitle={true}
                                                title="📈 Métricas Analytics"
                                                maxCols={4}
                                            />
                                        </Box>
                                    </SectionContainer>
                                </Grid>

                                <Grid item xs={12}>
                                    <SectionContainer elevation={0}>
                                        <Charts
                                            data={data}
                                            variant="analytics"
                                            height={450}
                                            showAllCharts={true}
                                        />
                                    </SectionContainer>
                                </Grid>
                            </Grid>
                        </GridSection>
                    </TabPanel>

                    {/* Performance Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 2 : 1}>
                        <SectionContainer elevation={0}>
                            <PerformanceAnalysis
                                data={data}
                                linksData={linksData}
                            />
                        </SectionContainer>
                    </TabPanel>

                    {/* Geografia Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 3 : 2}>
                        <SectionContainer elevation={0}>
                            <GeographicAnalysis data={data} />
                        </SectionContainer>
                    </TabPanel>

                    {/* Temporal Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 4 : 3}>
                        <SectionContainer elevation={0}>
                            <TemporalAnalysis data={data} />
                        </SectionContainer>
                    </TabPanel>

                    {/* Audiência Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 5 : 4}>
                        <SectionContainer elevation={0}>
                            <AudienceAnalysis data={data} />
                        </SectionContainer>
                    </TabPanel>

                    {/* Heatmap Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 6 : 5}>
                        <SectionContainer elevation={0}>
                            <HeatmapAnalysis data={data} />
                        </SectionContainer>
                    </TabPanel>

                    {/* Insights Tab */}
                    <TabPanel value={tabValue} index={showDashboardTab ? 7 : 6}>
                        <SectionContainer elevation={0}>
                            <BusinessInsights
                                insights={data?.insights || []}
                            />
                        </SectionContainer>
                    </TabPanel>
                </TabPanelContainer>
            </AnalyticsContent>
        </AnalyticsContainer>
    );
}

export default Analytics;