import { Grid, Button, Box } from '@mui/material';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { DemoCharts } from '@/shared/ui/base/DemoCharts';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';
import { ChartsProps } from '../types';
import { useState } from 'react';

// Styled Components
import {
    ChartsContainer,
    ChartSection,
    ChartTitle,
    MainChartsWrapper,
    DeviceCountryWrapper,
    AdvancedChartsWrapper,
    ChartsLoadingContainer,
    ChartsLoadingIcon,
    ChartsLoadingText,
    EmptyStateContainer,
    DemoControlsContainer,
    BackButton,
    ChartCardWrapper,
    ChartContentArea,
    ResponsiveChartsGrid
} from './Charts.styled';

/**
 * 📊 CHARTS COM STYLED COMPONENTS
 * Gráficos unificados com melhor tratamento de dados e erro
 */
export function Charts({
    data,
    variant = 'full',
    height = 300,
    showAllCharts = true
}: ChartsProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [showDemo, setShowDemo] = useState(false);

    // Verificação de segurança para dados
    if (!data) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <EmptyState
                        variant="charts"
                        height={400}
                        title="Carregando Gráficos..."
                        description="Aguarde enquanto carregamos os dados dos seus gráficos."
                        icon="⏳"
                    />
                </Grid>
            </Grid>
        );
    }

    // Verificar se há dados temporais válidos
    const hasTemporalData = data.temporal && (
        (data.temporal.clicks_by_hour && data.temporal.clicks_by_hour.length > 0) ||
        (data.temporal.clicks_by_day_of_week && data.temporal.clicks_by_day_of_week.length > 0)
    );

    // Verificar se há dados geográficos válidos
    const hasGeographicData = data.geographic && (
        (data.geographic.top_countries && data.geographic.top_countries.length > 0) ||
        (data.geographic.top_cities && data.geographic.top_cities.length > 0)
    );

    // Verificar se há dados de dispositivos
    const hasDeviceData = data.audience &&
        data.audience.device_breakdown &&
        data.audience.device_breakdown.length > 0;

    return (
        <ResponsiveChartsGrid container spacing={2} variant={variant}>
            {/* Gráficos principais - sempre mostrados se há dados */}
            {hasTemporalData && (
                <MainChartsWrapper>
                    {/* Gráfico Principal - Cliques por Hora */}
                    <Grid item xs={12} lg={6}>
                        <ChartCardWrapper>
                            <ChartCard title="📈 Cliques por Hora do Dia">
                                <ChartContentArea>
                                    <ApexChartWrapper
                                        type="area"
                                        height={height}
                                        {...formatAreaChart(
                                            data.temporal?.clicks_by_hour || [],
                                            'hour',
                                            'clicks',
                                            theme.palette.primary.main,
                                            isDark
                                        )}
                                    />
                                </ChartContentArea>
                            </ChartCard>
                        </ChartCardWrapper>
                    </Grid>

                    {/* Gráfico de Dias da Semana */}
                    <Grid item xs={12} lg={6}>
                        <ChartCardWrapper>
                            <ChartCard title="📅 Cliques por Dia da Semana">
                                <ChartContentArea>
                                    <ApexChartWrapper
                                        type="bar"
                                        height={height}
                                        {...formatBarChart(
                                            data.temporal?.clicks_by_day_of_week || [],
                                            'day_name',
                                            'clicks',
                                            theme.palette.secondary.main,
                                            false,
                                            isDark
                                        )}
                                    />
                                </ChartContentArea>
                            </ChartCard>
                        </ChartCardWrapper>
                    </Grid>
                </MainChartsWrapper>
            )}

            {/* Gráficos de dispositivos e países - dashboard e full */}
            {(variant === 'dashboard' || variant === 'full') && (hasDeviceData || hasGeographicData) && (
                <DeviceCountryWrapper>
                    {/* Dispositivos */}
                    {hasDeviceData && (
                        <Grid item xs={12} md={6}>
                            <ChartCard title="📱 Dispositivos">
                                <ApexChartWrapper
                                    type="donut"
                                    height={height}
                                    {...formatPieChart(
                                        (data.audience?.device_breakdown || []).map((item: any) => ({
                                            device: item.device,
                                            clicks: item.clicks
                                        })) as Record<string, unknown>[],
                                        'device',
                                        'clicks',
                                        isDark
                                    )}
                                />
                            </ChartCard>
                        </Grid>
                    )}

                    {/* Países */}
                    {hasGeographicData && (
                        <Grid item xs={12} md={6}>
                            <ChartCard title="🌍 Top Países">
                                <ApexChartWrapper
                                    type="bar"
                                    height={height}
                                    {...formatBarChart(
                                        data.geographic?.top_countries?.slice(0, 10) || [],
                                        'country',
                                        'clicks',
                                        theme.palette.success.main,
                                        true,
                                        isDark
                                    )}
                                />
                            </ChartCard>
                        </Grid>
                    )}
                </DeviceCountryWrapper>
            )}

            {/* Gráficos avançados - apenas analytics e full */}
            {(variant === 'analytics' || variant === 'full') && showAllCharts && hasGeographicData && (
                <AdvancedChartsWrapper>
                    {/* Estados/Regiões */}
                    {data.geographic?.top_states && data.geographic.top_states.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <ChartCard title="🏛️ Top Estados/Regiões">
                                <ApexChartWrapper
                                    type="bar"
                                    height={height}
                                    {...formatBarChart(
                                        data.geographic.top_states.slice(0, 8) as Record<string, unknown>[],
                                        'state',
                                        'clicks',
                                        theme.palette.info.main,
                                        true,
                                        isDark
                                    )}
                                />
                            </ChartCard>
                        </Grid>
                    )}

                    {/* Cidades */}
                    {data.geographic?.top_cities && data.geographic.top_cities.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <ChartCard title="🏙️ Top Cidades">
                                <ApexChartWrapper
                                    type="donut"
                                    height={height}
                                    {...formatPieChart(
                                        data.geographic.top_cities.slice(0, 8) as Record<string, unknown>[],
                                        'city',
                                        'clicks',
                                        isDark
                                    )}
                                />
                            </ChartCard>
                        </Grid>
                    )}
                </AdvancedChartsWrapper>
            )}

            {/* Se não há dados suficientes para gráficos */}
            {!hasTemporalData && !hasGeographicData && !hasDeviceData && (
                <Grid item xs={12}>
                    {showDemo ? (
                        <Box>
                            <DemoControlsContainer>
                                <BackButton
                                    variant="outlined"
                                    onClick={() => setShowDemo(false)}
                                    size="small"
                                >
                                    ← Voltar ao Estado Vazio
                                </BackButton>
                            </DemoControlsContainer>
                            <DemoCharts variant={variant} height={height} />
                        </Box>
                    ) : (
                        <EmptyState
                            variant="charts"
                            height={400}
                            showActions={true}
                            primaryAction={{
                                label: "Ver Preview dos Gráficos",
                                onClick: () => setShowDemo(true)
                            }}
                            secondaryAction={{
                                label: "Criar Primeiro Link",
                                onClick: () => window.location.href = '/link'
                            }}
                        />
                    )}
                </Grid>
            )}
        </ResponsiveChartsGrid>
    );
}

export default Charts;