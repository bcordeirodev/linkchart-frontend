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

/**
 * Fetches audience analytics (device/browser/OS breakdowns) for a link.
 *
 * @param options.linkId - canonical link id; the query stays disabled when falsy
 * @param options.enableRealtime - when true, refetches every `refreshInterval` ms (default `true`)
 * @param options.refreshInterval - polling interval in ms when realtime is on (default `60000`)
 * @returns `{ data: AudienceData | null, stats, loading, error, lastUpdate, refresh, isRealtime }`
 *
 * @remarks
 * Cache key: `queryKeys.analytics.audience(linkId)` → `["analytics", linkId, "audience"]`.
 * Endpoint: `GET /api/analytics/link/{id}/audience` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_AUDIENCE`).
 * Returned `AudienceData` shape is defined in `src/types/analytics`.
 * `stats` (primary device/browser, total clicks) is derived client-side from `device_breakdown`/`browser_breakdown`.
 */
export function useAudienceData({
  linkId,
  enableRealtime = true,
  refreshInterval = 60000,
}: UseAudienceDataOptions): UseAudienceDataReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.analytics.audience(linkId),
    queryFn: () =>
      api.get<AudienceData>(API_CONFIG.ENDPOINTS.ANALYTICS_AUDIENCE(linkId)),
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
