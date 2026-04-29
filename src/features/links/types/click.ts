/**
 * 🖱️ TIPOS DE CLIQUES (LISTAGEM)
 *
 * Estrutura paginada retornada por GET /api/link/{id}/clicks-list,
 * usada na tab "Cliques" da página de analytics individual.
 */

export interface LinkClickUtm {
	source: string | null;
	medium: string | null;
	campaign: string | null;
	term: string | null;
	content: string | null;
}

export interface LinkClickItem {
	id: number;
	created_at: string | null;
	local_time: string | null;
	ip: string | null;
	country: string | null;
	iso_code: string | null;
	state: string | null;
	state_name: string | null;
	city: string | null;
	continent: string | null;
	timezone: string | null;
	device: string | null;
	browser: string | null;
	browser_version: string | null;
	os: string | null;
	os_version: string | null;
	is_mobile: boolean;
	is_tablet: boolean;
	is_desktop: boolean;
	is_bot: boolean;
	referer: string | null;
	referer_host: string | null;
	click_source: string | null;
	is_return_visitor: boolean;
	response_time: number | null;
	utm: LinkClickUtm | null;
}

export interface LinkClicksMeta {
	total: number;
	per_page: number;
	current_page: number;
	last_page: number;
	from: number | null;
	to: number | null;
	sort_by: string;
	sort_dir: 'asc' | 'desc';
	search: string;
}

export interface LinkClicksListResponse {
	data: LinkClickItem[];
	meta: LinkClicksMeta;
}

export interface LinkClicksListParams {
	page?: number;
	per_page?: number;
	search?: string;
	sort_by?: string;
	sort_dir?: 'asc' | 'desc';
}
