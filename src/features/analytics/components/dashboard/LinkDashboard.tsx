"use client";
/**
 * 🔗 LINK DASHBOARD - Dashboard Unificado para Link Individual
 *
 * @description
 * Componente completo que gerencia dados, métricas e gráficos do link.
 * Unifica a lógica de dashboard e charts em um único componente coeso.
 */

import React, { useMemo, type ReactNode } from "react";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDashboardData } from "@/features/analytics/hooks/useDashboardData";
import { createPresetAnimations } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { EmptyState } from "@/shared/ui/base/EmptyState";

import type {
  DashboardData,
  DashboardSummary,
} from "@/types/analytics/dashboard";

import { OverviewKpiHeader } from "./OverviewKpiHeader";
import {
  LinkInfoCard,
  ViralityCard,
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

/**
 * Loading skeleton that mirrors the Overview tab layout:
 * link info card → 6 metric cards (3-col) →
 * 3 chart sections (Temporal / Audience / Acquisition),
 * each with a divider label and two side-by-side charts.
 */
function OverviewSkeleton() {
  return (
    <Box>
      {/* Link info card */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={72}
        sx={{ mb: 2, borderRadius: 2 }}
      />

      {/* 6 metric cards — xs: 2 cols, sm: 2 cols, md: 3 cols */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 2, md: 3 },
          mb: { xs: 2, md: 3 },
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            animation="wave"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>

      {/* 3 chart sections: Temporal, Audience, Acquisition */}
      <Stack spacing={3}>
        {Array.from({ length: 3 }).map((_, sectionIdx) => (
          <Box key={sectionIdx}>
            {/* Section divider with overline label */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
              <Skeleton
                variant="rounded"
                animation="wave"
                width={110}
                height={18}
                sx={{ borderRadius: 1 }}
              />
              <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
            </Box>

            {/* Two charts side-by-side */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 2, md: 3 },
              }}
            >
              <Skeleton
                variant="rounded"
                animation="wave"
                height={300}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
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

type DashboardChartSectionId = "temporal" | "audience" | "acquisition";

/** Props accepted by the {@link DashboardChartSection} component. */
interface DashboardChartSectionProps {
  chartData: ChartData;
  height?: number;
  section: DashboardChartSectionId;
}

function chartFlags(chartData: ChartData) {
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
  return {
    hasHourly,
    hasWeekly,
    hasTemporal,
    hasGeographic,
    hasDevice,
    hasUtm,
    hasSocial,
    hasAudience: hasDevice || hasGeographic,
    hasAcquisition: hasUtm || hasSocial,
    hasAny: hasTemporal || hasDevice || hasGeographic || hasUtm || hasSocial,
  };
}

/**
 * Renders one dashboard chart section inside its own Grid container so section
 * order stays stable (Temporal → Audience → Acquisition last).
 */
const DashboardChartSection = React.memo(function DashboardChartSection({
  chartData,
  height,
  section,
}: DashboardChartSectionProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const animations = useMemo(() => createPresetAnimations(theme), [theme]);

  const flags = chartFlags(chartData);
  const {
    hasHourly,
    hasWeekly,
    hasTemporal,
    hasGeographic,
    hasDevice,
    hasUtm,
    hasSocial,
    hasAudience,
    hasAcquisition,
  } = flags;

  if (section === "temporal" && !hasTemporal) return null;
  if (section === "audience" && !hasAudience) return null;
  if (section === "acquisition" && !hasAcquisition) return null;

  const sectionTitle =
    section === "temporal"
      ? t("sections.temporal")
      : section === "audience"
        ? t("sections.audience")
        : t("sections.acquisition");

  const chartCells: { key: string; node: ReactNode }[] = [];

  if (section === "temporal" && hasHourly) {
    chartCells.push({
      key: "hourly",
      node: (
        <HourlyClicksChart
          data={chartData.temporal!.clicks_by_hour}
          height={height}
        />
      ),
    });
  }
  if (section === "temporal" && hasWeekly) {
    chartCells.push({
      key: "weekly",
      node: (
        <DayOfWeekChart
          data={chartData.temporal!.clicks_by_day_of_week}
          height={height}
        />
      ),
    });
  }
  if (section === "audience" && hasDevice) {
    chartCells.push({
      key: "device",
      node: (
        <DeviceBreakdownChart
          data={chartData.audience!.device_breakdown}
          height={height}
        />
      ),
    });
  }
  if (section === "audience" && hasGeographic) {
    chartCells.push({
      key: "countries",
      node: (
        <TopCountriesChart
          data={chartData.geographic!.top_countries}
          height={height}
        />
      ),
    });
  }
  if (section === "acquisition" && hasUtm) {
    chartCells.push({
      key: "utm",
      node: <UtmSourceCard data={chartData.utmTopSources!} />,
    });
  }
  if (section === "acquisition" && hasSocial) {
    chartCells.push({
      key: "social",
      node: <SocialAppCard data={chartData.socialIab!} />,
    });
  }

  const twoColumnLayout = chartCells.length > 1;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Divider textAlign="left">
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 700, letterSpacing: "0.1em" }}
        >
          {sectionTitle}
        </Typography>
      </Divider>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: twoColumnLayout ? "repeat(2, minmax(0, 1fr))" : "1fr",
          },
          gap: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {chartCells.map(({ key, node }) => (
          <Box
            key={key}
            sx={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              ...animations.fadeIn,
            }}
          >
            <Box sx={{ width: "100%", minWidth: 0 }}>{node}</Box>
          </Box>
        ))}
      </Box>
    </Stack>
  );
});

/**
 * Formats the traffic-quality summary into the same display string used by the
 * standalone TrafficQualityCard (`"{organic_percentage}%"`). Returns the
 * provided `noDataLabel` (e.g. "No data") when the quality block is absent, so
 * the hero header stays consistent with the rest of the dashboard.
 *
 * @param quality - The `summary.quality` block from the dashboard payload.
 * @param noDataLabel - Fallback label shown when quality data is unavailable.
 * @returns A formatted percentage string, or the no-data fallback.
 */
function formatQuality(
  quality: DashboardSummary["quality"] | undefined,
  noDataLabel: string,
): string {
  if (!quality) return noDataLabel;
  return `${quality.organic_percentage}%`;
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
      skeleton={compact ? undefined : <OverviewSkeleton />}
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

        {/* Hero KPI header — total clicks + 4 compact tiles */}
        <OverviewKpiHeader
          totalClicks={data?.summary?.total_clicks ?? 0}
          uniqueVisitors={data?.summary?.unique_visitors ?? 0}
          countries={data?.summary?.countries_reached ?? 0}
          avgDaily={
            data?.summary?.avg_daily_clicks != null
              ? data.summary.avg_daily_clicks.toLocaleString()
              : null
          }
          qualityLabel={formatQuality(
            data?.summary?.quality,
            t("metrics.noData"),
          )}
          sparkline={(data?.temporal_data?.clicks_by_hour ?? []).map(
            (h) => h.clicks ?? 0,
          )}
        />

        {/* Viralidade — relocada para logo abaixo do header */}
        {data?.summary?.viral_rank && (
          <Box sx={{ mb: 2, maxWidth: { xs: "100%", sm: 360 } }}>
            <ViralityCard data={data.summary.viral_rank} />
          </Box>
        )}

        {/* Gráficos — seções em ordem fixa; Canais de Aquisição por último */}
        {!compact && showCharts && chartData ? (
          chartFlags(chartData).hasAny ? (
            <Stack spacing={3} sx={{ mt: { xs: 2, md: 3 } }}>
              <DashboardChartSection
                chartData={chartData}
                height={chartsHeight}
                section="temporal"
              />
              <DashboardChartSection
                chartData={chartData}
                height={chartsHeight}
                section="audience"
              />
              <DashboardChartSection
                chartData={chartData}
                height={chartsHeight}
                section="acquisition"
              />
            </Stack>
          ) : (
            <Box sx={{ mt: 2 }}>
              <EmptyState
                variant="charts"
                height={400}
                title={t("dashboard.charts.noData")}
                description={t("dashboard.charts.noDataDesc")}
              />
            </Box>
          )
        ) : null}

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
