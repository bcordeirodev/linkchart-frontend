/**
 * 📊 TIPOS DE ANALYTICS
 * Estruturas de dados específicas para analytics e métricas
 * Importa tipos comuns de api.ts para evitar duplicação
 */

import {
	HeatmapPoint,
	CountryData,
	StateData,
	CityData,
	HourlyData,
	DayOfWeekData,
	DeviceData,
	BusinessInsight
} from './api';

// ========================================
// 📊 ANALYTICS DATA STRUCTURES
// ========================================

export interface AnalyticsData {
	overview: {
		total_clicks: number;
		unique_visitors: number;
		countries_reached: number;
		avg_daily_clicks: number;
	};
	geographic: {
		heatmap_data: HeatmapPoint[];
		top_countries: CountryData[];
		top_states: StateData[];
		top_cities: CityData[];
	};
	temporal: {
		clicks_by_hour: HourlyData[];
		clicks_by_day_of_week: DayOfWeekData[];
	};
	audience: {
		device_breakdown: DeviceData[];
	};
	insights: BusinessInsight[];
}

// ========================================
// 📈 LEGACY ANALYTICS TYPES (Manter compatibilidade)
// ========================================

export interface ClicksByDay extends Record<string, unknown> {
	day: string;
	total: number;
}

export interface ClicksByCountry extends Record<string, unknown> {
	country: string;
	total: number;
}

export interface ClicksByCity extends Record<string, unknown> {
	city: string;
	total: number;
}

export interface ClicksByDevice extends Record<string, unknown> {
	device: string;
	total: number;
}

export interface ClicksByUserAgent extends Record<string, unknown> {
	user_agent: string;
	total: number;
}

export interface ClicksByReferer extends Record<string, unknown> {
	referer: string;
	total: number;
}

export interface ClicksByCampaign extends Record<string, unknown> {
	utm_campaign: string;
	total: number;
}

export interface ClicksGroupedByLinkAndDay extends Record<string, unknown> {
	link_id: number;
	day: string;
	total: number;
}

export interface TopLink extends Record<string, unknown> {
	original_url: string;
	clicks_count: number;
}

export interface LinksCreatedByDay extends Record<string, unknown> {
	day: string;
	total: number;
}


