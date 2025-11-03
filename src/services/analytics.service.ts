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
	 * Busca dados de performance para links específicos
	 */
	async getLinkPerformance(linkId: string): Promise<LinkPerformanceDashboard> {
		this.validateId(linkId, 'Link ID');

		// Usar endpoint de métricas do dashboard do link específico
		const endpoint = `/api/analytics/link/${linkId}/dashboard`;

		try {
			const performanceResponse = await this.get<{
				success: boolean;
				data: {
					summary: {
						total_clicks: number;
						unique_visitors: number;
						success_rate: number;
						avg_response_time: number;
					};
				};
			}>(endpoint, {
				context: 'get_link_performance'
			});

			if (!performanceResponse.success || !performanceResponse.data) {
				return this.getEmptyPerformanceData(linkId);
			}

			const metrics = performanceResponse.data.summary;

			// Adaptar resposta para formato esperado pelo frontend
			const adaptedData: LinkPerformanceDashboard = {
				linkId,
				totalClicks: metrics.total_clicks || 0,
				uniqueClicks: metrics.unique_visitors || 0,
				clicksToday: metrics.total_clicks || 0,
				clicksThisWeek: 0,
				clicksThisMonth: 0,
				topReferrers: [],
				topCountries: [],
				clicksOverTime: [],
				total_redirects_24h: metrics.total_clicks || 0,
				unique_visitors: metrics.unique_visitors || 0,
				avg_response_time: metrics.avg_response_time || 0,
				success_rate: metrics.success_rate || 100,
				performance_score: metrics.success_rate || 0,
				uptime_percentage: 100,
				clicks_per_hour: 0,
				visitor_retention: 0,
				total_links: 1,
				summary: {
					total_redirects_24h: metrics.total_clicks || 0,
					unique_visitors: metrics.unique_visitors || 0,
					avg_response_time: metrics.avg_response_time || 0,
					success_rate: metrics.success_rate || 100,
					total_links_with_traffic: 1,
					most_accessed_link: ''
				},
				hourly_data: [],
				link_performance: [],
				traffic_sources: [],
				geographic_data: [],
				device_data: []
			};

			return adaptedData;
		} catch (error) {
			console.error('Error fetching link performance:', error);
			return this.getEmptyPerformanceData(linkId);
		}
	}

	/**
	 * Retorna dados de performance vazios
	 */
	private getEmptyPerformanceData(linkId?: string): LinkPerformanceDashboard {
		return {
			linkId: linkId || '',
			totalClicks: 0,
			uniqueClicks: 0,
			clicksToday: 0,
			clicksThisWeek: 0,
			clicksThisMonth: 0,
			topReferrers: [],
			topCountries: [],
			clicksOverTime: [],
			total_redirects_24h: 0,
			unique_visitors: 0,
			avg_response_time: 0,
			success_rate: 100,
			performance_score: 0,
			uptime_percentage: 100,
			clicks_per_hour: 0,
			visitor_retention: 0,
			total_links: 0,
			summary: {
				total_redirects_24h: 0,
				unique_visitors: 0,
				avg_response_time: 0,
				success_rate: 100,
				total_links_with_traffic: 0,
				most_accessed_link: ''
			},
			hourly_data: [],
			link_performance: [],
			traffic_sources: [],
			geographic_data: [],
			device_data: []
		};
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

}

// Instância singleton do serviço
export const analyticsService = new AnalyticsService();
