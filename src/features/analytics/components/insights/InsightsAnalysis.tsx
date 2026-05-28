"use client";
import { useMemo } from "react";
import { Lightbulb, TrendingUp, Flag, BarChart3 } from "lucide-react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import { useInsightsData } from "../../hooks/useInsightsData";

import type { InsightPriority } from "@/features/links/hooks/useAnalyticsFilters";
import { BusinessInsights } from "./BusinessInsights";
import { InsightsFilterBar } from "./InsightsFilterBar";
import { RetentionAnalysisChart } from "./RetentionAnalysisChart";
import { SessionDepthChart } from "./SessionDepthChart";
import { TrafficSourceChart } from "./TrafficSourceChart";
import { TrafficQualityChart } from "./TrafficQualityChart";

/** Props accepted by the {@link InsightsAnalysis} component. */
interface InsightsAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** Maximum number of insights to display. Defaults to `50`. */
  maxInsights?: number;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /**
   * Active priority filter. When provided together with its setter the
   * {@link InsightsFilterBar} is rendered. Defaults to `"all"`.
   */
  priority?: InsightPriority;
  /** Array of active insight-type category filters. Defaults to `[]` (all types). */
  insightCategories?: string[];
  /** When `true`, only insights with `actionable === true` are shown. */
  actionableOnly?: boolean;
  /** Callback fired when the user changes the priority chip selection. */
  onPriorityChange?: (v: InsightPriority) => void;
  /** Callback fired when the user toggles a category chip. */
  onCategoriesChange?: (v: string[]) => void;
  /** Callback fired when the user toggles the actionable-only switch. */
  onActionableOnlyChange?: (v: boolean) => void;
}

/**
 * Main Insights tab component.
 *
 * Fetches insight data via {@link useInsightsData}, applies client-side
 * post-filters (priority / categories / actionableOnly), and derives
 * {@link filteredStats} so the metric cards always reflect the current
 * filter state rather than the unfiltered total.
 *
 * Renders an optional {@link InsightsFilterBar} when all three change
 * callbacks are provided.
 */
