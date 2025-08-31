import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Stack,
    Button,
    IconButton,
    Tooltip,
    Alert,
    Slider,
    FormControlLabel,
    Switch,
    alpha,
    useTheme
} from '@mui/material';
import {
    Refresh,
    Fullscreen,
    Timeline,
    Public,
    LocationOn,
    Speed
} from '@mui/icons-material';
import { useHeatmapData, HeatmapPoint } from '../../../hooks/useHeatmapData';

// Componentes seguros para SSR
interface SafeMapComponents {
    MapContainer: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
    TileLayer: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
    CircleMarker: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
    Popup: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
    LayersControl: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
    LayerGroup: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface RealTimeHeatmapChartProps {
    linkId?: string; // Opcional - se não fornecido, modo global
    height?: number;
    title?: string;
    enableRealtime?: boolean;
    refreshInterval?: number;
    showControls?: boolean;
    showStats?: boolean;
    globalMode?: boolean; // Modo global - todos os links ativos
}

export function RealTimeHeatmapChart({
    linkId,
    height = 600,
    title = "Mapa de Calor em Tempo Real",
    enableRealtime = true,
    refreshInterval = 30000,
    showControls = true,
    showStats = true,
    globalMode = false
}: RealTimeHeatmapChartProps) {
    const theme = useTheme();
    const [mapComponents, setMapComponents] = useState<SafeMapComponents>({
        MapContainer: null,
        TileLayer: null,
        CircleMarker: null,
        Popup: null,
        LayersControl: null,
        LayerGroup: null
    });
    const [mapReady, setMapReady] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Estados de controle
    const [minClicksFilter, setMinClicksFilter] = useState(1);
    const [showAllMarkers, setShowAllMarkers] = useState(true);
    const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'dark'>('street');
    const [showClusters, setShowClusters] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Hook personalizado para dados do heatmap
    const {
        data,
        stats,
        loading,
        error,
        lastUpdate,
        refresh,
        isRealtime
    } = useHeatmapData({
        linkId,
        refreshInterval,
        enableRealtime,
        minClicks: minClicksFilter,
        globalMode
    });

    // Debug: Log dos dados recebidos (apenas em desenvolvimento)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🗺️ RealTimeHeatmapChart: Dados recebidos:', {
                dataLength: data?.length || 0,
                linkId,
                globalMode,
                loading,
                error,
                stats,
                firstPoint: data && data.length > 0 ? data[0] : null,
                mapReady,
                isClient,
                dataIsArray: Array.isArray(data),
                dataType: typeof data,
                minClicksFilter,
                hasStats: !!stats
            });
        }
    }, [data, linkId, globalMode, loading, error, stats, mapReady, isClient, minClicksFilter]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Carregar componentes do Leaflet dinamicamente
    useEffect(() => {
        const loadLeaflet = async () => {
            try {
                // Verificar se o Leaflet CSS já foi carregado
                const existingCss = document.querySelector('link[href*="leaflet"]');
                if (!existingCss) {
                    const leafletCss = document.createElement('link');
                    leafletCss.rel = 'stylesheet';
                    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                    leafletCss.crossOrigin = '';
                    document.head.appendChild(leafletCss);
                }

                // Importar componentes React-Leaflet
                const [reactLeaflet] = await Promise.all([
                    import('react-leaflet')
                ]);

                setMapComponents({
                    MapContainer: reactLeaflet.MapContainer,
                    TileLayer: reactLeaflet.TileLayer,
                    CircleMarker: reactLeaflet.CircleMarker,
                    Popup: reactLeaflet.Popup,
                    LayersControl: reactLeaflet.LayersControl,
                    LayerGroup: reactLeaflet.LayerGroup
                });

                setMapReady(true);
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Erro ao carregar Leaflet:', error);
                }
                setMapError(true);
            }
        };

        if (isClient) {
            loadLeaflet();
        }
    }, [isClient]);

    // Calcular centro do mapa baseado nos dados
    const getMapCenter = useCallback((): [number, number] => {
        if (data.length === 0) return [0, 0];

        const totalLat = data.reduce((sum: number, point: HeatmapPoint) => sum + point.lat, 0);
        const totalLng = data.reduce((sum: number, point: HeatmapPoint) => sum + point.lng, 0);

        const center: [number, number] = [totalLat / data.length, totalLng / data.length];

        if (process.env.NODE_ENV === 'development') {
            console.log('🗺️ RealTimeHeatmapChart: Centro do mapa calculado:', {
                center,
                dataLength: data.length,
                firstPoint: data[0] ? [data[0].lat, data[0].lng] : null
            });
        }

        return center;
    }, [data]);

    // Calcular raio do marcador baseado no número de cliques
    const getMarkerRadius = useCallback((clicks: number, maxClicks: number) => {
        const minRadius = 12; // Aumentado de 6 para 12
        const maxRadius = 35; // Aumentado de 25 para 35
        const normalizedClicks = maxClicks > 0 ? clicks / maxClicks : 0;
        const radius = minRadius + normalizedClicks * (maxRadius - minRadius);

        if (process.env.NODE_ENV === 'development') {
            console.log('📏 Calculando raio:', { clicks, maxClicks, normalizedClicks, radius });
        }

        return radius;
    }, []);

    // Calcular cor do marcador baseado no número de cliques
    const getMarkerColor = useCallback((clicks: number, maxClicks: number) => {
        const normalizedClicks = clicks / maxClicks;

        if (normalizedClicks > 0.8) return '#d32f2f'; // Vermelho intenso
        if (normalizedClicks > 0.6) return '#f57c00'; // Laranja escuro
        if (normalizedClicks > 0.4) return '#ff9800'; // Laranja
        if (normalizedClicks > 0.2) return '#ffc107'; // Amarelo
        return '#4caf50'; // Verde
    }, []);

    // URLs dos tiles baseado no estilo
    const getTileUrl = useCallback((style: string) => {
        switch (style) {
            case 'satellite':
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case 'dark':
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
            default:
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        }
    }, []);

    // Agrupar dados por país para estatísticas
    const countryStats = useMemo(() => {
        const countryMap = new Map<string, { clicks: number; cities: Set<string>; points: HeatmapPoint[] }>();

        data.forEach((point: HeatmapPoint) => {
            if (!countryMap.has(point.country)) {
                countryMap.set(point.country, { clicks: 0, cities: new Set(), points: [] });
            }
            const country = countryMap.get(point.country)!;
            country.clicks += point.clicks;
            country.cities.add(point.city);
            country.points.push(point);
        });

        return Array.from(countryMap.entries())
            .map(([country, data]) => ({
                country,
                clicks: data.clicks,
                cities: Array.from(data.cities),
                points: data.points
            }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 10);
    }, [data]);

    // Renderizar estado de loading
    if (!isClient || !mapReady) {
        return (
            <Card sx={{ height: height, borderRadius: '16px' }}>
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        Carregando mapa interativo...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // Renderizar estado de erro
    if (mapError) {
        return (
            <Card sx={{ height: height, borderRadius: '16px' }}>
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Erro ao carregar o mapa
                    </Alert>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Não foi possível carregar os componentes do mapa.
                        <br />Verifique sua conexão com a internet.
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Recarregar Página
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Renderizar estado vazio
    if (process.env.NODE_ENV === 'development') {
        console.log('🔍 RealTimeHeatmapChart: Verificando estado vazio:', {
            hasData: !!data,
            dataLength: data?.length || 0,
            loading,
            shouldShowEmpty: !loading && (!data || data.length === 0),
            dataIsArray: Array.isArray(data)
        });
    }

    if (!loading && (!data || data.length === 0)) {
        return (
            <Card sx={{ height: height, borderRadius: '16px' }}>
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center'
                }}>
                    <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.primary" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Nenhum dado geográfico disponível ainda.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Os dados aparecerão aqui conforme os cliques forem registrados.
                    </Typography>
                    {enableRealtime && (
                        <Chip
                            label="Tempo Real Ativo"
                            color="success"
                            size="small"
                            sx={{ mt: 2 }}
                            icon={<Speed />}
                        />
                    )}
                </CardContent>
            </Card>
        );
    }

    const { MapContainer, TileLayer, CircleMarker, Popup } = mapComponents;

    if (!MapContainer || !TileLayer || !CircleMarker || !Popup) {
        return (
            <Card sx={{ height: height, borderRadius: '16px' }}>
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            right: isFullscreen ? 0 : 'auto',
            bottom: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 9999 : 'auto',
            width: isFullscreen ? '100vw' : 'auto',
            height: isFullscreen ? '100vh' : height
        }}>
            <CardContent sx={{ height: '100%', p: 0 }}>
                {/* Header com controles */}
                {showControls && (
                    <Box sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        background: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Public color="primary" />
                                <Typography variant="h6" fontWeight="600" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    {title}
                                </Typography>
                                {isRealtime && (
                                    <Chip
                                        label="Tempo Real"
                                        color="success"
                                        size="small"
                                        icon={<Speed />}
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Tooltip title="Atualizar dados">
                                    <IconButton onClick={refresh} disabled={loading}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}>
                                    <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
                                        <Fullscreen />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>

                        {/* Estatísticas */}
                        {showStats && stats && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                <Chip
                                    label={`${stats.totalClicks.toLocaleString()} cliques`}
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
                                    label={`Média: ${Math.round(stats.avgClicksPerLocation)} cliques/local`}
                                    color="success"
                                    size="small"
                                />
                                {lastUpdate && (
                                    <Chip
                                        label={`Atualizado: ${lastUpdate.toLocaleTimeString()}`}
                                        variant="outlined"
                                        size="small"
                                        icon={<Timeline />}
                                    />
                                )}
                            </Stack>
                        )}

                        {/* Controles de filtro */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Box sx={{ minWidth: 200 }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    Cliques mínimos: {minClicksFilter}
                                </Typography>
                                <Slider
                                    value={minClicksFilter}
                                    onChange={(_, value) => {
                                        console.log('🎚️ Mudando filtro de cliques para:', value);
                                        setMinClicksFilter(value as number);
                                    }}
                                    min={1}
                                    max={stats?.maxClicks || 100}
                                    size="small"
                                    valueLabelDisplay="auto"
                                />
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showClusters}
                                        onChange={(e) => setShowClusters(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label="Agrupar"
                                sx={{ ml: 2 }}
                            />

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    variant={mapStyle === 'street' ? "contained" : "outlined"}
                                    onClick={() => setMapStyle('street')}
                                >
                                    Ruas
                                </Button>
                                <Button
                                    size="small"
                                    variant={mapStyle === 'satellite' ? "contained" : "outlined"}
                                    onClick={() => setMapStyle('satellite')}
                                >
                                    Satélite
                                </Button>
                                <Button
                                    size="small"
                                    variant={mapStyle === 'dark' ? "contained" : "outlined"}
                                    onClick={() => setMapStyle('dark')}
                                >
                                    Escuro
                                </Button>
                            </Stack>
                        </Box>

                        {error && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                {error} (Exibindo dados de exemplo)
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Mapa */}
                <Box sx={{
                    height: showControls ? `calc(100% - 200px)` : '100%',
                    position: 'relative'
                }}>
                    <MapContainer
                        center={getMapCenter()}
                        zoom={4}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url={getTileUrl(mapStyle)}
                        />

                        {data.map((point: HeatmapPoint, index: number) => {
                            if (process.env.NODE_ENV === 'development' && index === 0) {
                                console.log('🎯 RealTimeHeatmapChart: Renderizando marcador:', {
                                    point,
                                    radius: getMarkerRadius(point.clicks, stats?.maxClicks || 1),
                                    color: getMarkerColor(point.clicks, stats?.maxClicks || 1),
                                    maxClicks: stats?.maxClicks
                                });
                            }

                            return (
                                <CircleMarker
                                    key={`${point.lat}-${point.lng}-${index}-${point.clicks}`}
                                    center={[point.lat, point.lng]}
                                    radius={getMarkerRadius(point.clicks, stats?.maxClicks || 1)}
                                    fillColor={getMarkerColor(point.clicks, stats?.maxClicks || 1)}
                                    color={getMarkerColor(point.clicks, stats?.maxClicks || 1)}
                                    weight={3}
                                    opacity={1.0}
                                    fillOpacity={0.8}
                                >
                                    <Popup>
                                        <Box sx={{ p: 1, minWidth: 200 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                📍 {point.city}, {point.country}
                                            </Typography>
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                {point.clicks.toLocaleString()} cliques
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Coordenadas: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                                            </Typography>
                                            {point.state_name && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Estado/Região: {point.state_name}
                                                </Typography>
                                            )}
                                            {point.iso_code && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Código: {point.iso_code} | Moeda: {point.currency}
                                                </Typography>
                                            )}
                                            {point.continent && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Continente: {point.continent}
                                                </Typography>
                                            )}
                                            {point.last_click && (
                                                <Typography variant="caption" color="primary" display="block" sx={{ mt: 1 }}>
                                                    Último clique: {new Date(point.last_click).toLocaleString('pt-BR')}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                    </MapContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
