import { API_CONFIG } from "@/lib/api/endpoints";

import { BaseService } from "@/services/base.service";

import type {
  BreakdownRow,
  ReportsBreakdownDimension,
  ReportsFilters,
  ReportsSummary,
  TimeseriesPoint,
  TopLinkRow,
} from "@/features/reports/types";

/**
 * Builds the `date_from`/`date_to`/`exclude_bots` query string shared by every
 * `/api/reports/*` endpoint from the camelCase {@link ReportsFilters} shape.
 *
 * @param filters - shared date range + exclude-bots filter.
 * @param extra - endpoint-specific params (e.g. `limit`, `dimension`).
 * @returns a URL-encoded query string, without the leading `?`.
 */
function buildReportsQuery(
  filters: ReportsFilters,
  extra?: Record<string, string | number>,
): string {
  const params = new URLSearchParams();

  if (filters.dateFrom) {
    params.set("date_from", filters.dateFrom);
  }
  if (filters.dateTo) {
    params.set("date_to", filters.dateTo);
  }
  if (filters.excludeBots) {
    params.set("exclude_bots", "true");
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

/**
 * Appends a query string to an endpoint path, omitting the `?` entirely when
 * there are no params (keeps cache keys / logs free of a trailing `?`).
 */
function withQuery(endpoint: string, qs: string): string {
  return qs ? `${endpoint}?${qs}` : endpoint;
}

/**
 * REST client for the aggregated, multi-link `/api/reports/*` endpoints that
 * power the `/reports` page.
 *
 * Unlike `LinkService`'s per-link analytics, every method here is scoped to
 * *all* of the authenticated user's non-demo links server-side — the frontend
 * only ever forwards the shared date/bot filters. Wraps `BaseService` and
 * inherits envelope unwrap (`{data}` -> `T`) and cookie-based auth from `ApiClient`.
 */
export default class ReportsService extends BaseService {
  constructor() {
    super("ReportsService");
  }

  /**
   * Aggregated KPIs (total clicks, unique visitors, active links, ...) for the
   * selected period.
   *
   * @param filters - shared date range + exclude-bots filter.
   * @endpoint `GET /api/reports/summary`
   */
  async getSummary(filters: ReportsFilters): Promise<ReportsSummary> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.REPORTS.SUMMARY,
      buildReportsQuery(filters),
    );

    return this.get<ReportsSummary>(endpoint, {
      context: "reports_summary",
    });
  }

  /**
   * Daily click counts across all of the user's links in the selected period.
   *
   * @param filters - shared date range + exclude-bots filter.
   * @endpoint `GET /api/reports/timeseries`
   */
  async getTimeseries(filters: ReportsFilters): Promise<TimeseriesPoint[]> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.REPORTS.TIMESERIES,
      buildReportsQuery(filters),
    );

    return this.get<TimeseriesPoint[]>(endpoint, {
      context: "reports_timeseries",
    });
  }

  /**
   * The user's most-clicked links in the selected period, ranked descending.
   *
   * @param filters - shared date range + exclude-bots filter.
   * @param limit - max rows to return (default `10`; backend caps at 50).
   * @endpoint `GET /api/reports/top-links?limit=`
   */
  async getTopLinks(
    filters: ReportsFilters,
    limit = 10,
  ): Promise<TopLinkRow[]> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.REPORTS.TOP_LINKS,
      buildReportsQuery(filters, { limit }),
    );

    return this.get<TopLinkRow[]>(endpoint, {
      context: "reports_top_links",
    });
  }

  /**
   * Click distribution across one dimension (country, device, browser,
   * navigation context or quality tier) in the selected period.
   *
   * @param dimension - which column to group by.
   * @param filters - shared date range + exclude-bots filter.
   * @endpoint `GET /api/reports/breakdown?dimension=`
   */
  async getBreakdown(
    dimension: ReportsBreakdownDimension,
    filters: ReportsFilters,
  ): Promise<BreakdownRow[]> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.REPORTS.BREAKDOWN,
      buildReportsQuery(filters, { dimension }),
    );

    return this.get<BreakdownRow[]>(endpoint, {
      context: "reports_breakdown",
    });
  }

  /**
   * Downloads the click-level CSV export for the selected period as a file
   * (triggers the browser's native save/download UI).
   *
   * Uses a manual `fetch` instead of `BaseService`/`ApiClient` because the
   * response is a `text/csv` stream, not the `{data}` JSON envelope
   * `ApiClient` unwraps. Auth travels via the httpOnly `auth_token` cookie
   * (`credentials: "include"`) — this app has no JS-readable token in
   * `localStorage` anymore (see `src/lib/auth/AuthContext.tsx`).
   *
   * @param filters - shared date range + exclude-bots filter.
   * @throws when the response is not `ok` (e.g. 401 if the session expired).
   * @endpoint `GET /api/reports/export/clicks`
   */
  async downloadClicksCsv(filters: ReportsFilters): Promise<void> {
    const endpoint = withQuery(
      API_CONFIG.ENDPOINTS.REPORTS.EXPORT_CLICKS,
      buildReportsQuery(filters),
    );

    const response = await fetch(endpoint, { credentials: "include" });

    if (!response.ok) {
      throw new Error(`Export falhou: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio-cliques.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}

/** Singleton instance — mirrors the `linkService`/`profileService` pattern. */
export const reportsService = new ReportsService();
