'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { HeatmapPoint } from '@/hooks/useEnhancedAnalytics';

// Importações condicionais do Leaflet
let MapContainer: React.ComponentType<any> | null = null;
let TileLayer: React.ComponentType<any> | null = null;
let CircleMarker: React.ComponentType<any> | null = null;
let Popup: React.ComponentType<any> | null = null;

interface LeafletMapComponentProps {
    data: HeatmapPoint[];
    height: number;
    maxClicks: number;
}

export default function LeafletMapComponent({ data, height, maxClicks }: LeafletMapComponentProps) {
    const [mapReady, setMapReady] = useState(false);
    const [mapError, setMapError] = useState(false);

    useEffect(() => {
        // Importar componentes do Leaflet dinamicamente
        const loadLeaflet = async () => {
            try {
                // Importar CSS do Leaflet
                if (typeof window !== 'undefined') {
                    const leafletCss = document.createElement('link');
                    leafletCss.rel = 'stylesheet';
                    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                    leafletCss.crossOrigin = '';
                    document.head.appendChild(leafletCss);
                }

                // Importar componentes React-Leaflet
                const reactLeaflet = await import('react-leaflet');
                MapContainer = reactLeaflet.MapContainer;
                TileLayer = reactLeaflet.TileLayer;
                CircleMarker = reactLeaflet.CircleMarker;
                Popup = reactLeaflet.Popup;

                setMapReady(true);
            } catch (error) {
                console.error('Erro ao carregar Leaflet:', error);
                setMapError(true);
            }
        };

        loadLeaflet();
    }, []);

    // Calcular centro do mapa baseado nos dados
    const getMapCenter = (): [number, number] => {
        if (data.length === 0) return [0, 0];

        const totalLat = data.reduce((sum, point) => sum + point.lat, 0);
        const totalLng = data.reduce((sum, point) => sum + point.lng, 0);

        return [totalLat / data.length, totalLng / data.length];
    };

    // Calcular raio do marcador baseado no número de cliques
    const getMarkerRadius = (clicks: number) => {
        const minRadius = 8;
        const maxRadius = 30;
        const normalizedClicks = clicks / maxClicks;
        return minRadius + normalizedClicks * (maxRadius - minRadius);
    };

    // Calcular cor do marcador baseado no número de cliques
    const getMarkerColor = (clicks: number) => {
        const normalizedClicks = clicks / maxClicks;

        if (normalizedClicks > 0.8) return '#d32f2f'; // Vermelho escuro
        if (normalizedClicks > 0.6) return '#f57c00'; // Laranja
        if (normalizedClicks > 0.4) return '#ff9800'; // Laranja claro
        if (normalizedClicks > 0.2) return '#ffc107'; // Amarelo
        return '#4caf50'; // Verde
    };

    if (mapError) {
        return (
            <Box
                sx={{
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: 2,
                    flexDirection: 'column'
                }}
            >
                <Typography
                    variant="h6"
                    color="error"
                    gutterBottom
                >
                    ❌ Erro ao carregar mapa
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Não foi possível carregar o componente de mapa.
                </Typography>
            </Box>
        );
    }

    if (!mapReady || !MapContainer) {
        return (
            <Box
                sx={{
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Carregando mapa...
                </Typography>
            </Box>
        );
    }

    try {
        // Verificar se todos os componentes foram carregados
        if (!MapContainer || !TileLayer || !CircleMarker || !Popup) {
            return (
                <Box
                    sx={{
                        height,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Carregando componentes do mapa...
                    </Typography>
                </Box>
            );
        }

        const MapContainerComponent = MapContainer as React.ComponentType<any>;
        const TileLayerComponent = TileLayer as React.ComponentType<any>;
        const CircleMarkerComponent = CircleMarker as React.ComponentType<any>;
        const PopupComponent = Popup as React.ComponentType<any>;

        return (
            <MapContainerComponent
                center={getMapCenter()}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayerComponent
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {data.map((point, index) => (
                    <CircleMarkerComponent
                        key={`${point.lat}-${point.lng}-${index}`}
                        center={[point.lat, point.lng]}
                        radius={getMarkerRadius(point.clicks)}
                        fillColor={getMarkerColor(point.clicks)}
                        color={getMarkerColor(point.clicks)}
                        weight={2}
                        opacity={0.8}
                        fillOpacity={0.6}
                    >
                        <PopupComponent>
                            <Box sx={{ p: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                >
                                    📍 {point.city}, {point.country}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <strong>{point.clicks}</strong> cliques
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                                </Typography>
                            </Box>
                        </PopupComponent>
                    </CircleMarkerComponent>
                ))}
            </MapContainerComponent>
        );
    } catch (error) {
        console.error('Erro ao renderizar mapa:', error);
        return (
            <Box
                sx={{
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: 2,
                    flexDirection: 'column'
                }}
            >
                <Typography
                    variant="h6"
                    color="error"
                    gutterBottom
                >
                    ❌ Erro de renderização
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Problema ao renderizar o mapa de calor.
                </Typography>
            </Box>
        );
    }
}
