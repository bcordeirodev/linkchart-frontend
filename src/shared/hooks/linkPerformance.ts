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
    topReferrers: Array<{
        referrer: string;
        clicks: number;
    }>;
    topCountries: Array<{
        country: string;
        clicks: number;
    }>;
}
