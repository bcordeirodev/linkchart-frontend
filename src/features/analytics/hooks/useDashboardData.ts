/**
 * @fileoverview Hook para dados do dashboard
 * @author Link Chart Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api/client';

// Tipos para o dashboard
export interface DashboardData {
    summary: {
        total_links: number;
        active_links: number;
        total_clicks: number;
        unique_visitors: number;
        avg_clicks_per_link: number;
        success_rate: number;
        avg_response_time: number;
        countries_reached: number;
        links_with_traffic: number;
    };
    top_links: Array<{
        id: number;
        title: string;
        short_url: string;
        original_url: string;
        clicks: number;
        is_active: boolean;
        created_at?: string;
    }>;
    recent_activity: Array<{
        date: string;
        clicks: number;
    }>;
    geographic_summary: {
        countries_reached: number;
        cities_reached: number;
        top_country?: string;
    };
    device_summary: {
        desktop: number;
        mobile: number;
        tablet: number;
    };
    // Dados de gráficos opcionais
    temporal_data?: {
        clicks_by_hour: Array<{
            hour: number;
            clicks: number;
            label: string;
        }>;
        clicks_by_day_of_week: Array<{
            day: number;
            day_name: string;
            clicks: number;
        }>;
    } | null;
    geographic_data?: {
        top_countries: Array<{
            country: string;
            clicks: number;
        }>;
        top_cities: Array<{
            city: string;
            clicks: number;
        }>;
    } | null;
    audience_data?: {
        device_breakdown: Array<{
            device: string;
            clicks: number;
        }>;
    } | null;
}

export interface DashboardStats {
    totalMetrics: number;
    lastUpdate: string;
    dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
    trendsAvailable: boolean;
}

export interface UseDashboardDataOptions {
    linkId?: string;
    globalMode?: boolean;
    refreshInterval?: number;
    enableRealtime?: boolean;
    timeframe?: '1h' | '24h' | '7d' | '30d';
}

export interface UseDashboardDataReturn {
    data: DashboardData | null;
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    isRealtime: boolean;
}

/**
 * Hook personalizado para dados do dashboard
 * 
 * @description
 * Gerencia dados agregados para o dashboard principal:
 * - Métricas resumidas de todos os links
 * - Top links por performance
 * - Atividade recente
 * - Resumos geográficos e de dispositivos
 * 
 * @example
 * ```tsx
 * // Dashboard global
 * const { data, stats, loading } = useDashboardData({
 *   globalMode: true,
 *   timeframe: '24h'
 * });
 * 
 * // Dashboard de link específico
 * const { data, loading } = useDashboardData({
 *   linkId: '123',
 *   enableRealtime: true
 * });
 * ```
 */
