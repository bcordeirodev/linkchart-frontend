"use client";
import { useMemo } from "react";
import { Clock, TrendingUp, Calendar, Activity } from "lucide-react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import { useTemporalData } from "../../hooks/useTemporalData";
import type { Segment } from "@/features/links/hooks/useAnalyticsFilters";
import {
  DayOfWeekChart,
  HourlyClicksChart,
} from "@/features/analytics/components/dashboard/charts";

import { TemporalChart } from "./TemporalChart";
import { TemporalFilterBar } from "./TemporalFilterBar";
import { HolidayImpactCard } from "./HolidayImpactCard";
import { SeasonalDistributionChart } from "./SeasonalDistributionChart";
import { ViralRankMiniChart } from "./ViralRankMiniChart";
import { ClickVelocityChart } from "./ClickVelocityChart";

/** Props accepted by the {@link TemporalAnalysis} component. */
interface TemporalAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /** Restricts data to weekday / weekend / business-hours subset (backend filter). */
  segment?: Segment;
  /** Callback to propagate `segment` changes to the parent. */
  onSegmentChange?: (v: Segment) => void;
  /** Currently-active temporal sub-tab index (0–3). */
  subTabIndex?: number;
  /** Called when the user switches temporal sub-tab. */
  onSubTabChange?: (v: number) => void;
}

/**
 * Componente de análise temporal com padrões de cliques por hora e dia da semana.
 *
 * Renders an optional {@link TemporalFilterBar} when `onGroupByChange` and
 * `onSegmentChange` callbacks are provided.
 *
 * Chart rendering order is controlled by `groupBy`:
 * - `"day"` or `"month"` → `DayOfWeekChart` renders before `HourlyClicksChart`
 * - `"hour"` (default) → `HourlyClicksChart` renders first
 */
export function TemporalAnalysis({
  linkId,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  segment,
  onSegmentChange,
  subTabIndex,
  onSubTabChange,
}: TemporalAnalysisProps) {
  const { t } = useTranslation("analytics");
  const { data, stats, loading, error, refresh } = useTemporalData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    segment,
    includeAdvanced: false, // Deprecated - endpoint sempre inclui dados advanced
    refreshInterval: 30000,
  });

  // Priorizar dados de peak_analysis do back-end quando disponíveis
  // Usar != null para rejeitar tanto null quanto undefined
  const peakHour =
    data?.advanced?.peak_analysis?.peak_hour != null
      ? `${data.advanced.peak_analysis.peak_hour.toString().padStart(2, "0")}h`
      : stats?.peakHour
        ? `${stats.peakHour}h`
        : "--";

  const peakDay =
    data?.advanced?.peak_analysis?.peak_day || stats?.peakDay || "N/A";

  const trendValue =
    stats?.trendDirection === "up"
      ? t("temporal.metrics.trending")
      : stats?.trendDirection === "down"
        ? t("temporal.metrics.declining")
        : t("temporal.metrics.stable");

  // The backend always returns all 7 days (with 0 clicks for segment-excluded days).
  // Filter to only the days that are relevant to the active segment so the
  // summary chart does not render empty bars for Sat/Sun (weekday filter) or
  // Mon–Fri (weekend filter).
  // day values: 1=Mon … 5=Fri, 6=Sat, 7=Sun  (ISO, matches backend output).
  const dayOfWeekChartData = useMemo(() => {
    const raw = data?.clicks_by_day_of_week ?? [];
    if (segment === "weekday") return raw.filter((d) => d.day <= 5);
    if (segment === "weekend") return raw.filter((d) => d.day >= 6);
    return raw;
  }, [data?.clicks_by_day_of_week, segment]);

  const hourlyChartNode =
    (data?.clicks_by_hour?.length ?? 0) > 0 ? (
      <Grid item xs={12} md={6}>
        <HourlyClicksChart data={data!.clicks_by_hour} />
      </Grid>
    ) : null;

  const weeklyChartNode =
    dayOfWeekChartData.length > 0 ? (
      <Grid item xs={12} md={6}>
        <DayOfWeekChart data={dayOfWeekChartData} />
      </Grid>
    ) : null;

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        skeleton={<AnalyticsTabSkeleton hasFilter metricCards={4} />}
        onRetry={refresh}
        loadingMessage={t("temporal.loading")}
        emptyMessage={t("temporal.empty")}
        minHeight={300}
      >
        <Box>
          {/* Filter bar — only rendered when parent supplies segment callback */}
          {onSegmentChange && (
            <TemporalFilterBar
              segment={segment ?? "all"}
              onSegmentChange={onSegmentChange}
            />
          )}

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.peakHour")}
                  value={peakHour}
                  icon={<Clock {...ICON_LG} />}
                  color="primary"
                  subtitle={t("temporal.metrics.peakHourSub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.peakDay")}
                  value={peakDay}
                  icon={<Calendar {...ICON_LG} />}
                  color="secondary"
                  subtitle={t("temporal.metrics.peakDaySub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.avgPerHour")}
                  value={stats?.averageHourlyClicks?.toString() || "0"}
                  icon={<Activity {...ICON_LG} />}
                  color="info"
                  subtitle={t("temporal.metrics.clicksPerHour")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.trend")}
                  value={trendValue}
                  icon={<TrendingUp {...ICON_LG} />}
                  color={
                    stats?.trendDirection === "up"
                      ? "success"
                      : stats?.trendDirection === "down"
                        ? "error"
                        : "warning"
                  }
                  subtitle={t("temporal.metrics.currentTrend")}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Summary charts */}
          <Grid container spacing={3}>
            {hourlyChartNode}
            {weeklyChartNode}
          </Grid>

          {/* Rich tabbed chart with advanced analytics — bordered to visually
               distinguish this sub-tab section from the summary charts above */}
          <Box
            sx={{
              mt: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: { xs: 1.5, md: 2 },
            }}
          >
            <TemporalChart
              hourlyData={data?.clicks_by_hour || []}
              weeklyData={dayOfWeekChartData}
              hourlyPatternsLocal={data?.hourly_patterns_local}
              weekendVsWeekday={data?.weekend_vs_weekday}
              businessHoursAnalysis={data?.business_hours_analysis}
              advancedData={data?.advanced}
              segment={segment}
              activeTab={subTabIndex}
              onTabChange={onSubTabChange}
            />
          </Box>

          {data?.holiday_impact?.top_holidays?.length ||
          data?.seasonal_distribution?.length ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {data?.holiday_impact?.top_holidays?.length ? (
                <Grid item xs={12} md={6}>
                  <HolidayImpactCard data={data.holiday_impact} />
                </Grid>
              ) : null}
              {data?.seasonal_distribution?.length ? (
                <Grid item xs={12} md={6}>
                  <SeasonalDistributionChart
                    data={data.seasonal_distribution}
                  />
                </Grid>
              ) : null}
            </Grid>
          ) : null}

          {data?.viral_rank_by_day && data.viral_rank_by_day.length > 0 && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <ViralRankMiniChart data={data.viral_rank_by_day} />
              </Grid>
            </Grid>
          )}

          {data?.click_velocity && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <ClickVelocityChart data={data.click_velocity} />
              </Grid>
            </Grid>
          )}
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default TemporalAnalysis;
