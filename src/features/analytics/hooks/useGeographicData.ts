/**
 * @fileoverview Hook para dados geográficos
 * @author Link Chart Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api/client';
import type { GeographicData } from '@/types/analytics';

export interface GeographicStats {
	totalCountries: number;
	totalStates: number;
	totalCities: number;
	topCountryClicks: number;
	coveragePercentage: number;
	lastUpdate: string;
}

export interface UseGeographicDataOptions {
	linkId?: string;
	globalMode?: boolean;
	refreshInterval?: number;
	enableRealtime?: boolean;
	includeHeatmap?: boolean;
	minClicks?: number;
}

export interface UseGeographicDataReturn {
	data: GeographicData | null;
	stats: GeographicStats | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	isRealtime: boolean;
}

/**
 * Hook personalizado para dados geográficos
 *
 * @description
 * Gerencia dados de distribuição geográfica:
 * - Top países, estados e cidades
 * - Dados para heatmap (opcional)
 * - Estatísticas de cobertura
 * - Insights regionais
 *
 * @example
 * ```tsx
 * // Dados globais com heatmap
 * const { data, stats, loading } = useGeographicData({
 *   globalMode: true,
 *   includeHeatmap: true
 * });
 *
 * // Link específico
 * const { data, loading } = useGeographicData({
 *   linkId: '123',
 *   minClicks: 5
 * });
 * ```
 */
export function useGeographicData({
	linkId,
	globalMode = false,
	refreshInterval = 30000,
	enableRealtime = false,
	includeHeatmap = false,
	minClicks = 1
}: UseGeographicDataOptions = {}): UseGeographicDataReturn {
	const [data, setData] = useState<GeographicData | null>(null);
	const [stats, setStats] = useState<GeographicStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRealtime, setIsRealtime] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * Calcular estatísticas dos dados geográficos
	 */
	const calculateStats = useCallback((geographicData: GeographicData): GeographicStats => {
		const countries = geographicData.top_countries || [];
		const states = geographicData.top_states || [];
		const cities = geographicData.top_cities || [];

		return {
			totalCountries: countries.length,
			totalStates: states.length,
			totalCities: cities.length,
			topCountryClicks: countries[0]?.clicks || 0,
			coveragePercentage: countries.length > 0 ? Math.min((countries.length / 195) * 100, 100) : 0, // 195 países no mundo
			lastUpdate: new Date().toISOString()
		};
	}, []);

	/**
	 * Buscar dados geográficos
	 */
	const fetchGeographicData = useCallback(async () => {
		try {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setError(null);

			let endpoint: string;

			if (linkId && !globalMode) {
				endpoint = `/api/analytics/link/${linkId}/geographic`;
			} else {
				// Para modo global, usar endpoint específico de analytics globais
				endpoint = '/api/analytics/global/geographic';
			}

			const response = await api.get<{
				success: boolean;
				data: GeographicData;
			}>(endpoint);

			if (response.success && response.data) {
				// Filtrar por cliques mínimos se especificado
				let filteredData = response.data;

				if (minClicks > 1) {
					filteredData = {
						...response.data,
						top_countries: response.data.top_countries?.filter((c) => c.clicks >= minClicks) || [],
						top_states: response.data.top_states?.filter((s) => s.clicks >= minClicks) || [],
						top_cities: response.data.top_cities?.filter((c) => c.clicks >= minClicks) || [],
						heatmap_data: response.data.heatmap_data?.filter((h) => h.clicks >= minClicks) || []
					};
				}

				setData(filteredData);
				setStats(calculateStats(filteredData));
			} else {
				throw new Error('Dados geográficos não encontrados');
			}
		} catch (err: any) {
			if (err.name === 'AbortError') {
				return;
			}

			const errorMessage = err.message || 'Erro ao carregar dados geográficos';
			setError(errorMessage);

			if (import.meta.env.DEV) {
				console.error('useGeographicData error:', err);
			}
		}
	}, [linkId, globalMode, minClicks, calculateStats]);

	/**
	 * Refresh manual
	 */
	const refresh = useCallback(async () => {
		setLoading(true);
		await fetchGeographicData();
		setLoading(false);
	}, []); // Removido fetchGeographicData das dependências

	/**
	 * Configurar realtime
	 */
	useEffect(() => {
		if (enableRealtime && refreshInterval > 0) {
			intervalRef.current = setInterval(fetchGeographicData, refreshInterval);
			setIsRealtime(true);
		} else {
			setIsRealtime(false);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [enableRealtime, refreshInterval]); // Removido fetchGeographicData das dependências

	/**
	 * Buscar dados na montagem
	 */
	useEffect(() => {
		setLoading(true);
		fetchGeographicData().finally(() => {
			setLoading(false);
		});

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []); // Removido fetchGeographicData das dependências

	return {
		data,
		stats,
		loading,
		error,
		refresh,
		isRealtime
	};
}

export default useGeographicData;
