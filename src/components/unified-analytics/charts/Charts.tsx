'use client';

import { Grid, Box, Typography } from '@mui/material';
import { ChartCard } from '@/components/ui/ChartCard';
import ApexChartWrapper from '@/components/charts/ApexChartWrapper';
import { formatAreaChart, formatBarChart, formatPieChart } from '@/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';
import { ChartsProps } from '../types';

/**
 * Gráficos unificados que se adaptam ao contexto
 * Renderiza diferentes conjuntos de gráficos baseado na variante
 */
export function Charts({
    data,
    variant = 'full',
    height = 300,
    showAllCharts = true
}: ChartsProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Verificação de segurança para dados null/undefined
    if (!data) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    📊 Carregando gráficos...
                </Typography>
            </Box>
        );
    }

    // Gráficos principais (sempre mostrados)
    const mainCharts = (
        <>
            {/* Gráfico Principal - Cliques por Hora */}
            <Grid item xs={12} lg={6}>
                <ChartCard title="📈 Cliques por Hora do Dia">
                    <ApexChartWrapper
                        type="area"
                        height={height}
                        {...formatAreaChart(
                            (data.temporal?.clicks_by_hour || []) as unknown as Record<string, unknown>[],
                            'label',
                            'clicks',
                            theme.palette.primary.main,
                            isDark
                        )}
                    />
                </ChartCard>
            </Grid>

            {/* Gráfico de Dias da Semana */}
            <Grid item xs={12} lg={6}>
                <ChartCard title="📅 Cliques por Dia da Semana">
                    <ApexChartWrapper
                        type="bar"
                        height={height}
                        {...formatBarChart(
                            (data.temporal?.clicks_by_day_of_week || []) as unknown as Record<string, unknown>[],
                            'day_name',
                            'clicks',
                            theme.palette.secondary.main,
                            true,
                            isDark
                        )}
                    />
                </ChartCard>
            </Grid>
        </>
    );

    // Gráficos de dispositivos e países (moderadamente importantes)
    const deviceCountryCharts = (
        <>
            {/* Gráfico de Dispositivos */}
            <Grid item xs={12} lg={6}>
                <ChartCard title="📱 Distribuição por Dispositivo">
                    <ApexChartWrapper
                        type="pie"
                        height={height}
                        {...formatPieChart(
                            (data.audience?.device_breakdown || []) as unknown as Record<string, unknown>[],
                            'device',
                            'clicks',
                            isDark
                        )}
                    />
                </ChartCard>
            </Grid>

            {/* Gráfico de Países */}
            <Grid item xs={12} lg={6}>
                <ChartCard title="🌍 Top Países">
                    <ApexChartWrapper
                        type="bar"
                        height={height}
                        {...formatBarChart(
                            (data.geographic?.top_countries?.slice(0, 8) || []) as unknown as Record<string, unknown>[],
                            'country',
                            'clicks',
                            '#1976d2',
                            true,
                            isDark
                        )}
                    />
                </ChartCard>
            </Grid>
        </>
    );

    // Gráficos avançados (apenas em analytics completo)
    const advancedCharts = (
        <>
            {/* Gráfico de Estados */}
            <Grid item xs={12} lg={6}>
                <ChartCard title="🏛️ Top Estados/Regiões">
                    <ApexChartWrapper
                        type="bar"
                        height={height}
                        {...formatBarChart(
                            (data.geographic?.top_states || []).map(state => ({
                                ...state,
                                label: `${state.state_name || state.state}, ${state.country}`,
                            })) as Record<string, unknown>[],
                            'label',
                            'clicks',
                            '#2e7d32',
                            true,
                            isDark
                        )}
                    />
                </ChartCard>
            </Grid>

            {/* Gráfico de Cidades */}
            <Grid item xs={12} lg={6}>
                <ChartCard title="🏙️ Top Cidades">
                    <ApexChartWrapper
                        type="bar"
                        height={height}
                        {...formatBarChart(
                            (data.geographic?.top_cities || []).map(city => ({
                                ...city,
                                label: `${city.city}, ${city.state}`,
                            })) as Record<string, unknown>[],
                            'label',
                            'clicks',
                            '#dc004e',
                            true,
                            isDark
                        )}
                    />
                </ChartCard>
            </Grid>
        </>
    );

    // Renderização baseada na variante
    return (
        <Grid container spacing={3}>
            {/* Gráficos principais - sempre mostrados */}
            {mainCharts}

            {/* Gráficos de dispositivos e países - dashboard e full */}
            {(variant === 'dashboard' || variant === 'full') && deviceCountryCharts}

            {/* Gráficos avançados - apenas analytics e full */}
            {(variant === 'analytics' || variant === 'full') && showAllCharts && advancedCharts}
        </Grid>
    );
}

export default Charts;
