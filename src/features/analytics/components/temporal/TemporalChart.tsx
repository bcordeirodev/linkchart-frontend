"use client";
import { Clock, Zap, Search } from "lucide-react";
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

import { ICON_LG, ICON_SM } from "@/lib/theme/iconDefaults";

import {
  formatAreaChart,
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import { getStandardChartColors, getChartColorsByType } from "@/lib/theme";
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
  // Enhanced temporal data
  hourlyPatternsLocal?: HourlyPatternData[];
  weekendVsWeekday?: WeekendVsWeekdayData;
  businessHoursAnalysis?: BusinessHoursData;
  // NEW: Advanced temporal data from unified endpoint
  advancedData?: AdvancedTemporalData;
}

export function TemporalChart({
  hourlyData,
  weeklyData,
  showInsights = true,
  // Enhanced props
  hourlyPatternsLocal,
  weekendVsWeekday,
  businessHoursAnalysis,
  // NEW: Advanced data
  advancedData,
}: TemporalChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState(0);

  // Cores padronizadas usando novo sistema
  const chartColors = getStandardChartColors(theme);
  const _temporalColors = getChartColorsByType("temporal");

  // Verificar se há dados enhanced disponíveis
  const hasEnhancedData =
    hourlyPatternsLocal?.length || weekendVsWeekday || businessHoursAnalysis;

  // Verificar se há dados advanced disponíveis
  const hasAdvancedData =
    advancedData &&
    ((advancedData.weekly_trends?.length ?? 0) > 0 ||
      (advancedData.monthly_trends?.length ?? 0) > 0 ||
      advancedData.peak_analysis?.peak_hour != null ||
      (advancedData.timezone_analysis &&
        advancedData.timezone_analysis.length > 0));

  const hasHeatmap = (advancedData?.heatmap_data?.length ?? 0) > 0;
  const hasDailyTimeline = (advancedData?.daily_timeline?.length ?? 0) > 0;
  const hasDeviceByPeriod = (advancedData?.device_by_period?.length ?? 0) > 0;

  const hasPeakAnalysis = advancedData?.peak_analysis?.peak_hour != null;
  const hasTrends =
    advancedData &&
    ((advancedData.weekly_trends?.length ?? 0) > 0 ||
      (advancedData.monthly_trends?.length ?? 0) > 0);
  const hasTimezones =
    advancedData?.timezone_analysis &&
    advancedData.timezone_analysis.length > 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Encontrar horário de pico
  const peakHour =
    hourlyData.length > 0
      ? hourlyData.reduce((prev, current) =>
          prev.clicks > current.clicks ? prev : current,
        )
      : { label: "--", clicks: 0 };

  // Encontrar dia de pico
  const peakDay =
    weeklyData.length > 0
      ? weeklyData.reduce((prev, current) =>
          prev.clicks > current.clicks ? prev : current,
        )
      : { day_name: "--", clicks: 0 };

  const getTotalClicks = (data: { clicks: number }[]) => {
    return data.reduce((sum, item) => sum + item.clicks, 0);
  };

  const hourlyTotal = getTotalClicks(hourlyData);
  const weeklyTotal = getTotalClicks(weeklyData);

  // Calcular insights temporais
  const avgClicksPerHour = hourlyTotal / 24;
  const avgClicksPerDay = weeklyTotal / 7;
  const activeHours = hourlyData.filter(
    (hour) => hour.clicks > avgClicksPerHour,
  ).length;
  const activeDays = weeklyData.filter(
    (day) => day.clicks > avgClicksPerDay,
  ).length;

  // Identificar padrões
  const isWeekendActive =
    weeklyData.length >= 7
      ? weeklyData[0].clicks + weeklyData[6].clicks >
        weeklyData.slice(1, 6).reduce((sum, day) => sum + day.clicks, 0)
      : false;
  const isBusinessHoursActive =
    hourlyData.length >= 24
      ? hourlyData.slice(9, 18).reduce((sum, hour) => sum + hour.clicks, 0) >
        hourlyData.slice(0, 9).reduce((sum, hour) => sum + hour.clicks, 0) +
          hourlyData.slice(18, 24).reduce((sum, hour) => sum + hour.clicks, 0)
      : false;

  return (
    <Box>
      {/* Tabs para análises enhanced e advanced */}
      {hasEnhancedData || hasAdvancedData ? (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={t("temporal.chart.generalPatterns")} />
            <Tab
              label={t("temporal.chart.localTime")}
              icon={<Clock {...ICON_SM} />}
              iconPosition="start"
              disabled={
                !hourlyPatternsLocal?.length || hourlyPatternsLocal.length < 3
              }
            />
            <Tab
              label={t("temporal.chart.weekend")}
              disabled={!weekendVsWeekday}
            />
            <Tab
              label={t("temporal.chart.businessHours")}
              disabled={!businessHoursAnalysis}
            />
            <Tab
              label={t("temporal.chart.peaks")}
              icon={<Zap {...ICON_SM} />}
              iconPosition="start"
              disabled={!hasPeakAnalysis}
            />
            <Tab label={t("temporal.chart.trends")} disabled={!hasTrends} />
            <Tab
              label={t("temporal.chart.timezones")}
              disabled={!hasTimezones}
            />
            <Tab
              label={t("temporal.chart.dailyTimeline")}
              disabled={!hasDailyTimeline}
            />
            <Tab
              label={t("temporal.chart.heatmapHourDay")}
              disabled={!hasHeatmap}
            />
            <Tab
              label={t("temporal.chart.deviceByPeriod")}
              disabled={!hasDeviceByPeriod}
            />
          </Tabs>
        </Box>
      ) : null}

      {/* Tab 0: Padrões Gerais (Conteúdo original) */}
      {(!(hasEnhancedData || hasAdvancedData) || activeTab === 0) && (
        <Grid container spacing={3}>
          {/* Insights Temporais */}
          <Grid item xs={12}>
            <Alert
              severity="info"
              sx={{
                mb: 3, // Aumentar margem inferior
                mt: 1, // Adicionar margem superior
                position: "relative", // Garantir posicionamento correto
                zIndex: 1, // Garantir que fique abaixo das tabs
              }}
            >
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
          </Grid>

          {/* Resumo por Período */}
          {hourlyTotal > 0 ? (
            <Grid item xs={12} lg={6}>
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>{t("temporal.chart.periodSummary")}</strong>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      {t("temporal.chart.morningPeriod")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {hourlyData
                        .slice(6, 12)
                        .reduce((sum, h) => sum + h.clicks, 0)}{" "}
                      {t("temporal.chart.clicks")}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      {t("temporal.chart.afternoonPeriod")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {hourlyData
                        .slice(12, 18)
                        .reduce((sum, h) => sum + h.clicks, 0)}{" "}
                      {t("temporal.chart.clicks")}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      {t("temporal.chart.eveningPeriod")}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {hourlyData
                        .slice(18, 24)
                        .reduce((sum, h) => sum + h.clicks, 0)}{" "}
                      {t("temporal.chart.clicks")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ) : null}

          {/* Lista de dias ordenada por engajamento */}
          {weeklyTotal > 0 ? (
            <Grid item xs={12} lg={6}>
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>{t("temporal.chart.daysByEngagement")}</strong>
                </Typography>
                {weeklyData
                  .slice()
                  .sort((a, b) => b.clicks - a.clicks)
                  .map((day, index) => (
                    <Box
                      key={day.day}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 0.5,
                        borderBottom:
                          index < weeklyData.length - 1 ? "1px solid" : "none",
                        borderBottomColor: "divider",
                      }}
                    >
                      <Typography variant="body2">{day.day_name}</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {day.clicks} {t("temporal.chart.clicks")}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Grid>
          ) : null}

          {/* Insights Temporais Integrados */}
          {showInsights && (hourlyTotal > 0 || weeklyTotal > 0) ? (
            <Grid item xs={12}>
              <Card sx={{ mt: 2 }}>
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
                    {/* Padrões por Hora */}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={
                              isBusinessHoursActive
                                ? t("temporal.chart.businessHours")
                                : t("temporal.chart.outsideHoursChip")
                            }
                            color={
                              isBusinessHoursActive ? "success" : "warning"
                            }
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {isBusinessHoursActive
                              ? t("temporal.chart.activeNow")
                              : t("temporal.chart.activeAfterHours")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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

                    {/* Padrões por Dia */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t("temporal.chart.dayPatterns")}
                      </Typography>
                      <Stack spacing={1}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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

                  {/* Recomendações */}
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
            </Grid>
          ) : null}
        </Grid>
      )}

      {/* NEW: Tab 1 - Padrões de Hora Local */}
      {hasEnhancedData && activeTab === 1 && hourlyPatternsLocal ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ChartCard
              title={t("temporal.chart.localTimePatterns")}
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
          </Grid>
        </Grid>
      ) : null}

      {/* NEW: Tab 2 - Fim de Semana vs Dias Úteis */}
      {hasEnhancedData && activeTab === 2 && weekendVsWeekday ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ChartCard title={t("temporal.chart.weekendVsWeekday")}>
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
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
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
      ) : null}

      {/* NEW: Tab 3 - Horário Comercial */}
      {hasEnhancedData && activeTab === 3 && businessHoursAnalysis ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ChartCard title={t("temporal.chart.businessHoursAnalysis")}>
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
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
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
                      {businessHoursAnalysis.after_hours.percentage.toFixed(1)}
                      {t("temporal.chart.ofTotal")}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* NEW: Tab 4 - Análise de Picos */}
      {hasAdvancedData &&
      activeTab === 4 &&
      hasPeakAnalysis &&
      advancedData?.peak_analysis ? (
        <PeakAnalysisCard peakAnalysis={advancedData.peak_analysis} />
      ) : null}

      {/* NEW: Tab 5 - Tendências */}
      {hasAdvancedData && activeTab === 5 && hasTrends && advancedData ? (
        <TemporalTrendsChart
          weeklyTrends={advancedData.weekly_trends || []}
          monthlyTrends={advancedData.monthly_trends || []}
        />
      ) : null}

      {/* NEW: Tab 6 - Fusos Horários */}
      {hasAdvancedData &&
      activeTab === 6 &&
      hasTimezones &&
      advancedData?.timezone_analysis ? (
        <TimezoneDistributionChart
          timezoneAnalysis={advancedData.timezone_analysis}
        />
      ) : null}

      {/* NEW: Tab 7 - Timeline Diária */}
      {activeTab === 7 && hasDailyTimeline && advancedData?.daily_timeline ? (
        <DailyTimelineChart data={advancedData.daily_timeline} />
      ) : null}

      {/* NEW: Tab 8 - Heatmap Hora × Dia */}
      {activeTab === 8 && hasHeatmap && advancedData?.heatmap_data ? (
        <HourDayHeatmapChart data={advancedData.heatmap_data} />
      ) : null}

      {/* NEW: Tab 9 - Dispositivos por Período */}
      {activeTab === 9 &&
      hasDeviceByPeriod &&
      advancedData?.device_by_period ? (
        <DeviceByPeriodChart data={advancedData.device_by_period} />
      ) : null}
    </Box>
  );
}
