/**
 * 📊 BASIC ANALYTICS TYPES
 * Tipos centralizados para o módulo de analytics básicos públicos
 */

export interface BasicAnalyticsData {
	total_clicks: number;
	created_at: string;
	is_active: boolean;
	short_url: string;
	has_analytics: boolean;
	charts?: {
		geographic?: {
			top_countries?: { country: string; clicks: number }[];
		};
		audience?: {
			device_breakdown?: { device: string; clicks: number }[];
		};
		temporal?: {
			clicks_by_hour?: { hour: number; clicks: number }[];
		};
	};
}

export interface BasicLinkData {
	id: number;
	slug: string;
	title: string | null;
	original_url: string;
	short_url: string;
	clicks: number;
	is_active: boolean;
	created_at: string;
	expires_at: string | null;
	is_public: boolean;
	has_analytics: boolean;
	domain: string;
}

export interface BasicAnalyticsState {
	linkData: BasicLinkData | null;
	analyticsData: BasicAnalyticsData | null;
	loading: boolean;
	error: string | null;
}

export interface BasicAnalyticsActions {
	handleCopyLink: () => Promise<void>;
	handleCreateLink: () => void;
	handleVisitLink: () => void;
}
