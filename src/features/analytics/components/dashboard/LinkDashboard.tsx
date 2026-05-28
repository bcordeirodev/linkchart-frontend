"use client";
/**
 * 🔗 LINK DASHBOARD - Dashboard Unificado para Link Individual
 *
 * @description
 * Componente completo que gerencia dados, métricas e gráficos do link.
 * Unifica a lógica de dashboard e charts em um único componente coeso.
 */

import React, { useMemo } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

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

/** Props accepted by the {@link ChartsSection} component. */
interface ChartsSectionProps {
  /** Pre-mapped chart data to render. */
  chartData: ChartData;
  /** Optional fixed height for each chart in pixels. */
  height?: number;
}

/**
 * ChartsSection — renders individual chart `Grid item` children for the dashboard.
 *
 * Returns a React fragment of `Grid item` elements that slot directly into the
 * parent `Grid container` in {@link LinkDashboard}. Does NOT wrap in its own
 * `Grid container` to avoid double-nesting.
 *
 * Chart order: UTM → Social → Hourly → DayOfWeek → Device → Countries.
 * Adaptive layout: single items in a pair use `md=12` instead of `md=6`.
 */
const ChartsSection = React.memo(function ChartsSection({
  chartData,
  height,
}: ChartsSectionProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const animations = useMemo(() => createPresetAnimations(theme), [theme]);

  const hasHourly = !!chartData.temporal?.clicks_by_hour?.length;
  const hasWeekly = !!chartData.temporal?.clicks_by_day_of_week?.length;
  const hasTemporal = hasHourly || hasWeekly;
  const hasGeographic = !!chartData.geographic?.top_countries?.length;
  const hasDevice = !!chartData.audience?.device_breakdown?.length;
  const hasUtm = !!(
    chartData.utmTopSources && chartData.utmTopSources.length > 0
  );
  const hasSocial = !!(
    chartData.socialIab &&
    (chartData.socialIab.total > 0 ||
      !chartData.socialIab.navigation_context_available)
  );

  if (!hasTemporal && !hasGeographic && !hasDevice && !hasUtm && !hasSocial) {
    return (
      <Grid item xs={12}>
        <EmptyState
          variant="charts"
          height={400}
          title={t("dashboard.charts.noData")}
          description={t("dashboard.charts.noDataDesc")}
        />
      </Grid>
    );
  }

  return (
    <>
      {/* ── Canais de Aquisição ─────────────────────────────────────────── */}
      {(hasUtm || hasSocial) && (
        <Grid item xs={12}>
          <Divider textAlign="left" sx={{ mt: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: "0.1em" }}
            >
              {t("sections.acquisition")}
            </Typography>
          </Divider>
        </Grid>
      )}

      {hasUtm ? (
        <Grid
          item
          xs={12}
          md={hasUtm && hasSocial ? 6 : 12}
          sx={{ display: "flex", ...animations.fadeIn }}
        >
          <UtmSourceCard data={chartData.utmTopSources!} />
        </Grid>
      ) : null}

      {hasSocial ? (
        <Grid
          item
          xs={12}
          md={hasUtm && hasSocial ? 6 : 12}
          sx={{ display: "flex", ...animations.fadeIn }}
        >
          <SocialAppCard data={chartData.socialIab!} />
        </Grid>
      ) : null}

      {/* ── Padrões Temporais ───────────────────────────────────────────── */}
      {hasTemporal && (
        <Grid item xs={12}>
          <Divider textAlign="left" sx={{ mt: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: "0.1em" }}
            >
              {t("sections.temporal")}
            </Typography>
          </Divider>
        </Grid>
      )}

      {hasHourly ? (
        <Grid
          item
          xs={12}
          md={hasHourly && hasWeekly ? 6 : 12}
          sx={{ display: "flex", ...animations.fadeIn }}
        >
          <HourlyClicksChart
            data={chartData.temporal!.clicks_by_hour}
            height={height}
          />
        </Grid>
      ) : null}

      {hasWeekly ? (
        <Grid
          item
          xs={12}
          md={hasHourly && hasWeekly ? 6 : 12}
          sx={{ display: "flex", ...animations.fadeIn }}
        >
          <DayOfWeekChart
            data={chartData.temporal!.clicks_by_day_of_week}
            height={height}
          />
        </Grid>
      ) : null}

      {/* ── Audiência ───────────────────────────────────────────────────── */}
      {(hasDevice || hasGeographic) && (
        <Grid item xs={12}>
          <Divider textAlign="left" sx={{ mt: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: "0.1em" }}
            >
              {t("sections.audience")}
            </Typography>
          </Divider>
        </Grid>
      )}

      {hasDevice ? (
        <Grid
          item
          xs={12}
          md={hasDevice && hasGeographic ? 6 : 12}
          sx={{ display: "flex", ...animations.fadeIn }}
        >
          <DeviceBreakdownChart
            data={chartData.audience!.device_breakdown}
            height={height}
          />
        </Grid>
      ) : null}

      {hasGeographic ? (
        <Grid
          item
          xs={12}
          md={hasDevice && hasGeographic ? 6 : 12}
          sx={{ display: "flex", ...animations.fadeIn }}
        >
          <TopCountriesChart
            data={chartData.geographic!.top_countries}
            height={height}
          />
        </Grid>
      ) : null}
    </>
  );
});

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
                iso_code:
                  c.iso_code ||
                  c.country?.substring(0, 2).toUpperCase() ||
                  "XX",
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
      skeleton={compact ? undefined : <AnalyticsTabSkeleton metricCards={6} />}
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

          {/* Gráficos — ChartsSection contributes Grid items directly */}
          {!compact && showCharts && chartData ? (
            <ChartsSection chartData={chartData} height={chartsHeight} />
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

export default LinkDashboard;
