"use client";

import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

import type {
  AudienceData,
  AudienceStats,
  UseAudienceDataOptions,
  UseAudienceDataReturn,
} from "@/types/analytics";

/**
 * Derives summary stats (primary device/browser, total clicks) from the raw
 * `AudienceData` returned by the API. Returns sentinel values (`"N/A"`, `0`)
 * when the device breakdown is empty so callers can render an empty state
 * without null checks.
 */
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
 * @param options.dateFrom - ISO date string (yyyy-MM-dd) for the start of the period
 * @param options.dateTo - ISO date string (yyyy-MM-dd) for the end of the period
 * @param options.excludeBots - when true, adds `exclude_bots=true` to the request
 * @returns `{ data: AudienceData | null, stats, loading, error, lastUpdate, refresh, isRealtime }`
 *
 * @remarks
 * Cache key includes filter params for proper cache isolation.
 * Endpoint: `GET /api/analytics/link/{id}/audience` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_AUDIENCE`).
 * Returned `AudienceData` shape is defined in `src/types/analytics`.
 * `stats` (primary device/browser, total clicks) is derived client-side from `device_breakdown`/`browser_breakdown`.
 */
export function useAudienceData({
  linkId,
  enableRealtime = true,
  refreshInterval = 60000,
  dateFrom,
  dateTo,
  excludeBots,
}: UseAudienceDataOptions): UseAudienceDataReturn {
  const { data, isLoading, isPlaceholderData, error, refetch } = useQuery({
    queryKey: [
      ...queryKeys.analytics.audience(linkId),
      { dateFrom, dateTo, excludeBots },
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      if (excludeBots) params.set("exclude_bots", "true");
      const qs = params.toString();
      const url = `${API_CONFIG.ENDPOINTS.ANALYTICS_AUDIENCE(linkId)}${qs ? `?${qs}` : ""}`;
      return api.get<AudienceData>(url);
    },
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
    // Keeps the previous dataset visible while a filter-change fetch is in flight so
    // AnalyticsStateManager never enters its loading state between filter changes.
    //
    // Why both flags together matter:
    //   • `placeholderData: keepPreviousData` → `data` stays non-null during the new
    //     fetch, so `hasData` passed to AnalyticsStateManager stays true.
    //   • `isLoading && !isPlaceholderData` → `loading` is false when placeholder data
    //     is present (filter transition) but true on the very first load (no data at all).
    //     Without this second condition, TanStack v5 still reports `isLoading=true` for
    //     the new queryKey even while serving placeholder data, which is enough to trigger
    //     the AnalyticsStateManager loading state.
    placeholderData: keepPreviousData,
  });

  const stats = useMemo(() => (data ? calculateStats(data) : null), [data]);

  return {
    data: data ?? null,
    stats,
    loading: isLoading && !isPlaceholderData,
    error: error ? (error as Error).message : null,
    lastUpdate: data ? new Date() : null,
    refresh: refetch,
    isRealtime: enableRealtime,
  };
}

export default useAudienceData;
