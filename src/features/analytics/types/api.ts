/**
 * Analytics API Types
 */

export interface AnalyticsResponse {
	data: any;
	message?: string;
	status: number;
}

export interface MetricsCategoryResponse {
	category: string;
	value: number;
	percentage: number;
}

export interface MetricsDashboardResponse {
	totalClicks: number;
	totalLinks: number;
	averageClicksPerLink: number;
	topPerformingLinks: {
		id: string;
		url: string;
		clicks: number;
	}[];
	categories: MetricsCategoryResponse[];
	success?: boolean;
	timeframe?: string;
	metrics?: any;
	summary?: any;
}

// Geographic and Analytics Types
export interface HeatmapPoint {
	lat: number;
	lng: number;
	value?: number;
	city: string;
	country: string;
	clicks: number;
}

export interface CountryData {
	country: string;
	iso_code: string;
	clicks: number;
	percentage: number;
	currency: string;
	[key: string]: any;
}

export interface StateData {
	country: string;
	state: string;
	state_name: string;
	clicks: number;
	percentage: number;
	[key: string]: any;
}

export interface CityData {
	city: string;
	state: string;
	country: string;
	clicks: number;
	percentage: number;
	[key: string]: any;
}

export interface HourlyData {
	hour: number;
	label: string;
	clicks: number;
	[key: string]: any;
}

export interface DayOfWeekData {
	day: number;
	day_name: string;
	clicks: number;
	[key: string]: any;
}

export interface DeviceData {
	device: string;
	clicks: number;
	percentage: number;
}

export interface BusinessInsight {
	title: string;
	description: string;
	value: string | number;
	trend?: 'up' | 'down' | 'stable';
	type: string;
	priority: 'low' | 'medium' | 'high';
}
