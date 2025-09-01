/**
 * 📊 TIPOS DE ANALYTICS PARA LINKS INDIVIDUAIS
 * Tipos específicos para analytics de link individual
 * Compatível com estrutura do useEnhancedAnalytics
 */

export interface LinkAnalyticsData {
	has_data: boolean;
	link_info?: {
		id: number;
		title?: string;
		original_url: string;
		shorted_url: string;
		created_at: string;
		is_active: boolean;
		expires_at?: string;
	};
	overview?: {
		total_clicks: number;
		unique_visitors: number;
		countries_reached: number;
		avg_daily_clicks: number;
		conversion_rate?: number;
		bounce_rate?: number;
		peak_hour?: string;
	};
	geographic?: {
		heatmap_data: any[];
		top_countries: {
			country: string;
			clicks: number;
			iso_code?: string;
			currency?: string;
		}[];
		top_states: {
			state: string;
			clicks: number;
			country?: string;
			state_name?: string;
		}[];
		top_cities: {
			city: string;
			clicks: number;
			state?: string;
			country?: string;
		}[];
	};
	temporal?: {
		clicks_by_hour: {
			hour: number;
			clicks: number;
			label: string;
		}[];
		clicks_by_day_of_week: {
			day: string;
			clicks: number;
			day_name?: string;
		}[];
	};
	audience?: {
		device_breakdown: {
			device: string;
			clicks: number;
		}[];
	};
	insights: any[];
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
