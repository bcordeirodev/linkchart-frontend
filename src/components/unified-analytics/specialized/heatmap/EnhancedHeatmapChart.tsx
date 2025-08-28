'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Chip, Stack, Button } from '@mui/material';
import { HeatmapPoint } from '@/hooks/useEnhancedAnalytics';
import dynamic from 'next/dynamic';
import { MyLocation, FilterList } from '@mui/icons-material';

// Importação dinâmica mais segura do Leaflet
const SafeLeafletComponents = dynamic(() => 
    import('react-leaflet').then(mod => ({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        CircleMarker: mod.CircleMarker,
        Popup: mod.Popup
    })), 
    { ssr: false }
);

const SafeMarkerClusterGroup = dynamic(() => 
    import('react-leaflet-markercluster').then(mod => mod.default), 
    { ssr: false }
);

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

    // Calcular centro do mapa baseado nos dados filtrados
    const getMapCenter = () => {
        if (filteredData.length === 0) return [0, 0];

        const totalLat = filteredData.reduce((sum, point) => sum + point.lat, 0);
        const totalLng = filteredData.reduce((sum, point) => sum + point.lng, 0);

        return [totalLat / filteredData.length, totalLng / filteredData.length];
    };

    // Calcular raio do marcador baseado no número de cliques
    const getMarkerRadius = (clicks: number) => {
        const minRadius = 6;
        const maxRadius = 25;
        const normalizedClicks = clicks / stats.maxClicks;
        return minRadius + (normalizedClicks * (maxRadius - minRadius));
    };

    // Calcular cor do marcador baseado no número de cliques
    const getMarkerColor = (clicks: number) => {
        const normalizedClicks = clicks / stats.maxClicks;

        if (normalizedClicks > 0.8) return '#d32f2f'; // Vermelho escuro
        if (normalizedClicks > 0.6) return '#f57c00'; // Laranja
        if (normalizedClicks > 0.4) return '#ff9800'; // Laranja claro
        if (normalizedClicks > 0.2) return '#ffc107'; // Amarelo
        return '#4caf50'; // Verde
    };

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
                cities: data.cities.size,
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);
    }, [filteredData]);

    // Se não há dados, mostrar mensagem de "sem dados"
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        🗺️ {title}
                    </Typography>
                    <Box
                        sx={{
                            height,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                            border: '2px dashed',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                🌍 Mapa de Calor
                            </Typography>
                            <Typography color="text.secondary">
                                Os dados geográficos aparecerão aqui quando houver cliques suficientes
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Compartilhe seu link para ver de onde vêm os cliques!
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Se ainda não está no cliente, mostrar loader
    if (!isClient) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        🗺️ {title}
                    </Typography>
                    <Box
                        sx={{
                            height,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                        }}
                    >
                        <CircularProgress />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                            Carregando mapa...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🗺️ {title}
                </Typography>

                {/* Estatísticas rápidas */}
                <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
                    <Chip
                        label={`${stats.totalClicks} cliques`}
                        color="primary"
                        size="small"
                    />
                    <Chip
                        label={`${stats.uniqueCountries} países`}
                        color="secondary"
                        size="small"
                    />
                    <Chip
                        label={`${stats.uniqueCities} cidades`}
                        color="info"
                        size="small"
                    />
                    <Chip
                        label={`${filteredData.length} locais`}
                        color="success"
                        size="small"
                    />
                </Stack>

                {/* Controles do mapa */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setMinClicksFilter(prev => prev === 1 ? 2 : 1)}
                    >
                        Min {minClicksFilter}+ cliques
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MyLocation />}
                        onClick={() => setShowAllMarkers(!showAllMarkers)}
                    >
                        {showAllMarkers ? 'Agrupar' : 'Expandir'}
                    </Button>
                </Stack>

                {/* Mapa interativo */}
                <Box
                    sx={{
                        height,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                    }}
                >
                    {/* Loader sobreposto - só mostra se o mapa ainda não carregou */}
                    {!mapLoaded && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                zIndex: 1000,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    <MapContainer
                        center={getMapCenter() as [number, number]}
                        zoom={2}
                        style={{ height: '100%', width: '100%' }}
                        whenReady={() => setMapLoaded(true)}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {showAllMarkers ? (
                            // Mostrar todos os marcadores
                            filteredData.map((point, index) => (
                                <CircleMarker
                                    key={index}
                                    center={[point.lat, point.lng]}
                                    radius={getMarkerRadius(point.clicks)}
                                    fillColor={getMarkerColor(point.clicks)}
                                    color={getMarkerColor(point.clicks)}
                                    weight={2}
                                    opacity={0.8}
                                    fillOpacity={0.6}
                                >
                                    <Popup>
                                        <Box sx={{ p: 1, minWidth: 200 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                📍 {point.city}, {point.country}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{point.clicks}</strong> cliques
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                                            </Typography>
                                        </Box>
                                    </Popup>
                                </CircleMarker>
                            ))
                        ) : (
                            // Usar clustering (se disponível)
                            <MarkerClusterGroup>
                                {filteredData.map((point, index) => (
                                    <CircleMarker
                                        key={index}
                                        center={[point.lat, point.lng]}
                                        radius={getMarkerRadius(point.clicks)}
                                        fillColor={getMarkerColor(point.clicks)}
                                        color={getMarkerColor(point.clicks)}
                                        weight={2}
                                        opacity={0.8}
                                        fillOpacity={0.6}
                                    >
                                        <Popup>
                                            <Box sx={{ p: 1, minWidth: 200 }}>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    📍 {point.city}, {point.country}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>{point.clicks}</strong> cliques
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                                                </Typography>
                                            </Box>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </MarkerClusterGroup>
                        )}
                    </MapContainer>
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
