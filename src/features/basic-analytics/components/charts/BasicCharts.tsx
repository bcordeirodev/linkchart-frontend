import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ChartCard } from '@/shared/ui/base/ChartCard';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import type { BasicAnalyticsData } from '../../types';

interface BasicChartsProps {
	analyticsData: BasicAnalyticsData;
}

/**
 * 📊 GRÁFICOS BÁSICOS
 *
 * Componente que renderiza gráficos básicos de dispositivos e países
 * Reutiliza componentes e formatadores do dashboard
 */
export function BasicCharts({ analyticsData }: BasicChartsProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	// Verificar se há dados de gráficos
	if (!analyticsData.has_analytics || !analyticsData.charts) {
		return null;
	}

	const { charts } = analyticsData;
	const hasDeviceData = charts.audience?.device_breakdown && charts.audience.device_breakdown.length > 0;
	const hasCountryData = charts.geographic?.top_countries && charts.geographic.top_countries.length > 0;

	// Se não há dados, não renderizar
	if (!hasDeviceData && !hasCountryData) {
		return null;
	}

	return (
		<Box sx={{ mb: 4 }}>
			<Typography
				variant="h5"
				gutterBottom
				sx={{
					mb: 3,
					textAlign: 'center',
					fontWeight: 600,
					color: 'text.primary'
				}}
			>
				📊 Gráficos Básicos
			</Typography>

			<Grid
				container
				spacing={3}
			>
				{/* Gráfico de Dispositivos */}
				{hasDeviceData && (
					<Grid
						item
						xs={12}
						md={6}
					>
						<ChartCard title="📱 Dispositivos">
							<Box sx={{ p: 2 }}>
								<ApexChartWrapper
									type="donut"
									height={300}
									{...formatPieChart(charts.audience!.device_breakdown!, 'device', 'clicks', isDark)}
								/>
							</Box>
						</ChartCard>
					</Grid>
				)}

				{/* Gráfico de Países */}
				{hasCountryData && (
					<Grid
						item
						xs={12}
						md={6}
					>
						<ChartCard title="🌍 Top Países">
							<Box sx={{ p: 2 }}>
								<ApexChartWrapper
									type="bar"
									height={300}
									{...formatBarChart(
										charts.geographic!.top_countries!,
										'country',
										'clicks',
										'#2e7d32',
										true, // horizontal bars
										isDark
									)}
								/>
							</Box>
						</ChartCard>
					</Grid>
				)}
			</Grid>
		</Box>
	);
}
