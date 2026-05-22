"use client";
import { Clock, Search } from "lucide-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Stack,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";

import {
  formatAreaChart,
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import { getStandardChartColors } from "@/lib/theme";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type {
  HourlyData,
  DayOfWeekData,
  HourlyPatternData,
  WeekendVsWeekdayData,
  BusinessHoursData,
  AdvancedTemporalData,
} from "@/types";

import { TemporalTrendsChart } from "./TemporalTrendsChart";
import { TimezoneDistributionChart } from "./TimezoneDistributionChart";
import { PeakAnalysisCard } from "./PeakAnalysisCard";
import { HourDayHeatmapChart } from "./HourDayHeatmapChart";
import { DailyTimelineChart } from "./DailyTimelineChart";
import { DeviceByPeriodChart } from "./DeviceByPeriodChart";

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
 * Charts within each tab are stacked vertically and rendered
 * conditionally based on data availability.
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

  const hasHeatmap = (advancedData?.heatmap_data?.length ?? 0) > 0;
  const hasDailyTimeline = (advancedData?.daily_timeline?.length ?? 0) > 0;
  const hasDeviceByPeriod = (advancedData?.device_by_period?.length ?? 0) > 0;
  const hasPeakAnalysis = advancedData?.peak_analysis?.peak_hour != null;
  const hasTrends =
    advancedData &&
    ((advancedData.weekly_trends?.length ?? 0) > 0 ||
      (advancedData.monthly_trends?.length ?? 0) > 0);
  const hasTimezones = (advancedData?.timezone_analysis?.length ?? 0) > 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
  // the computation stays correct when weeklyData is pre-filtered by segment
  // (e.g. only 5 entries for weekday filter or 2 entries for weekend filter).
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
        <Stack spacing={4}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{t("temporal.chart.insightsLabel")}:</strong>{" "}
              {hourlyTotal > 0 ? (
                <>
                  {t("temporal.chart.peakHour")}{" "}
                  <strong>{peakHour.label}</strong> ({peakHour.clicks}{" "}
                  {t("temporal.chart.clicks")}).{" "}
                  {t("temporal.chart.dayPatterns")}:{" "}
                  <strong>{peakDay.day_name}</strong> ({peakDay.clicks}{" "}
                  {t("temporal.chart.clicks")}).
                </>
              ) : (
                t("temporal.chart.noData")
              )}
            </Typography>
          </Alert>

          {hourlyTotal > 0 || weeklyTotal > 0 ? (
            <Box>
              <Grid container spacing={3}>
                {hourlyTotal > 0 ? (
                  <Grid item xs={12} lg={6} sx={{ minWidth: 0 }}>
                    <ChartCard
                      title={t("temporal.chart.periodSummary")}
                      subtitle={t("charts.descriptions.periodSummary")}
                    >
                      <ApexChartWrapper
                        type="bar"
                        size="standard"
                        {...formatBarChart(
                          [
                            {
                              name: t("temporal.chart.morningPeriod"),
                              value: hourlyData
                                .slice(6, 12)
                                .reduce((sum, h) => sum + h.clicks, 0),
                            },
                            {
                              name: t("temporal.chart.afternoonPeriod"),
                              value: hourlyData
                                .slice(12, 18)
                                .reduce((sum, h) => sum + h.clicks, 0),
                            },
                            {
                              name: t("temporal.chart.eveningPeriod"),
                              value: hourlyData
                                .slice(18, 24)
                                .reduce((sum, h) => sum + h.clicks, 0),
                            },
                          ],
                          "name",
                          "value",
                          chartColors.primary.main,
                          false,
                          isDark,
                        )}
                      />
                    </ChartCard>
                  </Grid>
                ) : null}

                {weeklyTotal > 0 ? (
                  <Grid item xs={12} lg={6} sx={{ minWidth: 0 }}>
                    <ChartCard
                      title={t("temporal.chart.daysByEngagement")}
                      subtitle={t("charts.descriptions.dayOfWeek")}
                    >
                      <ApexChartWrapper
                        type="bar"
                        size="standard"
                        {...formatBarChart(
                          weeklyData
                            .slice()
                            .sort((a, b) => b.clicks - a.clicks),
                          "day_name",
                          "clicks",
                          chartColors.secondary?.main ??
                            chartColors.primary.main,
                          false,
                          isDark,
                        )}
                      />
                    </ChartCard>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          ) : null}

          {showInsights && (hourlyTotal > 0 || weeklyTotal > 0) ? (
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: `${radiusTokens.lg}px`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Search size={16} strokeWidth={1.5} />
                  {t("temporal.chart.patternAnalysis")}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Clock size={16} strokeWidth={1.5} />{" "}
                      {t("temporal.chart.hourPatterns")}
                    </Typography>
                    <Stack spacing={1} my={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={
                            isBusinessHoursActive
                              ? t("temporal.chart.businessHours")
                              : t("temporal.chart.outsideHoursChip")
                          }
                          color={isBusinessHoursActive ? "success" : "warning"}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {isBusinessHoursActive
                            ? t("temporal.chart.activeNow")
                            : t("temporal.chart.activeAfterHours")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={`${activeHours}/24 ${t("temporal.chart.activeHours")}`}
                          color="info"
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {t("temporal.chart.activityPercent", {
                            percent: ((activeHours / 24) * 100).toFixed(0),
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t("temporal.chart.dayPatterns")}
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={
                            isWeekendActive
                              ? t("temporal.chart.weekendDays")
                              : t("temporal.chart.weekdays")
                          }
                          color={isWeekendActive ? "secondary" : "primary"}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {isWeekendActive
                            ? t("temporal.chart.weekendActiveDesc")
                            : t("temporal.chart.weekdayActiveDesc")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={`${activeDays}/7 ${t("temporal.chart.activeDays")}`}
                          color="info"
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {t("temporal.chart.weekActivityPercent", {
                            percent: ((activeDays / 7) * 100).toFixed(0),
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {t("temporal.chart.timingRecommendations")}
                  </Typography>
                  <Stack spacing={1}>
                    {peakHour && peakHour.clicks > 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("temporal.chart.scheduleTip", {
                          hour: peakHour.label,
                          clicks: peakHour.clicks,
                        })}
                      </Typography>
                    ) : null}
                    {peakDay && peakDay.clicks > 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("temporal.chart.mostActiveDay", {
                          day: peakDay.day_name,
                        })}
                      </Typography>
                    ) : null}
                    {isBusinessHoursActive ? (
                      <Typography variant="body2" color="text.secondary">
                        {t("temporal.chart.businessFocus")}
                      </Typography>
                    ) : null}
                    {!isBusinessHoursActive && hourlyTotal > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        {t("temporal.chart.afterHoursFocus")}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ) : null}

          {/* Local Time */}
          {hourlyPatternsLocal && hourlyPatternsLocal.length >= 3 && (
            <ChartCard
              title={t("temporal.chart.localTimePatterns")}
              subtitle={t("charts.descriptions.localTimePatterns")}
              icon={<Clock {...ICON_LG} />}
            >
              <ApexChartWrapper
                type="area"
                {...formatAreaChart(
                  hourlyPatternsLocal.map((item) => ({
                    hour: `${item.hour.toString().padStart(2, "0")}:00`,
                    clicks: item.clicks,
                    avg_response_time: item.avg_response_time,
                    unique_visitors: item.unique_visitors,
                  })),
                  "hour",
                  "clicks",
                  chartColors.primary.main,
                  isDark,
                )}
                size="standard"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t("temporal.chart.hourlyPerformance")}
                </Typography>
                <Stack spacing={1}>
                  {hourlyPatternsLocal.slice(0, 5).map((item) => (
                    <Box
                      key={item.hour}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{item.hour}h</Typography>
                      <Typography variant="caption">
                        {item.clicks} {t("temporal.chart.clicks")} |{" "}
                        {item.avg_response_time}ms | {item.unique_visitors}{" "}
                        {t("temporal.chart.uniqueVisitors")}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </ChartCard>
          )}

          {/* Weekend vs Weekday — hidden when weekday/weekend segment is active */}
          {weekendVsWeekday && showWeekendComparison && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8} sx={{ minWidth: 0 }}>
                  <ChartCard
                    title={t("temporal.chart.weekendVsWeekday")}
                    subtitle={t("charts.descriptions.weekendVsWeekday")}
                  >
                    <ApexChartWrapper
                      type="pie"
                      {...formatPieChart(
                        [
                          {
                            name: t("temporal.chart.weekdays"),
                            value: weekendVsWeekday.weekday.clicks,
                          },
                          {
                            name: t("temporal.chart.weekend"),
                            value: weekendVsWeekday.weekend.clicks,
                          },
                        ],
                        "name",
                        "value",
                        isDark,
                      )}
                      size="standard"
                    />
                  </ChartCard>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={4}
                  sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: `${radiusTokens.lg}px`,
                      flex: 1,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t("temporal.chart.comparison")}
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" color="primary">
                            {t("temporal.chart.weekdays")}
                          </Typography>
                          <Typography variant="body2">
                            {weekendVsWeekday.weekday.clicks}{" "}
                            {t("temporal.chart.clicks")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {weekendVsWeekday.weekday.unique_visitors}{" "}
                            {t("temporal.chart.uniqueVisitors")}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" color="secondary">
                            {t("temporal.chart.weekend")}
                          </Typography>
                          <Typography variant="body2">
                            {weekendVsWeekday.weekend.clicks}{" "}
                            {t("temporal.chart.clicks")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {weekendVsWeekday.weekend.unique_visitors}{" "}
                            {t("temporal.chart.uniqueVisitors")}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Business Hours — hidden when business segment is active */}
          {businessHoursAnalysis && showBusinessComparison && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8} sx={{ minWidth: 0 }}>
                  <ChartCard
                    title={t("temporal.chart.businessHoursAnalysis")}
                    subtitle={t("charts.descriptions.businessHours")}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 2 }}
                    >
                      {t("temporal.chart.businessHoursNote")}
                    </Typography>
                    <ApexChartWrapper
                      type="bar"
                      {...formatBarChart(
                        [
                          {
                            name: t("temporal.chart.businessHoursLabel"),
                            value: businessHoursAnalysis.business_hours.clicks,
                          },
                          {
                            name: t("temporal.chart.afterHoursLabel"),
                            value: businessHoursAnalysis.after_hours.clicks,
                          },
                        ],
                        "name",
                        "value",
                        chartColors.primary.main,
                        false,
                        isDark,
                      )}
                      size="standard"
                    />
                  </ChartCard>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={4}
                  sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: `${radiusTokens.lg}px`,
                      flex: 1,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {t("temporal.chart.engagementMetrics")}
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" color="primary">
                            {t("temporal.chart.businessHoursLabel")}
                          </Typography>
                          <Typography variant="body2">
                            {businessHoursAnalysis.business_hours.clicks}{" "}
                            {t("temporal.chart.clicks")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {businessHoursAnalysis.business_hours.percentage.toFixed(
                              1,
                            )}
                            {t("temporal.chart.ofTotal")}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" color="secondary">
                            {t("temporal.chart.afterHoursLabel")}
                          </Typography>
                          <Typography variant="body2">
                            {businessHoursAnalysis.after_hours.clicks}{" "}
                            {t("temporal.chart.clicks")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {businessHoursAnalysis.after_hours.percentage.toFixed(
                              1,
                            )}
                            {t("temporal.chart.ofTotal")}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Stack>
      )}

      {/* Tab 2 — Performance */}
      {activeTab === 2 && (
        <Stack spacing={4}>
          {hasPeakAnalysis && advancedData?.peak_analysis ? (
            <PeakAnalysisCard peakAnalysis={advancedData.peak_analysis} />
          ) : null}
          {hasTrends && advancedData ? (
            <TemporalTrendsChart
              weeklyTrends={advancedData.weekly_trends || []}
              monthlyTrends={advancedData.monthly_trends || []}
            />
          ) : null}
          {!hasPeakAnalysis && !hasTrends ? (
            <Alert severity="info">
              <Typography variant="body2">
                {t("temporal.chart.noData")}
              </Typography>
            </Alert>
          ) : null}
        </Stack>
      )}

      {/* Tab 1 — Timeline */}
      {activeTab === 1 && (
        <Stack spacing={4}>
          {hasDailyTimeline && advancedData?.daily_timeline ? (
            <DailyTimelineChart data={advancedData.daily_timeline} />
          ) : null}
          {hasHeatmap && advancedData?.heatmap_data ? (
            <HourDayHeatmapChart data={advancedData.heatmap_data} />
          ) : null}
          {!hasDailyTimeline && !hasHeatmap ? (
            <Alert severity="info">
              <Typography variant="body2">
                {t("temporal.chart.noData")}
              </Typography>
            </Alert>
          ) : null}
        </Stack>
      )}

      {/* Tab 3 — Distribution */}
      {activeTab === 3 && (
        <Stack spacing={4}>
          {hasTimezones && advancedData?.timezone_analysis ? (
            <TimezoneDistributionChart
              timezoneAnalysis={advancedData.timezone_analysis}
            />
          ) : null}
          {hasDeviceByPeriod && advancedData?.device_by_period ? (
            <DeviceByPeriodChart data={advancedData.device_by_period} />
          ) : null}
          {!hasTimezones && !hasDeviceByPeriod ? (
            <Alert severity="info">
              <Typography variant="body2">
                {t("temporal.chart.noData")}
              </Typography>
            </Alert>
          ) : null}
        </Stack>
      )}
    </Box>
  );
}
