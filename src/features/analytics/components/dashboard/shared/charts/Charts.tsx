import { Grid, Box, Typography } from '@mui/material';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';
import { ChartsProps } from '@/features/analytics/components/types';
import { createPresetAnimations, createComponentColorSet } from '@/lib/theme';
import { createChartContainerStyles, createHorizontalBarStyles } from '@/features/analytics/utils/chartStyles';

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

		// Estilos padronizados para gráficos
		const chartContainerStyles = createChartContainerStyles(theme, height);
		const horizontalBarStyles = createHorizontalBarStyles(theme);

		// Debug dos dados recebidos (apenas em desenvolvimento)
		if (import.meta.env.DEV) {
			// eslint-disable-next-line no-console
			console.log('📊 Charts - Dados recebidos:', {
				data,
				hasData: !!data,
				temporal: data?.temporal,
				geographic: data?.geographic,
				audience: data?.audience
			});
		}

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
							variant="charts"
							height={400}
							title="Carregando Gráficos..."
							description="Aguarde enquanto carregamos os dados dos seus gráficos."
							icon="⏳"
						/>
					</Grid>
				</Grid>
			);
		}

		// Função utilitária para verificar dados
		const checkDataAvailability = () => {
			if (!data) return { hasTemporalData: false, hasGeographicData: false, hasDeviceData: false };

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
			if (import.meta.env.DEV) {
				// eslint-disable-next-line no-console
				console.log('📊 Charts - Verificação de dados:', {
					hasTemporalData,
					hasGeographicData,
					hasDeviceData,
					temporal: {
						exists: !!data.temporal,
						clicks_by_hour: data.temporal?.clicks_by_hour?.length || 0,
						clicks_by_day_of_week: data.temporal?.clicks_by_day_of_week?.length || 0
					},
					geographic: {
						exists: !!data.geographic,
						top_countries: data.geographic?.top_countries?.length || 0,
						top_cities: data.geographic?.top_cities?.length || 0
					},
					audience: {
						exists: !!data.audience,
						device_breakdown: data.audience?.device_breakdown?.length || 0
					}
				});
			}

			return { hasTemporalData, hasGeographicData, hasDeviceData };
		};

		const { hasTemporalData, hasGeographicData, hasDeviceData } = checkDataAvailability();

		// Usar dados diretamente
		const chartData = data;

		// Debug apenas se houver problemas
		if (import.meta.env.DEV && !hasTemporalData && !hasGeographicData && !hasDeviceData) {
			console.warn('📊 Charts: Nenhum dado disponível para gráficos', {
				data,
				temporal: data?.temporal,
				geographic: data?.geographic,
				audience: data?.audience
			});
		}

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
				{hasTemporalData && chartData && (
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
								<ChartCard title="📈 Cliques por Hora do Dia">
									<Box sx={{ p: 2 }}>
										<ApexChartWrapper
											type="area"
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
								</ChartCard>
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
								<ChartCard title="📅 Cliques por Dia da Semana">
									<Box sx={{ p: 2 }}>
										<ApexChartWrapper
											type="bar"
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
								</ChartCard>
							</Box>
						</Grid>
					</>
				)}

				{/* Gráficos de dispositivos e países - dashboard e full */}
				{(variant === 'dashboard' || variant === 'full') &&
					(hasDeviceData || hasGeographicData) &&
					chartData && (
						<>
							{/* Dispositivos */}
							{hasDeviceData && (
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
										<ChartCard title="📱 Dispositivos">
											<Box sx={{ p: 2 }}>
												<ApexChartWrapper
													type="donut"
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
										</ChartCard>
									</Box>
								</Grid>
							)}

							{/* Países */}
							{hasGeographicData && (
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
										<ChartCard title="🌍 Top Países">
											<Box sx={{ p: 2 }}>
												<ApexChartWrapper
													type="bar"
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
										</ChartCard>
									</Box>
								</Grid>
							)}
						</>
					)}

				{/* Gráficos avançados - apenas analytics e full */}
				{(variant === 'analytics' || variant === 'full') && showAllCharts && hasGeographicData && chartData && (
					<>
						{/* Estados/Regiões */}
						{chartData &&
							chartData.geographic?.top_states &&
							chartData.geographic.top_states.length > 0 && (
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
										<ChartCard title="🏛️ Top Estados/Regiões">
											<Box sx={{ p: 2 }}>
												<ApexChartWrapper
													type="bar"
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
										</ChartCard>
									</Box>
								</Grid>
							)}

						{/* Cidades */}
						{chartData &&
							chartData.geographic?.top_cities &&
							chartData.geographic.top_cities.length > 0 && (
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
										<ChartCard title="🏙️ Top Cidades">
											<Box sx={{ p: 2 }}>
												<ApexChartWrapper
													type="donut"
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
										</ChartCard>
									</Box>
								</Grid>
							)}
					</>
				)}

				{/* Estado vazio */}
				{!hasTemporalData && !hasGeographicData && !hasDeviceData && (
					<Grid
						item
						xs={12}
					>
						<EmptyState
							variant="charts"
							height={400}
							title="📊 Nenhum Dado Disponível"
							description="Compartilhe seus links para ver gráficos detalhados de cliques por dia da semana e países."
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
						variant="charts"
						height={400}
						title="❌ Erro nos Gráficos"
						description="Ocorreu um erro ao carregar os gráficos. Tente recarregar a página."
					/>
				</Grid>
			</Grid>
		);
	}
}

export default Charts;
