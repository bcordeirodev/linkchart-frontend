"use client";

import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type {
  GeographicData,
  GeographicMeta,
  GeographicResponse,
} from "@/types/analytics/geographic";

/** Summary stats derived from `GeographicMeta` (country/state/city counts plus a coarse coverage ratio). */
export interface GeographicStats {
  totalCountries: number;
  totalStates: number;
  totalCities: number;
  totalClicks: number;
  maxClicks: number;
  totalLocations: number;
  /** Share of the ~195 recognised countries reached, capped at 100. */
  coveragePercentage: number;
  /** ISO 8601 timestamp of the most recent click, or `null` when there are no clicks. */
  lastUpdate: string | null;
  /** True when the heatmap hit the 500-row server-side cap. */
  heatmapCapped: boolean;
  /** Total distinct location groups before the cap was applied. */
  totalLocationsAvailable: number;
}

/** Input options accepted by `useGeographicData`. */
export interface UseGeographicDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period. */
  dateTo?: string | null;
  /** When true, adds `exclude_bots=true` to the request. */
  excludeBots?: boolean;
  /** Filters results to a specific continent code (e.g. `"EU"`, `"NA"`). */
  continent?: string | null;
}

/** Return shape of `useGeographicData`. */
export interface UseGeographicDataReturn {
  data: GeographicData | null;
  meta: GeographicMeta | null;
  stats: GeographicStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

/**
 * Maps `GeographicMeta` (counters returned alongside `data` in the
 * `{ data, meta }` envelope) into the `GeographicStats` shape the UI renders.
 * Computes `coveragePercentage` as `unique_countries / 195`, capped at 100.
 *
 * @param meta - Raw geographic metadata from the API response envelope.
 * @returns Derived stats object consumed by geographic UI components.
 */
function calculateStats(meta: GeographicMeta): GeographicStats {
  return {
    totalCountries: meta.unique_countries,
    totalStates: meta.unique_states,
    totalCities: meta.unique_cities,
    totalClicks: meta.total_clicks,
    maxClicks: meta.max_clicks,
    totalLocations: meta.total_locations,
    coveragePercentage:
      meta.unique_countries > 0
        ? Math.min((meta.unique_countries / 195) * 100, 100)
        : 0,
    lastUpdate: meta.last_updated ?? null,
    heatmapCapped: meta.heatmap_capped ?? false,
    totalLocationsAvailable:
      meta.total_locations_available ?? meta.total_locations,
  };
}

/**
 * Fetches geographic analytics (top countries/states/cities + heatmap) for a link.
 *
 * @param options.linkId - canonical link id; the query stays disabled when falsy
 * @param options.refreshInterval - polling interval in ms when realtime is on (default `30000`)
 * @param options.enableRealtime - when true, refetches every `refreshInterval` ms (default `false`)
 * @param options.dateFrom - ISO date string (yyyy-MM-dd) for the start of the period
 * @param options.dateTo - ISO date string (yyyy-MM-dd) for the end of the period
 * @param options.excludeBots - when true, adds `exclude_bots=true` to the request
 * @param options.continent - continent code to filter results (e.g. `"EU"`, `"NA"`)
 * @returns `{ data: GeographicData | null, meta, stats, loading, error, refresh, isRealtime }`
 *
 * @remarks
 * Cache key: `queryKeys.analytics.geographic(linkId, filters)` — see `AnalyticsQueryFilters`.
 * Endpoint: `GET /api/analytics/link/{id}/geographic[?date_from=…&date_to=…&exclude_bots=true&continent=…]` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC`).
 * Uses `rawEnvelope: true` because this endpoint returns `{ data, meta }` and the consumer needs both halves.
 * Returned `GeographicData` shape is defined in `src/types/analytics/geographic.ts`.
 */
export function useGeographicData({
  linkId,
  refreshInterval = 30000,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  continent,
}: UseGeographicDataOptions): UseGeographicDataReturn {
  const {
    data: raw,
    isLoading,
    isPlaceholderData,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.analytics.geographic(linkId, {
      dateFrom,
      dateTo,
      excludeBots,
      continent,
    }),
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      if (excludeBots) params.set("exclude_bots", "true");
      if (continent) params.set("continent", continent);
      const qs = params.toString();
      return api.get<GeographicResponse>(
        `${API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC(linkId)}${qs ? `?${qs}` : ""}`,
        { rawEnvelope: true },
      );
    },
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
    // Keeps the previous dataset visible while a filter-change fetch is in flight so
    // AnalyticsStateManager never goes into its loading state between filter changes.
    //
    // Why both flags together matter:
    //   • `placeholderData: keepPreviousData` → `data` stays non-null during the new
    //     fetch, so `hasData` passed to AnalyticsStateManager stays true.
    //   • `isLoading && !isPlaceholderData` → `loading` is false when placeholder data
    //     is present (filter transition) but true on the very first load (no data at all).
    //     Without this second condition, TanStack v5 still reports `isLoading=true` for
    //     the new queryKey even while serving placeholder data, which is enough to trigger
    //     the AnalyticsStateManager loading state and unmount the sub-tabs.
    placeholderData: keepPreviousData,
  });

  const data = useMemo<GeographicData | null>(() => raw?.data ?? null, [raw]);

  const meta = raw?.meta ?? null;
  const stats = useMemo(() => (meta ? calculateStats(meta) : null), [meta]);

  return {
    data,
    meta,
    stats,
    // True only on the very first load (no data at all).
    // False during filter transitions so the active sub-tab is preserved.
    loading: isLoading && !isPlaceholderData,
    error: error ? (error as Error).message : null,
    refresh: refetch,
    isRealtime: enableRealtime,
  };
}

export default useGeographicData;
