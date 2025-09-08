/**
 * Links API Types
 */

export interface LinkCreateRequest {
	original_url: string;
	custom_slug?: string;
	title?: string;
	description?: string;
	tags?: string[];
	expires_at?: string;
}

export interface LinkUpdateRequest {
	// Campos principais
	original_url?: string;
	title?: string;
	slug?: string;
	description?: string;
	is_active?: boolean;

	// Datas
	expires_at?: string | null;
	starts_in?: string | null;

	// Limites
	click_limit?: number | null;

	// UTM
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;

	// Tags (compatibilidade)
	tags?: string[];
}
