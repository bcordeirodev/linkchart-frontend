"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Activity, CalendarRange, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getStandardChartColors } from "@/lib/theme";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { AnalyticsSubTabs } from "@/shared/ui/navigation";

import type {
  HourlyData,
  DayOfWeekData,
  HourlyPatternData,
  WeekendVsWeekdayData,
  BusinessHoursData,
  AdvancedTemporalData,
  TemporalData,
} from "@/types";

import { TemporalPatternsTab } from "./tabs/TemporalPatternsTab";
import { TemporalPeaksTab } from "./tabs/TemporalPeaksTab";
import { TemporalTimelineTab } from "./tabs/TemporalTimelineTab";

/** Props for the TemporalChart orchestrator. */
interface TemporalChartProps {
  hourlyData: HourlyData[];
  weeklyData: DayOfWeekData[];
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
  /** Viral rank data for the "Picos e tendências" sub-tab. */
  viralRankByDay?: TemporalData["viral_rank_by_day"];
  /** Holiday impact data for the "Picos e tendências" sub-tab. */
  holidayImpact?: TemporalData["holiday_impact"];
  /** Click velocity data for the "Picos e tendências" sub-tab. */
  clickVelocity?: TemporalData["click_velocity"];
  /** Currently-active sub-tab index. When provided, the component is controlled. */
  activeTab?: number;
  /** Called when the user switches to a different sub-tab. */
  onTabChange?: (v: number) => void;
}

/**
 * Renders temporal analytics grouped into three sub-tabs: Padrões, Linha do
 * tempo, and Picos e tendências.
 *
 * The last one merges two former sub-tabs. "Performance" was a misnomer — it
 * held viral rank and engagement peaks, nothing about performance — and
 * "Distribuição" was a bag of leftovers. Neither named a question a reader
 * would ask; together they answer one: *when does this link spike, and where
 * is it heading?*
 *
 * Manages tab state and derives all computed values from props, then delegates
 * rendering to focused tab components. No data fetching occurs here — all data
 * flows in from the parent via props.
 */
export function TemporalChart({
  hourlyData,
  weeklyData,
  hourlyPatternsLocal,
  weekendVsWeekday,
  businessHoursAnalysis,
  advancedData,
  viralRankByDay,
  holidayImpact,
  clickVelocity,
  segment,
  activeTab: activeTabProp,
  onTabChange,
}: TemporalChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [localTab, setLocalTab] = useState(0);
  const activeTab = activeTabProp !== undefined ? activeTabProp : localTab;

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
  const hasViralRank = (viralRankByDay?.length ?? 0) > 0;

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

  /** @param newValue — selected tab index */
  const handleTabChange = (newValue: number) => {
    setLocalTab(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <AnalyticsSubTabs
        value={activeTab}
        onChange={handleTabChange}
        ariaLabel={t("tabs.when")}
        tabs={[
          {
            label: t("temporal.chart.tabPatterns"),
            icon: <Activity {...ICON_SM} />,
          },
          {
            label: t("temporal.chart.tabTimeline"),
            icon: <CalendarRange {...ICON_SM} />,
          },
          {
            label: t("temporal.chart.tabPeaks"),
            icon: <TrendingUp {...ICON_SM} />,
          },
        ]}
      >
        {/* Tab 0 — Patterns */}
        {activeTab === 0 && (
          <TemporalPatternsTab
            hourlyData={hourlyData}
            weeklyData={weeklyData}
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

        {/* Tab 2 — Picos e tendências: the former "Performance" (which was
            never about performance — it was viral rank and peaks) merged with
            "Distribuição" (a bag of leftovers). */}
        {activeTab === 2 && (
          <TemporalPeaksTab
            hasPeakAnalysis={hasPeakAnalysis}
            hasTrends={!!hasTrends}
            hasViralRank={hasViralRank}
            hasTimezones={hasTimezones}
            hasDeviceByPeriod={hasDeviceByPeriod}
            advancedData={advancedData}
            viralRankByDay={viralRankByDay}
            holidayImpact={holidayImpact}
            clickVelocity={clickVelocity}
          />
        )}
      </AnalyticsSubTabs>
    </Box>
  );
}
