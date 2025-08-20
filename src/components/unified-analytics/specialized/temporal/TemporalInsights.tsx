'use client';

import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Divider } from '@mui/material';
import ApexChartWrapper from '@/components/charts/ApexChartWrapper';
import { formatAreaChart, formatBarChart } from '@/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';

interface HourlyData {
    hour: number;
    clicks: number;
    label: string;
}

interface DayOfWeekData {
    day: number;
    day_name: string;
    clicks: number;
}

interface TemporalInsightsProps {
    hourlyData: HourlyData[];
    weeklyData: DayOfWeekData[];
}

export function TemporalInsights({ hourlyData, weeklyData }: TemporalInsightsProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Calcular estatísticas
    const totalClicks = hourlyData.reduce((sum, hour) => sum + hour.clicks, 0);
    const peakHour = hourlyData.reduce((max, hour) => hour.clicks > max.clicks ? hour : max, hourlyData[0]);
    const peakDay = weeklyData.reduce((max, day) => day.clicks > max.clicks ? day : max, weeklyData[0]);
    const avgClicksPerHour = totalClicks / 24;
    const avgClicksPerDay = totalClicks / 7;

    // Preparar dados para gráficos
    const hourlyChartData = hourlyData.map(hour => ({
        name: hour.label,
        value: hour.clicks,
        hour: hour.hour
    }));

    const weeklyChartData = weeklyData.map(day => ({
        name: day.day_name,
        value: day.clicks,
        day: day.day
    }));

    // Calcular períodos de atividade
    const activeHours = hourlyData.filter(hour => hour.clicks > avgClicksPerHour).length;
    const activeDays = weeklyData.filter(day => day.clicks > avgClicksPerDay).length;

    // Identificar padrões
    const isWeekendActive = weeklyData[0].clicks + weeklyData[6].clicks > weeklyData.slice(1, 6).reduce((sum, day) => sum + day.clicks, 0);
    const isBusinessHoursActive = hourlyData.slice(9, 18).reduce((sum, hour) => sum + hour.clicks, 0) > hourlyData.slice(0, 9).reduce((sum, hour) => sum + hour.clicks, 0) + hourlyData.slice(18, 24).reduce((sum, hour) => sum + hour.clicks, 0);

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                ⏰ Insights Temporais Detalhados
            </Typography>

            {/* Estatísticas rápidas */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="primary" gutterBottom>
                                {peakHour?.label || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Horário de Pico
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="secondary" gutterBottom>
                                {peakDay?.day_name || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dia Mais Ativo
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="info" gutterBottom>
                                {activeHours}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Horas Ativas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success" gutterBottom>
                                {avgClicksPerHour.toFixed(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Média/Hora
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3}>
                {/* Distribuição por Hora */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                🕐 Distribuição por Hora do Dia
                            </Typography>
                            <ApexChartWrapper
                                type="area"
                                height={300}
                                {...formatAreaChart(
                                    hourlyChartData,
                                    'name',
                                    'value',
                                    theme.palette.primary.main,
                                    isDark
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Distribuição por Dia da Semana */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                📅 Distribuição por Dia da Semana
                            </Typography>
                            <ApexChartWrapper
                                type="bar"
                                height={300}
                                {...formatBarChart(
                                    weeklyChartData,
                                    'name',
                                    'value',
                                    theme.palette.secondary.main,
                                    false,
                                    isDark
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Análise de Padrões */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        🔍 Análise de Padrões Temporais
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                                ⏰ Padrões por Hora
                            </Typography>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        label={isBusinessHoursActive ? 'Horário Comercial' : 'Fora do Horário'}
                                        color={isBusinessHoursActive ? 'success' : 'warning'}
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {isBusinessHoursActive ? 'Ativo durante 9h-18h' : 'Mais ativo fora do horário comercial'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        label={`${activeHours}/24 horas ativas`}
                                        color="info"
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {((activeHours / 24) * 100).toFixed(0)}% do dia com atividade
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                                📅 Padrões por Dia
                            </Typography>
                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        label={isWeekendActive ? 'Fim de Semana' : 'Dias Úteis'}
                                        color={isWeekendActive ? 'secondary' : 'primary'}
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {isWeekendActive ? 'Mais ativo nos fins de semana' : 'Mais ativo nos dias úteis'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        label={`${activeDays}/7 dias ativos`}
                                        color="info"
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {((activeDays / 7) * 100).toFixed(0)}% da semana com atividade
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Recomendações */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            📈 Recomendações de Timing
                        </Typography>
                        <Stack spacing={1}>
                            {peakHour && (
                                <Typography variant="body2" color="text.secondary">
                                    • <strong>{peakHour.label}</strong> é o horário de pico com {peakHour.clicks} cliques.
                                    Programe campanhas importantes neste horário.
                                </Typography>
                            )}
                            {peakDay && (
                                <Typography variant="body2" color="text.secondary">
                                    • <strong>{peakDay.day_name}</strong> é o dia mais ativo.
                                    Concentre lançamentos e promoções neste dia.
                                </Typography>
                            )}
                            {isBusinessHoursActive && (
                                <Typography variant="body2" color="text.secondary">
                                    • Seu público é ativo durante horário comercial.
                                    Foque em conteúdo B2B e profissional.
                                </Typography>
                            )}
                            {!isBusinessHoursActive && (
                                <Typography variant="body2" color="text.secondary">
                                    • Seu público é ativo fora do horário comercial.
                                    Foque em conteúdo de entretenimento e lifestyle.
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
