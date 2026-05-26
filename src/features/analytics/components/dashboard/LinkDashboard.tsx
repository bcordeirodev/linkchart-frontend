"use client";
/**
 * 🔗 LINK DASHBOARD - Dashboard Unificado para Link Individual
 *
 * @description
 * Componente completo que gerencia dados, métricas e gráficos do link.
 * Unifica a lógica de dashboard e charts em um único componente coeso.
 */

import { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { useDashboardData } from "@/features/analytics/hooks/useDashboardData";
import { LinkMetrics } from "@/features/links/components/LinkMetrics";
import { createPresetAnimations } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
import { EmptyState } from "@/shared/ui/base/EmptyState";

import type { DashboardData } from "@/types/analytics/dashboard";

import {
  LinkInfoCard,
  ViralityCard,
  TrafficQualityCard,
  UtmSourceCard,
  SocialAppCard,
} from "./cards";
import {
  DayOfWeekChart,
  DeviceBreakdownChart,
  HourlyClicksChart,
  TopCountriesChart,
} from "./charts";

/** Props accepted by the {@link LinkDashboard} component. */
interface LinkDashboardProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Whether to render the link info title card. Defaults to `true`. */
  showTitle?: boolean;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** Render in compact mode (reduced height, no charts). Defaults to `false`. */
  compact?: boolean;
  /** Override the default chart height in pixels. */
  chartsHeight?: number;
  /** Whether to render the chart section. Defaults to `true`. */
  showCharts?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
}

/** Pre-mapped chart data derived from the raw DashboardData payload. */
interface ChartData {
  temporal?: {
    clicks_by_hour: NonNullable<
      DashboardData["temporal_data"]
    >["clicks_by_hour"];
    clicks_by_day_of_week: NonNullable<
      DashboardData["temporal_data"]
    >["clicks_by_day_of_week"];
  };
  geographic?: {
    top_countries: Array<{ country: string; clicks: number; iso_code: string }>;
  };
  audience?: {
    device_breakdown: NonNullable<
      DashboardData["audience_data"]
    >["device_breakdown"];
  };
  utmTopSources?: NonNullable<DashboardData["summary"]>["utm_top_sources"];
  socialIab?: NonNullable<DashboardData["summary"]>["social_iab"];
}

/**
 * LinkDashboard — full unified dashboard for an individual link.
 *
 * Accepts external date-range and bot-exclusion props so that the parent
 * (e.g. `LinkAnalyticsTabs`) can drive the filter state from the URL via
 * `useAnalyticsFilters` without this component owning a local timeframe state.
 */
export function LinkDashboard({
  linkId,
  showTitle = true,
  enableRealtime = false,
  compact = false,
  chartsHeight,
  showCharts = true,
  dateFrom,
  dateTo,
  excludeBots,
}: LinkDashboardProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  // Memoize to avoid creating a new animations object on every render
  const animations = useMemo(() => createPresetAnimations(theme), [theme]);

  const { data, stats, loading, error, refresh, isRealtime } = useDashboardData(
    {
      linkId,
      enableRealtime,
      dateFrom,
      dateTo,
      excludeBots,
      refreshInterval: 60000,
    },
  );

  /**
   * Pre-maps raw DashboardData into the shapes expected by each chart component.
   * Memoized so the transformation only re-runs when `data` actually changes,
   * not on every parent re-render.
   */
  const chartData: ChartData | null = useMemo(() => {
    if (!data) return null;

    return {
      temporal: data.temporal_data
        ? {
            clicks_by_hour: data.temporal_data.clicks_by_hour || [],
            clicks_by_day_of_week:
              data.temporal_data.clicks_by_day_of_week || [],
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
          }
        : undefined,
      audience: data.audience_data
        ? {
            device_breakdown: data.audience_data.device_breakdown || [],
          }
        : undefined,
      utmTopSources: data.summary?.utm_top_sources,
      socialIab: data.summary?.social_iab,
    };
  }, [data]);

  return (
    <AnalyticsStateManager
      loading={loading}
      error={error}
      hasData={!!data}
      skeleton={compact ? undefined : <AnalyticsTabSkeleton metricCards={4} />}
      onRetry={refresh}
      loadingMessage={t("dashboard.loading")}
      emptyMessage={t("dashboard.empty")}
      minHeight={compact ? 200 : 400}
      compact={compact}
    >
      <Box>
        {/* Informações do Link */}
        {showTitle && data?.link_info ? (
          <Box sx={{ mb: 2 }}>
            <LinkInfoCard linkInfo={data.link_info} />
          </Box>
        ) : null}

        {/* Conteúdo Principal */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Métricas + Viralidade + Qualidade — mesma linha visual */}
          <LinkMetrics
            summary={data?.summary}
            linksData={[]}
            showTitle={false}
            mode="single-link"
            timeframeDays={0}
            noContainer
          />

          {data?.summary?.viral_rank && (
            <Grid item xs={12} sm={6} md={4}>
              <ViralityCard data={data.summary.viral_rank} />
            </Grid>
          )}

          {data?.summary?.quality && (
            <Grid item xs={12} sm={6} md={4}>
              <TrafficQualityCard data={data.summary.quality} />
            </Grid>
          )}

          {/* Gráficos - Renderização Direta */}
          {!compact && showCharts && chartData ? (
            <Grid item xs={12}>
              {renderCharts(data!, chartData, chartsHeight, animations, t)}
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
              {isRealtime ? (
                <>
                  {" • "}
                  <Circle
                    size={8}
                    fill="currentColor"
                    style={{
                      color: theme.palette.error.main,
                      verticalAlign: "middle",
                      display: "inline",
                    }}
                  />
                  {` ${t("dashboard.realtime")}`}
                </>
              ) : null}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </AnalyticsStateManager>
  );
}

/**
 * Renders the chart grid section for the dashboard using pre-mapped `chartData`.
 *
 * Accepts the pre-computed `ChartData` object (memoized in the parent) so that
 * this helper never triggers redundant array transformations on each call.
 *
 * @param data - Full dashboard data payload (used for UTM / social fields).
 * @param chartData - Pre-mapped chart data derived from `data` via `useMemo`.
 * @param height - Optional fixed height for each chart.
 * @param animations - MUI animation preset object.
 * @param t - i18next translation function scoped to the `"analytics"` namespace.
 * @returns A `<Grid>` of charts or an {@link EmptyState} when there is no data.
 */
function renderCharts(
  data: DashboardData,
  chartData: ChartData,
  height: number | undefined,
  animations: ReturnType<typeof createPresetAnimations>,
  t: TFunction<"analytics">,
) {
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

      {/* Campanhas UTM e Tráfego via App Social */}
      {chartData.utmTopSources && chartData.utmTopSources.length > 0 ? (
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <UtmSourceCard data={chartData.utmTopSources} />
        </Grid>
      ) : null}
      {chartData.socialIab &&
      (chartData.socialIab.total > 0 ||
        !chartData.socialIab.navigation_context_available) ? (
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <SocialAppCard data={chartData.socialIab} />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default LinkDashboard;
