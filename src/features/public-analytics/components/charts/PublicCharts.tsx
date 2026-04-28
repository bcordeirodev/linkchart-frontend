import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { AppIcon } from '@/shared/ui/icons';
import { createPresetShadows, createPresetAnimations, createTextGradient } from '@/lib/theme';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';

import type { PublicAnalyticsData } from '../../types';

const DOW_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

interface PublicChartsProps {
	analyticsData: PublicAnalyticsData;
}

interface ChartPanelProps {
	title: string;
	icon: React.ReactNode;
	paletteColor: string;
	children: React.ReactNode;
}

function ChartPanel({ title, icon, paletteColor, children }: ChartPanelProps) {
	const theme = useTheme();
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	return (
		<Paper
			elevation={0}
			sx={{
				p: 2,
				height: '100%',
				backgroundColor: theme.palette.background.paper,
				borderRadius: 2,
				boxShadow: shadows.card,
				...animations.cardHover,
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: shadows.cardHover,
					borderColor: paletteColor
				}
			}}
		>
			<Typography
				variant='h6'
				sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: paletteColor }}
			>
				{icon}
				{title}
			</Typography>
			<Box sx={{ p: 0.5 }}>{children}</Box>
		</Paper>
	);
}

export function PublicCharts({ analyticsData }: PublicChartsProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const animations = createPresetAnimations(theme);

	if (!analyticsData.has_analytics || !analyticsData.charts) {
		return <EmptyChartsState />;
	}

	const { charts } = analyticsData;

	const hourData = (charts.temporal?.clicks_by_hour ?? []).map((d) => ({
		hour: `${d.hour}h`,
		clicks: d.clicks
	}));

	const dowData = (charts.temporal?.clicks_by_day_of_week ?? []).map((d) => ({
		day: DOW_LABELS[d.day] ?? String(d.day),
		clicks: d.clicks
	}));

	const hasHourData = hourData.some((d) => d.clicks > 0);
	const hasDowData = dowData.some((d) => d.clicks > 0);
	const hasDeviceData = (charts.audience?.device_breakdown?.length ?? 0) > 0;
	const hasBrowserData = (charts.audience?.browser_breakdown?.length ?? 0) > 0;
	const hasCountryData = (charts.geographic?.top_countries?.length ?? 0) > 0;

	if (!hasHourData && !hasDowData && !hasDeviceData && !hasBrowserData && !hasCountryData) {
		return <EmptyChartsState />;
	}

	return (
		<Box sx={{ py: { xs: 2, md: 3 }, ...animations.fadeIn }}>
			<Typography
				variant='h5'
				component='h2'
				sx={{
					textAlign: 'center',
					mb: 3,
					fontWeight: 700,
					...createTextGradient(theme, 'primary'),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1.5
				}}
			>
				Gráficos de Analytics
			</Typography>

			<Grid
				container
				spacing={3}
			>
				{/* Linha 1: Cliques por Hora — largura total */}
				{hasHourData ? (
					<Grid
						item
						xs={12}
					>
						<ChartPanel
							title='Cliques por Hora'
							icon={
								<AppIcon
									intent='analytics'
									size={20}
								/>
							}
							paletteColor={theme.palette.primary.main}
						>
							<ApexChartWrapper
								type='area'
								height={250}
								{...formatAreaChart(
									hourData as Record<string, unknown>[],
									'hour',
									'clicks',
									theme.palette.primary.main,
									isDark
								)}
							/>
						</ChartPanel>
					</Grid>
				) : null}

				{/* Linha 2: Dia da Semana + Top Países */}
				{hasDowData ? (
					<Grid
						item
						xs={12}
						md={hasCountryData ? 6 : 12}
					>
						<ChartPanel
							title='Cliques por Dia da Semana'
							icon={
								<AppIcon
									intent='analytics'
									size={20}
								/>
							}
							paletteColor={theme.palette.warning.main}
						>
							<ApexChartWrapper
								type='bar'
								height={300}
								{...formatBarChart(
									dowData as Record<string, unknown>[],
									'day',
									'clicks',
									theme.palette.warning.main,
									false,
									isDark
								)}
							/>
						</ChartPanel>
					</Grid>
				) : null}

				{hasCountryData ? (
					<Grid
						item
						xs={12}
						md={hasDowData ? 6 : 12}
					>
						<ChartPanel
							title='Top Países'
							icon={
								<AppIcon
									name='location.map'
									size={20}
								/>
							}
							paletteColor={theme.palette.success.main}
						>
							<ApexChartWrapper
								type='bar'
								height={300}
								{...formatBarChart(
									(charts.geographic?.top_countries ?? []) as Record<string, unknown>[],
									'country',
									'clicks',
									theme.palette.success.main,
									true,
									isDark
								)}
							/>
						</ChartPanel>
					</Grid>
				) : null}

				{/* Linha 3: Dispositivos + Browsers */}
				{hasDeviceData ? (
					<Grid
						item
						xs={12}
						md={hasBrowserData ? 6 : 12}
					>
						<ChartPanel
							title='Dispositivos'
							icon={
								<AppIcon
									name='content.mobile'
									size={20}
								/>
							}
							paletteColor={theme.palette.primary.main}
						>
							<ApexChartWrapper
								type='donut'
								height={300}
								{...formatPieChart(
									(charts.audience?.device_breakdown ?? []) as Record<string, unknown>[],
									'device',
									'clicks',
									isDark
								)}
							/>
						</ChartPanel>
					</Grid>
				) : null}

				{hasBrowserData ? (
					<Grid
						item
						xs={12}
						md={hasDeviceData ? 6 : 12}
					>
						<ChartPanel
							title='Browsers'
							icon={
								<AppIcon
									intent='url'
									size={20}
								/>
							}
							paletteColor={theme.palette.info.main}
						>
							<ApexChartWrapper
								type='donut'
								height={300}
								{...formatPieChart(
									(charts.audience?.browser_breakdown ?? []) as Record<string, unknown>[],
									'browser',
									'clicks',
									isDark
								)}
							/>
						</ChartPanel>
					</Grid>
				) : null}
			</Grid>
		</Box>
	);
}

