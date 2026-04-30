import { TrendingUp, Link2, CheckCircle, BarChart3 } from 'lucide-react';
import { ICON_LG } from '@/lib/theme/iconDefaults';
import { Grid, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
export function LinkMetrics({ summary, linksData = [], showTitle = false, title }: DashboardMetricsProps) {
	const { t } = useTranslation('links');
	const titleText = title ?? t('metrics.title');
	const totalLinks = summary?.total_links ?? linksData.length;
	const activeLinks = summary?.active_links ?? linksData.filter((link) => link.is_active).length;
	const totalClicks = summary?.total_clicks ?? linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
	const avgClicksPerLink =
		summary?.avg_clicks_per_link ?? (totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0);

	const metrics = [
		{
			id: 'total_links',
			title: t('list.pageTitle'),
			value: totalLinks.toString(),
			icon: <Link2 {...ICON_LG} />,
			color: 'primary' as const,
			subtitle: t('metrics.linksCreated')
		},
		{
			id: 'active_links',
			title: t('status.active'),
			value: activeLinks.toString(),
			icon: <CheckCircle {...ICON_LG} />,
			color: 'success' as const,
			subtitle: t('metrics.linksActive')
		},
		{
			id: 'total_clicks',
			title: t('metrics.totalClicks'),
			value: totalClicks.toLocaleString(),
			icon: <TrendingUp {...ICON_LG} />,
			color: 'info' as const,
			subtitle: t('metrics.totalClicksSubtitle')
		},
		{
			id: 'avg_clicks_per_link',
			title: t('metrics.avgClicksDay'),
			value: avgClicksPerLink.toString(),
			icon: <BarChart3 {...ICON_LG} />,
			color: 'warning' as const,
			subtitle: t('metrics.clicksPerLink')
		}
	];

	return (
		<Box sx={{ mb: 3 }}>
			{showTitle ? (
				<Typography
					variant='h6'
					sx={{ mb: 3, fontWeight: 600 }}
				>
					{titleText}
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
