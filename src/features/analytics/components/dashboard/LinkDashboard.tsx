"use client";
/**
 * 🔗 LINK DASHBOARD - Dashboard Unificado para Link Individual
 *
 * @description
 * Componente completo que gerencia dados, métricas e gráficos do link.
 * Unifica a lógica de dashboard e charts em um único componente coeso.
 */

import { Link2 } from "lucide-react";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { useDashboardData } from "@/features/analytics/hooks/useDashboardData";
import { LinkMetrics } from "@/features/links/components/LinkMetrics";
import { createPresetAnimations } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { EmptyState } from "@/shared/ui/base/EmptyState";
import TabDescription from "@/shared/ui/base/TabDescription";

import type { DashboardData } from "@/types/analytics/dashboard";

import {
  LinkInfoCard,
  TimeframeSelector,
  ViralityCard,
  TrafficQualityCard,
} from "./cards";
import {
  DayOfWeekChart,
  DeviceBreakdownChart,
  HourlyClicksChart,
  TopCountriesChart,
} from "./charts";

interface LinkDashboardProps {
  linkId: string;
  showTitle?: boolean;
  title?: string;
  enableRealtime?: boolean;
  showTimeframeSelector?: boolean;
  compact?: boolean;
  chartsHeight?: number;
  showCharts?: boolean;
}

/**
 * LinkDashboard - Dashboard completo e unificado para link individual
 */