function EmptyChartsState() {
	const theme = useTheme();
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	return (
		<Box sx={{ py: { xs: 2, md: 3 }, ...animations.fadeIn }}>
			<Box
				sx={{
					textAlign: 'center',
					mb: 3,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1.5
				}}
			>
				<AppIcon
					intent='analytics'
					size={28}
					color={theme.palette.primary.main}
				/>
				<Typography
					variant='h5'
					component='h2'
					sx={{ fontWeight: 700, ...createTextGradient(theme, 'primary'), margin: 0 }}
				>
					Gráficos de Analytics
				</Typography>
			</Box>

			<Paper
				elevation={0}
				sx={{
					p: 4,
					textAlign: 'center',
					backgroundColor: theme.palette.background.paper,
					borderRadius: 2,
					boxShadow: shadows.card,
					background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 100%)`,
					border: `2px dashed ${theme.palette.divider}`
				}}
			>
				<Box
					sx={{
						display: 'inline-flex',
						p: 3,
						borderRadius: '50%',
						bgcolor: 'primary.light',
						color: 'primary.dark',
						mb: 3
					}}
				>
					<AppIcon
						intent='analytics'
						size={48}
					/>
				</Box>

				<Typography
					variant='h5'
					sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
				>
					Dados Insuficientes
				</Typography>

				<Typography
					variant='body1'
					color='text.secondary'
					sx={{ maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
				>
					Este link ainda não possui dados suficientes para gerar gráficos. Os gráficos aparecerão após alguns
					cliques serem registrados.
				</Typography>
			</Paper>
		</Box>
	);
}
