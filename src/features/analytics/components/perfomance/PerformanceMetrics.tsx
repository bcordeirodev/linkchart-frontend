import { TrendingUp, Public, CheckCircle, Speed } from '@mui/icons-material';
import { Grid, Box, Typography, useTheme } from '@mui/material';

import { createPresetAnimations } from '@/lib/theme';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';

interface PerformanceMetricsProps {
	data?: unknown;
	performanceData?: {
		total_redirects_24h?: number;
		unique_visitors?: number;
		success_rate?: number;
		avg_response_time?: number;
		performance_score?: number;
		uptime_percentage?: number;
		clicks_per_hour?: number;
		visitor_retention?: number;
		total_links?: number;
	};
	showTitle?: boolean;
	title?: string;
}

/**
 * ⚡ Métricas específicas de Performance
 * Focado em velocidade, disponibilidade e qualidade
 */
export function PerformanceMetrics({
	data: _data,
	performanceData,
	showTitle = false,
	title = 'Métricas de Performance'
}: PerformanceMetricsProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	// Cálculos das métricas usando dados reais do backend
	const clicks24h = performanceData?.total_redirects_24h || 0;
	const uniqueVisitors = performanceData?.unique_visitors || 0;
	const successRate = Math.round(performanceData?.success_rate || 100);
	const responseTime = Math.round(performanceData?.avg_response_time || 0);
	const performanceScore = Math.round(performanceData?.performance_score || 0);
	const uptimePercentage = Math.round(performanceData?.uptime_percentage || 100);
	const clicksPerHour = Math.round(performanceData?.clicks_per_hour || 0);
	const visitorRetention = Math.round(performanceData?.visitor_retention || 0);

	const metrics = [
		{
			id: 'performance_score',
			title: 'Score Performance',
			value: `${performanceScore}`,
			icon: <CheckCircle />,
			color:
				performanceScore >= 90
					? ('success' as const)
					: performanceScore >= 70
						? ('info' as const)
						: ('warning' as const),
			subtitle: 'pontuação geral'
		},
		{
			id: 'uptime_percentage',
			title: 'Uptime Real',
			value: `${uptimePercentage}%`,
			icon: <CheckCircle />,
			color:
				uptimePercentage >= 99
					? ('success' as const)
					: uptimePercentage >= 95
						? ('info' as const)
						: ('warning' as const),
			subtitle: 'disponibilidade'
		},
		{
			id: 'clicks_per_hour',
			title: 'Cliques/Hora',
			value: clicksPerHour.toLocaleString(),
			icon: <TrendingUp />,
			color: 'primary' as const,
			subtitle: 'taxa horária'
		},
		{
			id: 'visitor_retention',
			title: 'Retenção',
			value: `${visitorRetention}%`,
			icon: <Public />,
			color:
				visitorRetention >= 80
					? ('success' as const)
					: visitorRetention >= 60
						? ('info' as const)
						: ('warning' as const),
			subtitle: 'visitantes únicos'
		},
		{
			id: 'response_time',
			title: 'Tempo Resposta',
			value: `${responseTime}ms`,
			icon: <Speed />,
			color:
				responseTime < 200
					? ('success' as const)
					: responseTime < 400
						? ('warning' as const)
						: ('error' as const),
			subtitle: 'tempo médio'
		},
		{
			id: 'success_rate',
			title: 'Taxa de Sucesso',
			value: `${successRate}%`,
			icon: <CheckCircle />,
			color:
				successRate >= 99 ? ('success' as const) : successRate >= 95 ? ('info' as const) : ('warning' as const),
			subtitle: 'redirecionamentos'
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
				sx={{ ...animations.fadeIn }}
			>
				{metrics.map((metric) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={2}
						key={metric.id}
					>
						<Box sx={{ height: '100%', ...animations.cardHover }}>
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

export default PerformanceMetrics;