export function LinkDashboard({
  linkId,
  showTitle = true,
  title,
  enableRealtime = false,
  showTimeframeSelector = true,
  compact = false,
  chartsHeight,
  showCharts = true,
}: LinkDashboardProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const animations = createPresetAnimations(theme);
  const [timeframe, setTimeframe] = useState<"1h" | "24h" | "7d" | "30d">("7d");

  // If title prop is not passed, use translated default
  const displayTitle = title ?? t("dashboard.title");

  const { data, stats, loading, error, refresh, isRealtime } = useDashboardData(
    {
      linkId,
      enableRealtime,
      timeframe,
      refreshInterval: 60000,
    },
  );

  return (
    <AnalyticsStateManager
      loading={loading}
      error={error}
      hasData={!!data}
      onRetry={refresh}
      loadingMessage={t("dashboard.loading")}
      emptyMessage={t("dashboard.empty")}
      minHeight={compact ? 200 : 400}
      compact={compact}
    >
      <Box>
        {/* Header */}
        {showTitle ? (
          <Box sx={{ mb: 2 }}>
            <TabDescription
              icon={<Link2 {...ICON_LG} />}
              title={displayTitle}
              description={t("dashboard.description")}
              highlight={`${data?.summary?.total_clicks || 0} ${t("dashboard.totalClicksLabel")}`}
              metadata={
                isRealtime
                  ? t("dashboard.realtime")
                  : t(`timeframe.${timeframe}`)
              }
            />

            {/* Informações do Link */}
            {data?.link_info ? (
              <LinkInfoCard linkInfo={data.link_info} />
            ) : null}

            {/* Seletor de Timeframe */}
            {showTimeframeSelector ? (
              <TimeframeSelector value={timeframe} onChange={setTimeframe} />
            ) : null}
          </Box>
        ) : null}

        {/* Conteúdo Principal */}
        <Grid container spacing={3}>
          {/* Métricas */}
          <Grid item xs={12}>
            <LinkMetrics
              summary={data?.summary}
              linksData={[]}
              showTitle={!compact}
              title={t("dashboard.metrics.title")}
              variant={compact ? "compact" : "detailed"}
            />
          </Grid>

          {/* Viralidade */}
          {data?.summary?.viral_rank && (
            <Grid item xs={12} sm={6} md={4}>
              <ViralityCard data={data.summary.viral_rank} />
            </Grid>
          )}

          {/* Qualidade do Tráfego (Phase 3) */}
          {data?.summary?.quality && (
            <Grid item xs={12} sm={6} md={4}>
              <TrafficQualityCard data={data.summary.quality} />
            </Grid>
          )}

          {/* Gráficos - Renderização Direta */}
          {!compact && showCharts && data ? (
            <Grid item xs={12}>
              {renderCharts(data, chartsHeight, animations, t)}
            </Grid>
          ) : null}
        </Grid>

        {/* Footer - Informações de Qualidade */}
        {stats ? (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: `${radiusTokens.md}px`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t("dashboard.dataQuality")}: {stats.dataQuality} •{" "}
              {t("dashboard.lastUpdate")}:{" "}
              {new Date(stats.lastUpdate).toLocaleTimeString()}
              {isRealtime ? ` • 🔴 ${t("dashboard.realtime")}` : ""}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </AnalyticsStateManager>
  );
}

/**
 * Função auxiliar para renderizar gráficos
 */
function renderCharts(
  data: DashboardData,
  height: number | undefined,
  animations: ReturnType<typeof createPresetAnimations>,
  t: TFunction<"analytics">,
) {
  // Mapear dados para formato esperado pelos componentes de gráficos
  const chartData = {
    temporal: data.temporal_data
      ? {
          clicks_by_hour: data.temporal_data.clicks_by_hour || [],
          clicks_by_day_of_week: data.temporal_data.clicks_by_day_of_week || [],
        }
      : undefined,
    geographic: data.geographic_data
      ? {
          top_countries: (data.geographic_data.top_countries || []).map(
            (c) => ({
              country: c.country,
              clicks: c.clicks,
              iso_code: c.country?.substring(0, 2).toUpperCase() || "XX",
            }),
          ),
          top_cities: (data.geographic_data.top_cities || []).map((c) => ({
            city: c.city,
            clicks: c.clicks,
            state: "Unknown",
            country: "Unknown",
          })),
          top_states: [],
          heatmap_data: [],
        }
      : undefined,
    audience: data.audience_data
      ? {
          device_breakdown: data.audience_data.device_breakdown || [],
        }
      : undefined,
    overview: {
      total_clicks: data.summary?.total_clicks || 0,
      unique_visitors: data.summary?.unique_visitors || 0,
      countries_reached: data.summary?.countries_reached || 0,
      avg_daily_clicks: 0,
    },
  };

  const hasTemporal = !!(
    chartData.temporal?.clicks_by_hour?.length ||
    chartData.temporal?.clicks_by_day_of_week?.length
  );
  const hasGeographic = !!chartData.geographic?.top_countries?.length;
  const hasDevice = !!chartData.audience?.device_breakdown?.length;

  if (!hasTemporal && !hasGeographic && !hasDevice) {
    return (
      <EmptyState
        variant="charts"
        height={400}
        title={t("dashboard.charts.noData")}
        description={t("dashboard.charts.noDataDesc")}
      />
    );
  }

  return (
    <Grid container spacing={3} sx={{ ...animations.fadeIn }}>
      {/* Gráficos Temporais */}
      {hasTemporal && chartData.temporal ? (
        <>
          {chartData.temporal.clicks_by_hour?.length > 0 ? (
            <Grid item xs={12} md={6}>
              <HourlyClicksChart
                data={chartData.temporal.clicks_by_hour}
                height={height}
              />
            </Grid>
          ) : null}
          {chartData.temporal.clicks_by_day_of_week?.length > 0 ? (
            <Grid item xs={12} md={6}>
              <DayOfWeekChart
                data={chartData.temporal.clicks_by_day_of_week}
                height={height}
              />
            </Grid>
          ) : null}
        </>
      ) : null}

      {/* Gráficos de Dispositivos e Países */}
      {hasDevice && chartData.audience?.device_breakdown ? (
        <Grid item xs={12} md={6}>
          <DeviceBreakdownChart
            data={chartData.audience.device_breakdown}
            height={height}
          />
        </Grid>
      ) : null}
      {hasGeographic && chartData.geographic?.top_countries ? (
        <Grid item xs={12} md={6}>
          <TopCountriesChart
            data={chartData.geographic.top_countries}
            height={height}
          />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default LinkDashboard;
