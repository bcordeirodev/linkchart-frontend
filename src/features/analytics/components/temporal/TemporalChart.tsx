"use client";
import { Box, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getStandardChartColors } from "@/lib/theme";

import type {
  HourlyData,
  DayOfWeekData,
  HourlyPatternData,
  WeekendVsWeekdayData,
  BusinessHoursData,
  AdvancedTemporalData,
} from "@/types";

import { TemporalPatternsTab } from "./tabs/TemporalPatternsTab";
import { TemporalTimelineTab } from "./tabs/TemporalTimelineTab";
import { TemporalPerformanceTab } from "./tabs/TemporalPerformanceTab";
import { TemporalDistributionTab } from "./tabs/TemporalDistributionTab";

/** Props for the TemporalChart orchestrator. */
interface TemporalChartProps {
  hourlyData: HourlyData[];
  weeklyData: DayOfWeekData[];
  showInsights?: boolean;
  hourlyPatternsLocal?: HourlyPatternData[];
  weekendVsWeekday?: WeekendVsWeekdayData;
  businessHoursAnalysis?: BusinessHoursData;
  advancedData?: AdvancedTemporalData;
  /**
   * Active segment filter from the parent `TemporalAnalysis`.
   * Used to hide comparison charts whose output is trivially 100 %/0 %
   * when the filter already pre-excludes that dimension (e.g. the
   * Weekend vs Weekday pie is meaningless when `segment = 'weekday'`).
   */
  segment?: "all" | "weekday" | "weekend" | "business";
}

/**
 * Renders temporal analytics charts grouped into 4 tabs:
 * Patterns, Timeline, Performance, and Distribution.
 *
 * Manages tab state and derives all computed values from props, then
 * delegates rendering to focused tab components. No data fetching occurs
 * here — all data flows in from the parent via props.
 */
