/**
 * @fileoverview Tipos relacionados a métricas e comparações
 * @author Link Chart Team
 * @version 1.0.0
 */

import type { Trend } from './common';

/**
 * Configuração de período temporal para métricas
 */
export interface MetricsTimeframe {
    /** Label exibido para o usuário */
    label: string;
    /** Valor interno do período */
    value: string;
    /** Número de dias do período */
    days: number;
}

/**
 * Filtros para consulta de métricas
 */
export interface MetricsFilter {
    /** Período temporal */
    timeframe: string;
    /** Categoria específica (opcional) */
    category?: string;
    /** ID do link específico (opcional) */
    link_id?: string;
}

/**
 * Tendência de uma métrica com comparação temporal
 */
export interface MetricsTrend {
    /** Valor atual */
    current: number;
    /** Valor anterior */
    previous: number;
    /** Mudança absoluta */
    change: number;
    /** Mudança percentual */
    change_percentage: number;
    /** Direção da tendência */
    trend: Trend;
}

/**
 * Comparação detalhada entre períodos
 */
export interface MetricsComparison {
    /** Nome da métrica */
    metric: string;
    /** Dados do período atual */
    current_period: {
        /** Valor da métrica */
        value: number;
        /** Label do período */
        label: string;
    };
    /** Dados do período anterior */
    previous_period: {
        /** Valor da métrica */
        value: number;
        /** Label do período */
        label: string;
    };
    /** Mudança absoluta */
    change: number;
    /** Mudança percentual */
    change_percentage: number;
    /** Direção da tendência */
    trend: Trend;
}

/**
 * Resposta da API de métricas do dashboard
 */
export interface MetricsDashboardResponse {
    /** Sucesso da operação */
    success: boolean;
    /** Período dos dados */
    timeframe: string;
    /** Métricas organizadas por categoria */
    metrics: {
        /** Métricas do dashboard */
        dashboard: {
            total_links: number;
            active_links: number;
            total_clicks: number;
            avg_clicks_per_link: number;
        };
        /** Métricas de analytics */
        analytics: {
            total_clicks: number;
            unique_visitors: number;
            conversion_rate: number;
            avg_daily_clicks: number;
        };
        /** Métricas de performance */
        performance: {
            total_redirects_24h: number;
            unique_visitors: number;
            avg_response_time: number;
            success_rate: number;
        };
        /** Métricas geográficas */
        geographic: {
            countries_reached: number;
            cities_reached: number;
        };
        /** Métricas de audiência */
        audience: {
            device_types: number;
        };
    };
    /** Resumo geral */
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

/**
 * Resposta da API de métricas por categoria
 */
export interface MetricsCategoryResponse {
    /** Sucesso da operação */
    success: boolean;
    /** Categoria da métrica */
    category: string;
    /** Período dos dados */
    timeframe: string;
    /** Métricas da categoria */
    metrics: Record<string, number>;
}
