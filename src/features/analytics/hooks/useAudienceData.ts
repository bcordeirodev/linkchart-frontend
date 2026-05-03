"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type {
  AudienceData,
  AudienceStats,
  UseAudienceDataOptions,
  UseAudienceDataReturn,
} from "@/types/analytics";

function calculateStats(audienceData: AudienceData): AudienceStats {
  const devices = audienceData.device_breakdown || [];

  if (!devices.length) {
    return {
      totalClicks: 0,
      primaryDevice: "N/A",
      primaryBrowser: "N/A",
      lastUpdate: new Date().toISOString(),
    };
  }

  const totalClicks = devices.reduce((sum, device) => sum + device.clicks, 0);
  const primaryDevice = devices.reduce(
    (max, device) => (device.clicks > max.clicks ? device : max),
    devices[0],
  );

  return {
    totalClicks,
    primaryDevice: primaryDevice.device,
    primaryBrowser: audienceData.browser_breakdown?.[0]?.browser || "N/A",
    lastUpdate: new Date().toISOString(),
  };
}

export function useAudienceData({
  linkId,
  enableRealtime = true,
  refreshInterval = 60000,
}: UseAudienceDataOptions): UseAudienceDataReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.analytics.audience(linkId),
    queryFn: () =>
      api.get<AudienceData>(`/api/analytics/link/${linkId}/audience`),
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
    lastUpdate: data ? new Date() : null,
    refresh: refetch,
    isRealtime: enableRealtime,
  };
}

export default useAudienceData;
