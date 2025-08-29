/**
 * 🌐 TIPOS DA API
 * Definições de tipos para todas as respostas da API e requests
 */

// ========================================
// 📡 BASE API TYPES
// ========================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
}

export interface PaginatedResponse<T = unknown> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}

// ========================================
// 🔐 AUTH API TYPES
// ========================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
    expires_in: number;
    token_type: 'bearer';
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: string[];
}

// ========================================
// 🔗 LINKS API TYPES
// ========================================

export interface LinkCreateRequest {
    original_url: string;
    title?: string;
    slug?: string;
    description?: string;
    expires_at?: string;
    starts_in?: string;
    is_active?: boolean;
    click_limit?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

export interface LinkUpdateRequest {
    original_url?: string;
    title?: string;
    slug?: string;
    description?: string;
    expires_at?: string;
    starts_in?: string;
    is_active?: boolean;
    click_limit?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

export interface LinkResponse {
    id: number;
    user_id: number;
    slug: string;
    title?: string;
    description?: string;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    starts_in: string | null;
    is_expired: boolean;
    is_active_valid: boolean;
    original_url: string;
    clicks: number;
    click_limit?: number;
    shorted_url: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

// ========================================
// 📊 ANALYTICS API TYPES
// ========================================

export interface AnalyticsResponse {
    success: boolean;
    data: {
        overview: {
            total_clicks: number;
            unique_visitors: number;
            countries_reached: number;
            avg_daily_clicks: number;
        };
        geographic: {
            heatmap_data: HeatmapPoint[];
            top_countries: CountryData[];
            top_states: StateData[];
            top_cities: CityData[];
        };
        temporal: {
            clicks_by_hour: HourlyData[];
            clicks_by_day_of_week: DayOfWeekData[];
        };
        audience: {
            device_breakdown: DeviceData[];
        };
        insights: BusinessInsight[];
    };
}

export interface HeatmapPoint {
    lat: number;
    lng: number;
    city: string;
    country: string;
    clicks: number;
}

export interface CountryData {
    country: string;
    iso_code: string;
    clicks: number;
    currency: string;
    [key: string]: unknown;
}

export interface StateData {
    country: string;
    state: string;
    state_name: string;
    clicks: number;
    [key: string]: unknown;
}

export interface CityData {
    city: string;
    state: string;
    country: string;
    clicks: number;
    [key: string]: unknown;
}

export interface HourlyData {
    hour: number;
    clicks: number;
    label: string;
    [key: string]: unknown;
}

export interface DayOfWeekData {
    day: number;
    day_name: string;
    clicks: number;
    [key: string]: unknown;
}

export interface DeviceData {
    device: string;
    clicks: number;
}

export interface BusinessInsight {
    type: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

// ========================================
// 📈 METRICS API TYPES
// ========================================

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

// ========================================
// 🚀 PERFORMANCE API TYPES
// ========================================

export interface LinkPerformanceResponse {
    success: boolean;
    data: {
        summary: {
            total_redirects_24h: number;
            unique_visitors: number;
            avg_response_time: number;
            most_accessed_link: string;
            success_rate: number;
            total_links_with_traffic: number;
        };
        hourly_data: {
            hour: string;
            total_redirects: number;
            successful_redirects: number;
            unique_ips: number;
            avg_response_time: number;
            top_slugs: Record<string, number>;
        }[];
        link_performance: {
            slug: string;
            title: string;
            total_redirects: number;
            avg_response_time: number;
            success_rate: number;
            last_accessed: string;
        }[];
        traffic_sources: {
            referer: string;
            redirects: number;
            percentage: number;
        }[];
        geographic_data: {
            country: string;
            redirects: number;
            percentage: number;
        }[];
        device_data: {
            device: string;
            redirects: number;
            percentage: number;
        }[];
    };
}
