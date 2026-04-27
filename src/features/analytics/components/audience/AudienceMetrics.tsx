import { MonitorSmartphone, Globe, Clock, TrendingUp } from 'lucide-react';
import { Grid, Typography } from '@mui/material';

import { ICON_LG } from '@/lib/theme/iconDefaults';

import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';

interface AudienceMetricsProps {
	data?: any;
	showTitle?: boolean;
	title?: string;
}

/**
 * 👥 Métricas específicas de Audiência
 * Focado em dispositivos, browsers e comportamento
 */
export function AudienceMetrics({ data, showTitle = false, title = 'Métricas de Audiência' }: AudienceMetricsProps) {
	// Cálculos das métricas
	const deviceTypes = data?.audience?.device_breakdown?.length || 0;
	const browserTypes = data?.audience?.browser_breakdown?.length || 0;
	const osTypes = data?.audience?.os_breakdown?.length || 0;
	const totalAudienceClicks =
		data?.audience?.device_breakdown?.reduce((sum: number, device: any) => sum + (device.clicks || 0), 0) || 0;

	const metrics = [
		{
			id: 'device_types',
			title: 'Tipos de Dispositivos',
			value: deviceTypes.toString(),
			icon: <MonitorSmartphone {...ICON_LG} />,
			color: 'primary' as const,
			subtitle: 'dispositivos únicos'
		},
		{
			id: 'browser_types',
			title: 'Navegadores',
			value: browserTypes.toString(),
			icon: <Globe {...ICON_LG} />,
			color: 'success' as const,
			subtitle: 'browsers diferentes'
		},
		{
			id: 'os_types',
			title: 'Sistemas Operacionais',
			value: osTypes.toString(),
			icon: <Clock {...ICON_LG} />,
			color: 'info' as const,
			subtitle: 'OS diferentes'
		},
		{
			id: 'audience_clicks',
			title: 'Cliques da Audiência',
			value: totalAudienceClicks.toLocaleString(),
			icon: <TrendingUp />,
			color: 'warning' as const,
			subtitle: 'engajamento total'
		}
	];

	return (
		<>
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
		</>
	);
}

export default AudienceMetrics;
