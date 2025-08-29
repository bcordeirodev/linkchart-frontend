'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Chip, Stack, Button } from '@mui/material';
import { HeatmapPoint } from '@/hooks/useEnhancedAnalytics';
import { MyLocation, FilterList } from '@mui/icons-material';

interface EnhancedHeatmapChartProps {
    data: HeatmapPoint[];
    height?: number;
    title?: string;
}

export function EnhancedHeatmapChart({ data, height = 600, title = "Mapa de Calor Avançado" }: EnhancedHeatmapChartProps) {
    const [isClient, setIsClient] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showAllMarkers, setShowAllMarkers] = useState(true);
    const [minClicksFilter, setMinClicksFilter] = useState(1);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Calcular estatísticas dos dados
    const stats = useMemo(() => {
        const totalClicks = data.reduce((sum, point) => sum + point.clicks, 0);
        const maxClicks = Math.max(...data.map(point => point.clicks), 1);
        const uniqueCountries = new Set(data.map(point => point.country)).size;
        const uniqueCities = new Set(data.map(point => point.city)).size;
        const avgClicksPerLocation = totalClicks / data.length;

        return {
            totalClicks,
            maxClicks,
            uniqueCountries,
            uniqueCities,
            avgClicksPerLocation,
        };
    }, [data]);

    // Filtrar dados baseado no filtro mínimo de cliques
    const filteredData = useMemo(() => {
        return data.filter(point => point.clicks >= minClicksFilter);
    }, [data, minClicksFilter]);

    // Agrupar dados por país para estatísticas
    const countryStats = useMemo(() => {
        const countryMap = new Map<string, { clicks: number; cities: Set<string> }>();

        filteredData.forEach(point => {
            if (!countryMap.has(point.country)) {
                countryMap.set(point.country, { clicks: 0, cities: new Set() });
            }
            const country = countryMap.get(point.country)!;
            country.clicks += point.clicks;
            country.cities.add(point.city);
        });

        return Array.from(countryMap.entries())
            .map(([country, data]) => ({
                country,
                clicks: data.clicks,
                cities: Array.from(data.cities)
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 10);
    }, [filteredData]);

    if (!isClient) {
        return (
            <Card sx={{ height: height }}>
                <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

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
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        📍 {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Nenhum dado geográfico disponível ainda.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Os dados aparecerão aqui conforme os cliques forem registrados.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: height }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        📍 {title}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            variant={showAllMarkers ? "contained" : "outlined"}
                            onClick={() => setShowAllMarkers(true)}
                            startIcon={<MyLocation />}
                        >
                            Todos
                        </Button>
                        <Button
                            size="small"
                            variant={!showAllMarkers ? "contained" : "outlined"}
                            onClick={() => setShowAllMarkers(false)}
                            startIcon={<FilterList />}
                        >
                            Agrupados
                        </Button>
                    </Stack>
                </Box>

                {/* Filtro de cliques mínimos */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Cliques mínimos: {minClicksFilter}
                    </Typography>
                    <input
                        type="range"
                        min="1"
                        max={Math.max(...data.map(p => p.clicks), 10)}
                        value={minClicksFilter}
                        onChange={(e) => setMinClicksFilter(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </Box>

                {/* Estatísticas */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={`Total: ${stats.totalClicks} cliques`} color="primary" />
                    <Chip label={`Países: ${stats.uniqueCountries}`} color="secondary" />
                    <Chip label={`Cidades: ${stats.uniqueCities}`} color="info" />
                    <Chip label={`Média: ${Math.round(stats.avgClicksPerLocation)} cliques/local`} color="success" />
                </Box>

                {/* Mapa simplificado - Grid de países */}
                <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, overflow: 'auto' }}>
                    {countryStats.map((country, index) => (
                        <Card key={index} variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                🌍 {country.country}
                            </Typography>
                            <Typography variant="h6" color="primary">
                                {country.clicks} cliques
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {country.cities.length} cidades
                            </Typography>
                        </Card>
                    ))}
                </Box>

                {/* Estatísticas por país */}
                {countryStats.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            📊 Top Países
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {countryStats.map((country, index) => (
                                <Chip
                                    key={index}
                                    label={`${country.country}: ${country.clicks} cliques`}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
