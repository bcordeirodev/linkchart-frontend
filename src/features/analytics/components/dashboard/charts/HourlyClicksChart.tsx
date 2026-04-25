/**
 * 📈 HOURLY CLICKS CHART - Gráfico de Cliques por Hora
 */

import { useTheme } from '@mui/material/styles';

import { formatAreaChart } from '@/features/analytics/utils/chartFormatters';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { ChartCard } from '@/shared/ui/data-display/ChartCard';

import type { HourlyData } from '@/types';

interface HourlyClicksChartProps {
	data: HourlyData[];
	height?: number;
}

export function HourlyClicksChart({ data, height = 300 }: HourlyClicksChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<ChartCard
			title='Cliques por Hora do Dia'
			icon='📈'
		>
			<ApexChartWrapper
				type='area'
				height={height}
				{...formatAreaChart(data, 'hour', 'clicks', '#1976d2', isDark)}
			/>
		</ChartCard>
	);
}

export default HourlyClicksChart;
