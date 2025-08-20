import { useState, useEffect, useCallback } from 'react';
import { linkService, analyticsService } from '@/services';

interface LinkAnalyticsData {
	clicks_over_time: { date: string; clicks: number }[];
	clicks_by_country: { country: string; clicks: number }[];
	clicks_by_device: { device: string; clicks: number }[];
	clicks_by_referer: { referer: string; clicks: number }[];
	total_clicks: number;
	unique_visitors: number;
	conversion_rate: number;
}

interface UseLinkAnalyticsReturn {
	linkData: ILinkResponse | null;
	analyticsData: LinkAnalyticsData | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Hook para dados de um link específico e seus analytics
 * Gerencia carregamento dos dados do link e métricas
 * Implementa fallback robusto para diferentes cenários
 */
export function useLinkAnalytics(id: string): UseLinkAnalyticsReturn {
	const [linkData, setLinkData] = useState<ILinkResponse | null>(null);
	const [analyticsData, setAnalyticsData] = useState<LinkAnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Buscar dados do link usando o service centralizado
			const linkResponse = await linkService.findOne(id);
			setLinkData(linkResponse.data);

			// Buscar analytics específicos do link usando o service centralizado
			const analyticsResponse = await analyticsService.getLinkAnalytics(id);

			// Converter estrutura para o formato esperado
			setAnalyticsData({
				clicks_over_time: analyticsResponse.temporal?.clicks_by_hour?.map((hour: any) => ({
					date: hour.label || hour.date,
					clicks: hour.clicks
				})) || [],
				clicks_by_country: analyticsResponse.geographic?.top_countries?.map((country: any) => ({
					country: country.country,
					clicks: country.clicks
				})) || [],
				clicks_by_device: analyticsResponse.audience?.device_breakdown?.map((device: any) => ({
					device: device.device,
					clicks: device.clicks
				})) || [],
				clicks_by_referer: [],
				total_clicks: analyticsResponse.overview?.total_clicks || 0,
				unique_visitors: analyticsResponse.overview?.unique_visitors || 0,
				conversion_rate: 0
			});
		} catch (err) {
			setError('Erro ao carregar dados do link');
		} finally {
			setLoading(false);
		}
	}, [id]);

	const refetch = useCallback(async () => {
		await fetchData();
	}, [fetchData]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		linkData,
		analyticsData,
		loading,
		error,
		refetch
	};
}

export default useLinkAnalytics;
