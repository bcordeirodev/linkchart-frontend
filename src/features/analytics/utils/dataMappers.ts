/**
 * 🔄 DATA MAPPERS - Utilitários de Mapeamento de Dados
 *
 * @description
 * Funções utilitárias para mapear dados do backend para o formato
 * esperado pelos componentes do frontend, evitando duplicação.
 */

import type { DashboardData } from '../hooks/useDashboardData';

/**
 * Mapeia dados do dashboard para o formato esperado pelos Charts
 */
export function mapDashboardDataToCharts(data: DashboardData) {
	return {
		has_data: true,
		overview: {
			total_clicks: data?.summary?.total_clicks || 0,
			unique_visitors: data?.summary?.unique_visitors || 0,
			avg_daily_clicks: 0,
			conversion_rate: 0,
			countries_reached: data?.summary?.countries_reached || 0
		},
		temporal: {
			clicks_by_hour: data?.temporal_data?.clicks_by_hour || [],
			clicks_by_day_of_week: data?.temporal_data?.clicks_by_day_of_week || []
		},
		geographic: {
			top_countries: (data?.geographic_data?.top_countries || []).map((country) => ({
				...country,
				iso_code: (country as any).iso_code || country.country?.substring(0, 2).toUpperCase() || 'XX',
				currency: (country as any).currency || 'USD'
			})),
			top_states: [],
			top_cities: (data?.geographic_data?.top_cities || []).map((city) => ({
				...city,
				state: 'Unknown',
				country: 'Unknown'
			})),
			heatmap_data: []
		},
		audience: {
			device_breakdown: data?.audience_data?.device_breakdown || []
		},
		insights: []
	};
}

/**
 * Mapeia dados de links para o formato esperado pelo TopLinks
 */
export function mapLinksDataToTopLinks(links: any[]) {
	return (links || []).map((link) => ({
		id: link.id,
		title: link.title,
		slug: link.short_url || `link-${link.id}`,
		original_url: link.original_url || '',
		shorted_url: link.short_url,
		clicks: link.clicks,
		is_active: link.is_active
	}));
}

/**
 * Utilitário para criar dados de fallback seguros
 */
export function createSafeFallback<T>(data: T | null | undefined, fallback: T): T {
	return data ?? fallback;
}

/**
 * Valida se os dados têm estrutura mínima necessária
 */
export function validateDashboardData(data: any): boolean {
	return !!(
		data &&
		typeof data === 'object' &&
		(data.summary || data.temporal_data || data.geographic_data || data.audience_data)
	);
}
