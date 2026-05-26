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
  /** Social platform detected at click time (e.g. 'instagram', 'tiktok'). NULL for clicks recorded before May 2026. */
  social_platform: string | null;
  navigation_context: string | null;
  is_return_visitor: boolean;
  response_time: number | null;
  /** Quality classification assigned by Phase 3 scoring ('organic' | 'suspicious' | 'likely_fraud'). NULL for clicks recorded before quality scoring was implemented. */
  quality_tier: "organic" | "suspicious" | "likely_fraud" | null;
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
  sort_dir: "asc" | "desc";
  search: string;
  date_from: string | null;
  date_to: string | null;
  exclude_bots: boolean;
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
  sort_dir?: "asc" | "desc";
  /** ISO datetime string — filters clicks with `created_at >= date_from`. */
  date_from?: string | null;
  /** ISO datetime string — filters clicks with `created_at <= date_to`. */
  date_to?: string | null;
  /** When true, excludes bot clicks from the result. */
  exclude_bots?: boolean;
}
