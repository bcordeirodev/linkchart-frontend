"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";

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
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  recommendation?: string;
  impact_score?: number;
  confidence?: number;
  data_points?: Record<string, unknown>;
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retention?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session_depth?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traffic_sources?: any;
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

export interface InsightsStats {
  totalInsights: number;
  highPriorityCount: number;
  actionableCount: number;
  avgConfidence: number;
  topCategory: string;
  lastGenerated: string;
}

export interface UseInsightsDataOptions {
  linkId: string;
  refreshInterval?: number;
  enableRealtime?: boolean;
  minConfidence?: number;
  categories?: string[];
}

export interface UseInsightsDataReturn {
  data: InsightsData | null;
  stats: InsightsStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isRealtime: boolean;
}

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
 * @param options.minConfidence - drop insights below this confidence threshold in-memory (default `0.5`)
 * @param options.categories - if non-empty, keep only insights whose `type` is in this list
 * @returns `{ data: InsightsData | null, stats, loading, error, refresh, isRealtime }`
 *
 * @remarks
 * Cache key: `queryKeys.analytics.insights(linkId)` → `["analytics", linkId, "insights"]`.
 * Endpoint: `GET /api/analytics/link/{id}/insights` (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS`).
 * Backend may return either `BusinessInsight[]` (legacy) or `InsightsData` (current); `normaliseResponse` covers both shapes.
 * `stats` (high-priority count, average confidence, top category) is derived client-side.
 */
export function useInsightsData({
  linkId,
  refreshInterval = 300000,
  enableRealtime = false,
  minConfidence = 0.5,
  categories = [],
}: UseInsightsDataOptions): UseInsightsDataReturn {
  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.analytics.insights(linkId),
    queryFn: () =>
      api.get<BusinessInsight[] | InsightsData>(
        API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS(linkId),
      ),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
  });

  const data = useMemo(
    () => (raw ? normaliseResponse(raw, minConfidence, categories) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raw, minConfidence, JSON.stringify(categories)],
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
