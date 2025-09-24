import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { createPresetAnimations, createComponentColorSet } from '@/lib/theme';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';

import type { ChartsProps } from '@/features/analytics/components/types';

/**
 * 📊 CHARTS COM STYLED COMPONENTS
 * Gráficos unificados com melhor tratamento de dados e erro
 */
export function Charts({ data, variant = 'full', height = 300, showAllCharts = true }: ChartsProps) {
	try {
		const theme = useTheme();
		const isDark = theme.palette.mode === 'dark';

		// Usa utilitários de tema
		const animations = createPresetAnimations(theme);
		const successColors = createComponentColorSet(theme, 'success');
		const infoColors = createComponentColorSet(theme, 'info');

		// Estilos padronizados para gráficos (removidos pois não são mais utilizados com Card)

		// Debug dos dados rcebidos (apenas em desenvolvimento)
		// Validação silenciosa dos dados recebidos

		// Verificação de segurança para dados
		if (!data) {
			return (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
					>
						<EmptyState
							variant='charts'
							height={400}
							title='Carregando Gráficos...'
							description='Aguarde enquanto carregamos os dados dos seus gráficos.'
							icon='⏳'
						/>
					</Grid>
				</Grid>
			);
		}

		// Função utilitária para verificar dados
		const checkDataAvailability = () => {
			if (!data) {
				return { hasTemporalData: false, hasGeographicData: false, hasDeviceData: false };
			}

			// Verificar se há dados temporais com cliques reais
			const hasTemporalData = !!(
				data.temporal &&
				((data.temporal.clicks_by_hour?.length > 0 && data.temporal.clicks_by_hour.some((h) => h.clicks > 0)) ||
					(data.temporal.clicks_by_day_of_week?.length > 0 &&
						data.temporal.clicks_by_day_of_week.some((d) => d.clicks > 0)))
			);

			// Verificar se há dados geográficos com cliques reais
			const hasGeographicData = !!(
				data.geographic &&
				((data.geographic.top_countries?.length > 0 &&
					data.geographic.top_countries.some((c) => c.clicks > 0)) ||
					(data.geographic.top_cities?.length > 0 && data.geographic.top_cities.some((c) => c.clicks > 0)))
			);

			// Verificar se há dados de dispositivos com cliques reais
			const hasDeviceData = !!(
				data.audience?.device_breakdown?.length > 0 && data.audience.device_breakdown.some((d) => d.clicks > 0)
			);

			// Debug detalhado (apenas em desenvolvimento)

			return { hasTemporalData, hasGeographicData, hasDeviceData };
		};

		const { hasTemporalData, hasGeographicData, hasDeviceData } = checkDataAvailability();

		// Usar dados diretamente
		const chartData = data;

		// Validação silenciosa de disponibilidade de dados

		return (
			<Grid
				container
				spacing={3}
				sx={{
					...animations.fadeIn,
					mb: 3
				}}
			>
				{/* Gráficos principais - sempre mostrados se há dados */}
				{hasTemporalData && chartData ? (
					<>
						{/* Gráfico Principal - Cliques por Hora */}
						<Grid
							item
							xs={12}
							md={6}
							lg={6}
						>
							<Box
								sx={{
									height: '100%',
									...animations.cardHover
								}}
							>
								<Card>
									<CardContent>
										<Typography
											variant='h6'
											gutterBottom
											sx={{
												position: 'relative',
												zIndex: 1,
												mt: 1
											}}
										>
											📈 Cliques por Hora do Dia
										</Typography>
										<Box sx={{ mb: 2 }}>
											<ApexChartWrapper
												type='area'
												height={height}
												{...formatAreaChart(
													chartData.temporal?.clicks_by_hour || [],
													'hour',
													'clicks',
													'#1976d2',
													isDark
												)}
											/>
										</Box>
									</CardContent>
								</Card>
							</Box>
						</Grid>

						{/* Gráfico de Dias da Semana */}
						<Grid
							item
							xs={12}
							md={6}
							lg={6}
						>
							<Box
								sx={{
									height: '100%',
									...animations.cardHover
								}}
							>
								<Card>
									<CardContent>
										<Typography
											variant='h6'
											gutterBottom
											sx={{
												position: 'relative',
												zIndex: 1,
												mt: 1
											}}
										>
											📅 Cliques por Dia da Semana
										</Typography>
										<Box sx={{ mb: 2 }}>
											<ApexChartWrapper
												type='bar'
												height={height}
												{...formatBarChart(
													chartData.temporal?.clicks_by_day_of_week || [],
													'day_name',
													'clicks',
													'#1976d2',
													false, // vertical bars
													isDark
												)}
											/>
										</Box>
									</CardContent>
								</Card>
							</Box>
						</Grid>
					</>
				) : null}

				{/* Gráficos de dispositivos e países - dashboard e full */}
				{(variant === 'dashboard' || variant === 'full') &&
					(hasDeviceData || hasGeographicData) &&
					chartData ? (
					<>
						{/* Dispositivos */}
						{hasDeviceData ? (
							<Grid
								item
								xs={12}
								md={6}
								lg={6}
							>
								<Box
									sx={{
										height: '100%',
										...animations.cardHover
									}}
								>
									<Card>
										<CardContent>
											<Typography
												variant='h6'
												gutterBottom
												sx={{
													position: 'relative',
													zIndex: 1,
													mt: 1
												}}
											>
												📱 Dispositivos
											</Typography>
											<Box sx={{ mb: 2 }}>
												<ApexChartWrapper
													type='donut'
													height={height}
													{...formatPieChart(
														(chartData.audience?.device_breakdown || []).map((item) => ({
															device: item.device,
															clicks: item.clicks
														})),
														'device',
														'clicks',
														isDark
													)}
												/>
											</Box>
										</CardContent>
									</Card>
								</Box>
							</Grid>
						) : null}

						{/* Países */}
						{hasGeographicData ? (
							<Grid
								item
								xs={12}
								md={6}
								lg={6}
							>
								<Box
									sx={{
										height: '100%',
										...animations.cardHover
									}}
								>
									<Card>
										<CardContent>
											<Typography
												variant='h6'
												gutterBottom
												sx={{
													position: 'relative',
													zIndex: 1,
													mt: 1
												}}
											>
												🌍 Top Países
											</Typography>
											<Box sx={{ mb: 2 }}>
												<ApexChartWrapper
													type='bar'
													height={height}
													{...formatBarChart(
														(chartData.geographic?.top_countries || []).slice(0, 10),
														'country',
														'clicks',
														successColors.main,
														true, // horizontal bars
														isDark
													)}
												/>
											</Box>
										</CardContent>
									</Card>
								</Box>
							</Grid>
						) : null}
					</>
				) : null}

				{/* Gráficos avançados - apenas analytics e full */}
				{(variant === 'analytics' || variant === 'full') && showAllCharts && hasGeographicData && chartData ? (
					<>
						{/* Estados/Regiões */}
						{chartData?.geographic?.top_states?.length > 0 ? (
							<Grid
								item
								xs={12}
								md={6}
								lg={6}
							>
								<Box
									sx={{
										height: '100%',
										...animations.cardHover
									}}
								>
									<Card>
										<CardContent>
											<Typography
												variant='h6'
												gutterBottom
												sx={{
													position: 'relative',
													zIndex: 1,
													mt: 1
												}}
											>
												🏛️ Top Estados/Regiões
											</Typography>
											<Box sx={{ mb: 2 }}>
												<ApexChartWrapper
													type='bar'
													height={height}
													{...formatBarChart(
														chartData.geographic.top_states.slice(0, 8) as Record<
															string,
															unknown
														>[],
														'state',
														'clicks',
														infoColors.main,
														true,
														isDark
													)}
												/>
											</Box>
										</CardContent>
									</Card>
								</Box>
							</Grid>
						) : null}

						{/* Cidades */}
						{chartData?.geographic?.top_cities?.length > 0 ? (
							<Grid
								item
								xs={12}
								md={6}
								lg={6}
							>
								<Box
									sx={{
										height: '100%',
										...animations.cardHover
									}}
								>
									<Card>
										<CardContent>
											<Typography
												variant='h6'
												gutterBottom
												sx={{
													position: 'relative',
													zIndex: 1,
													mt: 1
												}}
											>
												🏙️ Top Cidades
											</Typography>
											<Box sx={{ mb: 2 }}>
												<ApexChartWrapper
													type='donut'
													height={height}
													{...formatPieChart(
														chartData.geographic.top_cities.slice(0, 8) as Record<
															string,
															unknown
														>[],
														'city',
														'clicks',
														isDark
													)}
												/>
											</Box>
										</CardContent>
									</Card>
								</Box>
							</Grid>
						) : null}
					</>
				) : null}

				{/* Estado vazio */}
				{!hasTemporalData && !hasGeographicData && !hasDeviceData && (
					<Grid
						item
						xs={12}
					>
						<EmptyState
							variant='charts'
							height={400}
							title='📊 Nenhum Dado Disponível'
							description='Compartilhe seus links para ver gráficos detalhados de cliques por dia da semana e países.'
						/>
					</Grid>
				)}
			</Grid>
		);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error in Charts component:', error);
		return (
			<Grid
				container
				spacing={3}
			>
				<Grid
					item
					xs={12}
				>
					<EmptyState
						variant='charts'
						height={400}
						title='❌ Erro nos Gráficos'
						description='Ocorreu um erro ao carregar os gráficos. Tente recarregar a página.'
					/>
				</Grid>
			</Grid>
		);
	}
}

export default Charts;
