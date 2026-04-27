import { MapPin, Globe, TrendingUp } from 'lucide-react';
import { Grid, Box, Typography } from '@mui/material';

import { ICON_LG } from '@/lib/theme/iconDefaults';

import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';

// Interface local para estatísticas
interface HeatmapStats {
	totalPoints: number;
	totalClicks: number;
	avgClicksPerPoint: number;
	topCountry: string;
	topCity: string;
	coveragePercentage: number;
}

interface HeatmapMetricsProps {
	stats: HeatmapStats | null;
	showTitle?: boolean;
	title?: string;
}

/**
 * 🔥 Métricas específicas do Heatmap
 * Focado em dados geográficos e distribuição
 */
export function HeatmapMetrics({ stats, showTitle = false, title = 'Métricas do Heatmap' }: HeatmapMetricsProps) {
	if (!stats) {
		return null;
	}

	const metrics = [
		{
			id: 'total_clicks',
			title: 'Total de Cliques',
			value: stats.totalClicks.toLocaleString(),
			icon: <TrendingUp />,
			color: 'primary' as const,
			subtitle: 'cliques mapeados'
		},
		{
			id: 'unique_countries',
			title: 'Países Únicos',
			value: stats.totalPoints.toString(),
			icon: <Globe {...ICON_LG} />,
			color: 'success' as const,
			subtitle: 'alcance global'
		},
		{
			id: 'unique_cities',
			title: 'Cidades Únicas',
			value: stats.totalClicks.toString(),
			icon: <MapPin {...ICON_LG} />,
			color: 'info' as const,
			subtitle: 'diversidade urbana'
		},
		{
			id: 'avg_clicks_per_location',
			title: 'Média por Local',
			value: stats.avgClicksPerPoint.toFixed(1),
			icon: <Globe {...ICON_LG} />,
			color: 'warning' as const,
			subtitle: 'cliques por localização'
		}
	];

	return (
		<Box sx={{ mb: 3 }}>
			{showTitle ? (
				<Typography
					variant='h6'
					sx={{ mb: 2, fontWeight: 600 }}
				>
					{title}
				</Typography>
			) : null}

			<Grid
				container
				spacing={3}
			>
				{metrics.map((metric) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						key={metric.id}
					>
						<Box sx={{ height: '100%' }}>
							<MetricCard
								title={metric.title}
								value={metric.value}
								icon={metric.icon}
								color={metric.color}
								subtitle={metric.subtitle}
							/>
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default HeatmapMetrics;
