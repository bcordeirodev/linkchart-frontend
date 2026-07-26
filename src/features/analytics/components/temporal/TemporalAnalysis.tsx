"use client";
import { useMemo } from "react";
import { Clock, TrendingUp, Calendar, Activity } from "lucide-react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import { getWeekdayLabel } from "../../utils/weekday";
import { useTemporalData } from "../../hooks/useTemporalData";
import type { Segment } from "@/features/links/hooks/useAnalyticsFilters";
import { TemporalChart } from "./TemporalChart";
import { TemporalFilterBar } from "./TemporalFilterBar";

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
 * Renders an optional {@link TemporalFilterBar} when `onSegmentChange`
 * callback is provided.
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
  const peakAnalysis = data?.advanced?.peak_analysis;

  const peakHour =
    peakAnalysis?.peak_hour != null
      ? `${peakAnalysis.peak_hour.toString().padStart(2, "0")}h`
      : stats?.peakHour
        ? `${stats.peakHour}h`
        : "--";

  // `peak_day` is the ISO day NUMBER (1-7) and is what gets localized —
  // `peak_day_name` comes back hardcoded in Portuguese, so it serves only as a
  // fallback. Falling back through the raw number rendered "3" as a day.
  const peakDay =
    peakAnalysis?.peak_day != null
      ? getWeekdayLabel(peakAnalysis.peak_day, t)
      : peakAnalysis?.peak_day_name || stats?.peakDay || "N/A";

  // Carry the peak click counts into the KPI subtitles — this row is now the
  // single summary of peaks in the tab (the Performance sub-tab keeps only
  // the rich analysis card).
  const peakHourSubtitle = peakAnalysis?.peak_hour_clicks
    ? `${peakAnalysis.peak_hour_clicks.toLocaleString()} ${t("temporal.peak.clicks")}`
    : t("temporal.metrics.peakHourSub");
  const peakDaySubtitle = peakAnalysis?.peak_day_clicks
    ? `${peakAnalysis.peak_day_clicks.toLocaleString()} ${t("temporal.peak.clicks")}`
    : t("temporal.metrics.peakDaySub");

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

          <Box sx={{ mb: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.peakHour")}
                  value={peakHour}
                  icon={<Clock {...ICON_LG} />}
                  color="primary"
                  subtitle={peakHourSubtitle}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.peakDay")}
                  value={peakDay}
                  icon={<Calendar {...ICON_LG} />}
                  color="secondary"
                  subtitle={peakDaySubtitle}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <MetricCard
                  title={t("temporal.metrics.avgPerHour")}
                  value={stats?.averageHourlyClicks?.toString() || "0"}
                  icon={<Activity {...ICON_LG} />}
                  color="info"
                  subtitle={t("temporal.metrics.clicksPerHour")}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
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

          {/* Rich tabbed chart with advanced analytics — holiday, seasonal and
               click-velocity datasets live inside the Distribution sub-tab */}
          <Box sx={{ mt: 2 }}>
            <TemporalChart
              hourlyData={data?.clicks_by_hour || []}
              weeklyData={dayOfWeekChartData}
              hourlyPatternsLocal={data?.hourly_patterns_local}
              weekendVsWeekday={data?.weekend_vs_weekday}
              businessHoursAnalysis={data?.business_hours_analysis}
              advancedData={data?.advanced}
              viralRankByDay={data?.viral_rank_by_day}
              holidayImpact={data?.holiday_impact}
              clickVelocity={data?.click_velocity}
              segment={segment}
              activeTab={subTabIndex}
              onTabChange={onSubTabChange}
            />
          </Box>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default TemporalAnalysis;
