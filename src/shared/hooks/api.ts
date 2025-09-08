/**
 * Shared Hooks API Types
 * @deprecated Use types from @/types instead
 */

import type { LinkResponse } from '@/types';

export interface AnalyticsResponse {
	totalClicks: number;
	totalLinks: number;
	clicksToday: number;
	clicksThisWeek: number;
}

export interface MetricsDashboardResponse {
	totalClicks: number;
	totalLinks: number;
	averageClicksPerLink: number;
	topPerformingLinks: LinkResponse[];
}
