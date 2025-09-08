/**
 * @fileoverview Componente de mapa de calor interativo em tempo real
 * @author Link Chart Team
 * @version 2.0.0
 * 
 * @description
 * Componente principal para renderização de mapas de calor interativos.
 * Suporta carregamento dinâmico do Leaflet, múltiplos estilos de mapa,
 * controles interativos e atualizações em tempo real.
 * 
 * @features
 * - Carregamento dinâmico do Leaflet (SSR safe)
 * - Múltiplos estilos de mapa (street, satellite, dark)
 * - Controles de filtro e visualização
 * - Popups informativos com dados detalhados
 * - Suporte a modo fullscreen
 * - Clustering de pontos próximos
 */

import React, { useEffect, useState, useCallback } from 'react';
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
import { Refresh, Fullscreen, Public, Speed, LocationOn, Timeline } from '@mui/icons-material';
import type { HeatmapPoint } from '@/types';

// ========================================
// 🏗️ INTERFACES E TIPOS
// ========================================

/**
 * Props do componente RealTimeHeatmapChart
 */
interface HeatmapChartProps {
	/** Dados dos pontos do mapa de calor */
	data: HeatmapPoint[];
	/** Estado de carregamento */
	loading?: boolean;
	/** Mensagem de erro */
	error?: string | null;
	/** Altura do mapa em pixels */
	height?: number;
	/** Callback quando um ponto é clicado */
	onPointClick?: (point: HeatmapPoint) => void;
	/** Estatísticas agregadas */
	stats?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	/** Callback para refresh dos dados */
	onRefresh?: () => void;
	/** Título do componente */
	title?: string;
	/** Mostrar controles de filtro */
	showControls?: boolean;
	/** Mostrar estatísticas */
	showStats?: boolean;
}

/**
 * Componentes do Leaflet carregados dinamicamente (SSR safe)
 */
interface SafeMapComponents {
	MapContainer: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	TileLayer: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	CircleMarker: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	Popup: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	LayersControl: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	LayerGroup: React.ComponentType<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// ========================================
// 🗺️ COMPONENTE PRINCIPAL
// ========================================

/**
 * Componente de mapa de calor interativo com suporte a tempo real
 * 
 * @description
 * Renderiza um mapa interativo com:
 * - Pontos de calor baseados em cliques geográficos
 * - Controles para filtros e visualização
 * - Atualizações em tempo real
 * - Suporte para modo global e específico por link
 * 
 * @example
 * ```tsx
 * // Modo global
 * <RealTimeHeatmapChart data={heatmapData} />
 * 
 * // Com controles personalizados
 * <RealTimeHeatmapChart 
 *   data={heatmapData}
 *   height={500}
 *   showControls={true}
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
export function RealTimeHeatmapChart({
	data,
	stats,
	loading = false,
	error = null,
	onRefresh,
	height = 600,
	title = 'Mapa de Calor em Tempo Real',
	showControls = true,
	showStats = true
}: HeatmapChartProps) {
	// ========================================
	// 🎛️ HOOKS E ESTADO
	// ========================================

	const theme = useTheme();

	// Estados do mapa
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
	const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'dark'>('street');
	const [showClusters, setShowClusters] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Dados recebidos como props - não precisa mais do hook

	// Debug removido para produção

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
				const [reactLeaflet] = await Promise.all([import('react-leaflet')]);

				setMapComponents({
					MapContainer: reactLeaflet.MapContainer,
					TileLayer: reactLeaflet.TileLayer,
					CircleMarker: reactLeaflet.CircleMarker,
					Popup: reactLeaflet.Popup,
					LayersControl: reactLeaflet.LayersControl,
					LayerGroup: reactLeaflet.LayerGroup
				});

				setMapReady(true);
			} catch (_error) {
				if (process.env.NODE_ENV === 'development') {
					// console.error('Erro ao carregar Leaflet:', error);
				}

				setMapError(true);
			}
		};

		if (isClient) {
			loadLeaflet();
		}
	}, [isClient]);

	// ========================================
	// 🧮 FUNÇÕES UTILITÁRIAS
	// ========================================

	/**
	 * Calcular centro do mapa baseado nos dados
	 */
	const getMapCenter = useCallback((): [number, number] => {
		if (data.length === 0) return [0, 0];

		const totalLat = data.reduce((sum: number, point: HeatmapPoint) => sum + point.lat, 0);
		const totalLng = data.reduce((sum: number, point: HeatmapPoint) => sum + point.lng, 0);

		return [totalLat / data.length, totalLng / data.length];
	}, [data]);

	/**
	 * Calcular raio do marcador baseado no número de cliques
	 */
	const getMarkerRadius = useCallback((clicks: number, maxClicks: number) => {
		const minRadius = 12;
		const maxRadius = 35;
		const normalizedClicks = maxClicks > 0 ? clicks / maxClicks : 0;
		return minRadius + normalizedClicks * (maxRadius - minRadius);
	}, []);

	/**
	 * Calcular cor do marcador baseado no número de cliques
	 */
	const getMarkerColor = useCallback((clicks: number, maxClicks: number) => {
		const normalizedClicks = clicks / maxClicks;

		if (normalizedClicks > 0.8) return '#d32f2f'; // Vermelho intenso
		if (normalizedClicks > 0.6) return '#f57c00'; // Laranja escuro
		if (normalizedClicks > 0.4) return '#ff9800'; // Laranja
		if (normalizedClicks > 0.2) return '#ffc107'; // Amarelo
		return '#4caf50'; // Verde
	}, []);

