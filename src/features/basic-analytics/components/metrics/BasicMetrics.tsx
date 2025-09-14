import { Grid } from '@mui/material';
import {
	Analytics as AnalyticsIcon,
	Schedule as ScheduleIcon,
	Visibility as VisibilityIcon
} from '@mui/icons-material';
import { MetricCardOptimized } from '@/shared/ui/base';
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

	return (
		<Grid
			container
			spacing={3}
			sx={{ mb: 4 }}
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
					icon={<VisibilityIcon />}
					color="primary"
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
					icon={<AnalyticsIcon />}
					color={analyticsData.is_active ? 'success' : 'error'}
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
					icon={<ScheduleIcon />}
					color="info"
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
					icon={<AnalyticsIcon />}
					color={analyticsData.has_analytics ? 'success' : 'warning'}
				/>
			</Grid>
		</Grid>
	);
}
