/**
 * Types for the `/reports` module — aggregated (multi-link) analytics for the
 * authenticated user, as opposed to the per-link types in `@/types/analytics`.
 *
 * Mirrors the backend `ReportsAnalyticsServiceInterface` contract 1:1 (see
 * `backend/app/Contracts/Analytics/ReportsAnalyticsServiceInterface.php` and
 * `ReportsController`) — every field here is unwrapped straight from the
 * `{data: ...}` envelope by `ApiClient`.
 */

/**
 * Aggregated KPIs for all of the authenticated user's (non-demo) links in the
 * selected period.
 *
 * @remarks Endpoint: `GET /api/reports/summary`.
 */
export interface ReportsSummary {
  /** Total clicks across all owned links in the period. */
  total_clicks: number;
  /** Distinct visitors (by IP) across all owned links in the period. */
  unique_visitors: number;
  /** Total non-demo links owned by the user (not period-scoped). */
  total_links: number;
  /** Subset of `total_links` currently active. */
  active_links: number;
  /** `total_clicks` divided by the number of days in the period. */
  avg_clicks_per_day: number;
  /**
   * Percentage variation vs. the immediately preceding period of equal
   * duration. `null` when there is no prior period to compare against — the
   * UI should render "—" instead of a signed percentage.
   */
  variation_pct: number | null;
}

/**
 * One point of the daily clicks timeseries.
 *
 * @remarks Endpoint: `GET /api/reports/timeseries`.
 */
export interface TimeseriesPoint {
  /** Calendar date in `YYYY-MM-DD` format. */
  date: string;
  /** Clicks recorded on that date. */
  clicks: number;
}

/**
 * One row of the top-links ranking.
 *
 * @remarks Endpoint: `GET /api/reports/top-links`.
 */
export interface TopLinkRow {
  link_id: number;
  /** User-facing title; `null` when the link has none set. */
  title: string | null;
  slug: string;
  /** Custom short domain, or `null` when the link uses the default domain. */
  short_domain: string | null;
  clicks: number;
  unique_visitors: number;
}

/**
 * Dimensions accepted by `GET /api/reports/breakdown?dimension=`.
 * Must stay in sync with the backend whitelist in `ReportsAnalyticsService::DIMENSIONS`.
 */
export type ReportsBreakdownDimension =
  | "country"
  | "device"
  | "browser"
  | "navigation_context"
  | "quality_tier";

/**
 * One row of a dimension breakdown (country/device/browser/...).
 *
 * @remarks Endpoint: `GET /api/reports/breakdown`.
 */
export interface BreakdownRow {
  /** Raw value of the grouped column (e.g. `"BR"`, `"mobile"`, `"Chrome"`). */
  label: string;
  clicks: number;
  /** Share of `clicks` over the sum of all returned rows, 0–100, one decimal. */
  pct: number;
}

/**
 * Shared date-range + bot-exclusion filter accepted by every `/api/reports/*`
 * endpoint. camelCase on the frontend; `reportsService` converts to the
 * `date_from`/`date_to`/`exclude_bots` query params the backend expects.
 */
export interface ReportsFilters {
  /** Datetime string (`yyyy-MM-dd HH:mm:ss`) — lower bound, inclusive. */
  dateFrom?: string | null;
  /** Datetime string (`yyyy-MM-dd HH:mm:ss`) — upper bound, inclusive. */
  dateTo?: string | null;
  /** When true, excludes bot clicks from every aggregation. */
  excludeBots?: boolean;
}

/**
 * Period presets offered by `ReportsDateFilter`. Unlike the per-link
 * `Period` type in `useAnalyticsFilters`, Reports only offers 7/30/90 days —
 * no `1h`/`24h`/`all`/`custom` — since it's a periodic-review page, not a
 * live-incident one.
 */
export type ReportsPeriod = "7d" | "30d" | "90d";
