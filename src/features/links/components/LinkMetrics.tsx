import { TrendingUp, Link as LinkIcon, CheckCircle, Assessment } from '@mui/icons-material';
import { Grid, Box, Typography } from '@mui/material';

import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';

import type { LinkResponse } from '@/types';

interface LinkMetricsSummary {
	total_links?: number;
	active_links?: number;
	total_clicks?: number;
	avg_clicks_per_link?: number;
}

interface DashboardMetricsProps {
	summary?: LinkMetricsSummary;
	linksData?: LinkResponse[];
	showTitle?: boolean;
	title?: string;
	/** @deprecated mantido apenas para compatibilidade com consumidores legados */
	variant?: 'compact' | 'detailed';
}

/**
 * 📊 Métricas específicas do Dashboard
 * Focado em estatísticas gerais dos links
 */
export function LinkMetrics({
	summary,
	linksData = [],
	showTitle = false,
	title = 'Métricas do Dashboard'
}: DashboardMetricsProps) {
	const totalLinks = summary?.total_links ?? linksData.length;
	const activeLinks = summary?.active_links ?? linksData.filter((link) => link.is_active).length;
	const totalClicks = summary?.total_clicks ?? linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
	const avgClicksPerLink =
		summary?.avg_clicks_per_link ?? (totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0);

	const metrics = [
		{
			id: 'total_links',
			title: 'Total de Links',
			value: totalLinks.toString(),
			icon: <LinkIcon />,
			color: 'primary' as const,
			subtitle: 'links criados'
		},
		{
			id: 'active_links',
			title: 'Links Ativos',
			value: activeLinks.toString(),
			icon: <CheckCircle />,
			color: 'success' as const,
			subtitle: 'links funcionando'
		},
		{
			id: 'total_clicks',
			title: 'Total de Cliques',
			value: totalClicks.toLocaleString(),
			icon: <TrendingUp />,
			color: 'info' as const,
			subtitle: 'cliques acumulados'
		},
		{
			id: 'avg_clicks_per_link',
			title: 'Média por Link',
			value: avgClicksPerLink.toString(),
			icon: <Assessment />,
			color: 'warning' as const,
			subtitle: 'cliques por link'
		}
	];

	return (
		<Box sx={{ mb: 3 }}>
			{showTitle ? (
				<Typography
					variant='h6'
					sx={{ mb: 3, fontWeight: 600 }}
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
						<MetricCard
							title={metric.title}
							value={metric.value}
							icon={metric.icon}
							color={metric.color}
							subtitle={metric.subtitle}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default LinkMetrics;
