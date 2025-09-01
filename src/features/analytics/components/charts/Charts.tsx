import { Grid, Box, Button } from '@mui/material';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { DemoCharts } from '@/shared/ui/base/DemoCharts';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';
import { ChartsProps } from '../types';
import { useState } from 'react';
import {
    createSpacingUtils,
    createGlassCard,
    createPresetShadows,
    createPresetAnimations,
    createComponentColorSet,
    getThemeColor
} from '@/lib/theme';

/**
 * 📊 CHARTS COM STYLED COMPONENTS
 * Gráficos unificados com melhor tratamento de dados e erro
 */
export function Charts({ data, variant = 'full', height = 300, showAllCharts = true }: ChartsProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [showDemo, setShowDemo] = useState(false);

    // Usa utilitários de tema
    const spacing = createSpacingUtils(theme);
    const shadows = createPresetShadows(theme);
    const animations = createPresetAnimations(theme);
    const primaryColors = createComponentColorSet(theme, 'primary');
    const secondaryColors = createComponentColorSet(theme, 'secondary');
    const successColors = createComponentColorSet(theme, 'success');
    const infoColors = createComponentColorSet(theme, 'info');

    // Verificação de segurança para dados
    if (!data) {
        return (
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    xs={12}
                >
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

    // Função utilitária para verificar dados
    const checkDataAvailability = () => {
        const hasTemporalData = data.temporal && (
            (data.temporal.clicks_by_hour?.length > 0) ||
            (data.temporal.clicks_by_day_of_week?.length > 0)
        );

        const hasGeographicData = data.geographic && (
            (data.geographic.top_countries?.length > 0) ||
            (data.geographic.top_cities?.length > 0)
        );

        const hasDeviceData = data.audience?.device_breakdown?.length > 0;

        return { hasTemporalData, hasGeographicData, hasDeviceData };
    };

    const { hasTemporalData, hasGeographicData, hasDeviceData } = checkDataAvailability();

    // Debug apenas se houver problemas
    if (import.meta.env.DEV && !hasTemporalData && !hasGeographicData && !hasDeviceData) {
        console.warn('📊 Charts: Nenhum dado disponível para gráficos');
    }

    return (
        <Grid
            container
            spacing={3}
            sx={{
                ...animations.fadeIn,
                mb: 3
            }}
        >
            {/* Gráficos principais - sempre mostrados se há dados */}
            {hasTemporalData && (
                <>
                    {/* Gráfico Principal - Cliques por Hora */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                ...animations.cardHover
                            }}
                        >
                            <ChartCard title="📈 Cliques por Hora do Dia">
                                <Box sx={{ p: 2 }}>
                                    <ApexChartWrapper
                                        type="area"
                                        height={height}
                                        {...formatAreaChart(
                                            data.temporal?.clicks_by_hour || [],
                                            'hour',
                                            'clicks',
                                            primaryColors.main,
                                            isDark
                                        )}
                                    />
                                </Box>
                            </ChartCard>
                        </Box>
                    </Grid>

                    {/* Gráfico de Dias da Semana */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                ...animations.cardHover
                            }}
                        >
                            <ChartCard title="📅 Cliques por Dia da Semana">
                                <Box sx={{ p: 2 }}>
                                    <ApexChartWrapper
                                        type="bar"
                                        height={height}
                                        {...formatBarChart(
                                            data.temporal?.clicks_by_day_of_week || [],
                                            'day_name',
                                            'clicks',
                                            secondaryColors.main,
                                            false,
                                            isDark
                                        )}
                                    />
                                </Box>
                            </ChartCard>
                        </Box>
                    </Grid>
                </>
            )}

            {/* Gráficos de dispositivos e países - dashboard e full */}
            {(variant === 'dashboard' || variant === 'full') && (hasDeviceData || hasGeographicData) && (
                <>
                    {/* Dispositivos */}
                    {hasDeviceData && (
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    ...animations.cardHover
                                }}
                            >
                                <ChartCard title="📱 Dispositivos">
                                    <Box sx={{ p: 2 }}>
                                        <ApexChartWrapper
                                            type="donut"
                                            height={height}
                                            {...formatPieChart(
                                                (data.audience?.device_breakdown || []).map((item: Record<string, unknown>) => ({
                                                    device: item.device,
                                                    clicks: item.clicks
                                                })) as Record<string, unknown>[],
                                                'device',
                                                'clicks',
                                                isDark
                                            )}
                                        />
                                    </Box>
                                </ChartCard>
                            </Box>
                        </Grid>
                    )}

                    {/* Países */}
                    {hasGeographicData && (
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    ...animations.cardHover
                                }}
                            >
                                <ChartCard title="🌍 Top Países">
                                    <Box sx={{ p: 2 }}>
                                        <ApexChartWrapper
                                            type="bar"
                                            height={height}
                                            {...formatBarChart(
                                                data.geographic?.top_countries?.slice(0, 10) || [],
                                                'country',
                                                'clicks',
                                                successColors.main,
                                                true,
                                                isDark
                                            )}
                                        />
                                    </Box>
                                </ChartCard>
                            </Box>
                        </Grid>
                    )}
                </>
            )}

            {/* Gráficos avançados - apenas analytics e full */}
            {(variant === 'analytics' || variant === 'full') && showAllCharts && hasGeographicData && (
                <>
                    {/* Estados/Regiões */}
                    {data.geographic?.top_states && data.geographic.top_states.length > 0 && (
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    ...animations.cardHover
                                }}
                            >
                                <ChartCard title="🏛️ Top Estados/Regiões">
                                    <Box sx={{ p: 2 }}>
                                        <ApexChartWrapper
                                            type="bar"
                                            height={height}
                                            {...formatBarChart(
                                                data.geographic.top_states.slice(0, 8) as Record<string, unknown>[],
                                                'state',
                                                'clicks',
                                                infoColors.main,
                                                true,
                                                isDark
                                            )}
                                        />
                                    </Box>
                                </ChartCard>
                            </Box>
                        </Grid>
                    )}

                    {/* Cidades */}
                    {data.geographic?.top_cities && data.geographic.top_cities.length > 0 && (
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={6}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    ...animations.cardHover
                                }}
                            >
                                <ChartCard title="🏙️ Top Cidades">
                                    <Box sx={{ p: 2 }}>
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
                                    </Box>
                                </ChartCard>
                            </Box>
                        </Grid>
                    )}
                </>
            )}

            {/* Se não há dados suficientes para gráficos */}
            {!hasTemporalData && !hasGeographicData && !hasDeviceData && (
                <Grid
                    item
                    xs={12}
                >
                    {showDemo ? (
                        <Box
                            sx={{
                                ...(createGlassCard(theme, 'neutral') as any),
                                p: 3,
                                ...animations.fadeIn
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    mb: 3
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowDemo(false)}
                                    size="small"
                                    sx={{
                                        ...animations.buttonHover,
                                        borderColor: primaryColors.main,
                                        color: primaryColors.main,
                                        '&:hover': {
                                            borderColor: primaryColors.dark,
                                            backgroundColor: primaryColors.alpha10
                                        }
                                    }}
                                >
                                    ← Voltar ao Estado Vazio
                                </Button>
                            </Box>
                            <DemoCharts height={height} />
                        </Box>
                    ) : (
                        <EmptyState
                            variant="charts"
                            height={400}
                            showActions={true}
                            primaryAction={{
                                label: 'Ver Preview dos Gráficos',
                                onClick: () => setShowDemo(true)
                            }}
                            secondaryAction={{
                                label: 'Criar Primeiro Link',
                                onClick: () => (window.location.href = '/link')
                            }}
                        />
                    )}
                </Grid>
            )}
        </Grid>
    );
}

export default Charts;
