/**
 * @fileoverview Hook personalizado para gerenciar dados de heatmap
 * @author Link Chart Team
 * @version 2.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import { api } from '@/lib/api/client';

import type { HeatmapPoint } from '@/types';

// Interfaces locais para o hook
interface HeatmapStats {
	totalPoints: number;
	totalClicks: number;
	avgClicksPerPoint: number;
	topCountry: string;
	topCity: string;
	coveragePercentage: number;
	maxClicks: number;
}

interface UseHeatmapDataOptions {
	linkId: string;
	enableRealtime?: boolean;
	refreshInterval?: number;
	minClicks?: number;
}

interface UseHeatmapDataReturn {
	data: HeatmapPoint[];
	stats: HeatmapStats | null;
	loading: boolean;
	error: string | null;
	refresh: () => void;
	lastUpdate: Date | null;
}

interface HeatmapApiResponse {
	success: boolean;
	data: HeatmapPoint[];
	metadata?: {
		total_points: number;
		total_clicks: number;
		countries: number;
		cities: number;
	};
}

/**
 * Hook personalizado para buscar e gerenciar dados de heatmap
 *
 * @description
 * Este hook fornece uma interface unificada para:
 * - Buscar dados de heatmap de link específico
 * - Gerenciar atualizações em tempo real
 * - Calcular estatísticas agregadas
 * - Tratar erros e estados de carregamento
 *
 * @example
 * ```tsx
 * // Link específico
 * const { data, stats, loading } = useHeatmapData({
 *   linkId: '123',
 *   minClicks: 5,
 *   enableRealtime: true
 * });
 * ```
 */
