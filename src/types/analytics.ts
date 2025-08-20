/**
 * Tipos para dados de Analytics
 * Centralizados para evitar duplicação e inconsistências
 */

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

// Novos tipos para a estrutura atualizada
export interface HeatmapPoint {
	lat: number;
	lng: number;
	city: string;
	country: string;
	clicks: number;
}

export interface CountryData {
	country: string;
	iso_code: string;
	clicks: number;
	currency: string;
}

export interface StateData {
	country: string;
	state: string;
	state_name: string;
	clicks: number;
}

export interface CityData {
	city: string;
	state: string;
	country: string;
	clicks: number;
}

export interface HourlyData {
	hour: number;
	clicks: number;
	label: string;
}

export interface DayOfWeekData {
	day: number;
	day_name: string;
	clicks: number;
}

export interface DeviceData {
	device: string;
	clicks: number;
}

export interface BusinessInsight {
	type: string;
	title: string;
	description: string;
	priority: string;
}

/**
 * Props para componentes de Analytics
 */
export interface AnalyticsComponentProps {
	data: {
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
	} | null;
}

export interface ChartDataPoint {
	x: string | number;
	y: number;
}

export interface ChartSeries {
	name: string;
	data: ChartDataPoint[];
}

export interface ChartOptions {
	chart: {
		type: string;
		[key: string]: unknown;
	};
	colors?: string[];
	[key: string]: unknown;
}
