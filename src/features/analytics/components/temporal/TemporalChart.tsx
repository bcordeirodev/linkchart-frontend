import { Box, Typography, Card, CardContent, Grid, Alert, Chip, Stack, Divider, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { getStandardChartColors, getChartColorsByType } from '@/lib/theme';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';

import type {
	HourlyData,
	DayOfWeekData,
	HourlyPatternData,
	WeekendVsWeekdayData,
	BusinessHoursData,
	AdvancedTemporalData
} from '@/types';

import { TemporalTrendsChart } from './TemporalTrendsChart';
import { TimezoneDistributionChart } from './TimezoneDistributionChart';
import { PeakAnalysisCard } from './PeakAnalysisCard';

interface TemporalChartProps {
	hourlyData: HourlyData[];
	weeklyData: DayOfWeekData[];
	showInsights?: boolean;
	// Enhanced temporal data
	hourlyPatternsLocal?: HourlyPatternData[];
	weekendVsWeekday?: WeekendVsWeekdayData;
	businessHoursAnalysis?: BusinessHoursData;
	// NEW: Advanced temporal data from unified endpoint
	advancedData?: AdvancedTemporalData;
}

export function TemporalChart({
	hourlyData,
	weeklyData,
	showInsights = true,
	// Enhanced props
	hourlyPatternsLocal,
	weekendVsWeekday,
	businessHoursAnalysis,
	// NEW: Advanced data
	advancedData
}: TemporalChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const [activeTab, setActiveTab] = useState(0);

	// Cores padronizadas usando novo sistema
	const chartColors = getStandardChartColors(theme);
	const temporalColors = getChartColorsByType('temporal');

	// Verificar se há dados enhanced disponíveis
	const hasEnhancedData = hourlyPatternsLocal?.length || weekendVsWeekday || businessHoursAnalysis;

	// Verificar se há dados advanced disponíveis
	const hasAdvancedData =
		advancedData &&
		(Object.keys(advancedData.weekly_trends || {}).length > 0 ||
			Object.keys(advancedData.monthly_trends || {}).length > 0 ||
			advancedData.peak_analysis ||
			(advancedData.timezone_analysis && advancedData.timezone_analysis.length > 0));

	const hasPeakAnalysis = advancedData?.peak_analysis;
	const hasTrends =
		advancedData &&
		(Object.keys(advancedData.weekly_trends || {}).length > 0 ||
			Object.keys(advancedData.monthly_trends || {}).length > 0);
	const hasTimezones = advancedData?.timezone_analysis && advancedData.timezone_analysis.length > 0;

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

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
		<Box>
			{/* Tabs para análises enhanced e advanced */}
			{hasEnhancedData || hasAdvancedData ? (
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						variant='scrollable'
						scrollButtons='auto'
					>
						<Tab label='📊 Padrões Gerais' />
						<Tab
							label='⏰ Hora Local'
							disabled={!hourlyPatternsLocal?.length || hourlyPatternsLocal.length < 3}
						/>
						<Tab
							label='📅 Fim de Semana'
							disabled={!weekendVsWeekday}
						/>
						<Tab
							label='🕘 Horário Comercial'
							disabled={!businessHoursAnalysis}
						/>
						<Tab
							label='⚡ Picos'
							disabled={!hasPeakAnalysis}
						/>
						<Tab
							label='📈 Tendências'
							disabled={!hasTrends}
						/>
						<Tab
							label='🌍 Fusos Horários'
							disabled={!hasTimezones}
						/>
					</Tabs>
				</Box>
			) : null}

			{/* Tab 0: Padrões Gerais (Conteúdo original) */}
			{(!(hasEnhancedData || hasAdvancedData) || activeTab === 0) && (
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
							severity='info'
							sx={{
								mb: 3, // Aumentar margem inferior
								mt: 1, // Adicionar margem superior
								position: 'relative', // Garantir posicionamento correto
								zIndex: 1 // Garantir que fique abaixo das tabs
							}}
						>
							<Typography variant='body2'>
								<strong>💡 Insights:</strong>{' '}
								{hourlyTotal > 0 ? (
									<>
										Horário de pico: <strong>{peakHour.label}</strong> ({peakHour.clicks} clicks).
										Dia com mais engajamento: <strong>{peakDay.day_name}</strong> ({peakDay.clicks}{' '}
										clicks).
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
							title='⏰ Cliques por Hora do Dia'
							subtitle={`Pico: ${peakHour.label} (${peakHour.clicks} cliques)`}
						>
							{hourlyTotal > 0 ? (
								<>
									<ApexChartWrapper
										type='area'
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
											colors: [temporalColors.hourly],
											fill: {
												type: 'gradient',
												gradient: {
													shade: 'light',
													type: 'vertical',
													shadeIntensity: 0.25,
													gradientToColors: [temporalColors.hourly],
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
														color: isDark
															? 'rgba(255, 255, 255, 0.85)'
															: 'rgba(0, 0, 0, 0.75)',
														fontSize: '14px',
														fontFamily: 'Inter, system-ui, sans-serif'
													}
												},
												labels: {
													style: {
														colors: isDark
															? 'rgba(255, 255, 255, 0.85)'
															: 'rgba(0, 0, 0, 0.75)',
														fontSize: '12px',
														fontFamily: 'Inter, system-ui, sans-serif'
													}
												}
											},
											yaxis: {
												title: {
													text: 'Número de Cliques',
													style: {
														color: isDark
															? 'rgba(255, 255, 255, 0.85)'
															: 'rgba(0, 0, 0, 0.75)',
														fontSize: '14px',
														fontFamily: 'Inter, system-ui, sans-serif'
													}
												},
												labels: {
													style: {
														colors: isDark
															? 'rgba(255, 255, 255, 0.85)'
															: 'rgba(0, 0, 0, 0.75)',
														fontSize: '12px',
														fontFamily: 'Inter, system-ui, sans-serif'
													},
													formatter(val: number) {
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
													formatter(val: number) {
														return `${val.toLocaleString()} cliques`;
													}
												}
											}
										}}
									/>

									{/* Resumo dos horários */}
									<Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
										<Typography
											variant='body2'
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
													variant='caption'
													color='text.secondary'
												>
													Manhã (6h-12h)
												</Typography>
												<Typography
													variant='body2'
													fontWeight='medium'
												>
													{hourlyData.slice(6, 12).reduce((sum, h) => sum + h.clicks, 0)}{' '}
													clicks
												</Typography>
											</Grid>
											<Grid
												item
												xs={4}
											>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													Tarde (12h-18h)
												</Typography>
												<Typography
													variant='body2'
													fontWeight='medium'
												>
													{hourlyData.slice(12, 18).reduce((sum, h) => sum + h.clicks, 0)}{' '}
													clicks
												</Typography>
											</Grid>
											<Grid
												item
												xs={4}
											>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													Noite (18h-24h)
												</Typography>
												<Typography
													variant='body2'
													fontWeight='medium'
												>
													{hourlyData.slice(18, 24).reduce((sum, h) => sum + h.clicks, 0)}{' '}
													clicks
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
										variant='h6'
										gutterBottom
									>
										⏰
									</Typography>
									<Typography>Padrões horários aparecerão aqui após os primeiros cliques</Typography>
									<Typography
										variant='body2'
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
							title='📅 Cliques por Dia da Semana'
							subtitle={`Melhor dia: ${peakDay.day_name} (${peakDay.clicks} cliques)`}
						>
							{weeklyTotal > 0 ? (
								<>
									<ApexChartWrapper
										type='bar'
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
											colors: [temporalColors.daily],
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
												formatter(val: number) {
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
														colors: isDark
															? 'rgba(255, 255, 255, 0.85)'
															: 'rgba(0, 0, 0, 0.75)',
														fontSize: '11px',
														fontFamily: 'Inter, system-ui, sans-serif'
													},
													rotate: -45
												}
											},
											yaxis: {
												labels: {
													style: {
														colors: isDark
															? 'rgba(255, 255, 255, 0.85)'
															: 'rgba(0, 0, 0, 0.75)',
														fontSize: '12px',
														fontFamily: 'Inter, system-ui, sans-serif'
													},
													formatter(val: number) {
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
													formatter(val: number) {
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
														borderBottom:
															index < weeklyData.length - 1 ? '1px solid' : 'none',
														borderBottomColor: 'divider'
													}}
												>
													<Typography variant='body2'>{day.day_name}</Typography>
													<Typography
														variant='body2'
														fontWeight='medium'
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
										variant='h6'
										gutterBottom
									>
										📅
									</Typography>
									<Typography>Padrões semanais aparecerão aqui após os primeiros cliques</Typography>
									<Typography
										variant='body2'
										sx={{ mt: 1 }}
									>
										Descubra os melhores dias para engajamento!
									</Typography>
								</Box>
							)}
						</ChartCard>
					</Grid>

					{/* Insights Temporais Integrados */}
					{showInsights && (hourlyTotal > 0 || weeklyTotal > 0) ? (
						<Grid
							item
							xs={12}
						>
							<Card sx={{ mt: 2 }}>
								<CardContent>
									<Typography
										variant='h6'
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
												variant='subtitle2'
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
														label={
															isBusinessHoursActive
																? 'Horário Comercial'
																: 'Fora do Horário'
														}
														color={isBusinessHoursActive ? 'success' : 'warning'}
														size='small'
													/>
													<Typography
														variant='body2'
														color='text.secondary'
													>
														{isBusinessHoursActive
															? 'Ativo durante 9h-18h'
															: 'Mais ativo fora do horário comercial'}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Chip
														label={`${activeHours}/24 horas ativas`}
														color='info'
														size='small'
													/>
													<Typography
														variant='body2'
														color='text.secondary'
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
												variant='subtitle2'
												gutterBottom
											>
												📅 Padrões por Dia
											</Typography>
											<Stack spacing={1}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Chip
														label={isWeekendActive ? 'Fim de Semana' : 'Dias Úteis'}
														color={isWeekendActive ? 'secondary' : 'primary'}
														size='small'
													/>
													<Typography
														variant='body2'
														color='text.secondary'
													>
														{isWeekendActive
															? 'Mais ativo nos fins de semana'
															: 'Mais ativo nos dias úteis'}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Chip
														label={`${activeDays}/7 dias ativos`}
														color='info'
														size='small'
													/>
													<Typography
														variant='body2'
														color='text.secondary'
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
											variant='subtitle2'
											gutterBottom
										>
											📈 Recomendações de Timing
										</Typography>
										<Stack spacing={1}>
											{peakHour && peakHour.clicks > 0 ? (
												<Typography
													variant='body2'
													color='text.secondary'
												>
													• <strong>{peakHour.label}</strong> é o horário de pico com{' '}
													{peakHour.clicks} cliques. Programe campanhas importantes neste
													horário.
												</Typography>
											) : null}
											{peakDay && peakDay.clicks > 0 ? (
												<Typography
													variant='body2'
													color='text.secondary'
												>
													• <strong>{peakDay.day_name}</strong> é o dia mais ativo. Concentre
													lançamentos e promoções neste dia.
												</Typography>
											) : null}
											{isBusinessHoursActive ? (
												<Typography
													variant='body2'
													color='text.secondary'
												>
													• Seu público é ativo durante horário comercial. Foque em conteúdo
													B2B e profissional.
												</Typography>
											) : null}
											{!isBusinessHoursActive && hourlyTotal > 0 && (
												<Typography
													variant='body2'
													color='text.secondary'
												>
													• Seu público é ativo fora do horário comercial. Foque em conteúdo
													de entretenimento e lifestyle.
												</Typography>
											)}
										</Stack>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					) : null}
				</Grid>
			)}

			{/* NEW: Tab 1 - Padrões de Hora Local */}
			{hasEnhancedData && activeTab === 1 && hourlyPatternsLocal ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
					>
						<ChartCard title='⏰ Padrões de Hora Local (com Timezone)'>
							<ApexChartWrapper
								type='area'
								{...formatAreaChart(
									hourlyPatternsLocal.map((item) => ({
										hour: `${item.hour.toString().padStart(2, '0')}:00`,
										clicks: item.clicks,
										avg_response_time: item.avg_response_time,
										unique_visitors: item.unique_visitors
									})),
									'hour',
									'clicks',
									chartColors.primary.main,
									isDark
								)}
								height={300}
							/>
							<Box sx={{ mt: 2 }}>
								<Typography
									variant='subtitle2'
									gutterBottom
								>
									Performance por Hora
								</Typography>
								<Stack spacing={1}>
									{hourlyPatternsLocal.slice(0, 5).map((item) => (
										<Box
											key={item.hour}
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												p: 1,
												bgcolor: 'background.paper',
												borderRadius: 1
											}}
										>
											<Typography variant='body2'>{item.hour}h</Typography>
											<Typography variant='caption'>
												{item.clicks} cliques | {item.avg_response_time}ms |{' '}
												{item.unique_visitors} visitantes
											</Typography>
										</Box>
									))}
								</Stack>
							</Box>
						</ChartCard>
					</Grid>
				</Grid>
			) : null}

			{/* NEW: Tab 2 - Fim de Semana vs Dias Úteis */}
			{hasEnhancedData && activeTab === 2 && weekendVsWeekday ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={8}
					>
						<ChartCard title='📅 Fim de Semana vs Dias Úteis'>
							<ApexChartWrapper
								type='pie'
								{...formatPieChart(
									[
										{ name: 'Dias Úteis', value: weekendVsWeekday.weekday.clicks },
										{ name: 'Fim de Semana', value: weekendVsWeekday.weekend.clicks }
									],
									'name',
									'value',
									isDark
								)}
								height={300}
							/>
						</ChartCard>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									Comparativo
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Typography
											variant='subtitle2'
											color='primary'
										>
											Dias Úteis
										</Typography>
										<Typography variant='body2'>
											{weekendVsWeekday.weekday.clicks} cliques
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{weekendVsWeekday.weekday.unique_visitors} visitantes únicos
										</Typography>
									</Box>
									<Divider />
									<Box>
										<Typography
											variant='subtitle2'
											color='secondary'
										>
											Fim de Semana
										</Typography>
										<Typography variant='body2'>
											{weekendVsWeekday.weekend.clicks} cliques
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{weekendVsWeekday.weekend.unique_visitors} visitantes únicos
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			) : null}

			{/* NEW: Tab 3 - Horário Comercial */}
			{hasEnhancedData && activeTab === 3 && businessHoursAnalysis ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={8}
					>
						<ChartCard title='🕘 Análise de Horário Comercial'>
							<ApexChartWrapper
								type='bar'
								{...formatBarChart(
									[
										{
											name: 'Horário Comercial',
											value: businessHoursAnalysis.business_hours.clicks,
											range: businessHoursAnalysis.business_hours.time_range
										},
										{
											name: 'Fora do Horário',
											value: businessHoursAnalysis.non_business_hours.clicks,
											range: businessHoursAnalysis.non_business_hours.time_range
										}
									],
									'name',
									'value',
									chartColors.primary.main,
									false,
									isDark
								)}
								height={300}
							/>
						</ChartCard>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									Métricas de Engajamento
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Typography
											variant='subtitle2'
											color='primary'
										>
											Horário Comercial
										</Typography>
										<Typography variant='body2'>
											{businessHoursAnalysis.business_hours.clicks} cliques
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{businessHoursAnalysis.business_hours.avg_session_depth} cliques/sessão
										</Typography>
									</Box>
									<Divider />
									<Box>
										<Typography
											variant='subtitle2'
											color='secondary'
										>
											Fora do Horário
										</Typography>
										<Typography variant='body2'>
											{businessHoursAnalysis.non_business_hours.clicks} cliques
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{businessHoursAnalysis.non_business_hours.avg_session_depth} cliques/sessão
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			) : null}

			{/* NEW: Tab 4 - Análise de Picos */}
			{hasAdvancedData && activeTab === 4 && hasPeakAnalysis && advancedData?.peak_analysis ? (
				<PeakAnalysisCard peakAnalysis={advancedData.peak_analysis} />
			) : null}

			{/* NEW: Tab 5 - Tendências */}
			{hasAdvancedData && activeTab === 5 && hasTrends && advancedData ? (
				<TemporalTrendsChart
					weeklyTrends={advancedData.weekly_trends || {}}
					monthlyTrends={advancedData.monthly_trends || {}}
				/>
			) : null}

			{/* NEW: Tab 6 - Fusos Horários */}
			{hasAdvancedData && activeTab === 6 && hasTimezones && advancedData?.timezone_analysis ? (
				<TimezoneDistributionChart timezoneAnalysis={advancedData.timezone_analysis} />
			) : null}
		</Box>
	);
}
