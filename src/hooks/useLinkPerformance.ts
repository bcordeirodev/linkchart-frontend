'use client';

import { useState, useEffect, useCallback } from 'react';
import { LinkPerformanceDashboard } from '@/types/linkPerformance';
import { analyticsService } from '@/services';

/**
 * Hook para gerenciar dados de performance dos links
 * Centraliza a lógica de fetch e estado para métricas de performance
 */
export function useLinkPerformance() {
    const [data, setData] = useState<LinkPerformanceDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Usar o service centralizado que já tem adaptação e fallback
            const adaptedData = await analyticsService.getLinkPerformance();
            setData(adaptedData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados de performance');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLinkAnalytics = useCallback(async () => {
        // Buscar analytics gerais usando o service centralizado
        const response = await analyticsService.getAnalytics();
        return response;
    }, []);

    useEffect(() => {
        fetchDashboard();

        // Atualizar dados a cada 60 segundos (apenas se não houver erro)
        const interval = setInterval(() => {
            if (!error) {
                fetchDashboard();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [fetchDashboard, error]);

    return {
        data,
        loading,
        error,
        refetch: fetchDashboard,
        fetchLinkAnalytics
    };
}

export default useLinkPerformance;