export function useDashboardData({
    linkId,
    globalMode = true,
    refreshInterval = 60000, // 1 minuto
    enableRealtime = false,
    timeframe = '24h'
}: UseDashboardDataOptions = {}): UseDashboardDataReturn {

    const [data, setData] = useState<DashboardData | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRealtime, setIsRealtime] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    /**
     * Busca dados do dashboard em uma única requisição otimizada
     */
    const fetchDashboardData = useCallback(async () => {
        try {
            // Cancelar requisição anterior se existir
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            setError(null);

            // Parâmetros da requisição
            const params = {
                hours: timeframe === '1h' ? '1' : timeframe === '24h' ? '24' : timeframe === '7d' ? '168' : '720',
                include_charts: 'true' // Incluir dados para gráficos
            };

            // Endpoint único do dashboard
            const dashboardEndpoint = linkId && !globalMode
                ? `/api/reports/link/${linkId}/dashboard`
                : '/api/analytics/global/dashboard';

            const urlParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    urlParams.append(key, String(value));
                }
            });
            const fullEndpoint = urlParams.toString() ? `${dashboardEndpoint}?${urlParams.toString()}` : dashboardEndpoint;

            // Fazer apenas UMA requisição
            const response = await api.get<{
                success: boolean;
                data?: DashboardData;
                summary?: DashboardData['summary'];
                metrics?: any;
                charts?: any;
                timeframe?: string;
            }>(fullEndpoint);

            if (!response.success) {
                throw new Error('Dados do dashboard não encontrados');
            }

            // Debug da resposta do backend
            if (import.meta.env.DEV) {
                console.log('🔧 useDashboardData - Resposta do backend:', {
                    success: response.success,
                    hasData: !!response.data,
                    hasSummary: !!response.summary,
                    hasMetrics: !!response.metrics,
                    hasCharts: !!response.charts,
                    response
                });
            }

            // Processar dados do dashboard
            let dashboardData: DashboardData;

            // Estrutura do novo endpoint global vs endpoint antigo
            if (globalMode && response.data) {
                // Novo endpoint global: /api/analytics/global/dashboard
                const data = response.data;
                dashboardData = {
                    summary: data.summary || {},
                    top_links: data.top_links || [],
                    recent_activity: [], // Será implementado depois se necessário
                    geographic_summary: {
                        countries_reached: data.summary?.countries_reached || 0,
                        cities_reached: 0, // Será implementado depois se necessário
                        top_country: data.geographic_data?.top_countries?.[0]?.country
                    },
                    device_summary: {
                        desktop: data.audience_data?.device_breakdown?.find(d => d.device === 'Desktop')?.clicks || 0,
                        mobile: data.audience_data?.device_breakdown?.find(d => d.device === 'Mobile')?.clicks || 0,
                        tablet: data.audience_data?.device_breakdown?.find(d => d.device === 'Tablet')?.clicks || 0
                    },
                    // Dados de gráficos vindos do back-end
                    temporal_data: data.temporal_data,
                    geographic_data: data.geographic_data,
                    audience_data: data.audience_data
                };
            } else {
                // Endpoint antigo: /api/metrics/dashboard
                const metrics = response.metrics || {};
                const charts = response.charts || {};

                dashboardData = {
                    summary: response.summary || metrics.dashboard || {},
                    top_links: (response as any).top_links || [],
                    recent_activity: (response as any).recent_activity || [],
                    geographic_summary: metrics.geographic || {
                        countries_reached: 0,
                        cities_reached: 0
                    },
                    device_summary: metrics.audience?.device_types || {
                        desktop: 0,
                        mobile: 0,
                        tablet: 0
                    },
                    // Dados de gráficos vindos do back-end
                    temporal_data: charts.temporal,
                    geographic_data: charts.geographic,
                    audience_data: charts.audience
                };
            }

            // Debug dos dados processados
            if (import.meta.env.DEV) {
                console.log('🔧 useDashboardData - Dados processados:', {
                    dashboardData,
                    temporal_data: dashboardData.temporal_data,
                    geographic_data: dashboardData.geographic_data,
                    audience_data: dashboardData.audience_data
                });
            }

            setData(dashboardData);

            // Calcular estatísticas
            const calculatedStats: DashboardStats = {
                totalMetrics: Object.keys(dashboardData.summary).length,
                lastUpdate: new Date().toISOString(),
                dataQuality: dashboardData.summary.total_clicks > 100 ? 'excellent' :
                    dashboardData.summary.total_clicks > 10 ? 'good' : 'fair',
                trendsAvailable: dashboardData.recent_activity.length > 0
            };

            setStats(calculatedStats);

        } catch (err: any) {
            if (err.name === 'AbortError') {
                return; // Requisição cancelada, não é erro
            }

            const errorMessage = err.message || 'Erro ao carregar dados do dashboard';
            setError(errorMessage);

            if (import.meta.env.DEV) {
                console.error('useDashboardData error:', err);
            }
        }
    }, [linkId, globalMode, timeframe]);

    /**
     * Refresh manual dos dados
     */
    const refresh = useCallback(async () => {
        setLoading(true);
        await fetchDashboardData();
        setLoading(false);
    }, [fetchDashboardData]);

    /**
     * Configurar polling se realtime estiver habilitado
     */
    useEffect(() => {
        if (enableRealtime && refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchDashboardData();
            }, refreshInterval);

            setIsRealtime(true);
        } else {
            setIsRealtime(false);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enableRealtime, refreshInterval, fetchDashboardData]);

    /**
     * Buscar dados na montagem
     */
    useEffect(() => {
        setLoading(true);
        fetchDashboardData().finally(() => {
            setLoading(false);
        });

        return () => {
            // Cleanup na desmontagem
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchDashboardData]);

    return {
        data,
        stats,
        loading,
        error,
        refresh,
        isRealtime
    };
}

export default useDashboardData;
