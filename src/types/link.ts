declare global {
	interface ILinkCreate {
		original_url: string;
		title?: string;
		slug?: string;
		description?: string;
		expires_at?: string;
		starts_in?: string;
		is_active?: boolean;
		click_limit?: number;
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	}

	interface ILinkUpdate {
		original_url?: string;
		title?: string;
		slug?: string;
		description?: string;
		expires_at?: string;
		starts_in?: string;
		is_active?: boolean;
		click_limit?: number;
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	}

	interface ILinkResponse {
		id: number;
		user_id: number;
		slug: string;
		title?: string;
		description?: string;
		expires_at: string | null;
		is_active: boolean;
		created_at: string;
		updated_at: string;
		starts_in: string | null;
		is_expired: boolean;
		is_active_valid: boolean;
		original_url: string;
		clicks: number;
		click_limit?: number;
		shorted_url: string;
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	}
}

export {};
