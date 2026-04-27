import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import type { SparklinePoint } from '@/types';

interface LinkSparklineProps {
	data: SparklinePoint[];
	trend?: number;
	height?: number;
	width?: number | string;
}

export function LinkSparkline({ data, trend = 0, height = 32, width = 120 }: LinkSparklineProps) {
	const theme = useTheme();

	const color =
		trend > 0
			? theme.palette.success.main
			: trend < 0
				? theme.palette.error.main
				: theme.palette.text.secondary;

	const series = useMemo(() => [{ data: data.map((d) => d.clicks) }], [data]);

	const options = useMemo(
		() => ({
			chart: { sparkline: { enabled: true }, animations: { enabled: false } },
			stroke: { curve: 'smooth', width: 2 },
			fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0 } },
			colors: [color],
			tooltip: { enabled: false },
			xaxis: { labels: { show: false }, axisBorder: { show: false } },
			yaxis: { labels: { show: false } },
			grid: { show: false },
		}),
		[color]
	);

	if (!data.length) return null;

	return (
		<ApexChartWrapper
			type='area'
			height={height}
			width={width}
			series={series}
			options={options}
		/>
	);
}
