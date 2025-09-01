import { Grid, Box, Typography, useTheme } from '@mui/material';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import {
	createSpacingUtils,
	createGlassCard,
	createPresetShadows,
	createTextGradient,
	createPresetAnimations
} from '@/lib/theme';
import {
	TrendingUp,
	Visibility,
	Public,
	Analytics as AnalyticsIcon,
	DevicesOther,
	Language,
	Schedule,
	Speed,
	Link as LinkIcon,
	CheckCircle,
	Assessment
} from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface MetricDefinition {
	id: string;
	title: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getValue: (data: any, linksData?: any[], performanceData?: any) => string | number;
	icon: React.ReactNode;
	color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
	subtitle?: string;
	category: 'analytics' | 'dashboard' | 'performance' | 'geographic' | 'audience';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UnifiedMetricsProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	linksData?: any[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	performanceData?: any;
	categories: ('analytics' | 'dashboard' | 'performance' | 'geographic' | 'audience')[];
	showTitle?: boolean;
	title?: string;
	maxCols?: number;
}

// Definições centralizadas de todas as métricas
const METRIC_DEFINITIONS: MetricDefinition[] = [
	// Analytics Metrics
	{
		id: 'total_clicks_analytics',
		title: 'Total de Cliques',
		getValue: (data) => data?.overview?.total_clicks?.toLocaleString() || '0',
		icon: <TrendingUp />,
		color: 'primary',
		subtitle: 'cliques acumulados',
		category: 'analytics'
	},
	{
		id: 'unique_visitors_analytics',
		title: 'Visitantes Únicos',
		getValue: (data) => data?.overview?.unique_visitors?.toLocaleString() || '0',
		icon: <Public />,
		color: 'success',
		subtitle: 'usuários únicos',
		category: 'analytics'
	},
	{
		id: 'conversion_rate',
		title: 'Taxa de Conversão',
		getValue: (data) => {
			const clicks = data?.overview?.total_clicks || 0;
			const visitors = data?.overview?.unique_visitors || 0;
			return clicks > 0 ? `${((visitors / clicks) * 100).toFixed(1)}%` : '0%';
		},
		icon: <Visibility />,
		color: 'info',
		subtitle: 'visitantes vs cliques',
		category: 'analytics'
	},
	{
		id: 'avg_daily_clicks',
		title: 'Média Diária',
		getValue: (data) => data?.overview?.avg_daily_clicks?.toFixed(1) || '0',
		icon: <AnalyticsIcon />,
		color: 'warning',
		subtitle: 'cliques por dia',
		category: 'analytics'
	},

	// Dashboard Metrics
	{
		id: 'total_links',
		title: 'Total de Links',
		getValue: (data, linksData) => (linksData?.length || 0).toString(),
		icon: <LinkIcon />,
		color: 'primary',
		subtitle: 'links criados',
		category: 'dashboard'
	},
	{
		id: 'active_links',
		title: 'Links Ativos',
		getValue: (data, linksData) => (linksData?.filter((link) => link.is_active)?.length || 0).toString(),
		icon: <CheckCircle />,
		color: 'success',
		subtitle: 'links funcionando',
		category: 'dashboard'
	},
	{
		id: 'total_clicks_dashboard',
		title: 'Total de Cliques',
		getValue: (data, linksData) =>
			(linksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0).toLocaleString(),
		icon: <TrendingUp />,
		color: 'info',
		subtitle: 'cliques acumulados',
		category: 'dashboard'
	},
	{
		id: 'avg_clicks_per_link',
		title: 'Média por Link',
		getValue: (data, linksData) => {
			const totalLinks = linksData?.length || 0;
			const totalClicks = linksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
			return totalLinks > 0 ? Math.round(totalClicks / totalLinks).toString() : '0';
		},
		icon: <Assessment />,
		color: 'warning',
		subtitle: 'cliques por link',
		category: 'dashboard'
	},

	// Performance Metrics
	{
		id: 'performance_clicks',
		title: 'Cliques (24h)',
		getValue: (data, linksData, performanceData) =>
			(performanceData?.summary?.total_redirects_24h || 0).toLocaleString(),
		icon: <TrendingUp />,
		color: 'primary',
		subtitle: 'últimas 24 horas',
		category: 'performance'
	},
	{
		id: 'performance_visitors',
		title: 'Visitantes Únicos',
		getValue: (data, linksData, performanceData) =>
			(performanceData?.summary?.unique_visitors || 0).toLocaleString(),
		icon: <Public />,
		color: 'success',
		subtitle: 'usuários únicos',
		category: 'performance'
	},
	{
		id: 'success_rate',
		title: 'Taxa de Sucesso',
		getValue: (data, linksData, performanceData) => `${Math.round(performanceData?.summary?.success_rate || 100)}%`,
		icon: <CheckCircle />,
		color: 'info',
		subtitle: 'redirecionamentos',
		category: 'performance'
	},
	{
		id: 'response_time',
		title: 'Tempo Resposta',
		getValue: (data, linksData, performanceData) =>
			`${Math.round(performanceData?.summary?.avg_response_time || 0)}ms`,
		icon: <Speed />,
		color: 'warning',
		subtitle: 'tempo médio',
		category: 'performance'
	},

	// Geographic Metrics
	{
		id: 'countries_reached',
		title: 'Países Alcançados',
		getValue: (data) =>
			(data?.geographic?.top_countries?.length || data?.overview?.countries_reached || 0).toString(),
		icon: <Language />,
		color: 'secondary',
		subtitle: 'alcance global',
		category: 'geographic'
	},
	{
		id: 'cities_reached',
		title: 'Cidades Alcançadas',
		getValue: (data) => (data?.geographic?.top_cities?.length || 0).toString(),
		icon: <Schedule />,
		color: 'info',
		subtitle: 'diversidade urbana',
		category: 'geographic'
	},

	// Audience Metrics
	{
		id: 'device_types',
		title: 'Tipos de Dispositivos',
		getValue: (data) => (data?.audience?.device_breakdown?.length || 0).toString(),
		icon: <DevicesOther />,
		color: 'success',
		subtitle: 'dispositivos únicos',
		category: 'audience'
	}
];

/**
 * Componente unificado de métricas que elimina duplicação
 * Centraliza todas as definições de métricas e permite composição flexível
 */
export function UnifiedMetrics({
	data,
	linksData = [],
	performanceData,
	categories,
	showTitle = false,
	title = 'Métricas',
}: UnifiedMetricsProps) {
	const theme = useTheme();

	// Usa utilitários de tema
	const spacing = createSpacingUtils(theme);
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	// Filtrar métricas baseado nas categorias solicitadas
	const relevantMetrics = METRIC_DEFINITIONS.filter((metric) => categories.includes(metric.category));

	if (relevantMetrics.length === 0) {
		return (
			<Box
				sx={{
					...(createGlassCard(theme, 'neutral') as any),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: 200,
					textAlign: 'center',
					gap: 2,
					p: 4
				}}
			>
				<Typography variant="h4">📊</Typography>
				<Typography variant="h6">Carregando métricas...</Typography>
			</Box>
		);
	}

	// Lógica de grid corrigida e simplificada
	const getResponsiveGrid = () => {
		const metricsCount = relevantMetrics.length;

		// Se temos poucas métricas, ajustar automaticamente
		if (metricsCount <= 2) {
			return { xs: 12, sm: 6, md: 6, lg: 6 };
		} else if (metricsCount === 3) {
			return { xs: 12, sm: 6, md: 4, lg: 4 };
		} else {
			// 4 ou mais métricas - layout padrão
			return { xs: 12, sm: 6, md: 3, lg: 3 };
		}
	};

	const gridProps = getResponsiveGrid();

	return (
		<Box sx={{ mb: 3 }}>
			{showTitle && (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 3,
						p: 2,
						...(createGlassCard(theme, 'primary') as any)
					}}
				>
					<Box>
						<Typography
							variant="h6"
							sx={{
								...createTextGradient(theme, 'primary'),
								fontWeight: 700,
								display: 'flex',
								alignItems: 'center',
								gap: 1
							}}
						>
							<span>📊</span>
							{title}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{relevantMetrics.length} métricas • {categories.join(', ')}
						</Typography>
					</Box>
					<Box
						sx={{
							px: 2,
							py: 1,
							borderRadius: 1,
							bgcolor: 'primary.alpha10',
							color: 'primary.main',
							fontSize: '0.75rem',
							fontWeight: 600,
							textTransform: 'uppercase'
						}}
					>
						{categories[0]}
					</Box>
				</Box>
			)}

			<Grid
				container
				spacing={3}
				sx={{
					...animations.fadeIn
				}}
			>
				{relevantMetrics.map((metric) => {
					const value = metric.getValue(data, linksData, performanceData);

					return (
						<Grid
							item
							{...gridProps}
							key={metric.id}
						>
							<Box
								sx={{
									height: '100%',
									...animations.cardHover
								}}
							>
								<MetricCard
									title={metric.title}
									value={value}
									icon={metric.icon}
									color={metric.color}
									subtitle={metric.subtitle}
								/>
							</Box>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}

export default UnifiedMetrics;
