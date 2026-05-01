'use client';
/**
 * 📊 USE DASHBOARD DATA - Hook para Dados do Dashboard
 *
 * @description
 * Hook customizado para gerenciar dados do dashboard com métricas agregadas,
 * suporte a tempo real e validação de dados.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import { api } from '@/lib/api/client';

import type {
	ActivityData,
	DashboardData,
	DashboardLink,
	DashboardStats,
	DashboardSummary,
	DeviceSummary,
	GeographicSummary,
	UseDashboardDataOptions,
	UseDashboardDataReturn
} from '@/types/analytics/dashboard';

/**
 * Hook para gerenciar dados do dashboard
 */
export function useDashboardData({
	linkId,
	refreshInterval = 60000,
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
	const isRequestingRef = useRef<boolean>(false);
	const lastRequestParamsRef = useRef<string>('');

	/**
	 * Busca dados do dashboard da API
	 */
	const fetchDashboardData = useCallback(async () => {
		try {
			const params = {
				hours: getHoursFromTimeframe(timeframe),
				include_charts: 'true'
			};

			const requestKey = `${linkId}-${timeframe}-${JSON.stringify(params)}`;

			// Evita requisições duplicadas
			if (isRequestingRef.current && lastRequestParamsRef.current === requestKey) {
				return;
			}

			isRequestingRef.current = true;
			lastRequestParamsRef.current = requestKey;

			// Cancela requisição anterior se existir
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setError(null);

			if (!linkId) {
				return;
			}

			const endpoint = `/api/analytics/link/${linkId}/dashboard`;
			const fullEndpoint = buildEndpointWithParams(endpoint, params);

			// Client já desembrulha envelope { data } (Onda 0).
			const response = await api.get<ApiResponse>(fullEndpoint);

			if (!response) {
				throw new Error('Dados do dashboard não encontrados');
			}

			const dashboardData = mapResponseToDashboardData(response);
			setData(dashboardData);

			const calculatedStats = calculateStats(dashboardData);
			setStats(calculatedStats);
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return;
			}

			const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
			setError(errorMessage);
		} finally {
			isRequestingRef.current = false;
		}
	}, [linkId, timeframe]);

	/**
	 * Atualiza dados manualmente
	 */
	const refresh = useCallback(async () => {
		setLoading(true);
		await fetchDashboardData();
		setLoading(false);
	}, [fetchDashboardData]);

	// Setup realtime updates
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

	// Initial fetch
	useEffect(() => {
		setLoading(true);
		fetchDashboardData().finally(() => {
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
	}, [linkId, timeframe]);

	return {
		data,
		stats,
		loading,
		error,
		refresh,
		isRealtime
	};
}

// ============================================
// Utilitários Internos
// ============================================

/**
 * Tipo da resposta da API
 */
interface ApiResponseData {
	summary?: DashboardSummary;
	top_links?: DashboardLink[];
	recent_activity?: ActivityData[];
	temporal_data?: DashboardData['temporal_data'];
	geographic_data?: DashboardData['geographic_data'];
	audience_data?: DashboardData['audience_data'];
	link_info?: DashboardData['link_info'];
}

interface ApiMetrics {
	dashboard?: DashboardSummary;
	geographic?: GeographicSummary;
	audience?: {
		device_types?: Partial<DeviceSummary>;
	};
}

interface ApiCharts {
	temporal?: DashboardData['temporal_data'];
	geographic?: DashboardData['geographic_data'];
	audience?: DashboardData['audience_data'];
}

// Shape que chega ao hook pós-Onda-0: payload direto do AnalyticsController,
// sem envelope {success, data}. Mantém campos legados (metrics/charts) apenas
// por compatibilidade com respostas antigas de cache.
interface ApiResponse extends ApiResponseData {
	metrics?: ApiMetrics;
	charts?: ApiCharts;
	timeframe?: string;
}

/**
 * Converte timeframe para horas
 */
function getHoursFromTimeframe(timeframe: '1h' | '24h' | '7d' | '30d'): string {
	const map = { '1h': '1', '24h': '24', '7d': '168', '30d': '720' };
	return map[timeframe];
}

/**
 * Constrói endpoint com parâmetros
 */
function buildEndpointWithParams(endpoint: string, params: Record<string, string>): string {
	const urlParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			urlParams.append(key, String(value));
		}
	});
	return urlParams.toString() ? `${endpoint}?${urlParams.toString()}` : endpoint;
}

/**
 * Mapeia resposta da API para DashboardData.
 *
 * Após Onda 0, o client já desembrulha o envelope { data }, então `response`
 * aqui é o payload direto do AnalyticsController@getLinkDashboardAnalytics:
 * { summary, link_info, temporal_data, geographic_data, audience_data, ... }.
 */
function mapResponseToDashboardData(response: ApiResponse): DashboardData {
	const defaultSummary: DashboardSummary = {
		total_links: 0,
		active_links: 0,
		total_clicks: 0,
		unique_visitors: 0,
		avg_clicks_per_link: 0,
		success_rate: 0,
		avg_response_time: 0,
		countries_reached: 0,
		links_with_traffic: 0
	};

	return {
		summary: response.summary || defaultSummary,
		top_links: response.top_links || [],
		recent_activity: response.recent_activity || [],
		geographic_summary: {
			countries_reached: response.summary?.countries_reached || 0,
			cities_reached: 0,
			top_country: response.geographic_data?.top_countries?.[0]?.country,
			top_country_clicks: response.geographic_data?.top_countries?.[0]?.clicks || 0,
			coverage_percentage: 0
		},
		device_summary: {
			desktop: response.audience_data?.device_breakdown?.find((d) => d.device === 'Desktop')?.clicks || 0,
			mobile: response.audience_data?.device_breakdown?.find((d) => d.device === 'Mobile')?.clicks || 0,
			tablet: response.audience_data?.device_breakdown?.find((d) => d.device === 'Tablet')?.clicks || 0,
			total: response.summary?.total_clicks || 0,
			mobile_percentage: 0
		},
		performance_indicators: [],
		temporal_data: response.temporal_data,
		geographic_data: response.geographic_data,
		audience_data: response.audience_data,
		link_info: response.link_info
	};
}

/**
 * Calcula estatísticas do dashboard
 */
function calculateStats(data: DashboardData): DashboardStats {
	const totalClicks = data.summary.total_clicks || 0;

	let dataQuality: 'excellent' | 'good' | 'fair' | 'poor';

	if (totalClicks > 100) {
		dataQuality = 'excellent';
	} else if (totalClicks > 10) {
		dataQuality = 'good';
	} else if (totalClicks > 0) {
		dataQuality = 'fair';
	} else {
		dataQuality = 'poor';
	}

	return {
		totalMetrics: Object.keys(data.summary).length,
		lastUpdate: new Date().toISOString(),
		dataQuality,
		trendsAvailable: (data.recent_activity?.length || 0) > 0,
		alertsCount: 0,
		recommendationsCount: 0
	};
}

export default useDashboardData;
