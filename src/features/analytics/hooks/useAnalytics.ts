import { useState, useEffect, useCallback } from 'react';
import { AnalyticsData } from '@/features/analytics/types/analytics';
import { analyticsService } from '../../../lib/services';

interface UseAnalyticsReturn {
	data: AnalyticsData | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Hook personalizado para dados de analytics
 * Gerencia carregamento, cache e atualização dos dados
 * Implementa fallback robusto para diferentes cenários
 */
export function useAnalytics(): UseAnalyticsReturn {
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAnalytics = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Usar o service centralizado que já tem fallback e tratamento de erro
			const response = await analyticsService.getAnalytics();
			setData(response);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao carregar dados de analytics');
		} finally {
			setLoading(false);
		}
	}, []);

	const refetch = useCallback(async () => {
		await fetchAnalytics();
	}, [fetchAnalytics]);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	return {
		data,
		loading,
		error,
		refetch
	};
}

export default useAnalytics;
