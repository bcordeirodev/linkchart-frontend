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
 * One point of the daily series for the ACTIVE window.
 *
 * @remarks Endpoint: `GET /api/reports/timeseries` (campo `series`).
 */
export interface TimeseriesPoint {
  /** Calendar date in `YYYY-MM-DD` format. */
  date: string;
  /** Clicks recorded on that date (0 when none — the backend zero-fills). */
  clicks: number;
  /** Distinct visitors (by IP) on that date. */
  unique_visitors: number;
}

/**
 * One point of the PREVIOUS window's daily series — the dashed overlay in
 * the overview chart. Aligned by index with {@link TimeseriesPoint} entries
 * (both zero-filled to the same length by the backend).
 */
export interface PreviousTimeseriesPoint {
  /** Calendar date in `YYYY-MM-DD` format (belongs to the previous window). */
  date: string;
  clicks: number;
}

/**
 * Full timeseries payload: active window series + previous window overlay.
 *
 * @remarks Endpoint: `GET /api/reports/timeseries`.
 */
export interface ReportsTimeseries {
  series: TimeseriesPoint[];
  previous: PreviousTimeseriesPoint[];
}

/**
 * Dimensions accepted by `GET /api/reports/breakdown?dimension=`.
 * Must stay in sync with the backend whitelist in `ReportsAnalyticsService::DIMENSIONS`.
 */
export type ReportsBreakdownDimension =
  | "country"
  | "city"
  | "device"
  | "os"
  | "browser"
  | "social_platform"
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
 * `Period` type in `useAnalyticsFilters`, Reports only offers 7/30/90 days
 * plus `"custom"` — since it's a periodic-review page, not a live-incident
 * one.
 */
export type ReportsPeriod = "7d" | "30d" | "90d" | "custom";

/**
 * Custom date range picked by the user when `ReportsPeriod` is `"custom"` —
 * plain `yyyy-MM-dd` strings straight from the native date inputs.
 */
export interface ReportsCustomRange {
  from: string | null;
  to: string | null;
}

/**
 * One row of the portfolio leaderboard — a link ranked by clicks, with its
 * trend vs. the previous period of equal length and its share of the user's
 * total clicks. Answers a portfolio-level question per-link analytics can't:
 * which of my links is trending, and how much of my traffic does each one
 * represent?
 *
 * @remarks Endpoint: `GET /api/reports/link-performance`.
 */
export interface LinkPerformanceRow {
  link_id: number;
  /** User-facing title; `null` when the link has none set. */
  title: string | null;
  slug: string;
  /** Custom short domain, or `null` when the link uses the default domain. */
  short_domain: string | null;
  /** Clicks in the selected period. */
  clicks: number;
  /**
   * Percentage change vs. the immediately preceding period of equal length.
   * `null` when that previous period had zero clicks for this link — there
   * is no meaningful baseline to compare against.
   */
  variation_pct: number | null;
  /**
   * This link's share of the user's TOTAL clicks in the period (0-100, one
   * decimal) — not just among the returned rows.
   */
  share_pct: number;
  /**
   * Daily clicks for this link across the window — one entry per calendar
   * day, zero-filled, same length for every row. Powers the row sparkline.
   */
  spark: number[];
}

/**
 * Machine-readable identifier for one portfolio insight. Frontend-only —
 * used to map each `ReportsInsight.key` to a localized label + icon in
 * `InsightsPanel`. Must stay in sync with the keys
 * `ReportsAnalyticsService::getInsights()` returns.
 */
export type ReportsInsightKey =
  | "best_performing_link"
  | "fastest_growing_link"
  | "top3_concentration"
  | "account_growth";

/**
 * One computed, account-wide business insight for the `/reports` page.
 *
 * The server sends raw, language-agnostic values only — no sentences —
 * `InsightsPanel` maps `key` to a localized label + icon and formats `value`
 * (appending `unit` when present). `meta` carries insight-specific extra data
 * that doesn't fit the generic `value`/`unit` shape (e.g. the supporting
 * click count for `best_performing_link`).
 *
 * @remarks Endpoint: `GET /api/reports/insights`.
 */
export interface ReportsInsight {
  key: ReportsInsightKey;
  /**
   * The headline value — a link name for the two link-identifying insights,
   * a number for the two percentage ones. `null` when the insight cannot be
   * computed (e.g. no clicks in the period, or no comparable baseline).
   */
  value: string | number | null;
  /** Unit suffix for numeric values (currently always `"%"` or `null`). */
  unit: string | null;
  /** Insight-specific supporting data (e.g. `{ clicks, slug, link_id }`), or `null`. */
  meta: Record<string, unknown> | null;
}
