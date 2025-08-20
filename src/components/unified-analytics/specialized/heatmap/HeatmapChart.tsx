'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Chip, Stack } from '@mui/material';
import { HeatmapPoint } from '@/hooks/useEnhancedAnalytics';
import dynamic from 'next/dynamic';

// Importação dinâmica mais robusta do Leaflet
const DynamicMap = dynamic(() => import('./LeafletMapComponent'), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                height: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: 2
            }}
        >
            <CircularProgress />
        </Box>
    )
}) as React.ComponentType<{ data: HeatmapPoint[]; height: number; maxClicks: number }>;

interface HeatmapChartProps {
    data: HeatmapPoint[];
    height?: number;
    title?: string;
}

export function HeatmapChart({ data, height = 500, title = 'Mapa de Calor Mundial' }: HeatmapChartProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Calcular estatísticas dos dados
    const totalClicks = data.reduce((sum, point) => sum + point.clicks, 0);
    const maxClicks = Math.max(...data.map((point) => point.clicks), 1);
    const uniqueCountries = new Set(data.map((point) => point.country)).size;
    const uniqueCities = new Set(data.map((point) => point.city)).size;

    if (!data || data.length === 0) {
        return (
            <Card sx={{ height: height }}>
                <CardContent
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                    >
                        📍 {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Nenhum dado geográfico disponível ainda.
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Os dados aparecerão aqui conforme os cliques forem registrados.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (!isClient) {
        return (
            <Card sx={{ height: height }}>
                <CardContent
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: height }}>
            <CardContent sx={{ height: '100%', p: 0 }}>
                {/* Header com estatísticas */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                    >
                        📍 {title}
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                    >
                        <Chip
                            label={`${totalClicks.toLocaleString()} cliques totais`}
                            color="primary"
                            size="small"
                        />
                        <Chip
                            label={`${uniqueCountries} países`}
                            color="secondary"
                            size="small"
                        />
                        <Chip
                            label={`${uniqueCities} cidades`}
                            color="info"
                            size="small"
                        />
                    </Stack>
                </Box>

                {/* Mapa */}
                <Box sx={{ height: height - 100, position: 'relative' }}>
                    <DynamicMap
                        data={data}
                        height={height - 100}
                        maxClicks={maxClicks}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default HeatmapChart;
