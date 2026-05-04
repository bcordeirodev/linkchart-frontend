"use client";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import TabDescription from "@/shared/ui/base/TabDescription";

import { useTemporalData } from "../../hooks/useTemporalData";

import { TemporalChart } from "./TemporalChart";

interface TemporalAnalysisProps {
  linkId: string;
  title?: string;
  enableRealtime?: boolean;
}

/**
 * Componente de análise temporal com padrões de cliques por hora e dia da semana
 */
export function TemporalAnalysis({
  linkId,
  title,
  enableRealtime = false,
}: TemporalAnalysisProps) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("temporal.title");
  const { data, stats, loading, error, refresh, isRealtime } = useTemporalData({
    linkId,
    enableRealtime,
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

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Clock {...ICON_LG} />}
          title={displayTitle}
          description={t("temporal.description")}
          highlight={`${t("temporal.chart.peakHour")} ${peakHour} - ${peakDay}`}
          metadata={isRealtime ? t("dashboard.realtime") : t("temporal.allData")}
        />
      </Box>

      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        onRetry={refresh}
        loadingMessage={t("temporal.loading")}
        emptyMessage={t("temporal.empty")}
        minHeight={300}
      >
        <Box>
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
                  icon={<Clock {...ICON_LG} />}
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

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TemporalChart
                hourlyData={data?.clicks_by_hour || []}
                weeklyData={data?.clicks_by_day_of_week || []}
                hourlyPatternsLocal={(data as any)?.hourly_patterns_local}
                weekendVsWeekday={(data as any)?.weekend_vs_weekday}
                businessHoursAnalysis={(data as any)?.business_hours_analysis}
                advancedData={data?.advanced}
              />
            </Grid>
          </Grid>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default TemporalAnalysis;
