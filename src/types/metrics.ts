/**
 * 📈 TIPOS DE MÉTRICAS
 * Re-exporta tipos de API para métricas e dashboard
 * Mantém compatibilidade com tipos existentes
 */

// ========================================
// 📈 METRICS TYPES (Re-exports from API)
// ========================================

export type {
    MetricsDashboardResponse,
    MetricsCategoryResponse
} from './api';

// ========================================
// 🎯 METRICS-SPECIFIC TYPES
// ========================================

export interface MetricsTimeframe {
    label: string;
    value: string;
    days: number;
}

export interface MetricsFilter {
    timeframe: string;
    category?: string;
    link_id?: string;
}

export interface MetricsTrend {
    current: number;
    previous: number;
    change: number;
    change_percentage: number;
    trend: 'up' | 'down' | 'stable';
}

export interface MetricsComparison {
    metric: string;
    current_period: {
        value: number;
        label: string;
    };
    previous_period: {
        value: number;
        label: string;
    };
    change: number;
    change_percentage: number;
    trend: 'up' | 'down' | 'stable';
}
