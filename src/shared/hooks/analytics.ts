/**
 * Analytics Types for Hooks
 */

export interface AnalyticsData {
	totalClicks: number;
	totalLinks: number;
	clicksToday: number;
	clicksThisWeek: number;
	topLinks: {
		id: string;
		url: string;
		clicks: number;
	}[];
}
