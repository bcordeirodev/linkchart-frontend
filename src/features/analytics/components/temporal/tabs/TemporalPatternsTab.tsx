"use client";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";

import {
  formatAreaChart,
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type {
  HourlyData,
  DayOfWeekData,
  HourlyPatternData,
  WeekendVsWeekdayData,
  BusinessHoursData,
} from "@/types";

/** Props for the Patterns tab content. */
export interface TemporalPatternsTabProps {
  /** Hourly click data (24 entries). */
  hourlyData: HourlyData[];
  /** Daily click data (up to 7 entries). */
  weeklyData: DayOfWeekData[];
  /** Local-timezone hourly patterns. */
  hourlyPatternsLocal?: HourlyPatternData[];
  /** Weekend vs weekday click comparison. */
  weekendVsWeekday?: WeekendVsWeekdayData;
  /** Business vs after-hours click comparison. */
  businessHoursAnalysis?: BusinessHoursData;
  /** Whether to show the weekend comparison chart. */
  showWeekendComparison: boolean;
  /** Whether to show the business hours comparison chart. */
  showBusinessComparison: boolean;
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Primary chart color. */
  primaryColor: string;
  /** Secondary chart color. */
  secondaryColor: string;
}

/**
 * Renders the Patterns tab content for the TemporalChart.
 *
 * Shows the period summary bar charts, the pattern analysis insights card,
 * local-time area chart, and the optional weekend/business-hours comparisons.
 * All data is received via props — no hooks.
 */
export function TemporalPatternsTab({
  hourlyData,
  weeklyData,
  hourlyPatternsLocal,
  weekendVsWeekday,
  businessHoursAnalysis,
  showWeekendComparison,
  showBusinessComparison,
  isDark,
  primaryColor,
  secondaryColor,
}: TemporalPatternsTabProps) {
  const { t } = useTranslation("analytics");

  const hourlyTotal = useMemo(
    () => hourlyData.reduce((sum, h) => sum + h.clicks, 0),
    [hourlyData],
  );
  const weeklyTotal = useMemo(
    () => weeklyData.reduce((sum, d) => sum + d.clicks, 0),
    [weeklyData],
  );

  const sortedWeeklyByClicks = useMemo(
    () => weeklyData.slice().sort((a, b) => b.clicks - a.clicks),
    [weeklyData],
  );

  return (
    <Stack spacing={2}>
      {hourlyTotal > 0 || weeklyTotal > 0 ? (
        <Box>
          <Grid container spacing={3}>
            {hourlyTotal > 0 ? (
              <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
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
                      primaryColor,
                      false,
                      isDark,
                    )}
                  />
                </ChartCard>
              </Grid>
            ) : null}

            {weeklyTotal > 0 ? (
              <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
                <ChartCard
                  title={t("temporal.chart.daysByEngagement")}
                  subtitle={t("charts.descriptions.dayOfWeek")}
                >
                  <ApexChartWrapper
                    type="bar"
                    size="standard"
                    {...formatBarChart(
                      sortedWeeklyByClicks,
                      "day_name",
                      "clicks",
                      secondaryColor,
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
              primaryColor,
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
            <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
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
              md={4}
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
            <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
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
                    primaryColor,
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
              md={4}
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
  );
}
