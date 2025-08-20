'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack } from '@mui/material';
import ApexChartWrapper from '@/components/charts/ApexChartWrapper';
import { formatBarChart, formatPieChart } from '@/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';

interface DeviceData {
    device: string;
    clicks: number;
}

interface AudienceChartProps {
    deviceBreakdown: DeviceData[];
    totalClicks: number;
}

export function AudienceChart({ deviceBreakdown, totalClicks }: AudienceChartProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Calcular estatísticas
    const totalDevices = deviceBreakdown.reduce((sum, device) => sum + device.clicks, 0);
    const primaryDevice = deviceBreakdown.reduce((max, device) =>
        device.clicks > max.clicks ? device : max, deviceBreakdown[0]);

    // Preparar dados para gráficos
    const deviceChartData = deviceBreakdown.map(device => ({
        name: device.device,
        value: device.clicks,
        percentage: ((device.clicks / totalClicks) * 100).toFixed(1)
    }));

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                📱 Análise de Audiência
            </Typography>

            {/* Estatísticas rápidas */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="primary" gutterBottom>
                                {totalDevices}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dispositivos Detectados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="secondary" gutterBottom>
                                {primaryDevice?.device || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dispositivo Principal
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="info" gutterBottom>
                                {deviceBreakdown.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tipos de Dispositivo
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success" gutterBottom>
                                {primaryDevice ? ((primaryDevice.clicks / totalClicks) * 100).toFixed(1) : '0'}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dominância Principal
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3}>
                {/* Distribuição por Dispositivo */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                📱 Distribuição por Dispositivo
                            </Typography>
                            <ApexChartWrapper
                                type="pie"
                                height={300}
                                {...formatPieChart(
                                    deviceChartData,
                                    'name',
                                    'value',
                                    isDark
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Ranking de Dispositivos */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                🏆 Ranking de Dispositivos
                            </Typography>
                            <ApexChartWrapper
                                type="bar"
                                height={300}
                                {...formatBarChart(
                                    deviceChartData,
                                    'name',
                                    'value',
                                    theme.palette.warning.main,
                                    true,
                                    isDark
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detalhes dos Dispositivos */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        📊 Detalhes por Dispositivo
                    </Typography>

                    <Stack spacing={2}>
                        {deviceBreakdown.map((device, index) => (
                            <Box
                                key={device.device}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip
                                        label={index + 1}
                                        color={index === 0 ? 'primary' : 'default'}
                                        size="small"
                                    />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {device.device}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {((device.clicks / totalClicks) * 100).toFixed(1)}% do total
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h6" color="primary">
                                        {device.clicks}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        cliques
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
