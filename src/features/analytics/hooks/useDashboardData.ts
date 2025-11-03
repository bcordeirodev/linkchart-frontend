import { useState, useEffect, useCallback, useRef } from 'react';

import { api } from '@/lib/api/client';
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
	top_links: {
		id: number;
		title: string;
		short_url: string;
		original_url: string;
		clicks: number;
		is_active: boolean;
		created_at?: string;
	}[];
	recent_activity?: {
		date: string;
		clicks: number;
	}[];
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
	// Informações do link (apenas para dashboard individual)
	link_info?: {
		id: number;
		title: string;
		short_url?: string;
		original_url: string;
		clicks: number;
		is_active: boolean;
		created_at: string;
	};
	// Dados de gráficos opcionais
	temporal_data?: {
		clicks_by_hour: {
			hour: number;
			clicks: number;
			label: string;
		}[];
		clicks_by_day_of_week: {
			day: number;
			day_name: string;
			clicks: number;
		}[];
	} | null;
	geographic_data?: {
		top_countries: {
			country: string;
			clicks: number;
		}[];
		top_cities: {
			city: string;
			clicks: number;
		}[];
	} | null;
	audience_data?: {
		device_breakdown: {
			device: string;
			clicks: number;
		}[];
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
 * Hook para gerenciar dados do dashboard com métricas agregadas e top links
 */
export function useDashboardData({
	linkId,
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
	const isRequestingRef = useRef<boolean>(false);
	const lastRequestParamsRef = useRef<string>('');
	const fetchDashboardData = useCallback(async () => {
		try {
			const params = {
				hours: timeframe === '1h' ? '1' : timeframe === '24h' ? '24' : timeframe === '7d' ? '168' : '720',
				include_charts: 'true'
			};

			const requestKey = `${linkId}-${timeframe}-${JSON.stringify(params)}`;

			if (isRequestingRef.current && lastRequestParamsRef.current === requestKey) {
				return;
			}

			isRequestingRef.current = true;
			lastRequestParamsRef.current = requestKey;

			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setError(null);

			// Analytics global removido - apenas link específico
			if (!linkId) {
				return; // Não buscar dados se não há linkId
			}

			const dashboardEndpoint = `/api/analytics/link/${linkId}/dashboard`;

			const urlParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					urlParams.append(key, String(value));
				}
			});
			const fullEndpoint = urlParams.toString()
				? `${dashboardEndpoint}?${urlParams.toString()}`
				: dashboardEndpoint;

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

			let dashboardData: DashboardData;

			if (response.data) {
				const data = response.data;
				dashboardData = {
					summary: data.summary || {},
					top_links: data.top_links || [],
					recent_activity: [],
					geographic_summary: {
						countries_reached: data.summary?.countries_reached || 0,
						cities_reached: 0,
						top_country: data.geographic_data?.top_countries?.[0]?.country
					},
					device_summary: {
						desktop: data.audience_data?.device_breakdown?.find((d) => d.device === 'Desktop')?.clicks || 0,
						mobile: data.audience_data?.device_breakdown?.find((d) => d.device === 'Mobile')?.clicks || 0,
						tablet: data.audience_data?.device_breakdown?.find((d) => d.device === 'Tablet')?.clicks || 0
					},
					temporal_data: data.temporal_data,
					geographic_data: data.geographic_data,
					audience_data: data.audience_data
				};
			} else {
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
					temporal_data: charts.temporal,
					geographic_data: charts.geographic,
					audience_data: charts.audience
				};
			}

			setData(dashboardData);

			const calculatedStats: DashboardStats = {
				totalMetrics: Object.keys(dashboardData.summary).length,
				lastUpdate: new Date().toISOString(),
				dataQuality:
					dashboardData.summary.total_clicks > 100
						? 'excellent'
						: dashboardData.summary.total_clicks > 10
							? 'good'
							: 'fair',
				trendsAvailable: (dashboardData.recent_activity?.length || 0) > 0
			};

			setStats(calculatedStats);
		} catch (err: any) {
			if (err.name === 'AbortError') {
				return;
			}

			const errorMessage = err.message || 'Erro ao carregar dados do dashboard';
			setError(errorMessage);

			console.error('useDashboardData error:', err);
		} finally {
			isRequestingRef.current = false;
		}
	}, [linkId, timeframe]);
	const refresh = useCallback(async () => {
		setLoading(true);
		await fetchDashboardData();
		setLoading(false);
	}, [fetchDashboardData]);

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
	}, [enableRealtime, refreshInterval]);

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

export default useDashboardData;
