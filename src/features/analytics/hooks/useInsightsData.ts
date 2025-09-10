/**
 * Hook para dados de insights
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { api } from '@/lib/api/client';

// Tipos para insights
export interface BusinessInsight {
	type: 'geographic' | 'temporal' | 'audience' | 'performance' | 'conversion' | 'engagement';
	title: string;
	description: string;
	priority: 'high' | 'medium' | 'low';
	actionable: boolean;
	recommendation?: string;
	impact_score?: number;
	confidence?: number;
	data_points?: Record<string, any>;
}

export interface InsightsData {
	insights: BusinessInsight[];
	summary: {
		total_insights: number;
		high_priority: number;
		actionable_insights: number;
		avg_confidence: number;
	};
	categories: Record<string, number>;
	generated_at: string;
}

export interface InsightsStats {
	totalInsights: number;
	highPriorityCount: number;
	actionableCount: number;
	avgConfidence: number;
	topCategory: string;
	lastGenerated: string;
}

export interface UseInsightsDataOptions {
	linkId?: string;
	globalMode?: boolean;
	refreshInterval?: number;
	enableRealtime?: boolean;
	minConfidence?: number;
	categories?: string[];
}

export interface UseInsightsDataReturn {
	data: InsightsData | null;
	stats: InsightsStats | null;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	isRealtime: boolean;
}

/**
 * Hook personalizado para dados de insights de negócio

 *  Gerencia insights automáticos gerados pela análise dos dados:
 * - Insights de performance e otimização
 * - Recomendações estratégicas
 * - Identificação de oportunidades
 * - Alertas e tendências importantes
 */
export function useInsightsData({
	linkId,
	globalMode = false,
	refreshInterval = 300000, // 5 minutos (insights não mudam frequentemente)
	enableRealtime = false,
	minConfidence = 0.5,
	categories = []
}: UseInsightsDataOptions = {}): UseInsightsDataReturn {
	const [data, setData] = useState<InsightsData | null>(null);
	const [stats, setStats] = useState<InsightsStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRealtime, setIsRealtime] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * Calcular estatísticas dos insights
	 */
	const calculateStats = useCallback((insightsData: InsightsData): InsightsStats => {
		const insights = insightsData.insights || [];

		const highPriorityCount = insights.filter((i) => i.priority === 'high').length;
		const actionableCount = insights.filter((i) => i.actionable).length;
		const avgConfidence =
			insights.length > 0 ? insights.reduce((sum, i) => sum + (i.confidence || 0.5), 0) / insights.length : 0;

		// Encontrar categoria mais comum
		const categoryCount: Record<string, number> = {};
		insights.forEach((insight) => {
			categoryCount[insight.type] = (categoryCount[insight.type] || 0) + 1;
		});

		const topCategory = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0] || 'performance';

		return {
			totalInsights: insights.length,
			highPriorityCount,
			actionableCount,
			avgConfidence: Math.round(avgConfidence * 100) / 100,
			topCategory,
			lastGenerated: insightsData.generated_at || new Date().toISOString()
		};
	}, []);

	/**
	 * Memoizar categorias para evitar recriação
	 */
	const stableCategories = useMemo(() => categories, [JSON.stringify(categories)]);

	/**
	 * Filtrar insights baseado nas opções
	 */
	const filterInsights = useCallback(
		(insights: BusinessInsight[]): BusinessInsight[] => {
			let filtered = insights;

			// Filtrar por confiança mínima
			if (minConfidence > 0) {
				filtered = filtered.filter((insight) => (insight.confidence || 0.5) >= minConfidence);
			}

			// Filtrar por categorias se especificado
			if (stableCategories.length > 0) {
				filtered = filtered.filter((insight) => stableCategories.includes(insight.type));
			}

			return filtered;
		},
		[minConfidence, stableCategories]
	);

	/**
	 * Parâmetros estáveis para fetchInsightsData
	 */
	const fetchParams = useMemo(
		() => ({
			linkId,
			globalMode,
			minConfidence,
			categories: stableCategories
		}),
		[linkId, globalMode, minConfidence, stableCategories]
	);

	/**
	 * Buscar dados de insights
	 */
	const fetchInsightsData = useCallback(async () => {
		try {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();
			setError(null);

			let endpoint: string;

			if (fetchParams.linkId && !fetchParams.globalMode) {
				endpoint = `/api/analytics/link/${fetchParams.linkId}/insights`;
			} else {
				// Para modo global, usar endpoint específico de analytics globais
				endpoint = '/api/analytics/global/insights';
			}

			const response = await api.get<{
				success: boolean;
				data: BusinessInsight[] | InsightsData;
			}>(endpoint);

			if (response.success && response.data) {
				let insightsData: InsightsData;

				// Adaptar resposta baseado no formato
				if (Array.isArray(response.data)) {
					// Resposta simples (array de insights)
					const filteredInsights = filterInsights(response.data);

					insightsData = {
						insights: filteredInsights,
						summary: {
							total_insights: filteredInsights.length,
							high_priority: filteredInsights.filter((i) => i.priority === 'high').length,
							actionable_insights: filteredInsights.filter((i) => i.actionable).length,
							avg_confidence:
								filteredInsights.length > 0
									? filteredInsights.reduce((sum, i) => sum + (i.confidence || 0.5), 0) /
										filteredInsights.length
									: 0
						},
						categories: {},
						generated_at: new Date().toISOString()
					};
				} else {
					// Resposta completa
					insightsData = {
						...response.data,
						insights: filterInsights(response.data.insights || [])
					};
				}

				setData(insightsData);
				setStats(calculateStats(insightsData));
			} else {
				throw new Error('Insights não encontrados');
			}
		} catch (err: any) {
			if (err.name === 'AbortError') {
				return;
			}

			const errorMessage = err.message || 'Erro ao carregar insights';
			setError(errorMessage);

			console.error('useInsightsData error:', err);
		}
	}, [fetchParams, filterInsights, calculateStats]);

	/**
	 * Refresh manual
	 */
	const refresh = useCallback(async () => {
		setLoading(true);
		await fetchInsightsData();
		setLoading(false);
	}, []); // Removido fetchInsightsData das dependências

	/**
	 * Configurar realtime (menos frequente para insights)
	 */
	useEffect(() => {
		if (enableRealtime && refreshInterval > 0) {
			intervalRef.current = setInterval(fetchInsightsData, refreshInterval);
			setIsRealtime(true);
		} else {
			setIsRealtime(false);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [enableRealtime, refreshInterval]); // Removido fetchInsightsData das dependências

	/**
	 * Buscar dados na montagem
	 */
	useEffect(() => {
		setLoading(true);
		fetchInsightsData().finally(() => {
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
	}, []); // Removido fetchInsightsData das dependências

	return {
		data,
		stats,
		loading,
		error,
		refresh,
		isRealtime
	};
}

export default useInsightsData;
