import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Divider } from '@mui/material';
import { HeatmapPoint } from '@/features/analytics/hooks/useEnhancedAnalytics';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';

interface GeographicInsightsProps {
	data: HeatmapPoint[];
	countries: { country: string; iso_code: string; clicks: number; currency: string }[];
	states: { country: string; state: string; state_name: string; clicks: number }[];
	cities: { city: string; state: string; country: string; clicks: number }[];
}

export function GeographicInsights({ data, countries, states, cities }: GeographicInsightsProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	// Calcular estatísticas
	const totalClicks = data.reduce((sum, point) => sum + point.clicks, 0);
	const uniqueCountries = new Set(data.map((point) => point.country)).size;
	const uniqueCities = new Set(data.map((point) => point.city)).size;

	// Preparar dados para gráficos
	const countryChartData = countries.slice(0, 8).map((country) => ({
		name: country.country,
		value: country.clicks,
		currency: country.currency
	}));

	const cityChartData = cities.slice(0, 6).map((city) => ({
		name: `${city.city}, ${city.state}`,
		value: city.clicks,
		country: city.country
	}));

	const stateChartData = states.slice(0, 6).map((state) => ({
		name: `${state.state_name}, ${state.country}`,
		value: state.clicks
	}));

	// Calcular distribuição por continente (simulado)
	const continentData = [
		{
			name: 'América do Norte',
			value: countries
				.filter((c) => c.country === 'United States' || c.country === 'Canada')
				.reduce((sum, c) => sum + c.clicks, 0)
		},
		{
			name: 'América do Sul',
			value: countries
				.filter((c) => c.country === 'Brazil' || c.country === 'Argentina')
				.reduce((sum, c) => sum + c.clicks, 0)
		},
		{
			name: 'Europa',
			value: countries
				.filter((c) => ['Germany', 'France', 'UK', 'Spain'].includes(c.country))
				.reduce((sum, c) => sum + c.clicks, 0)
		},
		{
			name: 'Ásia',
			value: countries
				.filter((c) => ['China', 'Japan', 'India'].includes(c.country))
				.reduce((sum, c) => sum + c.clicks, 0)
		},
		{ name: 'Outros', value: totalClicks - countries.slice(0, 8).reduce((sum, c) => sum + c.clicks, 0) }
	].filter((item) => item.value > 0);

	return (
		<Box sx={{ mt: 3 }}>
			<Typography
				variant="h6"
				gutterBottom
			>
				📊 Insights Geográficos Detalhados
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
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant="h4"
								color="primary"
								gutterBottom
							>
								{totalClicks}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
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
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant="h4"
								color="secondary"
								gutterBottom
							>
								{uniqueCountries}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
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
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant="h4"
								color="info"
								gutterBottom
							>
								{uniqueCities}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
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
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography
								variant="h4"
								color="success"
								gutterBottom
							>
								{data.length}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
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
					md={6}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								🌍 Distribuição por País
							</Typography>
							<ApexChartWrapper
								type="pie"
								height={300}
								{...formatPieChart(countryChartData, 'name', 'value', isDark)}
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Distribuição por Continente */}
				<Grid
					item
					xs={12}
					md={6}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								🌎 Distribuição por Continente
							</Typography>
							<ApexChartWrapper
								type="donut"
								height={300}
								{...formatPieChart(continentData, 'name', 'value', isDark)}
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Top Cidades */}
				<Grid
					item
					xs={12}
					md={6}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								🏙️ Top Cidades
							</Typography>
							<ApexChartWrapper
								type="bar"
								height={300}
								{...formatBarChart(
									cityChartData,
									'name',
									'value',
									theme.palette.warning.main,
									true,
									isDark
								)}
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Top Estados/Regiões */}
				<Grid
					item
					xs={12}
					md={6}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								🗺️ Top Estados/Regiões
							</Typography>
							<ApexChartWrapper
								type="bar"
								height={300}
								{...formatBarChart(
									stateChartData,
									'name',
									'value',
									theme.palette.success.main,
									false,
									isDark
								)}
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Insights detalhados */}
			<Card sx={{ mt: 3 }}>
				<CardContent>
					<Typography
						variant="h6"
						gutterBottom
					>
						💡 Insights de Mercado
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
								variant="subtitle2"
								gutterBottom
							>
								🎯 Mercados Principais
							</Typography>
							<Stack
								direction="row"
								spacing={1}
								flexWrap="wrap"
								sx={{ mb: 2 }}
							>
								{countries.slice(0, 5).map((country, index) => (
									<Chip
										key={index}
										label={`${country.country} (${country.clicks})`}
										size="small"
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
								variant="subtitle2"
								gutterBottom
							>
								🏆 Cidades com Mais Engajamento
							</Typography>
							<Stack
								direction="row"
								spacing={1}
								flexWrap="wrap"
							>
								{cities.slice(0, 5).map((city, index) => (
									<Chip
										key={index}
										label={`${city.city} (${city.clicks})`}
										size="small"
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
							variant="subtitle2"
							gutterBottom
						>
							📈 Recomendações Estratégicas
						</Typography>
						<Stack spacing={1}>
							{countries.length > 0 && (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									• <strong>{countries[0].country}</strong> é seu mercado principal com{' '}
									{countries[0].clicks} cliques. Considere criar conteúdo específico para este
									mercado.
								</Typography>
							)}
							{cities.length > 0 && (
								<Typography
									variant="body2"
									color="text.secondary"
								>
									• <strong>{cities[0].city}</strong> é a cidade com mais engajamento. Explore
									oportunidades de marketing local nesta região.
								</Typography>
							)}
							{uniqueCountries > 3 && (
								<Typography
									variant="body2"
									color="text.secondary"
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
