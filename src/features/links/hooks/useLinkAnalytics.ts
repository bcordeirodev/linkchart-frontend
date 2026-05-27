"use client";
import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { i18n } from "@/lib/i18n";
import { queryKeys } from "@/lib/query/keys";
import { linkService } from "@/services";

import type { LinkAnalyticsData } from "../types/analytics";
import type { LinkResponse } from "@/types";

interface UseLinkAnalyticsReturn {
  /** Minimal analytics shell for backward compatibility. Detailed analytics loaded by tab-specific hooks. */
  data: LinkAnalyticsData | null;
  /** Raw link info from the API. */
  linkInfo: LinkResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

/**
 * Loads basic link info and returns a minimal `LinkAnalyticsData` shell for legacy consumers.
 *
 * @param linkId - Canonical link id.
 * @returns `{ data, linkInfo, loading, error, refetch }`
 *
 * @remarks
 * Endpoint: `GET /api/links/{id}` via `linkService.findOne()`.
 * Uses TanStack Query with key `queryKeys.links.detail(linkId)` — deduplicated with `useLinkById`.
 * `overview.unique_visitors` and `overview.avg_daily_clicks` are **zeroed stubs**.
 * Real values come from `useDashboardData` → `/api/analytics/link/{id}/dashboard`.
 * Detailed tab data is loaded by `useGeographicData`, `useTemporalData`, `useAudienceData`, `useInsightsData`.
 */
export function useLinkAnalyticsOptimized(
  linkId: string,
): UseLinkAnalyticsReturn {
  const {
    data: linkInfo = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.links.detail(linkId),
    queryFn: () => linkService.findOne(linkId),
    enabled: !!linkId,
  });

  const analyticsData = useMemo<LinkAnalyticsData | null>(() => {
    if (!linkInfo) return null;
    return {
      has_data: true,
      link_info: linkInfo,
      overview: {
        total_clicks: linkInfo.clicks || 0,
        unique_visitors: 0, // real value from useDashboardData
        avg_daily_clicks: 0, // real value from useDashboardData
        conversion_rate: 0,
        countries_reached: 0,
        bounce_rate: 0,
        peak_hour: "--:--",
      },
      geographic: {
        top_countries: [],
        top_states: [],
        top_cities: [],
        heatmap_data: [],
      },
      temporal: {
        clicks_by_hour: [],
        clicks_by_day_of_week: [],
      },
      audience: {
        device_breakdown: [],
      },
      insights: [],
    } as LinkAnalyticsData;
  }, [linkInfo]);

  return {
    data: analyticsData,
    linkInfo: linkInfo ?? null,
    loading: isLoading,
    error: error
      ? (i18n.t as (key: string, opts: object) => string)("errors.loadLink", {
          ns: "links",
        })
      : null,
    refetch,
  };
}

export default useLinkAnalyticsOptimized;
