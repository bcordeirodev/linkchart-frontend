/**
 * Link Performance Types for Hooks
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
}
