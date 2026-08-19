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
import { useInsightsData } from "@/features/analytics/hooks/useInsightsData";
import { formatApproxRate } from "@/features/analytics/utils/displayLabels";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { EmptyState } from "@/shared/ui/base/EmptyState";
import { SectionLabel } from "@/shared/ui/base/SectionLabel";

import type { DashboardSummary } from "@/types/analytics/dashboard";

import { BusinessInsights } from "./BusinessInsights";
import { OverviewKpiHeader } from "./OverviewKpiHeader";
import { OverviewSkeleton } from "./OverviewSkeleton";
import {
  DashboardChartSection,
  chartFlags,
  type ChartData,
} from "./DashboardChartSection";

/** Props accepted by the {@link LinkDashboard} component. */
interface LinkDashboardProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
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
 * Formats the traffic-quality summary as a display string (`"{organic_percentage}%"`).
 * Returns the provided `noDataLabel` (e.g. "No data") when the quality block is
 * absent, so the hero header stays consistent with the rest of the dashboard.
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

  // The `/insights` payload survived the death of the Insights tab: its
  // plain-language reading of the numbers is what a non-expert actually came
  // for, so it moved up here. Skipped entirely in `compact` mode (the tile on
  // the links list has no room for it).
  const { data: insightsData } = useInsightsData({
    linkId,
    dateFrom,
    dateTo,
    excludeBots,
    enabled: !compact,
  });

  /** The three highest-priority insights — `BusinessInsights` sorts by priority itself. */
  const topInsights = useMemo(
    () => insightsData?.insights ?? [],
    [insightsData],
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

  // A link with no clicks still gets a complete payload back — every field
  // simply reads zero. `!!data` was therefore always true once the request
  // succeeded, which made the empty state unreachable and left a link nobody
  // has clicked showing a full wall of zeroed charts. The click count is what
  // actually decides whether there is anything to show.
  const hasClicks = (data?.summary?.total_clicks ?? 0) > 0;

  return (
    <AnalyticsStateManager
      loading={loading}
      error={error}
      hasData={!!data && hasClicks}
      skeleton={compact ? undefined : <OverviewSkeleton />}
      onRetry={refresh}
      loadingMessage={t("dashboard.loading")}
      // The hook's own error strings are developer-facing; what the user reads
      // is this, translated, with the retry button beside it.
      errorMessage={t("dashboard.loadError")}
      emptyMessage={t("dashboard.empty")}
      minHeight={compact ? 200 : 400}
      compact={compact}
    >
      <Box>
        {/* Hero KPI header — total clicks + 4 compact tiles */}
        <OverviewKpiHeader
          totalClicks={data?.summary?.total_clicks ?? 0}
          uniqueVisitors={data?.summary?.unique_visitors ?? 0}
          countries={data?.summary?.countries_reached ?? 0}
          avgDaily={formatApproxRate(
            data?.summary?.avg_daily_clicks,
            i18n.language,
          )}
          qualityLabel={formatQuality(
            data?.summary?.quality,
            t("metrics.noData"),
          )}
          sparkline={(data?.temporal_data?.clicks_by_hour ?? []).map(
            (h) => h.clicks ?? 0,
          )}
          trendPct={data?.summary?.clicks_variation_pct ?? null}
        />

        {/* Gráficos — seções em ordem fixa. "Aquisição" (UTM) saiu daqui: vive
            na aba Origem, sub-tab Campanhas. Nos dois lugares seria duplicação
            — exatamente o que este redesenho existe para matar. */}
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

        {/* "O que isso quer dizer" — the plain-language reading of the numbers.
            It sits below the main charts so the reader first sees the metrics
            and the visualizations, then the plain-language interpretation that
            ties them together. Capped at the three highest-priority items
            (BusinessInsights sorts by priority). */}
        {!compact && topInsights.length > 0 ? (
          <Box sx={{ mt: { xs: 2, md: 3 } }}>
            <SectionLabel headingLevel={2}>
              {t("dashboard.whatThisMeans.title")}
            </SectionLabel>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.5, mt: { xs: 1.5, sm: 2 } }}
            >
              {t("dashboard.whatThisMeans.description")}
            </Typography>
            <BusinessInsights
              insights={topInsights}
              showTitle={false}
              maxItems={3}
            />
          </Box>
        ) : null}

        {/* Footer - Informações de Qualidade */}
        {stats ? (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "background.paper",
              // Hairline explícita (varredura de temas 2026-08-17): o rodapé
              // vinha só com `background.paper`, um degrau de ~1% de
              // luminância contra o canvas nos dois temas — na prática uma
              // faixa de texto solta, sem caixa. A borda de `divider` é o que
              // dá a ela o mesmo nível de superfície dos cards acima.
              border: `1px solid ${theme.palette.divider}`,
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
