import { Public, LocationOn } from '@mui/icons-material';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack } from '@mui/material';

import type { HeatmapPoint } from '@/types';

interface HeatmapStatsProps {
	data: HeatmapPoint[];
	stats?: {
		totalPoints: number;
		totalClicks: number;
		maxClicks: number;
		topCountry: string;
		topCity: string;
		avgClicksPerPoint: number;
		coveragePercentage: number;
	};
	globalMode?: boolean;
	showTitle?: boolean;
	title?: string;
	showDetailed?: boolean;
}

/**
 * 📊 HEATMAP STATS - ESTATÍSTICAS DO MAPA
 *
 * @description
 * Componente responsável por exibir estatísticas agregadas do mapa de calor:
 * - Métricas principais (total de pontos, cliques, etc.)
 * - Top localizações
 * - Indicadores de cobertura
 * - Estatísticas calculadas
 *
 * @responsibilities
 * - Calcular estatísticas em tempo real
 * - Renderizar métricas em cards
 * - Mostrar top localizações
 */
export function HeatmapStats({
	data,
	stats,
	globalMode: _globalMode = false,
	showTitle = false,
	title = '📊 Estatísticas do Heatmap',
	showDetailed = true
}: HeatmapStatsProps) {
	// Calcular estatísticas se não fornecidas
	const calculatedStats = stats || {
		totalPoints: data.length,
		totalClicks: data.reduce((sum, point) => sum + point.clicks, 0),
		maxClicks: Math.max(...data.map((point) => point.clicks), 0),
		topCountry: data[0]?.country || 'N/A',
		topCity: data[0]?.city || 'N/A',
		avgClicksPerPoint:
			data.length > 0 ? Math.round(data.reduce((sum, point) => sum + point.clicks, 0) / data.length) : 0,
		coveragePercentage: Math.min((data.length / 100) * 100, 100) // Estimativa
	};

	// Estatísticas específicas do heatmap usando dados enriquecidos
	const uniqueVisitors = data.reduce((sum, point) => sum + (point.unique_visitors || 0), 0);
	const totalActiveDays = Math.max(...data.map((point) => point.active_days || 0), 0);
	const avgPeakHour =
		data.length > 0 ? data.reduce((sum, point) => sum + (point.avg_hour || 12), 0) / data.length : 12;
	const weekendPercentage =
		data.length > 0 ? data.reduce((sum, point) => sum + (point.weekend_percentage || 0), 0) / data.length : 0;
	const totalTimezones = new Set(data.map((point) => point.timezone).filter(Boolean)).size;
	const totalContinents = new Set(data.map((point) => point.continent).filter(Boolean)).size;

	// Top 5 países por cliques
	const topCountries = data.reduce((acc: Record<string, number>, point) => {
		acc[point.country] = (acc[point.country] || 0) + point.clicks;
		return acc;
	}, {});
	const topCountriesArray = Object.entries(topCountries)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(([country, clicks]) => ({ country, clicks }));

	// Top 5 cidades por cliques
	const topCities = data.reduce((acc: Record<string, number>, point) => {
		const cityKey = `${point.city}, ${point.country}`;
		acc[cityKey] = (acc[cityKey] || 0) + point.clicks;
		return acc;
	}, {});
	const topCitiesArray = Object.entries(topCities)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(([cityCountry, clicks]) => ({ cityCountry, clicks }));

	return (
		<Card>
			<CardContent>
				{showTitle ? (
					<Typography
						variant='h6'
						gutterBottom
					>
						{title}
					</Typography>
				) : null}

				{/* Métricas principais */}
				<Grid
					container
					spacing={2}
					sx={{ mb: 2 }}
				>
					<Grid
						item
						xs={6}
						sm={3}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Typography
								variant='h6'
								color='primary.main'
							>
								{calculatedStats.totalPoints}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Localizações
							</Typography>
						</Box>
					</Grid>
					<Grid
						item
						xs={6}
						sm={3}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Typography
								variant='h6'
								color='success.main'
							>
								{calculatedStats.totalClicks}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Total Cliques
							</Typography>
						</Box>
					</Grid>
					<Grid
						item
						xs={6}
						sm={3}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Typography
								variant='h6'
								color='warning.main'
							>
								{calculatedStats.maxClicks}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Máximo
							</Typography>
						</Box>
					</Grid>
					<Grid
						item
						xs={6}
						sm={3}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Typography
								variant='h6'
								color='info.main'
							>
								{calculatedStats.avgClicksPerPoint}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Média/Local
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* Estatísticas específicas do heatmap */}
				<Box sx={{ mt: 3, mb: 2 }}>
					<Typography
						variant='subtitle2'
						gutterBottom
						color='text.secondary'
					>
						🌍 Análise Geográfica Avançada
					</Typography>
					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={6}
							sm={4}
						>
							<Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
								<Typography
									variant='body2'
									fontWeight='bold'
									color='primary.main'
								>
									{uniqueVisitors.toLocaleString()}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									Visitantes Únicos
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={4}
						>
							<Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
								<Typography
									variant='body2'
									fontWeight='bold'
									color='success.main'
								>
									{totalActiveDays}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									Dias Ativos
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={4}
						>
							<Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
								<Typography
									variant='body2'
									fontWeight='bold'
									color='info.main'
								>
									{Math.round(avgPeakHour)}:00
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									Horário de Pico
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={4}
						>
							<Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
								<Typography
									variant='body2'
									fontWeight='bold'
									color='warning.main'
								>
									{weekendPercentage.toFixed(1)}%
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									Fins de Semana
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={4}
						>
							<Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
								<Typography
									variant='body2'
									fontWeight='bold'
									color='secondary.main'
								>
									{totalTimezones}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									Fusos Horários
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							sm={4}
						>
							<Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
								<Typography
									variant='body2'
									fontWeight='bold'
									color='error.main'
								>
									{totalContinents}
								</Typography>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									Continentes
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Box>

				{showDetailed ? (
					<>
						{/* Top países */}
						<Box sx={{ mb: 2 }}>
							<Typography
								variant='subtitle2'
								gutterBottom
							>
								🏆 Top Países
							</Typography>
							<Stack
								direction='row'
								spacing={1}
								flexWrap='wrap'
								useFlexGap
							>
								{topCountriesArray.map(({ country, clicks }) => (
									<Chip
										key={country}
										label={`${country}: ${clicks}`}
										size='small'
										variant='outlined'
										icon={<Public fontSize='small' />}
									/>
								))}
							</Stack>
						</Box>

						{/* Top cidades */}
						<Box>
							<Typography
								variant='subtitle2'
								gutterBottom
							>
								🏙️ Top Cidades
							</Typography>
							<Stack
								direction='row'
								spacing={1}
								flexWrap='wrap'
								useFlexGap
							>
								{topCitiesArray.map(({ cityCountry, clicks }) => (
									<Chip
										key={cityCountry}
										label={`${cityCountry}: ${clicks}`}
										size='small'
										variant='outlined'
										icon={<LocationOn fontSize='small' />}
									/>
								))}
							</Stack>
						</Box>
					</>
				) : null}
			</CardContent>
		</Card>
	);
}

export default HeatmapStats;
