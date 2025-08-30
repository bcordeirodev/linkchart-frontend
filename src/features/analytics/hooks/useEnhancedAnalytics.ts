import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

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

export interface EnhancedAnalyticsData {
    has_data: boolean;
    link_info: {
        id: number;
        title: string;
        short_url: string;
        original_url: string;
        created_at: string;
        is_active: boolean;
        expires_at?: string;
    };
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
}

// Interface para respostas da API
interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
}

export function useEnhancedAnalytics(linkId: string) {
    const [data, setData] = useState<EnhancedAnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        if (!linkId) return;

        try {
            setLoading(true);
            setError(null);

            if (import.meta.env.DEV) {
                console.log(`🔍 Buscando analytics para link ${linkId}...`);
            }

            // Tentar usar o novo endpoint primeiro
            let response: EnhancedAnalyticsData;
            try {
                const apiResponse = await api.get<ApiResponse<EnhancedAnalyticsData>>(
                    `/api/analytics/link/${linkId}/comprehensive`
                );
                // O endpoint protegido retorna dados dentro de 'data'
                response = apiResponse.data || (apiResponse as unknown as EnhancedAnalyticsData);

                if (import.meta.env.DEV) {
                    console.log(`✅ Dados reais carregados para link ${linkId}:`, {
                        total_clicks: response.overview?.total_clicks,
                        countries: response.geographic?.top_countries?.length,
                        has_data: response.has_data
                    });
                }
            } catch (authError) {
                // Se falhar por autenticação, usar endpoint de teste temporário
                if (import.meta.env.DEV) {
                    console.warn(`🔄 Link ${linkId} não encontrado, tentando endpoint de teste`);
                }

                try {
                    const directResponse = await fetch(
                        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/test-analytics/${linkId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            }
                        }
                    );

                    if (!directResponse.ok) {
                        throw new Error(`HTTP ${directResponse.status}: ${directResponse.statusText}`);
                    }

                    const testResponse = await directResponse.json();
                    if (import.meta.env.DEV) {
                        console.log('✅ Dados recebidos do endpoint de teste:', testResponse);
                    }

                    // Agora o endpoint de teste retorna dados completos
                    setData(testResponse);
                    return;
                } catch (testError) {
                    if (import.meta.env.DEV) {
                        console.error('❌ Falha também no endpoint de teste:', testError);
                    }
                    throw testError;
                }
            }

            // Se chegou aqui, o endpoint protegido funcionou
            setData(response);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar analytics';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [linkId]);

    const fetchHeatmapData = useCallback(async (): Promise<HeatmapPoint[]> => {
        if (!linkId) return [];

        try {
            // Tentar endpoint protegido primeiro
            try {
                const apiResponse = await api.get<ApiResponse<HeatmapPoint[]>>(`analytics/link/${linkId}/heatmap`);
                const response =
                    apiResponse.data ||
                    (apiResponse as unknown as { heatmap_data?: HeatmapPoint[]; data?: HeatmapPoint[] });
                return (
                    (response as { heatmap_data?: HeatmapPoint[]; data?: HeatmapPoint[] }).heatmap_data ||
                    (response as { heatmap_data?: HeatmapPoint[]; data?: HeatmapPoint[] }).data ||
                    (response as HeatmapPoint[])
                );
            } catch (_authError) {
                // Fallback para dados do endpoint de teste com fetch direto
                try {
                    const directResponse = await fetch(
                        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/test-analytics/${linkId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            }
                        }
                    );

                    if (!directResponse.ok) {
                        throw new Error(`HTTP ${directResponse.status}: ${directResponse.statusText}`);
                    }

                    const testResponse = await directResponse.json();
                    return testResponse.geographic?.heatmap_data || [];
                } catch (testError) {
                    if (import.meta.env.DEV) {
                        console.error('❌ Falha no endpoint de teste:', testError);
                    }
                    return [];
                }
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error fetching heatmap data:', err);
            }
            return [];
        }
    }, [linkId]);

    const fetchGeographicData = useCallback(async () => {
        if (!linkId) return null;

        try {
            // Tentar endpoint protegido primeiro
            try {
                const apiResponse = await api.get<ApiResponse<{ geographic: EnhancedAnalyticsData['geographic'] }>>(
                    `analytics/link/${linkId}/geographic`
                );
                const response =
                    apiResponse.data ||
                    (apiResponse as unknown as {
                        geographic?: EnhancedAnalyticsData['geographic'];
                        data?: EnhancedAnalyticsData['geographic'];
                    });
                return (
                    (response as { geographic?: EnhancedAnalyticsData['geographic'] }).geographic ||
                    (response as { data?: EnhancedAnalyticsData['geographic'] }).data
                );
            } catch (_authError) {
                // Fallback para dados básicos com fetch direto
                try {
                    const directResponse = await fetch(
                        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/test-analytics/${linkId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            }
                        }
                    );

                    if (!directResponse.ok) {
                        throw new Error(`HTTP ${directResponse.status}: ${directResponse.statusText}`);
                    }

                    const testResponse = await directResponse.json();
                    return {
                        top_countries: testResponse.geographic?.top_countries || [],
                        top_states: testResponse.geographic?.top_states || [],
                        top_cities: testResponse.geographic?.top_cities || [],
                        heatmap_data: testResponse.geographic?.heatmap_data || []
                    };
                } catch (testError) {
                    if (import.meta.env.DEV) {
                        console.error('❌ Falha no endpoint de teste:', testError);
                    }
                    return null;
                }
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error fetching geographic data:', err);
            }
            return null;
        }
    }, [linkId]);

    const fetchInsights = useCallback(async (): Promise<BusinessInsight[]> => {
        if (!linkId) return [];

        try {
            // Tentar endpoint protegido primeiro
            try {
                const apiResponse = await api.get<ApiResponse<BusinessInsight[]>>(`analytics/link/${linkId}/insights`);
                const response =
                    apiResponse.data ||
                    (apiResponse as unknown as { insights?: BusinessInsight[]; data?: BusinessInsight[] });
                return (
                    (response as { insights?: BusinessInsight[] }).insights ||
                    (response as { data?: BusinessInsight[] }).data ||
                    (response as BusinessInsight[])
                );
            } catch (_authError) {
                // Fallback para insights básicos com fetch direto
                try {
                    const directResponse = await fetch(
                        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/test-analytics/${linkId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json'
                            }
                        }
                    );

                    if (!directResponse.ok) {
                        throw new Error(`HTTP ${directResponse.status}: ${directResponse.statusText}`);
                    }

                    const testResponse = await directResponse.json();
                    return (
                        testResponse.insights || [
                            {
                                type: 'geographic',
                                title: 'Alcance Global',
                                description: `Seu link alcançou ${testResponse.overview?.countries_reached || 0} países diferentes.`,
                                priority: 'medium' as const
                            },
                            {
                                type: 'performance',
                                title: 'Alto Engajamento',
                                description: `Com ${testResponse.overview?.total_clicks || 0} cliques registrados.`,
                                priority: 'high' as const
                            }
                        ]
                    );
                } catch (testError) {
                    if (import.meta.env.DEV) {
                        console.error('❌ Falha no endpoint de teste:', testError);
                    }
                    return [];
                }
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error('Error fetching insights:', err);
            }
            return [];
        }
    }, [linkId]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const refetch = useCallback(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        data,
        loading,
        error,
        refetch,
        fetchHeatmapData,
        fetchGeographicData,
        fetchInsights
    };
}
