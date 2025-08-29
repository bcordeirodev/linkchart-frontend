/**
 * 🔗 TIPOS DE LINKS
 * Re-exporta tipos de API e adiciona tipos específicos de links
 * Mantém compatibilidade com interfaces globais existentes
 */

import { LinkCreateRequest, LinkUpdateRequest, LinkResponse } from './api';

// ========================================
// 🔗 LINK TYPES (Re-exports from API)
// ========================================

export type { LinkCreateRequest, LinkUpdateRequest, LinkResponse } from './api';

// ========================================
// 🌍 GLOBAL INTERFACES (Manter compatibilidade)
// ========================================

declare global {
	// Mantidas para compatibilidade durante transição
	interface ILinkCreate extends LinkCreateRequest { }
	interface ILinkUpdate extends LinkUpdateRequest { }
	interface ILinkResponse extends LinkResponse { }
}

// ========================================
// 🎯 LINK-SPECIFIC TYPES
// ========================================

export interface LinkStats {
	total_clicks: number;
	unique_visitors: number;
	conversion_rate: number;
	avg_daily_clicks: number;
	last_click_at: string | null;
}

export interface LinkAnalytics {
	link: LinkResponse;
	stats: LinkStats;
	geographic_data: {
		country: string;
		clicks: number;
		percentage: number;
	}[];
	device_data: {
		device: string;
		clicks: number;
		percentage: number;
	}[];
	referrer_data: {
		referrer: string;
		clicks: number;
		percentage: number;
	}[];
}

export interface LinkFilters {
	search?: string;
	status?: 'all' | 'active' | 'inactive' | 'expired';
	date_range?: {
		start: string;
		end: string;
	};
	sort_by?: 'created_at' | 'updated_at' | 'clicks' | 'title';
	sort_order?: 'asc' | 'desc';
}

export interface LinkBulkAction {
	action: 'activate' | 'deactivate' | 'delete';
	link_ids: number[];
}

export { };
