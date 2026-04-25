/**
 * 🔄 DATA MAPPERS - Utilitários de Mapeamento de Dados
 *
 * @description
 * Funções utilitárias para mapear dados do backend para o formato
 * esperado pelos componentes do frontend, evitando duplicação.
 */

import type { DashboardData } from '@/types/analytics/dashboard';

interface LinkInput {
	id: number;
	title: string;
	short_url?: string;
	original_url?: string;
	clicks: number;
	is_active: boolean;
}

/**
 * Mapeia dados de links para o formato esperado pelo TopLinks
 */
export function mapLinksDataToTopLinks(links: LinkInput[]) {
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
export function validateDashboardData(data: unknown): boolean {
	if (!data || typeof data !== 'object') {
		return false;
	}

	const dashData = data as Partial<DashboardData>;

	return !!(dashData.summary || dashData.temporal_data || dashData.geographic_data || dashData.audience_data);
}
