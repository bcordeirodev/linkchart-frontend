import { useCallback, useEffect, useState } from 'react';

import { analyticsService } from '@/services';

import type { LinkPerformanceDashboard } from '@/types/analytics/performance';

interface UseLinkPerformanceOptions {
	linkId: string;
	enableRealtime?: boolean;
	refreshInterval?: number;
}

/**
 * Hook para gerenciar dados de performance dos links
 * Centraliza a lógica de fetch e estado para métricas de performance
 */
export function useLinkPerformance(options: UseLinkPerformanceOptions) {
	const { linkId, enableRealtime = false, refreshInterval = 60000 } = options;

	const [data, setData] = useState<LinkPerformanceDashboard | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDashboard = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const adaptedData = await analyticsService.getLinkPerformance(linkId);
			setData(adaptedData);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Erro ao carregar dados de performance');
		} finally {
			setLoading(false);
		}
	}, [linkId]);

	useEffect(() => {
		fetchDashboard();

		// Atualizar dados periodicamente se realtime estiver habilitado
		let interval: NodeJS.Timeout | null = null;

		if (enableRealtime && refreshInterval > 0 && !error) {
			interval = setInterval(() => {
				if (!error) {
					fetchDashboard();
				}
			}, refreshInterval);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [linkId, enableRealtime, refreshInterval, error, fetchDashboard]);

	return {
		data,
		loading,
		error,
		refetch: fetchDashboard
	};
}

export default useLinkPerformance;
