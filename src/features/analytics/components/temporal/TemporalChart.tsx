import { Box, Typography, Card, CardContent, Grid, Alert, Chip, Stack, Divider } from '@mui/material';
import type { HourlyData, DayOfWeekData } from '@/types';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
// Imports removidos - não utilizados no momento
import { useTheme } from '@mui/material/styles';
import { ChartCard } from '@/shared/ui/base/ChartCard';

interface TemporalChartProps {
	hourlyData: HourlyData[];
	weeklyData: DayOfWeekData[];
	showInsights?: boolean;
}

export function TemporalChart({ hourlyData, weeklyData, showInsights = true }: TemporalChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	// Encontrar horário de pico
	const peakHour =
		hourlyData.length > 0
			? hourlyData.reduce((prev, current) => (prev.clicks > current.clicks ? prev : current))
			: { label: '--', clicks: 0 };

	// Encontrar dia de pico
	const peakDay =
		weeklyData.length > 0
			? weeklyData.reduce((prev, current) => (prev.clicks > current.clicks ? prev : current))
			: { day_name: '--', clicks: 0 };

	const getTotalClicks = (data: { clicks: number }[]) => {
		return data.reduce((sum, item) => sum + item.clicks, 0);
	};

	const hourlyTotal = getTotalClicks(hourlyData);
	const weeklyTotal = getTotalClicks(weeklyData);

	// Calcular insights temporais
	const avgClicksPerHour = hourlyTotal / 24;
	const avgClicksPerDay = weeklyTotal / 7;
	const activeHours = hourlyData.filter((hour) => hour.clicks > avgClicksPerHour).length;
	const activeDays = weeklyData.filter((day) => day.clicks > avgClicksPerDay).length;

	// Identificar padrões
	const isWeekendActive =
		weeklyData.length >= 7
			? weeklyData[0].clicks + weeklyData[6].clicks >
				weeklyData.slice(1, 6).reduce((sum, day) => sum + day.clicks, 0)
			: false;
	const isBusinessHoursActive =
		hourlyData.length >= 24
			? hourlyData.slice(9, 18).reduce((sum, hour) => sum + hour.clicks, 0) >
				hourlyData.slice(0, 9).reduce((sum, hour) => sum + hour.clicks, 0) +
					hourlyData.slice(18, 24).reduce((sum, hour) => sum + hour.clicks, 0)
			: false;

	return (
		<Grid
			container
			spacing={3}
		>
			{/* Insights Temporais */}
			<Grid
				item
				xs={12}
			>
				<Alert
					severity="info"
					sx={{
						mb: 3, // Aumentar margem inferior
						mt: 1, // Adicionar margem superior
						position: 'relative', // Garantir posicionamento correto
						zIndex: 1 // Garantir que fique abaixo das tabs
					}}
				>
					<Typography variant="body2">
						<strong>💡 Insights:</strong>{' '}
						{hourlyTotal > 0 ? (
							<>
								Horário de pico: <strong>{peakHour.label}</strong> ({peakHour.clicks} clicks). Dia com
								mais engajamento: <strong>{peakDay.day_name}</strong> ({peakDay.clicks} clicks).
							</>
						) : (
							'Compartilhe seu link para descobrir os melhores horários para engajamento!'
						)}
					</Typography>
				</Alert>
			</Grid>

			{/* Cliques por Hora */}
			<Grid
				item
				xs={12}
				lg={6}
			>
				<ChartCard
					title="⏰ Cliques por Hora do Dia"
					subtitle={`Pico: ${peakHour.label} (${peakHour.clicks} cliques)`}
				>
					{hourlyTotal > 0 ? (
						<>
							<ApexChartWrapper
								type="area"
								height={300}
								series={[
									{
										name: 'Cliques',
										data: hourlyData.map((hour) => ({
											x: hour.label,
											y: hour.clicks
										}))
									}
								]}
								options={{
									chart: {
										type: 'area',
										toolbar: { show: false },
										animations: {
											enabled: true,
											easing: 'easeinout',
											speed: 800
										}
									},
									colors: ['#ff9800'],
									fill: {
										type: 'gradient',
										gradient: {
											shade: 'light',
											type: 'vertical',
											shadeIntensity: 0.25,
											gradientToColors: ['#ff9800'],
											inverseColors: false,
											opacityFrom: 0.6,
											opacityTo: 0.1,
											stops: [0, 100]
										}
									},
									stroke: {
										curve: 'smooth',
										width: 3,
										lineCap: 'round'
									},
									markers: {
										size: 0,
										hover: {
											size: 8,
											sizeOffset: 2
										}
									},
									dataLabels: {
										enabled: false
									},
									xaxis: {
										categories: hourlyData.map((hour) => hour.label),
										title: {
											text: 'Hora do Dia',
											style: {
												color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
												fontSize: '14px',
												fontFamily: 'Inter, system-ui, sans-serif'
											}
										},
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
												fontSize: '12px',
												fontFamily: 'Inter, system-ui, sans-serif'
											}
										}
									},
									yaxis: {
										title: {
											text: 'Número de Cliques',
											style: {
												color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
												fontSize: '14px',
												fontFamily: 'Inter, system-ui, sans-serif'
											}
										},
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
												fontSize: '12px',
												fontFamily: 'Inter, system-ui, sans-serif'
											},
											formatter: function (val: number) {
												return val.toLocaleString();
											}
										}
									},
									grid: {
										borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
										strokeDashArray: 2,
										yaxis: {
											lines: {
												show: true
											}
										}
									},
									tooltip: {
										theme: isDark ? 'dark' : 'light',
										style: {
											fontSize: '14px',
											fontFamily: 'Inter, system-ui, sans-serif'
										},
										y: {
											formatter: function (val: number) {
												return `${val.toLocaleString()} cliques`;
											}
										}
									}
								}}
							/>

							{/* Resumo dos horários */}
							<Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
								<Typography
									variant="body2"
									gutterBottom
								>
									<strong>📊 Resumo por Período:</strong>
								</Typography>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={4}
									>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Manhã (6h-12h)
										</Typography>
										<Typography
											variant="body2"
											fontWeight="medium"
										>
											{hourlyData.slice(6, 12).reduce((sum, h) => sum + h.clicks, 0)} clicks
										</Typography>
									</Grid>
									<Grid
										item
										xs={4}
									>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Tarde (12h-18h)
										</Typography>
										<Typography
											variant="body2"
											fontWeight="medium"
										>
											{hourlyData.slice(12, 18).reduce((sum, h) => sum + h.clicks, 0)} clicks
										</Typography>
									</Grid>
									<Grid
										item
										xs={4}
									>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Noite (18h-24h)
										</Typography>
										<Typography
											variant="body2"
											fontWeight="medium"
										>
											{hourlyData.slice(18, 24).reduce((sum, h) => sum + h.clicks, 0)} clicks
										</Typography>
									</Grid>
								</Grid>
							</Box>
						</>
					) : (
						<Box
							sx={{
								textAlign: 'center',
								py: 4,
								color: 'text.secondary'
							}}
						>
							<Typography
								variant="h6"
								gutterBottom
							>
								⏰
							</Typography>
							<Typography>Padrões horários aparecerão aqui após os primeiros cliques</Typography>
							<Typography
								variant="body2"
								sx={{ mt: 1 }}
							>
								Descubra os melhores horários para compartilhar!
							</Typography>
						</Box>
					)}
				</ChartCard>
			</Grid>

			{/* Cliques por Dia da Semana */}
			<Grid
				item
				xs={12}
				lg={6}
			>
				<ChartCard
					title="📅 Cliques por Dia da Semana"
					subtitle={`Melhor dia: ${peakDay.day_name} (${peakDay.clicks} cliques)`}
				>
					{weeklyTotal > 0 ? (
						<>
							<ApexChartWrapper
								type="bar"
								height={300}
								series={[
									{
										name: 'Cliques',
										data: weeklyData.map((day) => day.clicks)
									}
								]}
								options={{
									chart: {
										type: 'bar',
										toolbar: { show: false },
										animations: {
											enabled: true,
											easing: 'easeinout',
											speed: 800
										}
									},
									colors: ['#1976d2'],
									plotOptions: {
										bar: {
											borderRadius: 4,
											columnWidth: '60%',
											dataLabels: {
												position: 'top'
											}
										}
									},
									dataLabels: {
										enabled: true,
										formatter: function (val: number) {
											return val.toLocaleString();
										},
										offsetY: -20,
										style: {
											fontSize: '12px',
											fontWeight: 'bold',
											colors: [isDark ? '#fff' : '#333']
										}
									},
									xaxis: {
										categories: weeklyData.map((day) => day.day_name),
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
												fontSize: '11px',
												fontFamily: 'Inter, system-ui, sans-serif'
											},
											rotate: -45
										}
									},
									yaxis: {
										labels: {
											style: {
												colors: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
												fontSize: '12px',
												fontFamily: 'Inter, system-ui, sans-serif'
											},
											formatter: function (val: number) {
												return val.toLocaleString();
											}
										}
									},
									grid: {
										borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
										strokeDashArray: 2
									},
									tooltip: {
										theme: isDark ? 'dark' : 'light',
										y: {
											formatter: function (val: number) {
												return `${val.toLocaleString()} cliques`;
											}
										}
									},
									responsive: [
										{
											breakpoint: 768,
											options: {
												plotOptions: {
													bar: {
														columnWidth: '80%'
													}
												},
												dataLabels: {
													style: {
														fontSize: '10px'
													}
												}
											}
										}
									]
								}}
							/>

							{/* Lista dos dias */}
							<Box sx={{ mt: 2 }}>
								{weeklyData
									.sort((a, b) => b.clicks - a.clicks)
									.map((day, index) => (
										<Box
											key={day.day}
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												py: 0.5,
												borderBottom: index < weeklyData.length - 1 ? '1px solid' : 'none',
												borderBottomColor: 'divider'
											}}
										>
											<Typography variant="body2">{day.day_name}</Typography>
											<Typography
												variant="body2"
												fontWeight="medium"
											>
												{day.clicks} clicks
											</Typography>
										</Box>
									))}
							</Box>
						</>
					) : (
						<Box
							sx={{
								textAlign: 'center',
								py: 4,
								color: 'text.secondary'
							}}
						>
							<Typography
								variant="h6"
								gutterBottom
							>
								📅
							</Typography>
							<Typography>Padrões semanais aparecerão aqui após os primeiros cliques</Typography>
							<Typography
								variant="body2"
								sx={{ mt: 1 }}
							>
								Descubra os melhores dias para engajamento!
							</Typography>
						</Box>
					)}
				</ChartCard>
			</Grid>

			{/* Insights Temporais Integrados */}
			{showInsights && (hourlyTotal > 0 || weeklyTotal > 0) && (
				<Grid
					item
					xs={12}
				>
					<Card sx={{ mt: 2 }}>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
								sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
							>
								🔍 Análise de Padrões Temporais
							</Typography>

							<Grid
								container
								spacing={3}
							>
								{/* Padrões por Hora */}
								<Grid
									item
									xs={12}
									md={6}
								>
									<Typography
										variant="subtitle2"
										gutterBottom
									>
										⏰ Padrões por Hora
									</Typography>
									<Stack
										spacing={1}
										my={2}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Chip
												label={isBusinessHoursActive ? 'Horário Comercial' : 'Fora do Horário'}
												color={isBusinessHoursActive ? 'success' : 'warning'}
												size="small"
											/>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{isBusinessHoursActive
													? 'Ativo durante 9h-18h'
													: 'Mais ativo fora do horário comercial'}
											</Typography>
										</Box>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Chip
												label={`${activeHours}/24 horas ativas`}
												color="info"
												size="small"
											/>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{((activeHours / 24) * 100).toFixed(0)}% do dia com atividade
											</Typography>
										</Box>
									</Stack>
								</Grid>

								{/* Padrões por Dia */}
								<Grid
									item
									xs={12}
									md={6}
								>
									<Typography
										variant="subtitle2"
										gutterBottom
									>
										📅 Padrões por Dia
									</Typography>
									<Stack spacing={1}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Chip
												label={isWeekendActive ? 'Fim de Semana' : 'Dias Úteis'}
												color={isWeekendActive ? 'secondary' : 'primary'}
												size="small"
											/>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{isWeekendActive
													? 'Mais ativo nos fins de semana'
													: 'Mais ativo nos dias úteis'}
											</Typography>
										</Box>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Chip
												label={`${activeDays}/7 dias ativos`}
												color="info"
												size="small"
											/>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{((activeDays / 7) * 100).toFixed(0)}% da semana com atividade
											</Typography>
										</Box>
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
									📈 Recomendações de Timing
								</Typography>
								<Stack spacing={1}>
									{peakHour && peakHour.clicks > 0 && (
										<Typography
											variant="body2"
											color="text.secondary"
										>
											• <strong>{peakHour.label}</strong> é o horário de pico com{' '}
											{peakHour.clicks} cliques. Programe campanhas importantes neste horário.
										</Typography>
									)}
									{peakDay && peakDay.clicks > 0 && (
										<Typography
											variant="body2"
											color="text.secondary"
										>
											• <strong>{peakDay.day_name}</strong> é o dia mais ativo. Concentre
											lançamentos e promoções neste dia.
										</Typography>
									)}
									{isBusinessHoursActive && (
										<Typography
											variant="body2"
											color="text.secondary"
										>
											• Seu público é ativo durante horário comercial. Foque em conteúdo B2B e
											profissional.
										</Typography>
									)}
									{!isBusinessHoursActive && hourlyTotal > 0 && (
										<Typography
											variant="body2"
											color="text.secondary"
										>
											• Seu público é ativo fora do horário comercial. Foque em conteúdo de
											entretenimento e lifestyle.
										</Typography>
									)}
								</Stack>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			)}
		</Grid>
	);
}