export function useHeatmapData({
	linkId,
	refreshInterval = 30000,
	enableRealtime = true,
	minClicks = 1
}: UseHeatmapDataOptions): UseHeatmapDataReturn {
	// Estados principais
	const [data, setData] = useState<HeatmapPoint[]>([]);
	const [stats, setStats] = useState<HeatmapStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

	// Refs para controle de ciclo de vida
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	/**
	 * Calcula estatísticas agregadas dos dados do heatmap
	 */
	const calculateStats = useCallback((heatmapData: HeatmapPoint[]): HeatmapStats => {
		if (!heatmapData.length) {
			return {
				totalPoints: 0,
				totalClicks: 0,
				maxClicks: 0,
				topCountry: 'N/A',
				topCity: 'N/A',
				avgClicksPerPoint: 0,
				coveragePercentage: 0
			};
		}

		const totalClicks = heatmapData.reduce((sum, point) => sum + point.clicks, 0);
		const maxClicks = Math.max(...heatmapData.map((point) => point.clicks));
		const countries = Array.from(new Set(heatmapData.map((point) => point.country)));
		const cities = Array.from(new Set(heatmapData.map((point) => point.city)));
		const avgClicksPerPoint = totalClicks / heatmapData.length;

		return {
			totalPoints: heatmapData.length,
			totalClicks,
			maxClicks,
			topCountry: countries[0] || 'N/A',
			topCity: cities[0] || 'N/A',
			avgClicksPerPoint,
			coveragePercentage: Math.round((countries.length / 195) * 100) // 195 países no mundo
		};
	}, []);

	/**
	 * Determina o endpoint correto (apenas link específico)
	 */
	const getEndpoint = useCallback(
		(isRealtime = false): string => {
			// Analytics global removido - apenas link específico
			if (!linkId) {
				return ''; // Endpoint vazio se não há linkId
			}
			const baseUrl = `/api/analytics/link/${linkId}/heatmap`;
			return isRealtime ? `${baseUrl}/realtime` : baseUrl;
		},
		[linkId]
	);

	/**
	 * Busca dados do heatmap da API
	 */
	const fetchHeatmapData = useCallback(
		async (showLoading = false): Promise<HeatmapPoint[]> => {
			// Validação inicial
			if (!linkId) {
				return [];
			}

			// Cancelar requisição anterior se existir
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Criar novo AbortController para esta requisição
			const abortController = new AbortController();
			abortControllerRef.current = abortController;

			try {
				if (showLoading) {
					setLoading(true);
					setError(null);
				}

				let heatmapData: HeatmapPoint[] = [];

				try {
					// Tentar endpoint protegido primeiro
					const endpoint = getEndpoint(false);

					// Analytics global removido - retornar vazio se não há endpoint
					if (!endpoint) {
						return [];
					}

					const response = await api.get<HeatmapApiResponse>(endpoint);

					// Verificar se a requisição foi cancelada
					if (abortController.signal.aborted) {
						return [];
					}

					if (response.success && Array.isArray(response.data)) {
						heatmapData = response.data;
					} else {
						throw new Error('Formato de resposta inválido');
					}
				} catch (authError) {
					// Verificar se foi cancelamento
					if (abortController.signal.aborted) {
						return [];
					}

					// Fallback para endpoint público em tempo real
					try {
						const realtimeEndpoint = getEndpoint(true);
						const realtimeUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${realtimeEndpoint}`;

						const realtimeResponse = await fetch(realtimeUrl, {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/json'
							}
						});

						if (!realtimeResponse.ok) {
							throw new Error(`HTTP ${realtimeResponse.status}: ${realtimeResponse.statusText}`);
						}

						const realtimeData: HeatmapApiResponse = await realtimeResponse.json();

						if (realtimeData.success && Array.isArray(realtimeData.data)) {
							heatmapData = realtimeData.data;
						}
					} catch (realtimeError) {
						// Se ambos falharem, usar dados vazios
						heatmapData = [];
					}
				}

				// Verificar se a requisição foi cancelada antes de processar
				if (abortController.signal.aborted) {
					return [];
				}

				// Filtrar por cliques mínimos
				const filteredData = heatmapData.filter((point) => point.clicks >= minClicks);

				// Verificar novamente se não foi cancelada
				if (abortController.signal.aborted) {
					return [];
				}

				// Atualizar estado (sem verificar mountedRef - deixar React gerenciar)
				setData(filteredData);
				setStats(calculateStats(filteredData));
				setLastUpdate(new Date());

				return filteredData;
			} catch (err) {
				// Verificar se foi cancelamento (não é erro real)
				if (abortController.signal.aborted) {
					return [];
				}

				const errorMessage =
					err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados do heatmap';

				setError(errorMessage);
				setData([]);
				setStats(calculateStats([]));

				return [];
			} finally {
				// Sempre definir loading como false no final (se não foi cancelado)
				if (!abortController.signal.aborted && showLoading) {
					setLoading(false);
				}
			}
		},
		[linkId, minClicks, calculateStats, getEndpoint]
	);

	/**
	 * Função para atualização manual dos dados
	 */
	const refresh = useCallback(() => {
		fetchHeatmapData(true);
	}, []); // Removido fetchHeatmapData das dependências

	/**
	 * Configurar busca inicial e polling para tempo real
	 */
	useEffect(() => {
		// Validar se deve executar
		if (!enableRealtime || !linkId) {
			return;
		}

		// Buscar dados iniciais
		fetchHeatmapData(true);

		// Configurar polling se habilitado
		if (refreshInterval > 0) {
			intervalRef.current = setInterval(() => {
				fetchHeatmapData(false); // Não mostrar loading nas atualizações automáticas
			}, refreshInterval);
		}

		// Cleanup do interval
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [linkId, enableRealtime, refreshInterval]); // Removido fetchHeatmapData das dependências

	/**
	 * Cleanup no unmount do componente
	 */
	useEffect(() => {
		return () => {
			// Cancelar requisições pendentes
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Limpar interval
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return {
		data,
		stats,
		loading,
		error,
		lastUpdate,
		refresh
	};
}

export default useHeatmapData;
