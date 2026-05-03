"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type { HeatmapPoint } from "@/types";

interface HeatmapStats {
  totalPoints: number;
  totalClicks: number;
  avgClicksPerPoint: number;
  topCountry: string;
  topCity: string;
  coveragePercentage: number;
  maxClicks: number;
  uniqueCountries: number;
  uniqueCities: number;
}

interface UseHeatmapDataOptions {
  linkId: string;
  enableRealtime?: boolean;
  refreshInterval?: number;
  minClicks?: number;
}

interface UseHeatmapDataReturn {
  data: HeatmapPoint[];
  stats: HeatmapStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdate: Date | null;
}

function calculateStats(heatmapData: HeatmapPoint[]): HeatmapStats {
  if (!heatmapData.length) {
    return {
      totalPoints: 0,
      totalClicks: 0,
      maxClicks: 0,
      topCountry: "N/A",
      topCity: "N/A",
      avgClicksPerPoint: 0,
      coveragePercentage: 0,
      uniqueCountries: 0,
      uniqueCities: 0,
    };
  }

  const totalClicks = heatmapData.reduce((sum, point) => sum + point.clicks, 0);
  const maxClicks = Math.max(...heatmapData.map((point) => point.clicks));
  const countries = Array.from(
    new Set(heatmapData.map((point) => point.country).filter(Boolean)),
  );
  const cities = Array.from(
    new Set(heatmapData.map((point) => point.city).filter(Boolean)),
  );

  return {
    totalPoints: heatmapData.length,
    totalClicks,
    maxClicks,
    topCountry: countries[0] || "N/A",
    topCity: cities[0] || "N/A",
    avgClicksPerPoint: totalClicks / heatmapData.length,
    coveragePercentage: Math.round((countries.length / 195) * 100),
    uniqueCountries: countries.length,
    uniqueCities: cities.length,
  };
}

export function useHeatmapData({
  linkId,
  refreshInterval = 30000,
  enableRealtime = true,
  minClicks = 1,
}: UseHeatmapDataOptions): UseHeatmapDataReturn {
  const {
    data: raw,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: queryKeys.analytics.heatmap(linkId),
    queryFn: () =>
      api.get<HeatmapPoint[]>(`/api/analytics/link/${linkId}/heatmap`),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
  });

  const data = useMemo(() => {
    if (!Array.isArray(raw)) return [];
    return minClicks > 1 ? raw.filter((p) => p.clicks >= minClicks) : raw;
  }, [raw, minClicks]);

  const stats = useMemo(() => calculateStats(data), [data]);

  return {
    data,
    stats,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
    lastUpdate: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
  };
}

export default useHeatmapData;
