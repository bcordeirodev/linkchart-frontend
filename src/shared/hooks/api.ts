/**
 * Shared Hooks API Types
 */

export interface LinkResponse {
    id: string;
    original_url: string;
    short_url: string;
    clicks: number;
    created_at: string;
}

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
