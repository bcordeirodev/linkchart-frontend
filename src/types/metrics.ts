/**
 * Tipos para API de métricas unificadas
 * Define os contratos da API /metrics/dashboard
 */

export interface MetricsDashboardResponse {
    success: boolean;
    timeframe: string;
    metrics: {
        dashboard: {
            total_links: number;
            active_links: number;
            total_clicks: number;
            avg_clicks_per_link: number;
        };
        analytics: {
            total_clicks: number;
            unique_visitors: number;
            conversion_rate: number;
            avg_daily_clicks: number;
        };
        performance: {
            total_redirects_24h: number;
            unique_visitors: number;
            avg_response_time: number;
            success_rate: number;
        };
        geographic: {
            countries_reached: number;
            cities_reached: number;
        };
        audience: {
            device_types: number;
        };
    };
    summary: {
        total_clicks: number;
        total_links: number;
        active_links: number;
        unique_visitors: number;
        success_rate: number;
        avg_response_time: number;
        countries_reached: number;
        links_with_traffic: number;
        most_accessed_link?: string;
    };
}

export interface MetricsCategoryResponse {
    success: boolean;
    category: string;
    timeframe: string;
    metrics: Record<string, number>;
}
