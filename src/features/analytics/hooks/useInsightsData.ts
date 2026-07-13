"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

/** Single AI-generated business insight returned by the insights endpoint. */
export interface BusinessInsight {
  type:
    | "geographic"
    | "temporal"
    | "audience"
    | "performance"
    | "conversion"
    | "engagement"
    | "optimization"
    | "security"
    | "retention"
    | "traffic_source";
  title: string;
  /** i18n key for the insight title (preferred over `title` when present). */
  title_key?: string;
  /** Interpolation params for `title_key`. */
  title_params?: Record<string, string | number>;
  description: string;
  /** i18n key for the insight description (preferred over `description` when present). */
  description_key?: string;
  /** Interpolation params for `description_key`. */
  description_params?: Record<string, string | number>;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  recommendation?: string;
  /** i18n key for the recommendation (preferred over `recommendation` when present). */
  recommendation_key?: string;
  /** Interpolation params for `recommendation_key`. */
  recommendation_params?: Record<string, string | number>;
  impact_score?: number;
  confidence?: number;
  data_points?: Record<string, unknown>;
}

/** Visitor retention breakdown returned by the backend. */
export interface RetentionData {
  return_visitor_rate: number;
  new_visitor_rate: number;
  total_visitors: number;
  return_visitors: number;
  new_visitors: number;
}

/** Single bucket in the session click-depth histogram. */
export interface SessionDistributionBucket {
  clicks_count: number;
  frequency: number;
  percentage: number;
  avg_response_time: number;
}

/** Session depth analytics returned by the backend. */
export interface SessionDepthData {
  avg_session_clicks: number;
  max_session_depth: number;
  session_distribution: SessionDistributionBucket[];
  power_users_count: number;
}

/** Individual traffic source with performance metrics. */
export interface TrafficSource {
  source: string;
  clicks: number;
  percentage: number;
  avg_response_time: number;
  avg_session_depth: number;
}

/** Traffic channel aggregation. */
export interface TrafficChannel {
  channel: string;
  clicks: number;
  percentage: number;
  unique_visitors: number;
  sources: TrafficSource[];
  avg_response_time: number;
  avg_session_depth: number;
}

/** Navigation context entry (Sec-Fetch-Site breakdown). */
export interface NavigationContextEntry {
  context: string;
  clicks: number;
  percentage: number;
}

/** Traffic recommendation from the backend analysis. */
export interface TrafficRecommendation {
  type: "optimization" | "growth" | "diversification";
  message_key: string;
  priority: "high" | "medium" | "low";
}

/** Full traffic sources analytics block returned inside analytics_data. */
export interface TrafficSourceData {
  sources: TrafficSource[];
  channels: TrafficChannel[];
  top_source: { source: string; clicks: number; percentage: number } | null;
  source_diversity: number;
  total_clicks: number;
  recommendations: TrafficRecommendation[];
  navigation_context?: NavigationContextEntry[];
}

/** Full insights payload (list of insights + aggregate summary and optional analytics breakdowns). */
export interface InsightsData {
  insights: BusinessInsight[];
  summary: {
    total_insights: number;
    high_priority: number;
    actionable_insights: number;
    avg_confidence: number;
  };
  categories: Record<string, number>;
  generated_at: string;
  analytics_data?: {
    retention?: RetentionData;
    session_depth?: SessionDepthData;
    traffic_sources?: TrafficSourceData;
    /**
     * Breakdown of clicks by navigation context (Sec-Fetch-* headers), as a
     * sibling of `traffic_sources` — not nested inside it. Flat list, same
     * shape as `TrafficSourceData.navigation_context` but populated by the
     * backend at this top-level key (`InsightsAnalyticsService::getNavigationContextBreakdown`).
     */
    navigation_context?: NavigationContextEntry[];
    /** Breakdown of clicks by HTTP protocol version (HTTP/1.1 vs HTTP/2). Nulls are coalesced to `"unknown"`. */
    http_protocol?: Array<{
      protocol: string;
      clicks: number;
      percentage: number;
    }>;
    /** Quality tier breakdown from Phase 3 scoring */
    quality?: {
      avg_quality_score: number | null;
      tier_breakdown: Array<{
        tier: string;
        clicks: number;
        percentage: number;
        avg_score: number;
      }>;
      organic_percentage: number;
    };
  };
}

/** Client-side derived stats over the insights list (counts, average confidence, top category). */
export interface InsightsStats {
  totalInsights: number;
  highPriorityCount: number;
  actionableCount: number;
  avgConfidence: number;
  topCategory: string;
  lastGenerated: string;
}

/** Input options accepted by `useInsightsData`. */
export interface UseInsightsDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period. */
  dateTo?: string | null;
  /** When true, adds `exclude_bots=true` to the request. */
  excludeBots?: boolean;
  /** Drop insights below this confidence threshold (0–1) before returning them. */
  minConfidence?: number;
  /** If non-empty, keep only insights whose `type` is in this list. */
  categories?: string[];
}

