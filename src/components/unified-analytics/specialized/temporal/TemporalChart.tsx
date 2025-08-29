import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Alert } from '@mui/material';
import { HourlyData, DayOfWeekData } from '@/hooks/useEnhancedAnalytics';
import ApexChartWrapper from '@/components/charts/ApexChartWrapper';
import { formatAreaChart, formatBarChart } from '@/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';

interface TemporalChartProps {
    hourlyData: HourlyData[];
    weeklyData: DayOfWeekData[];
}

export function TemporalChart({ hourlyData, weeklyData }: TemporalChartProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Encontrar horário de pico
    const peakHour = hourlyData.length > 0
        ? hourlyData.reduce((prev, current) =>
            prev.clicks > current.clicks ? prev : current
        )
        : { label: '--', clicks: 0 };

    // Encontrar dia de pico
    const peakDay = weeklyData.length > 0
        ? weeklyData.reduce((prev, current) =>
            prev.clicks > current.clicks ? prev : current
        )
        : { day_name: '--', clicks: 0 };

    const getTotalClicks = (data: { clicks: number }[]) => {
        return data.reduce((sum, item) => sum + item.clicks, 0);
    };

    const hourlyTotal = getTotalClicks(hourlyData);
    const weeklyTotal = getTotalClicks(weeklyData);

    return (
        <Grid container spacing={3}>
            {/* Insights Temporais */}
            <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>💡 Insights:</strong>{' '}
                        {hourlyTotal > 0 ? (
                            <>
                                Horário de pico: <strong>{peakHour.label}</strong> ({peakHour.clicks} clicks).
                                Dia com mais engajamento: <strong>{peakDay.day_name}</strong> ({peakDay.clicks} clicks).
                            </>
                        ) : (
                            'Compartilhe seu link para descobrir os melhores horários para engajamento!'
                        )}
                    </Typography>
                </Alert>
            </Grid>

            {/* Cliques por Hora */}
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            ⏰ Cliques por Hora do Dia
                        </Typography>

                        {hourlyTotal > 0 ? (
                            <>
                                <ApexChartWrapper
                                    type="area"
                                    height={300}
                                    {...formatAreaChart(
                                        hourlyData as Record<string, unknown>[],
                                        'label',
                                        'clicks',
                                        '#ff9800',
                                        isDark
                                    )}
                                    options={{
                                        ...formatAreaChart(hourlyData as Record<string, unknown>[], 'label', 'clicks', '#ff9800', isDark).options,
                                        xaxis: {
                                            ...(formatAreaChart(hourlyData, 'label', 'clicks', '#ff9800', isDark).options?.xaxis || {}),
                                            title: {
                                                text: 'Hora do Dia',
                                            },
                                        },
                                        yaxis: {
                                            title: {
                                                text: 'Número de Cliques',
                                            },
                                        },
                                    }}
                                />

                                {/* Resumo dos horários */}
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>📊 Resumo por Período:</strong>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="text.secondary">
                                                Manhã (6h-12h)
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {hourlyData.slice(6, 12).reduce((sum, h) => sum + h.clicks, 0)} clicks
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="text.secondary">
                                                Tarde (12h-18h)
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {hourlyData.slice(12, 18).reduce((sum, h) => sum + h.clicks, 0)} clicks
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" color="text.secondary">
                                                Noite (18h-24h)
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {hourlyData.slice(18, 24).reduce((sum, h) => sum + h.clicks, 0)} clicks
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    ⏰
                                </Typography>
                                <Typography>
                                    Padrões horários aparecerão aqui após os primeiros cliques
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Descubra os melhores horários para compartilhar!
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Cliques por Dia da Semana */}
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📅 Cliques por Dia da Semana
                        </Typography>

                        {weeklyTotal > 0 ? (
                            <>
                                <ApexChartWrapper
                                    type="bar"
                                    height={300}
                                    {...formatBarChart(
                                        weeklyData,
                                        'day_name',
                                        'clicks',
                                        '#9c27b0',
                                        false,
                                        isDark
                                    )}
                                    options={{
                                        ...formatBarChart(weeklyData, 'day_name', 'clicks', '#9c27b0', false, isDark).options,
                                        xaxis: {
                                            ...(formatBarChart(weeklyData, 'day_name', 'clicks', '#9c27b0', false, isDark).options?.xaxis || {}),
                                            title: {
                                                text: 'Dia da Semana',
                                            },
                                        },
                                        yaxis: {
                                            title: {
                                                text: 'Número de Cliques',
                                            },
                                        },
                                    }}
                                />

                                {/* Lista dos dias */}
                                <Box sx={{ mt: 2 }}>
                                    {weeklyData
                                        .sort((a, b) => b.clicks - a.clicks)
                                        .map((day, index) => (
                                            <Box
                                                key={day.day}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    py: 0.5,
                                                    borderBottom: index < weeklyData.length - 1 ? '1px solid' : 'none',
                                                    borderBottomColor: 'divider',
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {day.day_name}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {day.clicks} clicks
                                                </Typography>
                                            </Box>
                                        ))}
                                </Box>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    📅
                                </Typography>
                                <Typography>
                                    Padrões semanais aparecerão aqui após os primeiros cliques
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Descubra os melhores dias para engajamento!
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Dicas de Otimização */}
            <Grid item xs={12}>
                <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            💡 Dicas de Otimização Temporal
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>⏰ Horário Ideal</strong>
                                </Typography>
                                <Typography variant="body2">
                                    {hourlyTotal > 0
                                        ? `Publique às ${peakHour.label} para máximo engajamento`
                                        : 'Teste diferentes horários para encontrar o ideal'
                                    }
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>📅 Dia Ideal</strong>
                                </Typography>
                                <Typography variant="body2">
                                    {weeklyTotal > 0
                                        ? `${peakDay.day_name} é seu melhor dia`
                                        : 'Compartilhe durante a semana para descobrir padrões'
                                    }
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>📈 Estratégia</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Programe posts nos horários de pico para aumentar o alcance
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
