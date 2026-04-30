import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart3, Globe, Lightbulb, Target, Trophy, TrendingUp } from 'lucide-react';

import { formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';

import type { HeatmapPoint } from '@/types';

interface GeographicInsightsProps {
	data: HeatmapPoint[];
	countries: { country: string; iso_code?: string; clicks: number; currency?: string }[];
	states: { country?: string; state: string; state_name?: string; clicks: number }[];
	cities: { city: string; state?: string; country?: string; clicks: number }[];
}

export function GeographicInsights({ data, countries, states: _states, cities }: GeographicInsightsProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const cardSx = {
		borderRadius: `${radiusTokens.lg}px`,
		boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
		transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
		'&:hover': {
			boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm
		}
	} as const;

	// Calcular estatísticas
	const totalClicks = data.reduce((sum, point) => sum + point.clicks, 0);
	const uniqueCountries = new Set(data.map((point) => point.country)).size;
	const uniqueCities = new Set(data.map((point) => point.city)).size;

	// Preparar dados para gráficos
	const countryChartData = countries.slice(0, 8).map((country) => ({
		name: country.country,
		value: country.clicks,
		currency: country.currency || 'USD'
	}));

	return (
		<Box sx={{ mt: 3 }}>
			<Typography
				variant='h6'
				gutterBottom
				sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
			>
				<BarChart3
					size={16}
					strokeWidth={1.5}
				/>
				Insights Geográficos Detalhados
			</Typography>

			{/* Estatísticas rápidas */}
			<Grid
				container
				spacing={2}
				sx={{ mb: 3 }}
			>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card sx={cardSx}>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant='h4'
								color='primary'
								gutterBottom
							>
								{totalClicks}
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								Total de Cliques
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card sx={cardSx}>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant='h4'
								color='secondary'
								gutterBottom
							>
								{uniqueCountries}
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								Países Alcançados
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card sx={cardSx}>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant='h4'
								color='info'
								gutterBottom
							>
								{uniqueCities}
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								Cidades Únicas
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<Card sx={cardSx}>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant='h4'
								color='success'
								gutterBottom
							>
								{data.length}
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								Localizações
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Gráficos */}
			<Grid
				container
				spacing={3}
			>
				{/* Distribuição por País */}
				<Grid
					item
					xs={12}
					md={12}
				>
					<Card sx={cardSx}>
						<CardContent>
							<Typography
								variant='h6'
								gutterBottom
								sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
							>
								<Globe
									size={16}
									strokeWidth={1.5}
								/>
								Distribuição por País
							</Typography>
							<ApexChartWrapper
								type='pie'
								height={300}
								{...formatPieChart(countryChartData, 'name', 'value', isDark)}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Insights detalhados */}
			<Card sx={{ ...cardSx, mt: 3 }}>
				<CardContent>
					<Typography
						variant='h6'
						gutterBottom
						sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
					>
						<Lightbulb
							size={16}
							strokeWidth={1.5}
						/>
						Insights de Mercado
					</Typography>

					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Typography
								variant='subtitle2'
								gutterBottom
								sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
							>
								<Target
									size={16}
									strokeWidth={1.5}
								/>
								Mercados Principais
							</Typography>
							<Stack
								direction='row'
								spacing={1}
								flexWrap='wrap'
								sx={{ mb: 2 }}
							>
								{countries.slice(0, 5).map((country, index) => (
									<Chip
										key={country.country}
										label={`${country.country} (${country.clicks})`}
										size='small'
										color={index === 0 ? 'primary' : 'default'}
										variant={index === 0 ? 'filled' : 'outlined'}
									/>
								))}
							</Stack>
						</Grid>

						<Grid
							item
							xs={12}
							md={6}
						>
							<Typography
								variant='subtitle2'
								gutterBottom
								sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
							>
								<Trophy
									size={16}
									strokeWidth={1.5}
								/>
								Cidades com Mais Engajamento
							</Typography>
							<Stack
								direction='row'
								spacing={1}
								flexWrap='wrap'
							>
								{cities.slice(0, 5).map((city, index) => (
									<Chip
										key={index}
										label={`${city.city} (${city.clicks})`}
										size='small'
										color={index === 0 ? 'secondary' : 'default'}
										variant={index === 0 ? 'filled' : 'outlined'}
									/>
								))}
							</Stack>
						</Grid>
					</Grid>

					<Divider sx={{ my: 2 }} />

					{/* Recomendações */}
					<Box>
						<Typography
							variant='subtitle2'
							gutterBottom
							sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<TrendingUp
								size={16}
								strokeWidth={1.5}
							/>
							Recomendações Estratégicas
						</Typography>
						<Stack spacing={1}>
							{countries.length > 0 && (
								<Typography
									variant='body2'
									color='text.secondary'
								>
									• <strong>{countries[0].country}</strong> é seu mercado principal com{' '}
									{countries[0].clicks} cliques. Considere criar conteúdo específico para este
									mercado.
								</Typography>
							)}
							{cities.length > 0 && (
								<Typography
									variant='body2'
									color='text.secondary'
								>
									• <strong>{cities[0].city}</strong> é a cidade com mais engajamento. Explore
									oportunidades de marketing local nesta região.
								</Typography>
							)}
							{uniqueCountries > 3 && (
								<Typography
									variant='body2'
									color='text.secondary'
								>
									• Seu conteúdo está alcançando {uniqueCountries} países diferentes. Considere
									estratégias de internacionalização.
								</Typography>
							)}
						</Stack>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
