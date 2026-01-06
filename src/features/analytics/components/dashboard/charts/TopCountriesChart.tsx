/**
 * 🌍 TOP COUNTRIES CHART - Gráfico de Top Países
 */

import { useTheme } from '@mui/material/styles';

import { formatBarChart } from '@/features/analytics/utils/chartFormatters';
import { createComponentColorSet } from '@/lib/theme';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { ChartCard } from '@/shared/ui/data-display/ChartCard';

import type { CountryData } from '@/types';

interface TopCountriesChartProps {
	data: CountryData[];
	height?: number;
	maxCountries?: number;
}

export function TopCountriesChart({
	data,
	height = 300,
	maxCountries = 10
}: TopCountriesChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const successColors = createComponentColorSet(theme, 'success');

	const topCountries = data.slice(0, maxCountries);

	return (
		<ChartCard title="Top Países" icon="🌍">
			<ApexChartWrapper
				type='bar'
				height={height}
				{...formatBarChart(
					topCountries,
					'country',
					'clicks',
					successColors.main,
					true, // horizontal bars
					isDark
				)}
			/>
		</ChartCard>
	);
}

export default TopCountriesChart;

