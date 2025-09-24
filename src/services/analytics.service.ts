import { API_CONFIG } from '../lib/api/endpoints';

import { BaseService } from './base.service';

import type { AnalyticsData } from '@/types';
import type { LinkPerformanceDashboard } from '@/types/analytics/performance';
import type { MetricsDashboardResponse } from '@/types/core/metrics';

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
		// Usar endpoint específico de performance global
		const performanceResponse = await this.get<{
			success: boolean;
			data: {
				total_redirects_24h: number;
				unique_visitors: number;
				avg_response_time: number;
				success_rate: number;
				total_links: number;
				performance_score: number;
				uptime_percentage: number;
				clicks_per_hour: number;
				visitor_retention: number;
			};
		}>('/api/analytics/global/performance', {
			context: 'get_link_performance'
		});

		if (!performanceResponse.success) {
			throw new Error('Erro ao buscar dados de performance');
		}

		const metrics = performanceResponse.data;

		// Adaptar resposta para formato esperado pelo frontend
		const adaptedData: LinkPerformanceDashboard = {
			linkId,
			totalClicks: metrics.total_redirects_24h || 0,
			uniqueClicks: metrics.unique_visitors || 0,
			clicksToday: metrics.total_redirects_24h || 0,
			clicksThisWeek: 0,
			clicksThisMonth: 0,
			topReferrers: [],
			topCountries: [],
			clicksOverTime: [],
			// ✅ Incluir todos os dados do backend
			total_redirects_24h: metrics.total_redirects_24h || 0,
			unique_visitors: metrics.unique_visitors || 0,
			avg_response_time: metrics.avg_response_time || 0,
			success_rate: metrics.success_rate || 100,
			performance_score: metrics.performance_score || 0,
			uptime_percentage: metrics.uptime_percentage || 100,
			clicks_per_hour: metrics.clicks_per_hour || 0,
			visitor_retention: metrics.visitor_retention || 0,
			total_links: metrics.total_links || 0,
			summary: {
				total_redirects_24h: metrics.total_redirects_24h || 0,
				unique_visitors: metrics.unique_visitors || 0,
				avg_response_time: metrics.avg_response_time || 0,
				success_rate: metrics.success_rate || 100,
				total_links_with_traffic: metrics.total_links || 0,
				most_accessed_link: ''
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
	 * REMOVIDO: getEnhancedLinkAnalytics
	 * Agora usamos hooks individuais para cada tipo de dados:
	 * - useTemporalData para dados temporais
	 * - useGeographicData para dados geográficos
	 * - useAudienceData para dados de audiência
	 * - useInsightsData para insights
	 * - useHeatmapData para heatmap
	 */

	/**
	 * Busca dados geográficos de um link
	 */
	async getLinkGeographicData(linkId: string): Promise<unknown> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC(linkId);

		return this.get<unknown>(endpoint, {
			fallback: null,
			context: 'get_link_geographic'
		});
	}

	/**
	 * Busca heatmap de um link
	 */
	async getLinkHeatmap(linkId: string): Promise<unknown> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_HEATMAP(linkId);

		return this.get<unknown>(endpoint, {
			fallback: null,
			context: 'get_link_heatmap'
		});
	}

	/**
	 * Busca insights de negócio de um link
	 */
	async getLinkInsights(linkId: string): Promise<unknown> {
		this.validateId(linkId, 'Link ID');

		const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS(linkId);

		return this.get<unknown>(endpoint, {
			fallback: [],
			context: 'get_link_insights'
		});
	}

	/**
	 * Busca métricas por categoria
	 */
	async getMetricsByCategory(category: string, hours = 24): Promise<unknown> {
		const endpoint = `/api/metrics/category/${category}?hours=${hours}`;

		return this.get<unknown>(endpoint, {
			fallback: { metrics: {} },
			context: 'get_metrics_by_category'
		});
	}

	/**
	 * Busca métricas de um link específico
	 */
	async getLinkMetrics(linkId: string): Promise<unknown> {
		this.validateId(linkId, 'Link ID');

		const endpoint = `/api/metrics/link/${linkId}`;

		return this.get<unknown>(endpoint, {
			fallback: { metrics: {} },
			context: 'get_link_metrics'
		});
	}

	/**
	 * Compara métricas entre períodos
	 */
	async compareMetrics(currentPeriod = 24, previousPeriod = 48): Promise<unknown> {
		const endpoint = `/api/metrics/compare?current=${currentPeriod}&previous=${previousPeriod}`;

		return this.get<unknown>(endpoint, {
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
