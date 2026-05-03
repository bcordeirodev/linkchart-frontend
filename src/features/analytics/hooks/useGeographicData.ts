"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type { GeographicData } from "@/types/analytics";

export interface GeographicStats {
  totalCountries: number;
  totalStates: number;
  totalCities: number;
  topCountryClicks: number;
  totalClicks: number;
  coveragePercentage: number;
  lastUpdate: string;
}

export interface UseGeographicDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  includeHeatmap?: boolean;
  minClicks?: number;
}

export interface UseGeographicDataReturn {
  data: GeographicData | null;
  stats: GeographicStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

function calculateStats(geographicData: GeographicData): GeographicStats {
  const countries = geographicData.top_countries || [];
  const states = geographicData.top_states || [];
  const cities = geographicData.top_cities || [];

  const totalClicks = countries.reduce(
    (sum, country) => sum + (country.clicks || 0),
    0,
  );

  return {
    totalCountries: countries.length,
    totalStates: states.length,
    totalCities: cities.length,
    topCountryClicks: countries[0]?.clicks || 0,
    totalClicks,
    coveragePercentage:
      countries.length > 0 ? Math.min((countries.length / 195) * 100, 100) : 0,
    lastUpdate: new Date().toISOString(),
  };
}

export function useGeographicData({
  linkId,
  refreshInterval = 30000,
  enableRealtime = false,
  minClicks = 1,
}: UseGeographicDataOptions): UseGeographicDataReturn {
  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.analytics.geographic(linkId),
    queryFn: () =>
      api.get<GeographicData>(`/api/analytics/link/${linkId}/geographic`),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
  });

  const data = useMemo(() => {
    if (!raw) return null;
    if (minClicks <= 1) return raw;
    return {
      ...raw,
      top_countries:
        raw.top_countries?.filter((c) => c.clicks >= minClicks) || [],
      top_states: raw.top_states?.filter((s) => s.clicks >= minClicks) || [],
      top_cities: raw.top_cities?.filter((c) => c.clicks >= minClicks) || [],
      heatmap_data:
        raw.heatmap_data?.filter((h) => h.clicks >= minClicks) || [],
    };
  }, [raw, minClicks]);

  const stats = useMemo(() => (data ? calculateStats(data) : null), [data]);

  return {
    data,
    stats,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
    isRealtime: enableRealtime,
  };
}

export default useGeographicData;
