/**
 * 🌍 TOP COUNTRIES CHART - Gráfico de Top Países
 */

import { useTheme } from '@mui/material/styles';
import { Globe } from 'lucide-react';

import { formatBarChart } from '@/features/analytics/utils/chartFormatters';
import { ICON_LG } from '@/lib/theme/iconDefaults';
import { chartByType } from '@/lib/theme/colors';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { ChartCard } from '@/shared/ui/data-display/ChartCard';

import type { CountryData } from '@/types';

interface TopCountriesChartProps {
	data: CountryData[];
	height?: number;
	maxCountries?: number;
}

export function TopCountriesChart({ data, height = 300, maxCountries = 10 }: TopCountriesChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const topCountries = data.slice(0, maxCountries);

	return (
		<ChartCard
			title='Top Países'
			icon={<Globe {...ICON_LG} />}
		>
			<ApexChartWrapper
				type='bar'
				height={height}
				{...formatBarChart(
					topCountries,
					'country',
					'clicks',
					chartByType.geographic.countries,
					true, // horizontal bars
					isDark
				)}
			/>
		</ChartCard>
	);
}

export default TopCountriesChart;
