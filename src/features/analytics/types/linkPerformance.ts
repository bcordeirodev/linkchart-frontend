/**
 * Link Performance Types
 */

export interface LinkPerformanceDashboard {
	linkId: string;
	totalClicks: number;
	uniqueClicks: number;
	clicksToday: number;
	clicksThisWeek: number;
	clicksThisMonth: number;
	topReferrers: {
		referrer: string;
		clicks: number;
	}[];
	topCountries: {
		country: string;
		clicks: number;
	}[];
	clicksOverTime: {
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
