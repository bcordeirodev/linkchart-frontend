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
	topReferrers: Array<{
		referrer: string;
		clicks: number;
	}>;
	topCountries: Array<{
		country: string;
		clicks: number;
	}>;
	clicksOverTime: Array<{
		date: string;
		clicks: number;
	}>;
	summary?: {
		success_rate?: number;
		avg_response_time?: number;
		total_redirects_24h?: number;
		unique_visitors?: number;
		total_links_with_traffic?: number;
		most_accessed_link?: string;
	};
	hourly_data?: Array<{
		hour: string;
		clicks: number;
	}>;
	link_performance?: Array<{
		link_id: string;
		clicks: number;
		performance: number;
	}>;
	traffic_sources?: Array<{
		source: string;
		clicks: number;
	}>;
	geographic_data?: Array<{
		country: string;
		clicks: number;
	}>;
	device_data?: Array<{
		device: string;
		clicks: number;
	}>;
}