export function InsightsAnalysis({
  linkId,
  enableRealtime = false,
  maxInsights = 50,
  dateFrom,
  dateTo,
  excludeBots,
  priority = "all",
  insightCategories = [],
  actionableOnly = false,
  onPriorityChange,
  onCategoriesChange,
  onActionableOnlyChange,
}: InsightsAnalysisProps) {
  const { t } = useTranslation("analytics");

  const { data, stats, loading, error, refresh, isRealtime } = useInsightsData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    minConfidence: 0.5,
    // Categories filter is applied client-side via filteredInsights below.
    // Passing [] here ensures normaliseResponse never double-filters.
    categories: [],
    refreshInterval: 300000,
  });

  /** Client-side post-filter applied on top of the hook's results. */
  const filteredInsights = useMemo(() => {
    let list = data?.insights ?? [];
    if (priority !== "all") {
      list = list.filter((i) => i.priority === priority);
    }
    if (insightCategories.length > 0) {
      list = list.filter((i) => insightCategories.includes(i.type));
    }
    if (actionableOnly) {
      list = list.filter((i) => i.actionable);
    }
    return list;
  }, [data?.insights, priority, insightCategories.join(","), actionableOnly]);

  /**
   * Stats derived from the filtered list so metric cards reflect what is
   * actually shown — not the unfiltered total when a filter is active.
   */
  const filteredStats = useMemo(() => {
    if (!stats) return null;
    const isFiltered =
      priority !== "all" || insightCategories.length > 0 || actionableOnly;
    if (!isFiltered) return stats;
    const high = filteredInsights.filter((i) => i.priority === "high").length;
    const actionable = filteredInsights.filter((i) => i.actionable).length;
    const avgConf =
      filteredInsights.length > 0
        ? filteredInsights.reduce((s, i) => s + (i.confidence ?? 0.5), 0) /
          filteredInsights.length
        : 0;
    return {
      ...stats,
      totalInsights: filteredInsights.length,
      highPriorityCount: high,
      actionableCount: actionable,
      avgConfidence: Math.round(avgConf * 100) / 100,
    };
  }, [
    filteredInsights,
    priority,
    insightCategories.join(","),
    actionableOnly,
    stats,
  ]);

  /** Whether to render the filter bar — requires all three callbacks to be present. */
  const showFilterBar =
    !!onPriorityChange && !!onCategoriesChange && !!onActionableOnlyChange;

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data?.insights?.length}
        skeleton={<AnalyticsTabSkeleton hasFilter metricCards={4} />}
        onRetry={refresh}
        loadingMessage={t("insights.loading")}
        emptyMessage={t("insights.empty")}
        minHeight={300}
      >
        <Box>
          {showFilterBar ? (
            <InsightsFilterBar
              priority={priority}
              insightCategories={insightCategories}
              actionableOnly={actionableOnly}
              onPriorityChange={onPriorityChange!}
              onCategoriesChange={onCategoriesChange!}
              onActionableOnlyChange={onActionableOnlyChange!}
            />
          ) : null}

          {/* KPI cards — use filteredStats so they match the visible list */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.total")}
                  value={filteredStats?.totalInsights?.toString() || "0"}
                  icon={<Lightbulb {...ICON_LG} />}
                  color="primary"
                  subtitle={t("insights.metrics.totalSub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.highPriority")}
                  value={filteredStats?.highPriorityCount?.toString() || "0"}
                  icon={<Flag {...ICON_LG} />}
                  color="error"
                  subtitle={t("insights.metrics.highPrioritySub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.actionable")}
                  value={filteredStats?.actionableCount?.toString() || "0"}
                  icon={<TrendingUp {...ICON_LG} />}
                  color="success"
                  subtitle={t("insights.metrics.actionableSub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.avgConfidence")}
                  value={`${Math.round((filteredStats?.avgConfidence || 0) * 100)}%`}
                  icon={<BarChart3 {...ICON_LG} />}
                  color="info"
                  subtitle={t("insights.metrics.confidenceSub")}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Actionable insights list */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Lightbulb size={16} strokeWidth={1.5} />
              {t("insights.autoInsights")}
            </Typography>
            <BusinessInsights
              insights={filteredInsights}
              showTitle={false}
              maxItems={maxInsights}
            />
          </Box>

          {/* Analytics blocks — 2×2 grid to reduce scroll */}
          {data?.analytics_data ? (
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {/* Row 1: Traffic Sources (wider) + Traffic Quality */}
                {data.analytics_data.traffic_sources ? (
                  <Grid item xs={12} lg={7}>
                    <TrafficSourceChart
                      data={data.analytics_data.traffic_sources}
                      loading={loading}
                      showTitle
                    />
                  </Grid>
                ) : null}

                {data.analytics_data.quality ? (
                  <Grid item xs={12} lg={5}>
                    <TrafficQualityChart data={data.analytics_data.quality} />
                  </Grid>
                ) : null}

                {/* Row 2: Retention + Session Depth */}
                {data.analytics_data.retention ? (
                  <Grid item xs={12} md={6}>
                    <RetentionAnalysisChart
                      data={data.analytics_data.retention}
                      loading={loading}
                      showTitle
                    />
                  </Grid>
                ) : null}

                {data.analytics_data.session_depth ? (
                  <Grid item xs={12} md={6}>
                    <SessionDepthChart
                      data={data.analytics_data.session_depth}
                      loading={loading}
                      showTitle
                    />
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          ) : null}

          {filteredStats ? (
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: `${radiusTokens.md}px`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t("insights.footer.topCategory", {
                  category: filteredStats.topCategory,
                })}{" "}
                • {t("insights.footer.lastGenerated")}{" "}
                {new Date(filteredStats.lastGenerated).toLocaleString()} •{" "}
                {t("insights.footer.showing", {
                  shown: filteredInsights.length,
                  total: data?.insights?.length ?? stats?.totalInsights,
                })}
                {isRealtime ? ` • ${t("insights.footer.autoUpdate")}` : null}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default InsightsAnalysis;
