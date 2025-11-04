import { Box, Grid, Typography, Stack, LinearProgress } from '@mui/material';
import { Public } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { ChartCard } from '@/shared/ui/base/ChartCard';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { getStandardChartColors } from '@/lib/theme';
import type { TimezoneAnalysis } from '@/types';

interface TimezoneDistributionChartProps {
	timezoneAnalysis: TimezoneAnalysis[];
}

/**
 * Componente para visualizar distribuição de cliques por timezone
 */
export function TimezoneDistributionChart({ timezoneAnalysis }: TimezoneDistributionChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const chartColors = getStandardChartColors(theme);

	if (!timezoneAnalysis || timezoneAnalysis.length === 0) {
		return (
			<Box
				sx={{
					textAlign: 'center',
					py: 8,
					color: 'text.secondary'
				}}
			>
				<Public sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
				<Typography variant='h6'>Dados de timezone ainda não disponíveis</Typography>
				<Typography
					variant='body2'
					sx={{ mt: 1 }}
				>
					Continue compartilhando seu link para coletar dados de diferentes fusos horários
				</Typography>
			</Box>
		);
	}

	// Ordenar por cliques (decrescente)
	const sortedTimezones = [...timezoneAnalysis].sort((a, b) => b.clicks - a.clicks);

	// Top 10 timezones
	const topTimezones = sortedTimezones.slice(0, 10);

	// Preparar dados para o gráfico
	const chartData = topTimezones.map((tz) => ({
		x: tz.name.split('/').pop() || tz.name, // Mostrar apenas a cidade
		y: tz.clicks
	}));

	const totalClicks = timezoneAnalysis.reduce((sum, tz) => sum + tz.clicks, 0);

	return (
		<Box>
			<Grid
				container
				spacing={3}
			>
				{/* Gráfico de Barras */}
				<Grid
					item
					xs={12}
					lg={8}
				>
					<ChartCard
						title='🌍 Distribuição por Fuso Horário'
						subtitle={`${timezoneAnalysis.length} fusos horários detectados`}
					>
						<ApexChartWrapper
							type='bar'
							height={350}
							series={[
								{
									name: 'Cliques',
									data: chartData.map((d) => d.y)
								}
							]}
							options={{
								chart: {
									type: 'bar',
									toolbar: { show: true }
								},
								colors: [chartColors.info.main],
								plotOptions: {
									bar: {
										borderRadius: 6,
										horizontal: true,
										dataLabels: {
											position: 'top'
										}
									}
								},
								dataLabels: {
									enabled: true,
									formatter(val: number) {
										return val.toLocaleString();
									},
									offsetX: 30,
									style: {
										fontSize: '12px',
										colors: [isDark ? '#fff' : '#333']
									}
								},
								xaxis: {
									categories: chartData.map((d) => d.x),
									labels: {
										style: {
											colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'
										}
									}
								},
								yaxis: {
									labels: {
										style: {
											colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
											fontSize: '11px'
										}
									}
								},
								grid: {
									borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
								},
								tooltip: {
									theme: isDark ? 'dark' : 'light',
									y: {
										formatter(val: number, opts?: any) {
											const dataPointIndex = opts?.dataPointIndex;
											const percentage =
												dataPointIndex !== undefined
													? topTimezones[dataPointIndex]?.percentage || 0
													: 0;
											return `${val.toLocaleString()} cliques (${percentage.toFixed(1)}%)`;
										}
									}
								}
							}}
						/>
					</ChartCard>
				</Grid>

				{/* Lista Detalhada */}
				<Grid
					item
					xs={12}
					lg={4}
				>
					<ChartCard
						title='📊 Top Timezones'
						subtitle={`Total: ${totalClicks.toLocaleString()} cliques`}
					>
						<Stack spacing={2}>
							{topTimezones.map((tz, index) => (
								<Box key={tz.name}>
									<Stack
										direction='row'
										justifyContent='space-between'
										alignItems='center'
										sx={{ mb: 0.5 }}
									>
										<Typography
											variant='body2'
											fontWeight='medium'
										>
											{index + 1}. {tz.name.split('/').pop()}
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{tz.clicks.toLocaleString()} ({tz.percentage?.toFixed(1)}%)
										</Typography>
									</Stack>
									<LinearProgress
										variant='determinate'
										value={tz.percentage || 0}
										sx={{
											height: 6,
											borderRadius: 3,
											bgcolor: 'action.hover',
											'& .MuiLinearProgress-bar': {
												borderRadius: 3,
												bgcolor:
													index === 0
														? chartColors.success.main
														: index === 1
															? chartColors.info.main
															: index === 2
																? chartColors.warning.main
																: chartColors.primary.main
											}
										}}
									/>
									<Typography
										variant='caption'
										color='text.secondary'
										sx={{ display: 'block', mt: 0.5 }}
									>
										{tz.name}
									</Typography>
								</Box>
							))}
						</Stack>

						{timezoneAnalysis.length > 10 && (
							<Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
								<Typography
									variant='caption'
									color='text.secondary'
								>
									+{timezoneAnalysis.length - 10} outros fusos horários
								</Typography>
							</Box>
						)}
					</ChartCard>
				</Grid>

				{/* Insights */}
				<Grid
					item
					xs={12}
				>
					<Box
						sx={{
							p: 2,
							bgcolor: 'info.main',
							color: 'info.contrastText',
							borderRadius: 1
						}}
					>
						<Typography
							variant='subtitle2'
							gutterBottom
						>
							💡 Insight de Timezone
						</Typography>
						<Typography variant='body2'>
							{sortedTimezones[0] ? (
								<>
									Seu público está concentrado em <strong>{sortedTimezones[0].name}</strong> com{' '}
									<strong>{sortedTimezones[0].percentage?.toFixed(1)}%</strong> dos cliques.
									{sortedTimezones.length > 1 && (
										<>
											{' '}
											Considere adaptar horários de publicação para otimizar o engajamento nesta
											região.
										</>
									)}
								</>
							) : null}
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default TimezoneDistributionChart;
