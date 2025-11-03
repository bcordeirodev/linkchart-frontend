/**
 * Hook para dados temporais
 */
import { useState, useEffect, useCallback, useRef } from 'react';

import { api } from '@/lib/api/client';

import type { TemporalData } from '@/types/analytics';

export interface TemporalStats {
	totalDataPoints: number;
	peakHour: string;
	peakDay: string;
	averageHourlyClicks: number;
	trendDirection: 'up' | 'down' | 'stable';
	lastUpdate: string;
}

export interface UseTemporalDataOptions {
	linkId: string;
	refreshInterval?: number;
	enableRealtime?: boolean;
	/**
	 * @deprecated Endpoint /temporal agora sempre inclui dados advanced
	 * Este parâmetro é mantido por compatibilidade mas não tem efeito
	 */
	includeAdvanced?: boolean;
}

export interface UseTemporalDataReturn {
	data: TemporalData | null;
	stats: TemporalStats | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	isRealtime: boolean;
}

/**
 * Hook personalizado para dados temporais
 */
export function useTemporalData({
	linkId,
	refreshInterval = 30000,
	enableRealtime = false,
	includeAdvanced = false
}: UseTemporalDataOptions): UseTemporalDataReturn {
	const [data, setData] = useState<TemporalData | null>(null);
	const [stats, setStats] = useState<TemporalStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRealtime, setIsRealtime] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * Calcular estatísticas dos dados temporais
	 */
	const calculateStats = useCallback((temporalData: TemporalData): TemporalStats => {
		const hourlyData = temporalData.clicks_by_hour || [];
		const dailyData = temporalData.clicks_by_day_of_week || [];

		// Encontrar pico de hora
		const peakHourData = hourlyData.reduce(
			(prev, current) => (current.clicks > prev.clicks ? current : prev),
			hourlyData[0] || { hour: '0', clicks: 0 }
		);

		// Encontrar pico de dia
		const peakDayData = dailyData.reduce(
			(prev, current) => (current.clicks > prev.clicks ? current : prev),
			dailyData[0] || { day_name: 'Segunda', clicks: 0 }
		);

		// Calcular média de cliques por hora
		const totalClicks = hourlyData.reduce((sum, item) => sum + item.clicks, 0);
		const averageHourlyClicks = hourlyData.length > 0 ? totalClicks / hourlyData.length : 0;

		// Determinar tendência (simplificado)
		let trendDirection: 'up' | 'down' | 'stable' = 'stable';

		if (hourlyData.length >= 2) {
			const firstHalf = hourlyData.slice(0, Math.floor(hourlyData.length / 2));
			const secondHalf = hourlyData.slice(Math.floor(hourlyData.length / 2));

			const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.clicks, 0) / firstHalf.length;
			const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.clicks, 0) / secondHalf.length;

			if (secondHalfAvg > firstHalfAvg * 1.1) {
				trendDirection = 'up';
			} else if (secondHalfAvg < firstHalfAvg * 0.9) {
				trendDirection = 'down';
			}
		}

		return {
			totalDataPoints: hourlyData.length + dailyData.length,
			peakHour: String(peakHourData.hour),
			peakDay: peakDayData.day_name,
			averageHourlyClicks: Math.round(averageHourlyClicks),
			trendDirection,
			lastUpdate: new Date().toISOString()
		};
	}, []);

	/**
	 * Buscar dados temporais
	 * ✨ UNIFICADO: Sempre usa endpoint /temporal que agora inclui dados advanced
	 */
	const fetchTemporalData = useCallback(async () => {
		try {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setError(null);

			// Analytics global removido - apenas link específico
			if (!linkId) {
				return; // Não buscar dados se não há linkId
			}

			// ✨ Sempre usar endpoint unificado (includeAdvanced é ignorado)
			// ✨ Endpoint sempre retorna TODOS os dados desde o início (sem filtro de data)
			const endpoint = `/api/analytics/link/${linkId}/temporal`;

			const response = await api.get<{
				success: boolean;
				data: TemporalData;
			}>(endpoint);

			if (response.success && response.data) {
				setData(response.data);
				setStats(calculateStats(response.data));
			} else {
				throw new Error('Dados temporais não encontrados');
			}
		} catch (err: any) {
			if (err.name === 'AbortError') {
				return;
			}

			const errorMessage = err.message || 'Erro ao carregar dados temporais';
			setError(errorMessage);

			console.error('useTemporalData error:', err);
		}
	}, [linkId, calculateStats]); // includeAdvanced e timeRange removidos das dependências

	/**
	 * Refresh manual
	 */
	const refresh = useCallback(async () => {
		setLoading(true);
		await fetchTemporalData();
		setLoading(false);
	}, [fetchTemporalData]);

	/**
	 * Configurar realtime
	 */
	useEffect(() => {
		if (enableRealtime && refreshInterval > 0) {
			intervalRef.current = setInterval(fetchTemporalData, refreshInterval);
			setIsRealtime(true);
		} else {
			setIsRealtime(false);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [enableRealtime, refreshInterval, fetchTemporalData]);

	/**
	 * Buscar dados na montagem
	 */
	useEffect(() => {
		setLoading(true);
		fetchTemporalData().finally(() => {
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
	}, [fetchTemporalData]);

	return {
		data,
		stats,
		loading,
		error,
		refresh,
		isRealtime
	};
}

export default useTemporalData;
