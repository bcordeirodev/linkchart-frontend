import { BaseService } from '../../../lib/api/base.service';
import { API_CONFIG } from '../../../lib/api/endpoints';
import { AnalyticsData } from '@/features/analytics/types/analytics';
import { MetricsDashboardResponse } from '@/features/analytics/types/metrics';
import { LinkPerformanceDashboard } from '../types/linkPerformance';
import { EnhancedAnalyticsData } from '@/features/analytics/hooks/useEnhancedAnalytics';

/**
 * Serviço para operações de Analytics
 *
 * Centraliza todas as chamadas relacionadas a:
 * - Analytics gerais
 * - Métricas de performance
 * - Analytics de links específicos
 * - Dados de dashboard
 */
export default class AnalyticsService extends BaseService {
	constructor() {
		super('AnalyticsService');
	}

	/**
	 * Busca dados gerais de analytics do usuário
	 */
	async getAnalytics(): Promise<AnalyticsData> {
		const fallbackData: AnalyticsData = {
			overview: {
				total_clicks: 0,
				unique_visitors: 0,
				countries_reached: 0,
				avg_daily_clicks: 0
			},
			geographic: {
				heatmap_data: [],
				top_countries: [],
				top_states: [],
				top_cities: []
			},
			temporal: {
				clicks_by_hour: [],
				clicks_by_day_of_week: []
			},
			audience: {
				device_breakdown: []
			},
			insights: []
		};

		return this.get<AnalyticsData>(API_CONFIG.ENDPOINTS.ANALYTICS, {
			fallback: fallbackData,
			context: 'get_analytics'
		});
	}

	/**
	 * Busca métricas unificadas do dashboard
	 */
	async getDashboardMetrics(hours = 24): Promise<MetricsDashboardResponse> {
		const endpoint = `/api/metrics/dashboard?hours=${hours}`;

		const fallbackData: MetricsDashboardResponse = {
			success: true,
			timeframe: `${hours}h`,
			totalClicks: 0,
			totalLinks: 0,
			averageClicksPerLink: 0,
			topPerformingLinks: [],
			categories: [],
			metrics: {
				dashboard: {
					total_links: 0,
					active_links: 0,
					total_clicks: 0,
					avg_clicks_per_link: 0
				},
				analytics: {
					total_clicks: 0,
					unique_visitors: 0,
					conversion_rate: 0,
					avg_daily_clicks: 0
				},
				performance: {
					total_redirects_24h: 0,
					unique_visitors: 0,
					avg_response_time: 0,
					success_rate: 100
				},
				geographic: {
					countries_reached: 0,
					cities_reached: 0
				},
				audience: {
					device_types: 0
				}
			},
			summary: {
				total_clicks: 0,
				total_links: 0,
				active_links: 0,
				unique_visitors: 0,
				success_rate: 100,
				avg_response_time: 0,
				countries_reached: 0,
				links_with_traffic: 0
			}
		};

		return this.get<MetricsDashboardResponse>(endpoint, {
			fallback: fallbackData,
			context: 'get_dashboard_metrics'
		});
	}

	/**
	 * Busca dados de performance para links
	 */
	async getLinkPerformance(linkId = '2'): Promise<LinkPerformanceDashboard> {
		const metrics = await this.getDashboardMetrics();

		// Adaptar resposta para formato esperado pelo frontend
		const adaptedData: LinkPerformanceDashboard = {
			linkId: linkId,
			totalClicks: metrics.metrics?.performance?.total_redirects_24h || 0,
			uniqueClicks: metrics.metrics?.performance?.unique_visitors || 0,
			clicksToday: metrics.metrics?.performance?.total_redirects_24h || 0,
			clicksThisWeek: 0,
			clicksThisMonth: 0,
			topReferrers: [],
			topCountries: [],
			clicksOverTime: [],
			summary: {
				total_redirects_24h: metrics.metrics?.performance?.total_redirects_24h || 0,
				unique_visitors: metrics.metrics?.performance?.unique_visitors || 0,
				avg_response_time: metrics.metrics?.performance?.avg_response_time || 0,
				success_rate: metrics.metrics?.performance?.success_rate || 100,
				total_links_with_traffic: metrics.summary?.links_with_traffic || 0,
				most_accessed_link: metrics.summary?.most_accessed_link || ''
			},
			hourly_data: [],
			link_performance: [],
			traffic_sources: [],
			geographic_data: [],
			device_data: []
		};

		return adaptedData;
	}

