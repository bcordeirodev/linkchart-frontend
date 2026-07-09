"use client";
/**
 * 🔗 LINK DASHBOARD - Dashboard Unificado para Link Individual
 *
 * @description
 * Componente completo que gerencia dados, métricas e gráficos do link.
 * Unifica a lógica de dashboard e charts em um único componente coeso.
 */

import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDashboardData } from "@/features/analytics/hooks/useDashboardData";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { EmptyState } from "@/shared/ui/base/EmptyState";

import type { DashboardSummary } from "@/types/analytics/dashboard";

import { OverviewKpiHeader } from "./OverviewKpiHeader";
import { OverviewSkeleton } from "./OverviewSkeleton";
import {
  DashboardChartSection,
  chartFlags,
  type ChartData,
} from "./DashboardChartSection";
import { LinkInfoCard } from "./cards";

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
  const { t, i18n } = useTranslation("analytics");

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
          trendPct={data?.summary?.clicks_variation_pct ?? null}
        />

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
              {t("dashboard.dataQuality")}:{" "}
              {t(`dashboard.dataQualityValues.${stats.dataQuality}`)} •{" "}
              {t("dashboard.lastUpdate")}:{" "}
              {new Date(stats.lastUpdate).toLocaleTimeString(i18n.language)}
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
