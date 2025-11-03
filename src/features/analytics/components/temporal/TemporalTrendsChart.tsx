import { Box, Grid, Typography, Card, CardContent, Stack, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, ShowChart } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { ChartCard } from '@/shared/ui/base/ChartCard';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatAreaChart } from '@/features/analytics/utils/chartFormatters';
import { getStandardChartColors } from '@/lib/theme';

interface TemporalTrendsChartProps {
	weeklyTrends: Record<string, number>;
	monthlyTrends: Record<string, number>;
}

/**
 * Componente para visualizar tendências temporais (semanais e mensais)
 */
export function TemporalTrendsChart({ weeklyTrends, monthlyTrends }: TemporalTrendsChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const chartColors = getStandardChartColors(theme);

	// Processar weekly trends
	const weeklyData = Object.entries(weeklyTrends)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([week, clicks]) => ({
			x: week,
			y: clicks
		}));

	// Processar monthly trends
	const monthlyData = Object.entries(monthlyTrends)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([month, clicks]) => ({
			x: month,
			y: clicks
		}));

	// Calcular estatísticas
	const weeklyValues = Object.values(weeklyTrends);
	const monthlyValues = Object.values(monthlyTrends);

	const weeklyTotal = weeklyValues.reduce((sum, val) => sum + val, 0);
	const weeklyAvg = weeklyValues.length > 0 ? weeklyTotal / weeklyValues.length : 0;

	const monthlyTotal = monthlyValues.reduce((sum, val) => sum + val, 0);
	const monthlyAvg = monthlyValues.length > 0 ? monthlyTotal / monthlyValues.length : 0;

	// Calcular tendência semanal
	const weeklyTrend =
		weeklyValues.length >= 2
			? weeklyValues[weeklyValues.length - 1] - weeklyValues[weeklyValues.length - 2]
			: 0;

	// Calcular tendência mensal
	const monthlyTrend =
		monthlyValues.length >= 2
			? monthlyValues[monthlyValues.length - 1] - monthlyValues[monthlyValues.length - 2]
			: 0;

	const hasWeeklyData = weeklyData.length > 0;
	const hasMonthlyData = monthlyData.length > 0;

	if (!hasWeeklyData && !hasMonthlyData) {
		return (
			<Box
				sx={{
					textAlign: 'center',
					py: 8,
					color: 'text.secondary'
				}}
			>
				<ShowChart sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
				<Typography variant="h6">Dados de tendências ainda não disponíveis</Typography>
				<Typography
					variant="body2"
					sx={{ mt: 1 }}
				>
					Continue compartilhando seu link para gerar dados de tendências ao longo do tempo
				</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<Grid
				container
				spacing={3}
			>
				{/* Weekly Trends */}
				{hasWeeklyData && (
					<Grid
						item
						xs={12}
						lg={6}
					>
						<ChartCard
							title="📊 Tendências Semanais"
							subtitle={`Média: ${Math.round(weeklyAvg)} cliques/semana`}
						>
							<ApexChartWrapper
								type="area"
								height={300}
								series={[
									{
										name: 'Cliques',
										data: weeklyData
									}
								]}
								options={{
									chart: {
										type: 'area',
										toolbar: { show: true },
										zoom: { enabled: true }
									},
									colors: [chartColors.primary.main],
									stroke: {
										curve: 'smooth',
										width: 3
									},
									fill: {
										type: 'gradient',
										gradient: {
											shadeIntensity: 1,
											opacityFrom: 0.6,
											opacityTo: 0.1
										}
									},
									dataLabels: {
										enabled: false
									},
									xaxis: {
										type: 'category',
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'
											}
										}
									},
									yaxis: {
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'
											},
											formatter(val: number) {
												return val.toLocaleString();
											}
										}
									},
									grid: {
										borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
									},
									tooltip: {
										theme: isDark ? 'dark' : 'light',
										y: {
											formatter(val: number) {
												return `${val.toLocaleString()} cliques`;
											}
										}
									}
								}}
							/>

							{/* Insights Semanais */}
							<Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
								<Stack
									spacing={1}
									direction="row"
									alignItems="center"
									flexWrap="wrap"
								>
									<Chip
										icon={weeklyTrend >= 0 ? <TrendingUp /> : <TrendingDown />}
										label={`${weeklyTrend >= 0 ? '+' : ''}${weeklyTrend} última semana`}
										color={weeklyTrend >= 0 ? 'success' : 'error'}
										size="small"
									/>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Total: {weeklyTotal.toLocaleString()} cliques em {weeklyValues.length} semanas
									</Typography>
								</Stack>
							</Box>
						</ChartCard>
					</Grid>
				)}

				{/* Monthly Trends */}
				{hasMonthlyData && (
					<Grid
						item
						xs={12}
						lg={6}
					>
						<ChartCard
							title="📅 Tendências Mensais"
							subtitle={`Média: ${Math.round(monthlyAvg)} cliques/mês`}
						>
							<ApexChartWrapper
								type="area"
								height={300}
								series={[
									{
										name: 'Cliques',
										data: monthlyData
									}
								]}
								options={{
									chart: {
										type: 'area',
										toolbar: { show: true },
										zoom: { enabled: true }
									},
									colors: [chartColors.secondary.main],
									stroke: {
										curve: 'smooth',
										width: 3
									},
									fill: {
										type: 'gradient',
										gradient: {
											shadeIntensity: 1,
											opacityFrom: 0.6,
											opacityTo: 0.1
										}
									},
									dataLabels: {
										enabled: false
									},
									xaxis: {
										type: 'category',
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'
											}
										}
									},
									yaxis: {
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'
											},
											formatter(val: number) {
												return val.toLocaleString();
											}
										}
									},
									grid: {
										borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
									},
									tooltip: {
										theme: isDark ? 'dark' : 'light',
										y: {
											formatter(val: number) {
												return `${val.toLocaleString()} cliques`;
											}
										}
									}
								}}
							/>

							{/* Insights Mensais */}
							<Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
								<Stack
									spacing={1}
									direction="row"
									alignItems="center"
									flexWrap="wrap"
								>
									<Chip
										icon={monthlyTrend >= 0 ? <TrendingUp /> : <TrendingDown />}
										label={`${monthlyTrend >= 0 ? '+' : ''}${monthlyTrend} último mês`}
										color={monthlyTrend >= 0 ? 'success' : 'error'}
										size="small"
									/>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Total: {monthlyTotal.toLocaleString()} cliques em {monthlyValues.length} meses
									</Typography>
								</Stack>
							</Box>
						</ChartCard>
					</Grid>
				)}

				{/* Resumo Geral */}
				{(hasWeeklyData || hasMonthlyData) && (
					<Grid
						item
						xs={12}
					>
						<Card>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
								>
									📈 Análise de Crescimento
								</Typography>
								<Grid
									container
									spacing={2}
								>
									{hasWeeklyData && (
										<Grid
											item
											xs={12}
											md={6}
										>
											<Typography
												variant="subtitle2"
												color="text.secondary"
											>
												Desempenho Semanal
											</Typography>
											<Typography variant="body2">
												{weeklyTrend > 0
													? `✅ Crescimento de ${weeklyTrend} cliques na última semana`
													: weeklyTrend < 0
														? `⚠️ Queda de ${Math.abs(weeklyTrend)} cliques na última semana`
														: '➖ Estável na última semana'}
											</Typography>
										</Grid>
									)}
									{hasMonthlyData && (
										<Grid
											item
											xs={12}
											md={6}
										>
											<Typography
												variant="subtitle2"
												color="text.secondary"
											>
												Desempenho Mensal
											</Typography>
											<Typography variant="body2">
												{monthlyTrend > 0
													? `✅ Crescimento de ${monthlyTrend} cliques no último mês`
													: monthlyTrend < 0
														? `⚠️ Queda de ${Math.abs(monthlyTrend)} cliques no último mês`
														: '➖ Estável no último mês'}
											</Typography>
										</Grid>
									)}
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				)}
			</Grid>
		</Box>
	);
}

export default TemporalTrendsChart;