	/**
	 * Busca analytics de um link específico
	 */
	async getLinkAnalytics(linkId: string): Promise<AnalyticsData> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.LINK_ANALYTICS(linkId);

		const fallbackData: AnalyticsData = {
			overview: {
				total_clicks: 0,
				unique_visitors: 0,
				countries_reached: 0,
				avg_daily_clicks: 0
			},
			geographic: {
				heatmap_data: [],
				top_countries: [],
				top_states: [],
				top_cities: []
			},
			temporal: {
				clicks_by_hour: [],
				clicks_by_day_of_week: []
			},
			audience: {
				device_breakdown: []
			},
			insights: []
		};

		return this.get<AnalyticsData>(endpoint, {
			fallback: fallbackData,
			context: 'get_link_analytics'
		});
	}

	/**
	 * Busca analytics avançados de um link
	 */
	async getEnhancedLinkAnalytics(linkId: string): Promise<EnhancedAnalyticsData> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_COMPREHENSIVE(linkId);

		const fallbackData: EnhancedAnalyticsData = {
			has_data: false,
			link_info: {
				id: 0,
				title: '',
				short_url: '',
				original_url: '',
				created_at: '',
				is_active: false
			},
			overview: {
				total_clicks: 0,
				unique_visitors: 0,
				countries_reached: 0,
				avg_daily_clicks: 0
			},
			geographic: {
				heatmap_data: [],
				top_countries: [],
				top_states: [],
				top_cities: []
			},
			temporal: {
				clicks_by_hour: [],
				clicks_by_day_of_week: []
			},
			audience: {
				device_breakdown: []
			},
			insights: []
		};

		return this.get<EnhancedAnalyticsData>(endpoint, {
			fallback: fallbackData,
			context: 'get_enhanced_link_analytics'
		});
	}

	/**
	 * Busca dados geográficos de um link
	 */
	async getLinkGeographicData(linkId: string): Promise<any> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC(linkId);

		return this.get<any>(endpoint, {
			fallback: null,
			context: 'get_link_geographic'
		});
	}

	/**
	 * Busca heatmap de um link
	 */
	async getLinkHeatmap(linkId: string): Promise<any> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_HEATMAP(linkId);

		return this.get<any>(endpoint, {
			fallback: null,
			context: 'get_link_heatmap'
		});
	}

	/**
	 * Busca insights de negócio de um link
	 */
	async getLinkInsights(linkId: string): Promise<any> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS(linkId);

		return this.get<any>(endpoint, {
			fallback: [],
			context: 'get_link_insights'
		});
	}

	/**
	 * Busca métricas por categoria
	 */
	async getMetricsByCategory(category: string, hours = 24): Promise<any> {
		const endpoint = `/api/metrics/category/${category}?hours=${hours}`;

		return this.get<any>(endpoint, {
			fallback: { metrics: {} },
			context: 'get_metrics_by_category'
		});
	}

	/**
	 * Busca métricas de um link específico
	 */
	async getLinkMetrics(linkId: string): Promise<any> {
		this.validateId(linkId, 'Link ID');

		const endpoint = `/api/metrics/link/${linkId}`;

		return this.get<any>(endpoint, {
			fallback: { metrics: {} },
			context: 'get_link_metrics'
		});
	}

	/**
	 * Compara métricas entre períodos
	 */
	async compareMetrics(currentPeriod = 24, previousPeriod = 48): Promise<any> {
		const endpoint = `/api/metrics/compare?current=${currentPeriod}&previous=${previousPeriod}`;

		return this.get<any>(endpoint, {
			fallback: { comparison: {} },
			context: 'compare_metrics'
		});
	}

	/**
	 * Limpa cache de métricas
	 */
	async clearMetricsCache(): Promise<{ message: string }> {
		return this.delete<{ message: string }>('/api/metrics/cache', {
			fallback: { message: 'Cache limpo' },
			context: 'clear_metrics_cache'
		});
	}
}

// Instância singleton do serviço
export const analyticsService = new AnalyticsService();
