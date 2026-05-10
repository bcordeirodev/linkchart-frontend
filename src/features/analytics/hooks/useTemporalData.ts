"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type { TemporalData } from "@/types/analytics";

export interface TemporalStats {
  totalDataPoints: number;
  peakHour: string;
  peakDay: string;
  averageHourlyClicks: number;
  trendDirection: "up" | "down" | "stable";
  lastUpdate: string;
}

export interface UseTemporalDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  /** @deprecated mantido por compatibilidade, sem efeito */
  includeAdvanced?: boolean;
}

export interface UseTemporalDataReturn {
  data: TemporalData | null;
  stats: TemporalStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

function calculateStats(temporalData: TemporalData): TemporalStats {
  const hourlyData = temporalData.clicks_by_hour || [];
  const dailyData = temporalData.clicks_by_day_of_week || [];

  const peakHourData = hourlyData.reduce(
    (prev, current) => (current.clicks > prev.clicks ? current : prev),
    hourlyData[0] || { hour: "0", clicks: 0 },
  );

  const peakDayData = dailyData.reduce(
    (prev, current) => (current.clicks > prev.clicks ? current : prev),
    dailyData[0] || { day_name: "Segunda", clicks: 0 },
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
    averageHourlyClicks: Math.round(averageHourlyClicks),
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
 * @returns `{ data: TemporalData | null, stats, loading, error, refresh, isRealtime }`
 *
 * @remarks
 * Cache key: `queryKeys.analytics.temporal(linkId)` → `["analytics", linkId, "temporal"]`.
 * Endpoint: `GET /api/analytics/link/{id}/temporal` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_TEMPORAL`).
 * Returned `TemporalData` shape is defined in `src/types/analytics`.
 * `stats` (peak hour/day, trend direction) is derived client-side from `clicks_by_hour` and `clicks_by_day_of_week`.
 */
export function useTemporalData({
  linkId,
  refreshInterval = 30000,
  enableRealtime = false,
}: UseTemporalDataOptions): UseTemporalDataReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.analytics.temporal(linkId),
    queryFn: () =>
      api.get<TemporalData>(API_CONFIG.ENDPOINTS.ANALYTICS_TEMPORAL(linkId)),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
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
