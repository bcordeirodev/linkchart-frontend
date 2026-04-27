import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { chartByType } from '@/lib/theme/colors/chart';
import { radiusTokens } from '@/lib/theme/designSystem';

import type { HeatmapPoint } from '@/types';
import type React from 'react';

interface HeatmapMapProps {
	data: HeatmapPoint[];
	height?: number;
	onPointClick?: (point: HeatmapPoint) => void;
	minClicks?: number;
	loading?: boolean;
}

// Componentes Leaflet carregados dinamicamente
interface LeafletComponents {
	MapContainer: React.ComponentType<any>;
	TileLayer: React.ComponentType<any>;
	CircleMarker: React.ComponentType<any>;
	Popup: React.ComponentType<any>;
}

/**
 * 🗺️ HEATMAP MAP - MAPA INTERATIVO
 *
 * @description
 * Componente responsável pela renderização do mapa interativo:
 * - Carregamento dinâmico do Leaflet (SSR safe)
 * - Renderização de pontos de calor
 * - Interações com pontos
 * - Popups informativos
 *
 * @responsibilities
 * - Carregar Leaflet dinamicamente
 * - Renderizar pontos no mapa
 * - Gerenciar interações
 * - Mostrar popups com informações
 */
export function HeatmapMap({ data, height = 600, onPointClick, minClicks = 1, loading = false }: HeatmapMapProps) {
	const [leafletComponents, setLeafletComponents] = useState<LeafletComponents | null>(null);
	const [mapError, setMapError] = useState<string | null>(null);

	// Carregar Leaflet dinamicamente (SSR safe)
	useEffect(() => {
		const loadLeaflet = async () => {
			try {
				// Carregar CSS do Leaflet
				if (!document.querySelector('link[href*="leaflet.css"]')) {
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
					document.head.appendChild(link);
				}

				// Carregar componentes React Leaflet
				const [{ MapContainer }, { TileLayer }, { CircleMarker }, { Popup }] = await Promise.all([
					import('react-leaflet/MapContainer'),
					import('react-leaflet/TileLayer'),
					import('react-leaflet/CircleMarker'),
					import('react-leaflet/Popup')
				]);

				setLeafletComponents({
					MapContainer,
					TileLayer,
					CircleMarker,
					Popup
				});
			} catch (error) {
				setMapError('Erro ao carregar componentes do mapa');
				console.error('Erro ao carregar Leaflet:', error);
			}
		};

		loadLeaflet();
	}, []);

	// Filtrar dados por cliques mínimos
	const filteredData = data.filter((point) => point.clicks >= minClicks);

	// Calcular centro do mapa baseado nos dados
	const center: [number, number] =
		filteredData.length > 0
			? [
					filteredData.reduce((sum, point) => sum + point.lat, 0) / filteredData.length,
					filteredData.reduce((sum, point) => sum + point.lng, 0) / filteredData.length
				]
			: [0, 0];

	// Calcular raio dos pontos baseado nos cliques
	const getPointRadius = (clicks: number) => {
		const maxClicks = Math.max(...filteredData.map((p) => p.clicks));
		return Math.max(5, Math.min(30, (clicks / maxClicks) * 25));
	};

	// Calcular cor baseada na intensidade (paleta SP2 chartByType.heatmap)
	const getPointColor = (clicks: number) => {
		const maxClicks = Math.max(...filteredData.map((p) => p.clicks));
		const intensity = clicks / maxClicks;

		if (intensity > 0.6) {
			return chartByType.heatmap.intense;
		}

		if (intensity > 0.4) {
			return chartByType.heatmap.high;
		}

		if (intensity > 0.2) {
			return chartByType.heatmap.medium;
		}

		return chartByType.heatmap.low;
	};

	// Estado de carregamento do Leaflet
	if (!leafletComponents) {
		return (
			<Box
				sx={{
					height,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'background.paper',
					borderRadius: `${radiusTokens.md}px`,
					border: 1,
					borderColor: 'divider'
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<CircularProgress sx={{ mb: 2 }} />
					<Typography
						variant='body2'
						color='text.secondary'
					>
						Carregando mapa interativo...
					</Typography>
				</Box>
			</Box>
		);
	}

	// Estado de erro
	if (mapError) {
		return (
			<Alert
				severity='error'
				sx={{ height }}
			>
				{mapError}
			</Alert>
		);
	}

	// Estado sem dados
	if (filteredData.length === 0) {
		return (
			<Box
				sx={{
					height,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'background.paper',
					borderRadius: `${radiusTokens.md}px`,
					border: 1,
					borderColor: 'divider'
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<Typography
						variant='h6'
						color='text.secondary'
						gutterBottom
					>
						🗺️ Nenhum Ponto no Mapa
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
					>
						Ajuste o filtro de cliques mínimos ou aguarde mais dados.
					</Typography>
				</Box>
			</Box>
		);
	}

	const { MapContainer, TileLayer, CircleMarker, Popup } = leafletComponents;

	return (
		<Box
			sx={{
				height,
				borderRadius: `${radiusTokens.md}px`,
				overflow: 'hidden',
				border: 1,
				borderColor: 'divider'
			}}
		>
			<MapContainer
				center={center}
				zoom={2}
				style={{ height: '100%', width: '100%' }}
				zoomControl
				scrollWheelZoom
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>

				{filteredData.map((point, index) => (
					<CircleMarker
						key={`${point.lat}-${point.lng}-${index}`}
						center={[point.lat, point.lng]}
						radius={getPointRadius(point.clicks)}
						fillColor={getPointColor(point.clicks)}
						color={getPointColor(point.clicks)}
						weight={2}
						opacity={0.8}
						fillOpacity={0.6}
						eventHandlers={{
							click: () => onPointClick?.(point)
						}}
					>
						<Popup>
							<Box sx={{ minWidth: 200 }}>
								<Typography
									variant='subtitle2'
									gutterBottom
								>
									📍 {point.city}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									gutterBottom
								>
									{point.country}
								</Typography>
								<Typography
									variant='h6'
									color='primary.main'
								>
									{point.clicks} cliques
								</Typography>
								{point.last_click ? (
									<Typography
										variant='caption'
										color='text.secondary'
									>
										Último: {new Date(point.last_click).toLocaleString()}
									</Typography>
								) : null}
							</Box>
						</Popup>
					</CircleMarker>
				))}
			</MapContainer>
		</Box>
	);
}

export default HeatmapMap;
