import { Grid, Box, Typography, useTheme } from '@mui/material';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { createPresetAnimations } from '@/lib/theme';
import { DevicesOther, Language, Schedule, TrendingUp } from '@mui/icons-material';

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
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

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
			icon: <DevicesOther />,
			color: 'primary' as const,
			subtitle: 'dispositivos únicos'
		},
		{
			id: 'browser_types',
			title: 'Navegadores',
			value: browserTypes.toString(),
			icon: <Language />,
			color: 'success' as const,
			subtitle: 'browsers diferentes'
		},
		{
			id: 'os_types',
			title: 'Sistemas Operacionais',
			value: osTypes.toString(),
			icon: <Schedule />,
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
		<Box sx={{ mb: 3 }}>
			{showTitle && (
				<Typography
					variant="h6"
					sx={{ mb: 2, fontWeight: 600 }}
				>
					{title}
				</Typography>
			)}

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
						md={3}
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

export default AudienceMetrics;
