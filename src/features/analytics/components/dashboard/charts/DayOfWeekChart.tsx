/**
 * 📅 DAY OF WEEK CHART - Gráfico de Cliques por Dia da Semana
 */

import { useTheme } from '@mui/material/styles';

import { formatBarChart } from '@/features/analytics/utils/chartFormatters';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { ChartCard } from '@/shared/ui/data-display/ChartCard';

import type { DayOfWeekData } from '@/types';

interface DayOfWeekChartProps {
	data: DayOfWeekData[];
	height?: number;
}

export function DayOfWeekChart({ data, height = 300 }: DayOfWeekChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<ChartCard title="Cliques por Dia da Semana" icon="📅">
			<ApexChartWrapper
				type='bar'
				height={height}
				{...formatBarChart(
					data,
					'day_name',
					'clicks',
					'#1976d2',
					false, // vertical bars
					isDark
				)}
			/>
		</ChartCard>
	);
}

export default DayOfWeekChart;

