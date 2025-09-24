/**
 * @deprecated Este hook foi substituído por hooks individuais
 *
 * Use os hooks específicos ao invés deste:
 * - useDashboardData para dados do dashboard
 * - useTemporalData para dados temporais
 * - useGeographicData para dados geográficos
 * - useAudienceData para dados de audiência
 * - useInsightsData para insights
 * - useHeatmapData para heatmap
 * - useLinkPerformance para performance
 *
 * Este arquivo será removido na próxima versão.
 */

import { useState, useEffect, useCallback } from 'react';

import { api } from '@/lib/api/client';

import type { HeatmapPoint, CountryData, StateData, CityData, HourlyData, DayOfWeekData, DeviceData } from '@/types';

// Tipos movidos para @/types/core/api
// @deprecated Use types from @/types instead

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
		if (!linkId) {
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Tentar usar o novo endpoint primeiro
			let response: EnhancedAnalyticsData;
			try {
				const apiResponse = await api.get<ApiResponse<EnhancedAnalyticsData>>(
					`/api/analytics/link/${linkId}/comprehensive`
				);
				// O endpoint protegido retorna dados dentro de 'data'
				response = apiResponse.data || (apiResponse as unknown as EnhancedAnalyticsData);
			} catch (authError) {
				// Se falhar por autenticação, usar endpoint de teste temporário

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

					// Agora o endpoint de teste retorna dados completos
					setData(testResponse);
					return;
				} catch (testError) {
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

	// ✅ fetchHeatmapData removido - usar useHeatmapData hook

	// ✅ fetchGeographicData removido - usar useGeographicData hook

	// ✅ fetchInsights removido - usar useInsightsData hook

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
		refetch
	};
}
