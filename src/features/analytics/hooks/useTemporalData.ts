"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type { TemporalData } from "@/types/analytics";
import { useAnalyticsPanelActive } from "@/features/analytics/context/AnalyticsPanelActiveContext";

/** Summary stats derived from `TemporalData` (peak hour/day, hourly average, coarse trend direction). */
export interface TemporalStats {
  totalDataPoints: number;
  peakHour: string;
  peakDay: string;
  averageHourlyClicks: number;
  /** Coarse trend over the hourly series, comparing the second half against the first. */
  trendDirection: "up" | "down" | "stable";
  lastUpdate: string;
}

/** Input options accepted by `useTemporalData`. */
export interface UseTemporalDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period. */
  dateTo?: string | null;
  /** When true, adds `exclude_bots=true` to the request. */
  excludeBots?: boolean;
  /** Restricts results to a weekday/weekend/business-hours segment. */
  segment?: "all" | "weekday" | "weekend" | "business";
  /** @deprecated mantido por compatibilidade, sem efeito */
  includeAdvanced?: boolean;
}

/** Return shape of `useTemporalData`. */
export interface UseTemporalDataReturn {
  data: TemporalData | null;
  stats: TemporalStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

/**
 * Derives `TemporalStats` from `TemporalData`: peak hour/weekday by clicks,
 * the hourly average, and a coarse `up`/`down`/`stable` trend obtained by
 * comparing the average of the first vs. second half of `clicks_by_hour`
 * with a ±10% deadband.
 */
function calculateStats(temporalData: TemporalData): TemporalStats {
  const hourlyData = temporalData.clicks_by_hour || [];
  const dailyData = temporalData.clicks_by_day_of_week || [];

  const peakHourData = hourlyData.reduce(
    (prev, current) => (current.clicks > prev.clicks ? current : prev),
    hourlyData[0] || { hour: "0", clicks: 0 },
  );

  // Empty fallback rather than a day name: this hook has no translator, and a
  // hardcoded "Segunda" would surface untranslated. Consumers already treat an
  // empty `peakDay` as "no data" — and they prefer the ISO `peak_day` number,
  // which they can localize themselves (see `getWeekdayLabel`).
  const peakDayData = dailyData.reduce(
    (prev, current) => (current.clicks > prev.clicks ? current : prev),
    dailyData[0] || { day_name: "", clicks: 0 },
  );

  const totalClicks = hourlyData.reduce((sum, item) => sum + item.clicks, 0);
  const averageHourlyClicks =
    hourlyData.length > 0 ? totalClicks / hourlyData.length : 0;

  let trendDirection: "up" | "down" | "stable" = "stable";

  if (hourlyData.length >= 2) {
    const mid = Math.floor(hourlyData.length / 2);
    const firstHalf = hourlyData.slice(0, mid);
    const secondHalf = hourlyData.slice(mid);

    const firstHalfAvg =
      firstHalf.reduce((sum, item) => sum + item.clicks, 0) / firstHalf.length;
    const secondHalfAvg =
      secondHalf.reduce((sum, item) => sum + item.clicks, 0) /
      secondHalf.length;

    if (secondHalfAvg > firstHalfAvg * 1.1) trendDirection = "up";
    else if (secondHalfAvg < firstHalfAvg * 0.9) trendDirection = "down";
  }

  return {
    totalDataPoints: hourlyData.length + dailyData.length,
    peakHour: String(peakHourData.hour),
    peakDay: peakDayData.day_name,
    // Duas casas em vez de inteiro: arredondar aqui destruía qualquer média
    // sub-0.1 antes da camada de exibição (que mostra "<0.1" nesses casos —
    // refinamento visual 2026-08-08 §3.8). Só formatação; nenhum consumidor
    // faz aritmética com este campo.
    averageHourlyClicks: Math.round(averageHourlyClicks * 100) / 100,
    trendDirection,
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Fetches temporal analytics (hourly, daily, weekday breakdowns) for a link.
 *
 * @param options.linkId - canonical link id; the query stays disabled when falsy
 * @param options.refreshInterval - polling interval in ms when realtime is on (default `30000`)
 * @param options.enableRealtime - when true, refetches every `refreshInterval` ms (default `false`)
 * @param options.dateFrom - ISO date string (yyyy-MM-dd) for the start of the period
 * @param options.dateTo - ISO date string (yyyy-MM-dd) for the end of the period
 * @param options.excludeBots - when true, adds `exclude_bots=true` to the request
 * @param options.segment - restricts data to weekday/weekend/business-hours subset
 * @returns `{ data: TemporalData | null, stats, loading, error, refresh, isRealtime }`
 *
 * @remarks
 * Cache key: `queryKeys.analytics.temporal(linkId)` + filter params for cache isolation.
 * Endpoint: `GET /api/analytics/link/{id}/temporal[?date_from=…&date_to=…&exclude_bots=true&segment=…]` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_TEMPORAL`).
 * Returned `TemporalData` shape is defined in `src/types/analytics`.
 * `stats` (peak hour/day, trend direction) is derived client-side from `clicks_by_hour` and `clicks_by_day_of_week`.
 */
export function useTemporalData({
  linkId,
  refreshInterval = 30000,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  segment,
}: UseTemporalDataOptions): UseTemporalDataReturn {
  const panelActive = useAnalyticsPanelActive();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.analytics.temporal(linkId, {
      dateFrom,
      dateTo,
      excludeBots,
      segment,
    }),
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      if (excludeBots) params.set("exclude_bots", "true");
      if (segment && segment !== "all") params.set("segment", segment);
      const qs = params.toString();
      return api.get<TemporalData>(
        `${API_CONFIG.ENDPOINTS.ANALYTICS_TEMPORAL(linkId)}${qs ? `?${qs}` : ""}`,
      );
    },
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    refetchIntervalInBackground: false,
    // A hidden analytics tab keeps its cached data but stops fetching —
    // see `AnalyticsPanelActiveContext`. Outside the tabs this is always true.
    enabled: !!linkId && panelActive,
  });

  const stats = useMemo(() => (data ? calculateStats(data) : null), [data]);

  return {
    data: data ?? null,
    stats,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
    isRealtime: enableRealtime,
  };
}

export default useTemporalData;
