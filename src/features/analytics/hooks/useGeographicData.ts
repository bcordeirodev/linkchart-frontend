"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type {
  GeographicData,
  GeographicMeta,
  GeographicResponse,
} from "@/types/analytics/geographic";

export interface GeographicStats {
  totalCountries: number;
  totalStates: number;
  totalCities: number;
  totalClicks: number;
  maxClicks: number;
  totalLocations: number;
  coveragePercentage: number;
  lastUpdate: string;
}

export interface UseGeographicDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  minClicks?: number;
}

export interface UseGeographicDataReturn {
  data: GeographicData | null;
  meta: GeographicMeta | null;
  stats: GeographicStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

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
    lastUpdate: meta.last_updated,
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
      api.get<GeographicResponse>(
        API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC(linkId),
        {
          rawEnvelope: true,
        },
      ),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
  });

  const data = useMemo<GeographicData | null>(() => {
    if (!raw?.data) return null;
    if (minClicks <= 1) return raw.data;
    return {
      ...raw.data,
      top_countries:
        raw.data.top_countries?.filter((c) => c.clicks >= minClicks) || [],
      top_states:
        raw.data.top_states?.filter((s) => s.clicks >= minClicks) || [],
      top_cities:
        raw.data.top_cities?.filter((c) => c.clicks >= minClicks) || [],
      heatmap_data:
        raw.data.heatmap_data?.filter((h) => h.clicks >= minClicks) || [],
    };
  }, [raw, minClicks]);

  const meta = raw?.meta ?? null;
  const stats = useMemo(() => (meta ? calculateStats(meta) : null), [meta]);

  return {
    data,
    meta,
    stats,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refresh: refetch,
    isRealtime: enableRealtime,
  };
}

export default useGeographicData;
