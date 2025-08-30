/**
 * Analytics Types for Hooks
 */

export interface AnalyticsData {
    totalClicks: number;
    totalLinks: number;
    clicksToday: number;
    clicksThisWeek: number;
    topLinks: Array<{
        id: string;
        url: string;
        clicks: number;
    }>;
}
