/**
 * @fileoverview Tipos relacionados ao dashboard
 * Centraliza interfaces para métricas e visualizações do dashboard
 */

/**
 * Dados principais do dashboard
 */
export interface DashboardData {
	summary: DashboardSummary;
	top_links: DashboardLink[];
	recent_activity: ActivityData[];
	geographic_summary: GeographicSummary;
	device_summary: DeviceSummary;
	performance_indicators: PerformanceIndicator[];
}

/**
 * Resumo de métricas principais
 */
export interface DashboardSummary {
	total_links: number;
	active_links: number;
	total_clicks: number;
	unique_visitors: number;
	avg_clicks_per_link: number;
	success_rate: number;
	avg_response_time: number;
	countries_reached: number;
	links_with_traffic: number;
	conversion_rate?: number;
	growth_rate?: number;
}

/**
 * Link no dashboard
 */
export interface DashboardLink {
	id: number;
	title: string;
	short_url: string;
	original_url: string;
	clicks: number;
	unique_visitors: number;
	is_active: boolean;
	created_at: string;
	last_click_at?: string;
	performance_score?: number;
}

/**
 * Dados de atividade recente
 */
export interface ActivityData {
	date: string;
	clicks: number;
	unique_visitors: number;
	new_links: number;
}

/**
 * Resumo geográfico para dashboard
 */
export interface GeographicSummary {
	countries_reached: number;
	cities_reached: number;
	top_country?: string;
	top_country_clicks?: number;
	coverage_percentage?: number;
}

/**
 * Resumo de dispositivos para dashboard
 */
export interface DeviceSummary {
	desktop: number;
	mobile: number;
	tablet: number;
	total: number;
	mobile_percentage: number;
}

/**
 * Indicador de performance
 */
export interface PerformanceIndicator {
	metric: string;
	value: number;
	unit: string;
	trend: 'up' | 'down' | 'stable';
	change_percent: number;
	status: 'excellent' | 'good' | 'warning' | 'critical';
}

/**
 * Estatísticas calculadas do dashboard
 */
export interface DashboardStats {
	totalMetrics: number;
	lastUpdate: string;
	dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
	trendsAvailable: boolean;
	alertsCount: number;
	recommendationsCount: number;
}

/**
 * Opções para o hook useDashboardData
 */
export interface UseDashboardDataOptions {
	linkId?: string;

	refreshInterval?: number;
	enableRealtime?: boolean;
	timeframe?: '1h' | '24h' | '7d' | '30d';
	includeInactive?: boolean;
}

/**
 * Retorno do hook useDashboardData
 */
export interface UseDashboardDataReturn {
	data: DashboardData | null;
	stats: DashboardStats | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	isRealtime: boolean;
}

/**
 * Props para componentes do dashboard
 */
export interface DashboardAnalyticsProps {
	data?: DashboardData;
	loading?: boolean;
	error?: string | null;
	showTitle?: boolean;
	title?: string;
	compact?: boolean;
}

/**
 * Props para métricas do dashboard
 */
export interface DashboardMetricsProps {
	summary?: DashboardSummary;
	linksData?: DashboardLink[];
	loading?: boolean;
	showTitle?: boolean;
	title?: string;
	variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Props para lista de top links
 */
export interface TopLinksProps {
	links: DashboardLink[];
	maxItems?: number;
	title?: string;
	showMetrics?: boolean;
	onLinkClick?: (linkId: number) => void;
}

/**
 * Configuração de visualização do dashboard
 */
export interface DashboardViewConfig {
	showMetrics: boolean;
	showCharts: boolean;
	showTopLinks: boolean;
	showActivity: boolean;
	compactMode: boolean;
	refreshInterval: number;
}

/**
 * Filtros para dados do dashboard
 */
export interface DashboardFilters {
	timeframe: '1h' | '24h' | '7d' | '30d';
	includeInactive: boolean;
	minClicks: number;
	linkIds?: number[];
}

/**
 * Resposta da API do dashboard
 */
export interface DashboardApiResponse {
	success: boolean;
	data: DashboardData;
	metadata?: {
		generated_at: string;
		cache_ttl: number;
		data_freshness: 'real-time' | 'cached' | 'stale';
		total_processing_time: number;
	};
}
