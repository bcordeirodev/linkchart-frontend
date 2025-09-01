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
	title?: string;
	description?: string;
	tags?: string[];
	expires_at?: string;
	is_active?: boolean;
}

export interface LinkResponse {
	id: string;
	original_url: string;
	short_url: string;
	slug?: string;
	custom_slug?: string;
	title?: string;
	description?: string;
	tags?: string[];
	clicks: number;
	is_active: boolean;
	expires_at?: string | null;
	created_at: string;
	updated_at: string;
	user_id: string;
	shorted_url?: string;
	starts_in?: string | null;
	is_expired?: boolean;
	is_active_valid?: boolean;
}
