import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api/client';

export interface HeatmapPoint {
    lat: number;
    lng: number;
    city: string;
    country: string;
    clicks: number;
    iso_code?: string;
    currency?: string;
    state_name?: string;
    continent?: string;
    timezone?: string;
    last_click?: string;
}

export interface HeatmapStats {
    totalClicks: number;
    maxClicks: number;
    uniqueCountries: number;
    uniqueCities: number;
    avgClicksPerLocation: number;
    lastUpdate: string;
}

interface UseHeatmapDataOptions {
    linkId?: string; // Opcional - se não fornecido, busca dados globais
    refreshInterval?: number; // em ms, padrão 30s
    enableRealtime?: boolean;
    minClicks?: number;
    globalMode?: boolean; // Modo global - todos os links ativos
}

interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    error?: string;
}

export function useHeatmapData({
    linkId,
    refreshInterval = 30000, // 30 segundos
    enableRealtime = true,
    minClicks = 1,
    globalMode = false
}: UseHeatmapDataOptions) {
    const [data, setData] = useState<HeatmapPoint[]>([]);
    const [stats, setStats] = useState<HeatmapStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    // Calcular estatísticas dos dados
    const calculateStats = useCallback((heatmapData: HeatmapPoint[]): HeatmapStats => {
        const totalClicks = heatmapData.reduce((sum, point) => sum + point.clicks, 0);
        const maxClicks = Math.max(...heatmapData.map(point => point.clicks), 1);
        const uniqueCountries = new Set(heatmapData.map(point => point.country)).size;
        const uniqueCities = new Set(heatmapData.map(point => point.city)).size;
        const avgClicksPerLocation = heatmapData.length > 0 ? totalClicks / heatmapData.length : 0;

        return {
            totalClicks,
            maxClicks,
            uniqueCountries,
            uniqueCities,
            avgClicksPerLocation,
            lastUpdate: new Date().toISOString()
        };
    }, []);

    // Buscar dados do heatmap
    const fetchHeatmapData = useCallback(async (showLoading = false): Promise<HeatmapPoint[]> => {
        // Se não temos linkId e não está em modo global, retornar vazio
        if (!linkId && !globalMode) return [];

        try {
            if (showLoading) setLoading(true);
            setError(null);

            // Tentar endpoint protegido primeiro
            let heatmapData: HeatmapPoint[] = [];

            try {
                // Escolher endpoint baseado no modo
                const endpoint = globalMode
                    ? '/api/analytics/global/heatmap'
                    : `/api/analytics/link/${linkId}/heatmap`;

                const response = await api.get(endpoint) as { data: any };

                if (response.data?.success && response.data?.data) {
                    heatmapData = response.data.data as HeatmapPoint[];
                } else if (Array.isArray(response.data)) {
                    heatmapData = response.data as HeatmapPoint[];
                } else {
                    throw new Error('Dados não encontrados na resposta da API');
                }
            } catch (authError) {
                // Fallback para endpoint de teste (apenas para links específicos)
                if (!globalMode && linkId) {
                    console.warn('Tentando endpoint de teste para heatmap:', authError);

                    try {
                        const testResponse = await fetch(
                            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/test-analytics/${linkId}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json'
                                }
                            }
                        );

                        if (!testResponse.ok) {
                            throw new Error(`HTTP ${testResponse.status}: ${testResponse.statusText}`);
                        }

                        const testData = await testResponse.json();
                        heatmapData = testData.geographic?.heatmap_data || [];
                    } catch (testError) {
                        console.error('Falha no endpoint de teste:', testError);

                        // Tentar endpoint de tempo real sem autenticação
                        try {
                            const realtimeEndpoint = globalMode
                                ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analytics/global/heatmap/realtime`
                                : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analytics/link/${linkId}/heatmap/realtime`;

                            const realtimeResponse = await fetch(realtimeEndpoint, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json'
                                }
                            });

                            if (realtimeResponse.ok) {
                                const realtimeData = await realtimeResponse.json();
                                heatmapData = realtimeData.data || [];
                            } else {
                                throw new Error(`Realtime endpoint failed: ${realtimeResponse.status}`);
                            }
                        } catch (realtimeError) {
                            console.error('Falha no endpoint de tempo real:', realtimeError);
                            // Retornar array vazio em vez de dados mock
                            heatmapData = [];
                        }
                    }
                } else {
                    // Para modo global, tentar endpoint de tempo real direto
                    try {
                        const realtimeResponse = await fetch(
                            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analytics/global/heatmap/realtime`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json'
                                }
                            }
                        );

                        if (realtimeResponse.ok) {
                            const realtimeData = await realtimeResponse.json();
                            heatmapData = realtimeData.data || [];
                        } else {
                            throw new Error(`Global realtime endpoint failed: ${realtimeResponse.status}`);
                        }
                    } catch (realtimeError) {
                        console.error('Falha no endpoint global de tempo real:', realtimeError);
                        heatmapData = [];
                    }
                }
            }

            // Filtrar dados por cliques mínimos
            const filteredData = heatmapData.filter((point: HeatmapPoint) => point.clicks >= minClicks);

            if (mountedRef.current) {
                setData(filteredData);
                setStats(calculateStats(filteredData));
                setLastUpdate(new Date());
            }

            return filteredData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            console.error('Erro ao buscar dados do heatmap:', errorMessage);

            if (mountedRef.current) {
                setError(errorMessage);
                // Em caso de erro, retornar dados vazios
                setData([]);
                setStats({
                    totalClicks: 0,
                    maxClicks: 0,
                    uniqueCountries: 0,
                    uniqueCities: 0,
                    avgClicksPerLocation: 0,
                    lastUpdate: new Date().toISOString()
                });
            }

            return [];
        } finally {
            if (mountedRef.current && showLoading) {
                setLoading(false);
            }
        }
    }, [linkId, globalMode, minClicks, calculateStats]);



    // Refresh manual
    const refresh = useCallback(() => {
        fetchHeatmapData(true);
    }, [fetchHeatmapData]);

    // Configurar polling para tempo real
    useEffect(() => {
        if (!enableRealtime || (!linkId && !globalMode)) return;

        // Buscar dados iniciais
        fetchHeatmapData(true);

        // Configurar polling
        if (refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchHeatmapData(false); // Não mostrar loading nas atualizações automáticas
            }, refreshInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [linkId, globalMode, enableRealtime, refreshInterval, fetchHeatmapData]);

    // Cleanup no unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Filtrar dados por cliques mínimos quando o filtro muda
    useEffect(() => {
        if (data.length > 0) {
            const filteredData = data.filter((point: HeatmapPoint) => point.clicks >= minClicks);
            setStats(calculateStats(filteredData));
        }
    }, [data, minClicks, calculateStats]);

    return {
        data: data.filter((point: HeatmapPoint) => point.clicks >= minClicks),
        stats,
        loading,
        error,
        lastUpdate,
        refresh,
        isRealtime: enableRealtime
    };
}
