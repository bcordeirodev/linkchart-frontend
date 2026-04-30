/**
 * 📊 TIPOS DE ANALYTICS PARA LINKS INDIVIDUAIS
 * Tipos específicos para analytics de link individual
 * Compatível com estrutura do useEnhancedAnalytics
 */

import type { AnalyticsData } from '@/types/analytics/base';

export interface LinkAnalyticsData extends AnalyticsData {
	// Herda toda a estrutura de AnalyticsData
	// Pode adicionar campos específicos se necessário
}

export interface LinkAnalyticsMetricsData {
	total_clicks: number;
	unique_visitors: number;
	countries_reached: number;
	avg_daily_clicks: number;
	conversion_rate: number;
	bounce_rate: number;
	peak_hour: string;
}

export interface LinkAnalyticsFilters {
	date_range?: {
		start: string;
		end: string;
	};
	group_by?: 'hour' | 'day' | 'week' | 'month';
	include_geographic?: boolean;
	include_temporal?: boolean;
	include_audience?: boolean;
}
