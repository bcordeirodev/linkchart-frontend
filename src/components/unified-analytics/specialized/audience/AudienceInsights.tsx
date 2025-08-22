'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, Divider, Grid } from '@mui/material';

interface DeviceData {
    device: string;
    clicks: number;
}

interface AudienceInsightsProps {
    deviceBreakdown: DeviceData[];
    totalClicks: number;
}

export function AudienceInsights({ deviceBreakdown, totalClicks }: AudienceInsightsProps) {
    // Calcular insights
    const primaryDevice = deviceBreakdown.length > 0
        ? deviceBreakdown.reduce((max, device) =>
            device.clicks > max.clicks ? device : max, deviceBreakdown[0])
        : { device: '--', clicks: 0 };

    const mobileDevices = deviceBreakdown.filter(device =>
        device.device.toLowerCase().includes('mobile') ||
        device.device.toLowerCase().includes('android') ||
        device.device.toLowerCase().includes('iphone')
    );

    const desktopDevices = deviceBreakdown.filter(device =>
        device.device.toLowerCase().includes('desktop') ||
        device.device.toLowerCase().includes('windows') ||
        device.device.toLowerCase().includes('mac')
    );

    const mobilePercentage = mobileDevices.reduce((sum, device) => sum + device.clicks, 0) / totalClicks * 100;
    const desktopPercentage = desktopDevices.reduce((sum, device) => sum + device.clicks, 0) / totalClicks * 100;

    const isMobileDominant = mobilePercentage > desktopPercentage;
    const isDesktopDominant = desktopPercentage > mobilePercentage;
    const isBalanced = Math.abs(mobilePercentage - desktopPercentage) < 10;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                💡 Insights de Audiência
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        📱 Perfil da Audiência
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                                🎯 Dispositivo Principal
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                <Chip
                                    label={primaryDevice?.device || 'N/A'}
                                    color="primary"
                                    variant="filled"
                                />
                                <Chip
                                    label={`${((primaryDevice?.clicks || 0) / totalClicks * 100).toFixed(1)}%`}
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                                📊 Distribuição Mobile vs Desktop
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                    label={`Mobile: ${mobilePercentage.toFixed(1)}%`}
                                    color={isMobileDominant ? 'primary' : 'default'}
                                    variant={isMobileDominant ? 'filled' : 'outlined'}
                                />
                                <Chip
                                    label={`Desktop: ${desktopPercentage.toFixed(1)}%`}
                                    color={isDesktopDominant ? 'primary' : 'default'}
                                    variant={isDesktopDominant ? 'filled' : 'outlined'}
                                />
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Recomendações */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            📈 Recomendações Estratégicas
                        </Typography>
                        <Stack spacing={1}>
                            {isMobileDominant && (
                                <Typography variant="body2" color="text.secondary">
                                    • <strong>Mobile-first:</strong> Sua audiência é predominantemente mobile ({mobilePercentage.toFixed(1)}%).
                                    Otimize a experiência para dispositivos móveis.
                                </Typography>
                            )}
                            {isDesktopDominant && (
                                <Typography variant="body2" color="text.secondary">
                                    • <strong>Desktop-focused:</strong> Sua audiência é predominantemente desktop ({desktopPercentage.toFixed(1)}%).
                                    Foque em conteúdo mais detalhado e interativo.
                                </Typography>
                            )}
                            {isBalanced && (
                                <Typography variant="body2" color="text.secondary">
                                    • <strong>Audiência equilibrada:</strong> Sua audiência está bem distribuída entre mobile e desktop.
                                    Mantenha uma experiência consistente em todas as plataformas.
                                </Typography>
                            )}
                            {primaryDevice && (
                                <Typography variant="body2" color="text.secondary">
                                    • <strong>{primaryDevice.device}</strong> é o dispositivo mais usado.
                                    Considere otimizações específicas para esta plataforma.
                                </Typography>
                            )}
                            {deviceBreakdown.length > 3 && (
                                <Typography variant="body2" color="text.secondary">
                                    • Sua audiência usa {deviceBreakdown.length} tipos diferentes de dispositivos.
                                    Garanta compatibilidade cross-platform.
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Detalhes técnicos */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            🔧 Detalhes Técnicos
                        </Typography>
                        <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                                • <strong>Total de dispositivos:</strong> {deviceBreakdown.length} tipos diferentes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • <strong>Dispositivo mais popular:</strong> {primaryDevice?.device} com {primaryDevice?.clicks} cliques
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • <strong>Diversidade de plataformas:</strong> {deviceBreakdown.length > 2 ? 'Alta' : 'Baixa'}
                            </Typography>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