/** Return shape of `useInsightsData`. */
export interface UseInsightsDataReturn {
  data: InsightsData | null;
  stats: InsightsStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

/**
 * Derives `InsightsStats` from `InsightsData`: counts by priority/actionability,
 * the mean confidence rounded to 2 decimals, and the dominant insight type.
 * Falls back to `"performance"` as the top category when the list is empty.
 */
function calculateStats(insightsData: InsightsData): InsightsStats {
  const insights = insightsData.insights || [];

  const highPriorityCount = insights.filter(
    (i) => i.priority === "high",
  ).length;
  const actionableCount = insights.filter((i) => i.actionable).length;
  const avgConfidence =
    insights.length > 0
      ? insights.reduce((sum, i) => sum + (i.confidence || 0.5), 0) /
        insights.length
      : 0;

  const categoryCount: Record<string, number> = {};
  insights.forEach((insight) => {
    categoryCount[insight.type] = (categoryCount[insight.type] || 0) + 1;
  });

  const topCategory =
    Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "performance";

  return {
    totalInsights: insights.length,
    highPriorityCount,
    actionableCount,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
    topCategory,
    lastGenerated: insightsData.generated_at || new Date().toISOString(),
  };
}

/**
 * Normalises the two backend response shapes into a single `InsightsData`:
 * the legacy `BusinessInsight[]` (rebuilds a synthetic `summary` from the
 * filtered list) and the current `InsightsData` envelope (just filters its
 * `insights` array). Both branches apply the `minConfidence` and `categories`
 * filters in-memory before returning.
 */
function normaliseResponse(
  response: BusinessInsight[] | InsightsData,
  minConfidence: number,
  categories: string[],
): InsightsData {
  const filter = (list: BusinessInsight[]) =>
    list
      .filter((i) => (i.confidence ?? 0.5) >= minConfidence)
      .filter((i) => categories.length === 0 || categories.includes(i.type));

  if (Array.isArray(response)) {
    const filtered = filter(response);
    return {
      insights: filtered,
      summary: {
        total_insights: filtered.length,
        high_priority: filtered.filter((i) => i.priority === "high").length,
        actionable_insights: filtered.filter((i) => i.actionable).length,
        avg_confidence:
          filtered.length > 0
            ? filtered.reduce((sum, i) => sum + (i.confidence || 0.5), 0) /
              filtered.length
            : 0,
      },
      categories: {},
      generated_at: new Date().toISOString(),
    };
  }

  return { ...response, insights: filter(response.insights || []) };
}

/**
 * Fetches AI-generated business insights for a link, with client-side filtering.
 *
 * @param options.linkId - canonical link id; the query stays disabled when falsy
 * @param options.refreshInterval - polling interval in ms when realtime is on (default `300000`, 5 min)
 * @param options.enableRealtime - when true, refetches every `refreshInterval` ms (default `false`)
 * @param options.dateFrom - ISO date string (yyyy-MM-dd) for the start of the period
 * @param options.dateTo - ISO date string (yyyy-MM-dd) for the end of the period
 * @param options.excludeBots - when true, adds `exclude_bots=true` to the request
 * @param options.minConfidence - drop insights below this confidence threshold in-memory (default `0.5`)
 * @param options.categories - if non-empty, keep only insights whose `type` is in this list
 * @returns `{ data: InsightsData | null, stats, loading, error, refresh, isRealtime }`
 *
 * @remarks
 * Cache key: `queryKeys.analytics.insights(linkId)` + filter params for cache isolation.
 * Endpoint: `GET /api/analytics/link/{id}/insights[?date_from=…&date_to=…&exclude_bots=true]` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS`).
 * Backend may return either `BusinessInsight[]` (legacy) or `InsightsData` (current); `normaliseResponse` covers both shapes.
 * `stats` (high-priority count, average confidence, top category) is derived client-side.
 */
export function useInsightsData({
  linkId,
  refreshInterval = 300000,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  minConfidence = 0.5,
  categories = [],
}: UseInsightsDataOptions): UseInsightsDataReturn {
  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    // minConfidence and categories are applied client-side — not part of the cache key
    queryKey: queryKeys.analytics.insights(linkId, {
      dateFrom,
      dateTo,
      excludeBots,
    }),
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      if (excludeBots) params.set("exclude_bots", "true");
      const qs = params.toString();
      return api.get<BusinessInsight[] | InsightsData>(
        `${API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS(linkId)}${qs ? `?${qs}` : ""}`,
      );
    },
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
  });

  const data = useMemo(
    () => (raw ? normaliseResponse(raw, minConfidence, categories) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raw, minConfidence, categories.join(",")],
  );

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

export default useInsightsData;
