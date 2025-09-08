import { Grid, Box, Typography } from '@mui/material';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';
import { ChartsProps } from '../../types';
import {
	createPresetAnimations,
	createComponentColorSet
} from '@/lib/theme';

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
		const secondaryColors = createComponentColorSet(theme, 'secondary');
		const successColors = createComponentColorSet(theme, 'success');
		const infoColors = createComponentColorSet(theme, 'info');

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

			const hasTemporalData = !!(
				data.temporal &&
				(data.temporal.clicks_by_hour?.length > 0 || data.temporal.clicks_by_day_of_week?.length > 0)
			);

			const hasGeographicData = !!(
				data.geographic &&
				(data.geographic.top_countries?.length > 0 || data.geographic.top_cities?.length > 0)
			);

			const hasDeviceData = !!(data.audience?.device_breakdown?.length > 0);

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
									<Box sx={{ p: 2, height }}>
										<Box sx={{
											display: 'flex',
											alignItems: 'flex-end',
											gap: 1,
											height: '100%',
											pb: 2
										}}>
											{(chartData.temporal?.clicks_by_day_of_week || []).map((item, index) => {
												const dayData = chartData.temporal?.clicks_by_day_of_week || [];
												const maxValue = dayData.length > 0 ? Math.max(...dayData.map((d) => d.clicks)) : 1;
												return (
													<Box
														key={index}
														sx={{
															flex: 1,
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															gap: 0.5
														}}
													>
														<Typography
															variant="caption"
															sx={{
																fontSize: '0.7rem',
																fontWeight: 'bold'
															}}
														>
															{item.clicks.toLocaleString()}
														</Typography>
														<Box
															sx={{
																width: '100%',
																backgroundColor: secondaryColors.main,
																borderRadius: '4px 4px 0 0',
																height: `${(item.clicks / maxValue) * 80}%`,
																minHeight: 4,
																transition: 'all 0.3s ease'
															}}
														/>
														<Typography
															variant="caption"
															sx={{
																fontSize: '0.65rem',
																textAlign: 'center',
																transform: 'rotate(-45deg)',
																transformOrigin: 'center',
																whiteSpace: 'nowrap',
																maxWidth: 60,
																overflow: 'hidden',
																textOverflow: 'ellipsis'
															}}
														>
															{item.day_name}
														</Typography>
													</Box>
												);
											})}
										</Box>
									</Box>
								</ChartCard>
							</Box>
						</Grid>
					</>
				)}

				{/* Gráficos de dispositivos e países - dashboard e full */}
				{(variant === 'dashboard' || variant === 'full') && (hasDeviceData || hasGeographicData) && chartData && (
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
													(chartData.audience?.device_breakdown || []).map(
														(item) => ({
															device: item.device,
															clicks: item.clicks
														})
													),
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
										<Box sx={{ p: 2, height }}>
											<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
												{(chartData.geographic?.top_countries?.slice(0, 10) || []).map((item, index) => {
													const countryData = chartData.geographic?.top_countries || [];
													const maxValue = countryData.length > 0 ? Math.max(...countryData.map((c) => c.clicks)) : 1;
													return (
														<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
															<Typography
																variant="body2"
																sx={{
																	minWidth: 100,
																	fontSize: '0.75rem',
																	textAlign: 'right'
																}}
															>
																{item.country}
															</Typography>
															<Box sx={{ flex: 1, position: 'relative' }}>
																<Box
																	sx={{
																		height: 20,
																		backgroundColor: successColors.main,
																		borderRadius: 1,
																		width: `${(item.clicks / maxValue) * 100}%`,
																		minWidth: 2,
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'flex-end',
																		pr: 1
																	}}
																>
																	<Typography
																		variant="caption"
																		sx={{
																			color: 'white',
																			fontWeight: 'bold',
																			fontSize: '0.7rem'
																		}}
																	>
																		{item.clicks.toLocaleString()}
																	</Typography>
																</Box>
															</Box>
														</Box>
													);
												})}
											</Box>
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
						{chartData && chartData.geographic?.top_states && chartData.geographic.top_states.length > 0 && (
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
													chartData.geographic.top_states.slice(0, 8) as Record<string, unknown>[],
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
						{chartData && chartData.geographic?.top_cities && chartData.geographic.top_cities.length > 0 && (
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
													chartData.geographic.top_cities.slice(0, 8) as Record<string, unknown>[],
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
					<Grid item xs={12}>
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
			<Grid container spacing={3}>
				<Grid item xs={12}>
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
