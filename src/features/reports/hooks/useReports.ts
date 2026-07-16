"use client";
/**
 * TanStack Query hooks for the `/reports` page — aggregated, multi-link
 * analytics for the authenticated user. Sibling to the per-link hooks in
 * `@/features/analytics/hooks` (e.g. `useDashboardData`), but every query here
 * scopes to *all* of the user's own (non-demo) links instead of a single one.
 */

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { reportsService } from "@/services/reports.service";

import type {
  BreakdownRow,
  LinkPerformanceRow,
  ReportsBreakdownDimension,
  ReportsFilters,
  ReportsInsight,
  ReportsSummary,
  ReportsTimeseries,
  TopLinkRow,
} from "@/features/reports/types";
import type { UseQueryResult } from "@tanstack/react-query";

/**
 * Aggregated KPIs (total clicks, unique visitors, active links, average per
 * day, period-over-period variation) for all of the user's links.
 *
 * @param filters - shared date range + exclude-bots filter.
 * @returns a TanStack Query result wrapping {@link ReportsSummary}.
 *
 * @remarks
 * Endpoint: `GET /api/reports/summary` (constant:
 * `API_CONFIG.ENDPOINTS.REPORTS.SUMMARY`). `staleTime` of 60s mirrors the
 * backend's own `Cache::remember` TTL for this endpoint — a refetch inside
 * that window is a cache hit on both sides.
 */
export function useReportsSummary(
  filters: ReportsFilters,
): UseQueryResult<ReportsSummary> {
  return useQuery({
    queryKey: queryKeys.reports.summary(filters),
    queryFn: () => reportsService.getSummary(filters),
    staleTime: 60_000,
  });
}

/**
 * Daily click counts across all of the user's links in the selected period —
 * powers `ReportsOverviewHero`.
 *
 * @param filters - shared date range + exclude-bots filter.
 * @returns a TanStack Query result wrapping {@link ReportsTimeseries}.
 *
 * @remarks Endpoint: `GET /api/reports/timeseries`.
 */
export function useReportsTimeseries(
  filters: ReportsFilters,
): UseQueryResult<ReportsTimeseries> {
  return useQuery({
    queryKey: queryKeys.reports.timeseries(filters),
    queryFn: () => reportsService.getTimeseries(filters),
    staleTime: 60_000,
  });
}

/**
 * The user's most-clicked links in the selected period, ranked descending —
 * powers `TopLinksTable`.
 *
 * @param filters - shared date range + exclude-bots filter.
 * @param limit - max rows to return (default `10`; backend caps at 50).
 * @returns a TanStack Query result wrapping an array of {@link TopLinkRow}.
 *
 * @remarks Endpoint: `GET /api/reports/top-links?limit=`.
 */
export function useTopLinks(
  filters: ReportsFilters,
  limit = 10,
): UseQueryResult<TopLinkRow[]> {
  return useQuery({
    queryKey: queryKeys.reports.topLinks(filters, limit),
    queryFn: () => reportsService.getTopLinks(filters, limit),
    staleTime: 60_000,
  });
}

/**
 * Click distribution across one dimension (country, device, browser,
 * navigation context or quality tier) in the selected period — powers
 * `BreakdownBars`.
 *
 * @param dimension - which column to group by.
 * @param filters - shared date range + exclude-bots filter.
 * @returns a TanStack Query result wrapping an array of {@link BreakdownRow}.
 *
 * @remarks Endpoint: `GET /api/reports/breakdown?dimension=`.
 */
export function useBreakdown(
  dimension: ReportsBreakdownDimension,
  filters: ReportsFilters,
): UseQueryResult<BreakdownRow[]> {
  return useQuery({
    queryKey: queryKeys.reports.breakdown(dimension, filters),
    queryFn: () => reportsService.getBreakdown(dimension, filters),
    staleTime: 60_000,
  });
}

/**
 * Portfolio leaderboard — the user's own links ranked by clicks in the
 * selected period, each with the variation vs. the previous period of equal
 * length and its share of total clicks — powers `LinkPerformanceTable`.
 *
 * @param filters - shared date range + exclude-bots filter.
 * @param limit - max rows to return (default `10`; backend caps at 50).
 * @returns a TanStack Query result wrapping an array of {@link LinkPerformanceRow}.
 *
 * @remarks Endpoint: `GET /api/reports/link-performance?limit=`.
 */
export function useLinkPerformance(
  filters: ReportsFilters,
  limit = 10,
): UseQueryResult<LinkPerformanceRow[]> {
  return useQuery({
    queryKey: queryKeys.reports.linkPerformance(filters, limit),
    queryFn: () => reportsService.getLinkPerformance(filters, limit),
    staleTime: 60_000,
  });
}

/**
 * Portfolio-level (account-wide) computed insights — best performing link,
 * fastest growing link, top-3 traffic concentration and overall account
 * growth vs. the previous period — powers `InsightsPanel`.
 *
 * @param filters - shared date range + exclude-bots filter.
 * @returns a TanStack Query result wrapping an array of {@link ReportsInsight}.
 *
 * @remarks Endpoint: `GET /api/reports/insights`.
 */
export function useReportsInsights(
  filters: ReportsFilters,
): UseQueryResult<ReportsInsight[]> {
  return useQuery({
    queryKey: queryKeys.reports.insights(filters),
    queryFn: () => reportsService.getInsights(filters),
    staleTime: 60_000,
  });
}
