import { Clock, Calendar, Globe, Smartphone, Monitor } from 'lucide-react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { AppIcon } from '@/shared/ui/icons';
import { createPresetShadows, createPresetAnimations, createTextGradient } from '@/lib/theme';
import { chartByType } from '@/lib/theme/colors';
import { ICON_LG } from '@/lib/theme/iconDefaults';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { ChartCard } from '@/shared/ui/data-display/ChartCard';

import type { PublicAnalyticsData } from '../../types';

const DOW_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

interface PublicChartsProps {
	analyticsData: PublicAnalyticsData;
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
						<ChartCard
							title='Cliques por Hora'
							icon={<Clock {...ICON_LG} />}
						>
							<ApexChartWrapper
								type='area'
								size='compact'
								{...formatAreaChart(
									hourData as Record<string, unknown>[],
									'hour',
									'clicks',
									chartByType.temporal.hourly,
									isDark
								)}
							/>
						</ChartCard>
					</Grid>
				) : null}

				{/* Linha 2: Dia da Semana + Top Países */}
				{hasDowData ? (
					<Grid
						item
						xs={12}
						md={hasCountryData ? 6 : 12}
					>
						<ChartCard
							title='Cliques por Dia da Semana'
							icon={<Calendar {...ICON_LG} />}
						>
							<ApexChartWrapper
								type='bar'
								size='standard'
								{...formatBarChart(
									dowData as Record<string, unknown>[],
									'day',
									'clicks',
									chartByType.temporal.weekly,
									false,
									isDark
								)}
							/>
						</ChartCard>
					</Grid>
				) : null}

				{hasCountryData ? (
					<Grid
						item
						xs={12}
						md={hasDowData ? 6 : 12}
					>
						<ChartCard
							title='Top Países'
							icon={<Globe {...ICON_LG} />}
						>
							<ApexChartWrapper
								type='bar'
								size='standard'
								{...formatBarChart(
									(charts.geographic?.top_countries ?? []) as Record<string, unknown>[],
									'country',
									'clicks',
									chartByType.geographic.countries,
									true,
									isDark
								)}
							/>
						</ChartCard>
					</Grid>
				) : null}

				{/* Linha 3: Dispositivos + Browsers */}
				{hasDeviceData ? (
					<Grid
						item
						xs={12}
						md={hasBrowserData ? 6 : 12}
					>
						<ChartCard
							title='Dispositivos'
							icon={<Smartphone {...ICON_LG} />}
						>
							<ApexChartWrapper
								type='donut'
								size='standard'
								{...formatPieChart(
									(charts.audience?.device_breakdown ?? []) as Record<string, unknown>[],
									'device',
									'clicks',
									isDark
								)}
							/>
						</ChartCard>
					</Grid>
				) : null}

				{hasBrowserData ? (
					<Grid
						item
						xs={12}
						md={hasDeviceData ? 6 : 12}
					>
						<ChartCard
							title='Browsers'
							icon={<Monitor {...ICON_LG} />}
						>
							<ApexChartWrapper
								type='donut'
								size='standard'
								{...formatPieChart(
									(charts.audience?.browser_breakdown ?? []) as Record<string, unknown>[],
									'browser',
									'clicks',
									isDark
								)}
							/>
						</ChartCard>
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
