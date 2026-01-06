/**
 * 📱 DEVICE BREAKDOWN CHART - Gráfico de Dispositivos
 */

import { useTheme } from '@mui/material/styles';

import { formatPieChart } from '@/features/analytics/utils/chartFormatters';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { ChartCard } from '@/shared/ui/data-display/ChartCard';

import type { DeviceData } from '@/types';

interface DeviceBreakdownChartProps {
	data: DeviceData[];
	height?: number;
}

export function DeviceBreakdownChart({ data, height = 300 }: DeviceBreakdownChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<ChartCard title="Dispositivos" icon="📱">
			<ApexChartWrapper
				type='donut'
				height={height}
				{...formatPieChart(
					data.map((item) => ({
						device: item.device,
						clicks: item.clicks
					})),
					'device',
					'clicks',
					isDark
				)}
			/>
		</ChartCard>
	);
}

export default DeviceBreakdownChart;