export function TemporalChart({
  hourlyData,
  weeklyData,
  showInsights = true,
  hourlyPatternsLocal,
  weekendVsWeekday,
  businessHoursAnalysis,
  advancedData,
  segment,
}: TemporalChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState(0);

  const chartColors = getStandardChartColors(theme);

  // ── data availability flags ──────────────────────────────────────────────
  const hasHeatmap = (advancedData?.heatmap_data?.length ?? 0) > 0;
  // daily_timeline is now a DailyTimeline object; fall back to array-length check for legacy payloads.
  const hasDailyTimeline = Array.isArray(advancedData?.daily_timeline)
    ? (advancedData!.daily_timeline as unknown as unknown[]).length > 0
    : (advancedData?.daily_timeline?.data?.length ?? 0) > 0;
  const hasDeviceByPeriod = (advancedData?.device_by_period?.length ?? 0) > 0;
  const hasPeakAnalysis = advancedData?.peak_analysis?.peak_hour != null;
  const hasTrends =
    advancedData &&
    ((advancedData.weekly_trends?.length ?? 0) > 0 ||
      (advancedData.monthly_trends?.length ?? 0) > 0);
  const hasTimezones = (advancedData?.timezone_analysis?.length ?? 0) > 0;

  // ── derived metrics (passed to Patterns tab) ──────────────────────────────
  const peakHour =
    hourlyData.length > 0
      ? hourlyData.reduce((prev, current) =>
          prev.clicks > current.clicks ? prev : current,
        )
      : { label: "--", clicks: 0 };

  const peakDay =
    weeklyData.length > 0
      ? weeklyData.reduce((prev, current) =>
          prev.clicks > current.clicks ? prev : current,
        )
      : { day_name: "--", clicks: 0 };

  /** @param data — array of objects that each have a `clicks` property */
  const getTotalClicks = (data: { clicks: number }[]) =>
    data.reduce((sum, item) => sum + item.clicks, 0);

  const hourlyTotal = getTotalClicks(hourlyData);
  const weeklyTotal = getTotalClicks(weeklyData);

  const avgClicksPerHour = hourlyTotal / 24;
  // Use the number of days that actually have data as the denominator so the
  // average stays meaningful when a segment filter reduces the active day set
  // (e.g. weekday filter → 5 days, not 7).
  const daysWithData = weeklyData.filter((d) => d.clicks > 0).length || 7;
  const avgClicksPerDay = weeklyTotal / daysWithData;
  const activeHours = hourlyData.filter(
    (hour) => hour.clicks > avgClicksPerHour,
  ).length;
  const activeDays = weeklyData.filter(
    (day) => day.clicks > avgClicksPerDay,
  ).length;

  // Use the `day` field (ISO 1=Mon…7=Sun) instead of positional indices so
  // the computation stays correct when weeklyData is pre-filtered by segment.
  const weekendClicks = weeklyData
    .filter((d) => (d.day as number) >= 6) // Sat=6, Sun=7
    .reduce((sum, d) => sum + d.clicks, 0);
  const weekdayClicks = weeklyData
    .filter((d) => (d.day as number) <= 5) // Mon=1 … Fri=5
    .reduce((sum, d) => sum + d.clicks, 0);
  const isWeekendActive =
    weeklyData.length > 0 ? weekendClicks > weekdayClicks : false;
  const isBusinessHoursActive =
    hourlyData.length >= 24
      ? hourlyData.slice(9, 18).reduce((sum, hour) => sum + hour.clicks, 0) >
        hourlyData.slice(0, 9).reduce((sum, hour) => sum + hour.clicks, 0) +
          hourlyData.slice(18, 24).reduce((sum, hour) => sum + hour.clicks, 0)
      : false;

  // Hide comparison charts when the active segment filter pre-excludes one of
  // their dimensions — the result would be trivially 100 %/0 % and misleading.
  // weekday/weekend filter → Weekend vs Weekday comparison is meaningless.
  // business filter        → Business Hours comparison is meaningless.
  const showWeekendComparison =
    !segment || segment === "all" || segment === "business";
  const showBusinessComparison =
    !segment ||
    segment === "all" ||
    segment === "weekday" ||
    segment === "weekend";

  /** @param _event — synthetic React event (unused) @param newValue — selected tab index */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t("temporal.chart.tabPatterns")} />
          <Tab label={t("temporal.chart.tabTimeline")} />
          <Tab label={t("temporal.chart.tabPerformance")} />
          <Tab label={t("temporal.chart.tabDistribution")} />
        </Tabs>
      </Box>

      {/* Tab 0 — Patterns */}
      {activeTab === 0 && (
        <TemporalPatternsTab
          hourlyData={hourlyData}
          weeklyData={weeklyData}
          showInsights={showInsights}
          hourlyPatternsLocal={hourlyPatternsLocal}
          weekendVsWeekday={weekendVsWeekday}
          businessHoursAnalysis={businessHoursAnalysis}
          showWeekendComparison={showWeekendComparison}
          showBusinessComparison={showBusinessComparison}
          isDark={isDark}
          primaryColor={chartColors.primary.main}
          secondaryColor={
            chartColors.secondary?.main ?? chartColors.primary.main
          }
          hourlyTotal={hourlyTotal}
          weeklyTotal={weeklyTotal}
          peakHour={peakHour}
          peakDay={peakDay}
          activeHours={activeHours}
          activeDays={activeDays}
          isBusinessHoursActive={isBusinessHoursActive}
          isWeekendActive={isWeekendActive}
        />
      )}

      {/* Tab 1 — Timeline */}
      {activeTab === 1 && (
        <TemporalTimelineTab
          hasDailyTimeline={hasDailyTimeline}
          hasHeatmap={hasHeatmap}
          advancedData={advancedData}
        />
      )}

      {/* Tab 2 — Performance */}
      {activeTab === 2 && (
        <TemporalPerformanceTab
          hasPeakAnalysis={hasPeakAnalysis}
          hasTrends={!!hasTrends}
          advancedData={advancedData}
        />
      )}

      {/* Tab 3 — Distribution */}
      {activeTab === 3 && (
        <TemporalDistributionTab
          hasTimezones={hasTimezones}
          hasDeviceByPeriod={hasDeviceByPeriod}
          advancedData={advancedData}
        />
      )}
    </Box>
  );
}
