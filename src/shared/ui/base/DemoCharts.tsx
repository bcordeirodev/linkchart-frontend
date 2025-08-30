import React from 'react';
import { Grid, Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';

const DemoContainer = styled(Box)(({ theme }) => ({
    position: 'relative',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)'
            : 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(25, 118, 210, 0.01) 100%)',
        borderRadius: theme.spacing(2),
        zIndex: 0,
    }
}));

const DemoHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(25, 118, 210, 0.05)',
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
}));

const DemoTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const DemoChip = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    fontSize: '0.75rem',
}));

interface DemoChartsProps {
    variant?: 'full' | 'dashboard' | 'analytics';
    height?: number;
}

/**
 * 🎨 DEMO CHARTS COMPONENT
 * Gráficos de demonstração com dados mock para preview
 */
export const DemoCharts: React.FC<DemoChartsProps> = ({
    variant = 'full',
    height = 300
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Dados mock para demonstração
    const mockData = {
        temporal: {
            clicks_by_hour: [
                { hour: '00:00', clicks: 12 },
                { hour: '01:00', clicks: 8 },
                { hour: '02:00', clicks: 5 },
                { hour: '03:00', clicks: 3 },
                { hour: '04:00', clicks: 2 },
                { hour: '05:00', clicks: 4 },
                { hour: '06:00', clicks: 15 },
                { hour: '07:00', clicks: 28 },
                { hour: '08:00', clicks: 45 },
                { hour: '09:00', clicks: 67 },
                { hour: '10:00', clicks: 89 },
                { hour: '11:00', clicks: 95 },
                { hour: '12:00', clicks: 102 },
                { hour: '13:00', clicks: 87 },
                { hour: '14:00', clicks: 76 },
                { hour: '15:00', clicks: 92 },
                { hour: '16:00', clicks: 85 },
                { hour: '17:00', clicks: 78 },
                { hour: '18:00', clicks: 65 },
                { hour: '19:00', clicks: 52 },
                { hour: '20:00', clicks: 38 },
                { hour: '21:00', clicks: 25 },
                { hour: '22:00', clicks: 18 },
                { hour: '23:00', clicks: 14 }
            ],
            clicks_by_day_of_week: [
                { day_name: 'Segunda', clicks: 245 },
                { day_name: 'Terça', clicks: 312 },
                { day_name: 'Quarta', clicks: 289 },
                { day_name: 'Quinta', clicks: 356 },
                { day_name: 'Sexta', clicks: 423 },
                { day_name: 'Sábado', clicks: 198 },
                { day_name: 'Domingo', clicks: 167 }
            ]
        },
        geographic: {
            top_countries: [
                { country: 'Brasil', clicks: 856 },
                { country: 'Estados Unidos', clicks: 432 },
                { country: 'Portugal', clicks: 234 },
                { country: 'Argentina', clicks: 187 },
                { country: 'México', clicks: 156 }
            ],
            top_cities: [
                { city: 'São Paulo', clicks: 324 },
                { city: 'Rio de Janeiro', clicks: 198 },
                { city: 'Belo Horizonte', clicks: 145 },
                { city: 'Porto Alegre', clicks: 89 },
                { city: 'Salvador', clicks: 67 }
            ]
        },
        audience: {
            device_breakdown: [
                { device: 'Mobile', clicks: 1245 },
                { device: 'Desktop', clicks: 856 },
                { device: 'Tablet', clicks: 234 }
            ]
        }
    };

    return (
        <DemoContainer>
            <DemoHeader>
                <DemoTitle variant="h6">
                    🎨 Preview dos Gráficos
                </DemoTitle>
                <DemoChip
                    label="DEMONSTRAÇÃO"
                    size="small"
                />
            </DemoHeader>

            <Grid container spacing={3}>
                {/* Gráficos principais */}
                <Grid item xs={12} lg={6}>
                    <ChartCard title="📈 Cliques por Hora do Dia">
                        <ApexChartWrapper
                            type="area"
                            height={height}
                            {...formatAreaChart(
                                mockData.temporal.clicks_by_hour,
                                'hour',
                                'clicks',
                                theme.palette.primary.main,
                                isDark
                            )}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <ChartCard title="📅 Cliques por Dia da Semana">
                        <ApexChartWrapper
                            type="bar"
                            height={height}
                            {...formatBarChart(
                                mockData.temporal.clicks_by_day_of_week,
                                'day_name',
                                'clicks',
                                theme.palette.secondary.main,
                                false,
                                isDark
                            )}
                        />
                    </ChartCard>
                </Grid>

                {/* Gráficos de dispositivos e países */}
                {(variant === 'dashboard' || variant === 'full') && (
                    <>
                        <Grid item xs={12} md={6}>
                            <ChartCard title="📱 Dispositivos">
                                <ApexChartWrapper
                                    type="donut"
                                    height={height}
                                    {...formatPieChart(
                                        mockData.audience.device_breakdown.map(item => ({
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

                        <Grid item xs={12} md={6}>
                            <ChartCard title="🌍 Top Países">
                                <ApexChartWrapper
                                    type="bar"
                                    height={height}
                                    {...formatBarChart(
                                        mockData.geographic.top_countries,
                                        'country',
                                        'clicks',
                                        theme.palette.success.main,
                                        true,
                                        isDark
                                    )}
                                />
                            </ChartCard>
                        </Grid>
                    </>
                )}

                {/* Gráficos avançados */}
                {(variant === 'analytics' || variant === 'full') && (
                    <Grid item xs={12} md={6}>
                        <ChartCard title="🏙️ Top Cidades">
                            <ApexChartWrapper
                                type="donut"
                                height={height}
                                {...formatPieChart(
                                    mockData.geographic.top_cities as Record<string, unknown>[],
                                    'city',
                                    'clicks',
                                    isDark
                                )}
                            />
                        </ChartCard>
                    </Grid>
                )}
            </Grid>
        </DemoContainer>
    );
};

export default DemoCharts;
