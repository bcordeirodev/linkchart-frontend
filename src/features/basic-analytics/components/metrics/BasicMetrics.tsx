import { Grid } from '@mui/material';
import { MetricCardOptimized } from '@/shared/ui/base';
import { AppIcon } from '@/lib/icons';
import type { BasicAnalyticsData } from '../../types';

interface BasicMetricsProps {
	analyticsData: BasicAnalyticsData;
}

/**
 * 📊 MÉTRICAS BÁSICAS
 *
 * Componente que exibe as métricas principais usando MetricCardOptimized
 * Segue padrões de design system do projeto
 */
export function BasicMetrics({ analyticsData }: BasicMetricsProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	// Estilo comum para cards compactos
	const compactCardStyle = {
		'& .MuiCardContent-root': {
			p: 2,
			'&:last-child': { pb: 2 }
		},
		'& .MuiTypography-h4': {
			fontSize: '1.5rem',
			fontWeight: 600
		}
	};

	return (
		<Grid
			container
			spacing={2}
		>
			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<MetricCardOptimized
					title="Total de Cliques"
					value={analyticsData.total_clicks.toLocaleString()}
					icon={
						<AppIcon
							intent="analytics"
							size={20}
						/>
					}
					color="primary"
					sx={compactCardStyle}
				/>
			</Grid>

			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<MetricCardOptimized
					title="Status"
					value={analyticsData.is_active ? 'Ativo' : 'Inativo'}
					icon={
						<AppIcon
							intent="info"
							size={20}
						/>
					}
					color={analyticsData.is_active ? 'success' : 'error'}
					sx={compactCardStyle}
				/>
			</Grid>

			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<MetricCardOptimized
					title="Criado em"
					value={formatDate(analyticsData.created_at).split(' às ')[0]}
					subtitle={formatDate(analyticsData.created_at).split(' às ')[1]}
					icon={
						<AppIcon
							name="time.calendar"
							size={20}
						/>
					}
					color="info"
					sx={compactCardStyle}
				/>
			</Grid>

			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<MetricCardOptimized
					title="Analytics"
					value={analyticsData.has_analytics ? 'Disponível' : 'Sem dados'}
					icon={
						<AppIcon
							intent="chart"
							size={20}
						/>
					}
					color={analyticsData.has_analytics ? 'success' : 'warning'}
					sx={compactCardStyle}
				/>
			</Grid>
		</Grid>
	);
}
