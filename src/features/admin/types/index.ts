/**
 * Tipos do módulo admin — espelham os payloads de /api/admin/* (backend
 * AdminStatsServiceInterface). Qualquer mudança de shape começa lá.
 */

/** Janela aceita pelos endpoints janelados do admin. */
export type AdminRange = "7d" | "30d" | "90d";

/** Um ponto de série diária (bucket em America/Sao_Paulo). */
export interface AdminSeriesPoint {
  date: string;
  value: number;
}

/** Par janela atual/anterior com variação percentual (null sem baseline). */
export interface AdminPeriodComparison {
  current: number;
  previous: number;
  variation_pct: number | null;
}

/** Payload de GET /api/admin/overview. */
export interface AdminOverview {
  totals: { users: number; links: number; clicks: number };
  period: {
    signups: AdminPeriodComparison;
    links: AdminPeriodComparison;
    clicks: AdminPeriodComparison;
  };
  series: {
    signups: AdminSeriesPoint[];
    links: AdminSeriesPoint[];
    clicks: AdminSeriesPoint[];
  };
}

/** Linha da listagem de usuários do admin. */
export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  created_at: string;
  last_login_at: string | null;
  links_count: number;
  total_clicks: number;
}

/** Parâmetros server-side da listagem de usuários. */
export interface AdminUsersParams {
  page: number;
  perPage: number;
  q?: string;
  sort: "created_at" | "last_login_at" | "name" | "links" | "clicks";
  order: "asc" | "desc";
}

/** Payload de GET /api/admin/users. */
export interface AdminUsersPage {
  items: AdminUserRow[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

/** Payload de GET /api/admin/engagement. */
export interface AdminEngagement {
  activation_pct: number | null;
  week1_return_pct: number | null;
  links_distribution: Array<{ bucket: string; users: number }>;
  wau: number;
  mau: number;
  login_tracking_since: string | null;
}

/** Payload de GET /api/admin/health. */
export interface AdminHealth {
  queue_depth: number | null;
  failed_jobs_24h: number;
  failed_jobs_7d: number;
  links: { active: number; inactive: number; broken: number };
  quality_tiers_7d: Array<{ tier: string; clicks: number; pct: number }>;
}
