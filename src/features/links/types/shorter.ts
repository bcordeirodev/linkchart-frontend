/**
 * 🔗 TIPOS DO ENCURTADOR
 * Tipos específicos para o sistema de encurtamento de URLs
 */

// ========================================
// 🔗 SHORTENER TYPES
// ========================================

export interface IShortUrl {
	slug: string;
	short_url: string;
	original_url: string;
	expires_at: string | null;
}

export interface ShortenRequest {
	url: string;
	custom_slug?: string;
	expires_at?: string;
}

export interface ShortenResponse {
	success: boolean;
	data: {
		original_url: string;
		short_url: string;
		slug: string;
		expires_at: string | null;
		qr_code?: string;
	};
	message?: string;
}

export interface URLValidationResult {
	isValid: boolean;
	error?: string;
	suggestions?: string[];
}

export interface ShortenStats {
	total_shortened: number;
	active_links: number;
	total_clicks: number;
	top_domains: {
		domain: string;
		count: number;
	}[];
}