	/**
	 * URLs dos tiles baseado no estilo
	 */
	const getTileUrl = useCallback((style: string) => {
		switch (style) {
			case 'satellite':
				return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
			case 'dark':
				return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
			default:
				return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		}
	}, []);

	// ========================================
	// 🎨 RENDERIZAÇÃO
	// ========================================

	// Estado de loading
	if (!isClient || !mapReady) {
		return (
			<Card sx={{ height: height, borderRadius: '16px' }}>
				<CardContent
					sx={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column'
					}}
				>
					<CircularProgress
						size={40}
						sx={{ mb: 2 }}
					/>
					<Typography
						variant="body2"
						color="text.secondary"
					>
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
				<CardContent
					sx={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column'
					}}
				>
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						Erro ao carregar o mapa
					</Alert>
					<Typography
						variant="body2"
						color="text.secondary"
						textAlign="center"
					>
						Não foi possível carregar os componentes do mapa.
						<br />
						Verifique sua conexão com a internet.
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
	if (!loading && (!data || data.length === 0)) {
		return (
			<Card sx={{ height: height, borderRadius: '16px' }}>
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
					<LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
					<Typography
						variant="h6"
						color="text.primary"
						gutterBottom
						sx={{
							position: 'relative',
							zIndex: 1,
							mt: 1
						}}
					>
						{title}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 2 }}
					>
						Nenhum dado geográfico disponível ainda.
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Os dados aparecerão aqui conforme os cliques forem registrados.
					</Typography>
					{onRefresh && (
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
		<Card
			sx={{
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
			}}
		>
			<CardContent sx={{ height: '100%', p: 0 }}>
				{/* Header com controles */}
				{showControls && (
					<Box
						sx={{
							p: 2,
							borderBottom: 1,
							borderColor: 'divider',
							background: alpha(theme.palette.background.paper, 0.95),
							backdropFilter: 'blur(10px)'
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Public color="primary" />
								<Typography
									variant="h6"
									fontWeight="600"
									sx={{
										fontFamily: 'Inter, system-ui, sans-serif',
										position: 'relative',
										zIndex: 1,
										mt: 1
									}}
								>
									{title}
								</Typography>
								{onRefresh && (
									<Chip
										label="Tempo Real"
										color="success"
										size="small"
										icon={<Speed />}
										sx={{ ml: 1 }}
									/>
								)}
							</Box>

							<Stack
								direction="row"
								spacing={1}
							>
								<Tooltip title="Atualizar dados">
									<IconButton
										onClick={onRefresh}
										disabled={loading || !onRefresh}
									>
										<Refresh />
									</IconButton>
								</Tooltip>
								<Tooltip title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}>
									<IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
										<Fullscreen />
									</IconButton>
								</Tooltip>
							</Stack>
						</Box>

						{/* Estatísticas */}
						{showStats && stats && (
							<Stack
								direction="row"
								spacing={1}
								flexWrap="wrap"
								sx={{ mb: 2 }}
							>
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
								{stats?.lastUpdate && (
									<Chip
										label={`Atualizado: ${new Date(stats.lastUpdate).toLocaleTimeString()}`}
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
								<Typography
									variant="caption"
									color="text.secondary"
									gutterBottom
								>
									Cliques mínimos: {minClicksFilter}
								</Typography>
								<Slider
									value={minClicksFilter}
									onChange={(_, value) => {
										// console.log('🎚️ Mudando filtro de cliques para:', value);
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

							<Stack
								direction="row"
								spacing={1}
							>
								<Button
									size="small"
									variant={mapStyle === 'street' ? 'contained' : 'outlined'}
									onClick={() => setMapStyle('street')}
								>
									Ruas
								</Button>
								<Button
									size="small"
									variant={mapStyle === 'satellite' ? 'contained' : 'outlined'}
									onClick={() => setMapStyle('satellite')}
								>
									Satélite
								</Button>
								<Button
									size="small"
									variant={mapStyle === 'dark' ? 'contained' : 'outlined'}
									onClick={() => setMapStyle('dark')}
								>
									Escuro
								</Button>
							</Stack>
						</Box>

						{error && (
							<Alert
								severity="warning"
								sx={{ mt: 2 }}
							>
								{error} (Exibindo dados de exemplo)
							</Alert>
						)}
					</Box>
				)}

				{/* Mapa */}
				<Box
					sx={{
						height: showControls ? `calc(100% - 200px)` : '100%',
						position: 'relative'
					}}
				>
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
											<Typography
												variant="subtitle2"
												fontWeight="bold"
												gutterBottom
											>
												📍 {point.city}, {point.country}
											</Typography>
											<Typography
												variant="h6"
												color="primary"
												gutterBottom
												sx={{
													position: 'relative',
													zIndex: 1
												}}
											>
												{point.clicks.toLocaleString()} cliques
											</Typography>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Coordenadas: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
											</Typography>
											{point.state_name && (
												<Typography
													variant="caption"
													color="text.secondary"
													display="block"
												>
													Estado/Região: {point.state_name}
												</Typography>
											)}
											{point.iso_code && (
												<Typography
													variant="caption"
													color="text.secondary"
													display="block"
												>
													Código: {point.iso_code} | Moeda: {point.currency}
												</Typography>
											)}
											{point.continent && (
												<Typography
													variant="caption"
													color="text.secondary"
													display="block"
												>
													Continente: {point.continent}
												</Typography>
											)}
											{point.last_click && (
												<Typography
													variant="caption"
													color="primary"
													display="block"
													sx={{ mt: 1 }}
												>
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
