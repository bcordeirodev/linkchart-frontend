'use client';

import { Grid, Box } from '@mui/material';
import { TrendingUp, Public, Schedule, Analytics, Visibility, Speed, Flag } from '@mui/icons-material';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { LinkAnalyticsData } from '../../types/analytics';

interface LinkAnalyticsMetricsProps {
	data: LinkAnalyticsData | null;
	loading?: boolean;
}

/**
 * 📈 Métricas específicas para analytics de link individual
 * Reutiliza MetricCard base seguindo padrões arquiteturais
 */
export function LinkAnalyticsMetrics({ data, loading = false }: LinkAnalyticsMetricsProps) {
	if (!data?.has_data) {
		return (
			<Box sx={{ mb: 4 }}>
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Total de Cliques"
							value="0"
							icon={<TrendingUp />}
							color="primary"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Visitantes Únicos"
							value="0"
							icon={<Public />}
							color="secondary"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Países Alcançados"
							value="0"
							icon={<Flag />}
							color="success"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Média Diária"
							value="0"
							subtitle="cliques/dia"
							icon={<Analytics />}
							color="warning"
						/>
					</Grid>
				</Grid>
			</Box>
		);
	}

	const overview = data.overview || {
		total_clicks: 0,
		unique_visitors: 0,
		countries_reached: 0,
		avg_daily_clicks: 0,
		conversion_rate: 0,
		bounce_rate: 0,
		peak_hour: '--:--'
	};

	return (
		<Box sx={{ mb: 4 }}>
			<Grid
				container
				spacing={3}
			>
				{/* Primeira linha - Métricas principais */}
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title="Total de Cliques"
						value={String(overview.total_clicks || 0)}
						icon={<TrendingUp />}
						color="primary"
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title="Visitantes Únicos"
						value={String(overview.unique_visitors || 0)}
						icon={<Visibility />}
						color="secondary"
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title="Países Alcançados"
						value={String(overview.countries_reached || 0)}
						icon={<Flag />}
						color="success"
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title="Média Diária"
						value={String(overview.avg_daily_clicks || 0)}
						subtitle="cliques/dia"
						icon={<Analytics />}
						color="warning"
					/>
				</Grid>

				{/* Segunda linha - Métricas avançadas */}
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
				>
					<MetricCard
						title="Taxa de Conversão"
						value={`${(overview.conversion_rate || 0).toFixed(1)}%`}
						subtitle="cliques/visitante"
						icon={<Speed />}
						color="info"
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={4}
				>
					<MetricCard
						title="Taxa de Rejeição"
						value={`${(overview.bounce_rate || 0).toFixed(1)}%`}
						subtitle="visitas únicas"
						icon={<Public />}
						color="error"
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={4}
				>
					<MetricCard
						title="Horário de Pico"
						value={(overview as any)?.peak_hour || '--:--'}
						subtitle="maior atividade"
						icon={<Schedule />}
						color="secondary"
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

export default LinkAnalyticsMetrics;
