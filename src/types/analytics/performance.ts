/**
 * @fileoverview Tipos relacionados à análise de performance
 * Centraliza todas as interfaces de performance de links
 */

/**
 * Dashboard de performance de um link específico
 */
export interface LinkPerformanceDashboard {
	linkId: string;
	totalClicks?: number;
	uniqueClicks?: number;
	clicksToday?: number;
	clicksThisWeek?: number;
	clicksThisMonth?: number;

	// Dados reais do backend de performance
	total_redirects_24h?: number;
	unique_visitors?: number;
	avg_response_time?: number;
	success_rate?: number;
	total_links?: number;
	performance_score?: number;
	uptime_percentage?: number;
	clicks_per_hour?: number;
	visitor_retention?: number;

	topReferrers?: {
		referrer: string;
		clicks: number;
	}[];
	topCountries?: {
		country: string;
		clicks: number;
	}[];
	clicksOverTime?: {
		date: string;
		clicks: number;
	}[];
	summary?: {
		success_rate?: number;
		avg_response_time?: number;
		total_redirects_24h?: number;
		unique_visitors?: number;
		total_links_with_traffic?: number;
		most_accessed_link?: string;
	};
	hourly_data?: {
		hour: string;
		clicks: number;
	}[];
	link_performance?: {
		link_id: string;
		clicks: number;
		performance: number;
	}[];
	traffic_sources?: {
		source: string;
		clicks: number;
	}[];
	geographic_data?: {
		country: string;
		clicks: number;
	}[];
	device_data?: {
		device: string;
		clicks: number;
	}[];
}

/**
 * Dados básicos de performance de um link
 */
export interface LinkPerformanceData {
	linkId: string;
	totalClicks: number;
	uniqueClicks: number;
	successRate: number;
	avgResponseTime: number;
	lastClickAt?: string;
}

/**
 * Resumo de performance agregado
 */
export interface PerformanceSummary {
	totalRedirects24h: number;
	uniqueVisitors: number;
	avgResponseTime: number;
	successRate: number;
	linksWithTraffic: number;
	mostAccessedLink?: string;
}

/**
 * Métrica individual de performance
 */
export interface LinkPerformanceMetric {
	linkId: string;
	metric: 'clicks' | 'response_time' | 'success_rate' | 'unique_visitors';
	value: number;
	trend: 'up' | 'down' | 'stable';
	changePercent: number;
}

/**
 * Filtros para consultas de performance
 */
export interface PerformanceFilters {
	linkId?: string;
	dateRange?: {
		start: string;
		end: string;
	};
	metric?: string;
	minClicks?: number;
}

/**
 * Resposta da API de performance
 */
export interface PerformanceApiResponse {
	success: boolean;
	data: LinkPerformanceDashboard | LinkPerformanceData[];
	metadata?: {
		total: number;
		page: number;
		limit: number;
		lastUpdated: string;
	};
}
