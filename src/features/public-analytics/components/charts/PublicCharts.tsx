import { Clock, Calendar, Globe, Smartphone, Monitor, BarChart2 } from 'lucide-react';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { formatAreaChart, formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { createPresetAnimations, createTextGradient } from '@/lib/theme';
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
	const { charts } = analyticsData;

	const hourData = (charts?.temporal?.clicks_by_hour ?? []).map((d) => ({
		hour: `${d.hour}h`,
		clicks: d.clicks
	}));
	const dowData = (charts?.temporal?.clicks_by_day_of_week ?? []).map((d) => ({
		day: DOW_LABELS[d.day] ?? String(d.day),
		clicks: d.clicks
	}));

	const hasHourData = hourData.some((d) => d.clicks > 0);
	const hasDowData = dowData.some((d) => d.clicks > 0);
	const hasDeviceData = (charts?.audience?.device_breakdown?.length ?? 0) > 0;
	const hasBrowserData = (charts?.audience?.browser_breakdown?.length ?? 0) > 0;
	const hasCountryData = (charts?.geographic?.top_countries?.length ?? 0) > 0;

	const hasRealData =
		analyticsData.has_analytics &&
		charts &&
		(hasHourData || hasDowData || hasDeviceData || hasBrowserData || hasCountryData);

	if (!hasRealData) {
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

			<ChartsGrid
				isDark={isDark}
				hourData={hasHourData ? hourData : undefined}
				dowData={hasDowData ? dowData : undefined}
				deviceData={
					hasDeviceData
						? (charts?.audience?.device_breakdown as { device: string; clicks: number }[])
						: undefined
				}
				browserData={
					hasBrowserData
						? (charts?.audience?.browser_breakdown as { browser: string; clicks: number }[])
						: undefined
				}
				countryData={
					hasCountryData
						? (charts?.geographic?.top_countries as { country: string; clicks: number }[])
						: undefined
				}
			/>
		</Box>
	);
}

interface ChartsGridProps {
	isDark: boolean;
	hourData?: { hour: string; clicks: number }[];
	dowData?: { day: string; clicks: number }[];
	deviceData?: { device: string; clicks: number }[];
	browserData?: { browser: string; clicks: number }[];
	countryData?: { country: string; clicks: number }[];
}

function ChartsGrid({ isDark, hourData, dowData, deviceData, browserData, countryData }: ChartsGridProps) {
	return (
		<Grid
			container
			spacing={3}
		>
			{hourData ? (
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

			{dowData ? (
				<Grid
					item
					xs={12}
					md={countryData ? 6 : 12}
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

			{countryData ? (
				<Grid
					item
					xs={12}
					md={dowData ? 6 : 12}
				>
					<ChartCard
						title='Top Países'
						icon={<Globe {...ICON_LG} />}
					>
						<ApexChartWrapper
							type='bar'
							size='standard'
							{...formatBarChart(
								countryData as Record<string, unknown>[],
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

			{deviceData ? (
				<Grid
					item
					xs={12}
					md={browserData ? 6 : 12}
				>
					<ChartCard
						title='Dispositivos'
						icon={<Smartphone {...ICON_LG} />}
					>
						<ApexChartWrapper
							type='donut'
							size='standard'
							{...formatPieChart(deviceData as Record<string, unknown>[], 'device', 'clicks', isDark)}
						/>
					</ChartCard>
				</Grid>
			) : null}

			{browserData ? (
				<Grid
					item
					xs={12}
					md={deviceData ? 6 : 12}
				>
					<ChartCard
						title='Browsers'
						icon={<Monitor {...ICON_LG} />}
					>
						<ApexChartWrapper
							type='donut'
							size='standard'
							{...formatPieChart(browserData as Record<string, unknown>[], 'browser', 'clicks', isDark)}
						/>
					</ChartCard>
				</Grid>
			) : null}
		</Grid>
	);
}

function EmptyChartsState() {
	return (
		<Box
			sx={{
				py: { xs: 3, md: 4 },
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 1.5,
				border: '1px solid rgba(255,255,255,0.05)',
				borderRadius: '12px',
				background: 'rgba(255,255,255,0.02)'
			}}
		>
			<BarChart2
				size={28}
				color='rgba(255,255,255,0.12)'
				strokeWidth={1.5}
			/>
			<Typography
				sx={{
					fontSize: '0.875rem',
					fontWeight: 500,
					color: 'rgba(255,255,255,0.25)',
					textAlign: 'center'
				}}
			>
				Os gráficos aparecerão após os primeiros cliques
			</Typography>
			<Typography
				sx={{
					fontSize: '0.75rem',
					color: 'rgba(255,255,255,0.13)',
					textAlign: 'center',
					maxWidth: 340,
					lineHeight: 1.6
				}}
			>
				Horários de pico, dispositivos, países e muito mais.
			</Typography>
		</Box>
	);
}
