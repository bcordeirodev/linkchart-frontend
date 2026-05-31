"use client";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { Lightbulb, TrendingUp, Flag, BarChart3 } from "lucide-react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

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
import {
  INSIGHTS_SECTION_SPACING,
  insightsMetricRowSx,
} from "./insightsLayout";

/**
 * Lightweight section heading used to group analytics blocks with whitespace
 * instead of nested bordered containers.
 */
function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1,
          letterSpacing: 0.2,
        }}
      >
        {icon}
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}

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

  // Stable key for insightCategories so useMemo deps can reference a primitive.
  const categoriesKey = insightCategories.join(",");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.insights, priority, categoriesKey, actionableOnly]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredInsights, priority, categoriesKey, actionableOnly, stats]);

  const topCategoryLabel = filteredStats?.topCategory
    ? t(`filters.insightTypeOptions.${filteredStats.topCategory}`, {
        defaultValue: filteredStats.topCategory,
      })
    : "-";

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
        <Stack spacing={3} sx={{ "& > *": { minWidth: 0 } }}>
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
          <Box sx={insightsMetricRowSx}>
            <MetricCard
              title={t("insights.metrics.total")}
              value={filteredStats?.totalInsights?.toString() || "0"}
              icon={<Lightbulb {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.metrics.totalSub")}
            />
            <MetricCard
              title={t("insights.metrics.highPriority")}
              value={filteredStats?.highPriorityCount?.toString() || "0"}
              icon={<Flag {...ICON_LG} />}
              color="error"
              subtitle={t("insights.metrics.highPrioritySub")}
            />
            <MetricCard
              title={t("insights.metrics.actionable")}
              value={filteredStats?.actionableCount?.toString() || "0"}
              icon={<TrendingUp {...ICON_LG} />}
              color="success"
              subtitle={t("insights.metrics.actionableSub")}
            />
            <MetricCard
              title={t("insights.metrics.avgConfidence")}
              value={`${Math.round((filteredStats?.avgConfidence || 0) * 100)}%`}
              icon={<BarChart3 {...ICON_LG} />}
              color="info"
              subtitle={t("insights.metrics.confidenceSub")}
            />
          </Box>

          {/* Retenção e profundidade de sessão — primeiros blocos após os KPIs */}
          {data?.analytics_data?.retention ||
          data?.analytics_data?.session_depth ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              {data.analytics_data.retention ? (
                <RetentionAnalysisChart
                  data={data.analytics_data.retention}
                  loading={loading}
                  showTitle
                />
              ) : null}
              {data.analytics_data.session_depth ? (
                <SessionDepthChart
                  data={data.analytics_data.session_depth}
                  loading={loading}
                  showTitle
                />
              ) : null}
            </Box>
          ) : null}

          {/* Demais análises complementares */}
          {data?.analytics_data?.traffic_sources ? (
            <TrafficSourceChart
              data={data.analytics_data.traffic_sources}
              quality={data.analytics_data.quality ?? undefined}
              loading={loading}
              showTitle
            />
          ) : null}

          {/* Insights automáticos — por último na página */}
          <Box>
            <SectionHeading
              icon={<Lightbulb size={18} strokeWidth={1.75} />}
              title={t("insights.autoInsights")}
            />
            <BusinessInsights
              insights={filteredInsights}
              showTitle={false}
              maxItems={maxInsights}
            />
          </Box>

          {filteredStats ? (
            <Box sx={{ pt: 0.5 }}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {t("insights.footer.topCategory", {
                  category: topCategoryLabel,
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
        </Stack>
      </AnalyticsStateManager>
    </Box>
  );
}

export default InsightsAnalysis;
