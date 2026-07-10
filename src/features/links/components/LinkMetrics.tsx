"use client";
import { TrendingUp, BarChart3, Users, Globe } from "lucide-react";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { Grid, Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

import { AccountClicksTrendPanel } from "@/features/links/components/AccountClicksTrendPanel";
import { OverviewStatCard } from "@/features/links/components/OverviewStatCard";
import { getLinkStatus } from "@/features/links/utils/linkStatus";
import { aggregateSparklines } from "@/features/links/utils/overviewAggregation";
import { formatCount } from "@/lib/utils";
import type { BatchMetaResponse, LinkResponse } from "@/types";

interface LinkMetricsSummary {
  total_links?: number;
  active_links?: number;
  total_clicks?: number;
  avg_clicks_per_link?: number;
  unique_visitors?: number;
  countries_reached?: number;
}

interface DashboardMetricsProps {
  summary?: LinkMetricsSummary;
  linksData?: LinkResponse[];
  showTitle?: boolean;
  title?: string;
  /** Render link-individual metrics instead of portfolio counters */
  mode?: "list" | "single-link";
  /** Days covered by the current timeframe — used to compute avg daily clicks */
  timeframeDays?: number;
  /** When true, renders Grid items without the Box+Grid container wrapper (caller owns the container) */
  noContainer?: boolean;
  /**
   * Batch link metadata (`useLinksMeta` response), used in `mode="list"` to
   * render the aggregated click-trend chart under the metric cards. Optional
   * — the "Overview vivo" chart simply doesn't render without it.
   */
  meta?: BatchMetaResponse;
  /** @deprecated mantido apenas para compatibilidade com consumidores legados */
  variant?: "compact" | "detailed";
}

/**
 * 📊 Métricas do Dashboard
 *
 * mode="list" (default): total_links, active_links, total_clicks, avg_clicks_per_link
 * mode="single-link": total_clicks, unique_visitors, countries_reached, avg_daily_clicks
 */
export function LinkMetrics({
  summary,
  linksData = [],
  showTitle = false,
  title,
  mode = "list",
  timeframeDays = 7,
  noContainer = false,
  meta,
}: DashboardMetricsProps) {
  const { t, i18n } = useTranslation("links");
  const { t: tA } = useTranslation("analytics");

  // Only meaningful for the list-mode account overview — the chart panel
  // renders nothing (and this stays an empty array) for single-link mode.
  const aggregatedSparkline = useMemo(
    () => (mode === "list" ? aggregateSparklines(meta ?? {}) : []),
    [mode, meta],
  );

  // Variação agregada do período: soma current/previous dos trends por link.
  // `null` (sem base de comparação) oculta o badge — nunca inventa números.
  const aggregateTrendPercent = useMemo(() => {
    if (mode !== "list" || !meta) {
      return null;
    }
    let current = 0;
    let previous = 0;
    let hasTrend = false;
    for (const linkMeta of Object.values(meta)) {
      if (linkMeta.trend) {
        current += linkMeta.trend.current ?? 0;
        previous += linkMeta.trend.previous ?? 0;
        hasTrend = true;
      }
    }
    if (!hasTrend || previous <= 0) {
      return null;
    }
    return ((current - previous) / previous) * 100;
  }, [mode, meta]);

  const titleText = title ?? t("metrics.title");

  const totalLinks = summary?.total_links ?? linksData.length;
  const activeLinks =
    summary?.active_links ??
    linksData.filter((link) => getLinkStatus(link) === "active").length;
  const totalClicks =
    summary?.total_clicks ??
    linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const avgClicksPerLink =
    summary?.avg_clicks_per_link ??
    (totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0);
  const avgDaily =
    timeframeDays > 0
      ? formatCount(
          Math.round(totalClicks / Math.max(0.001, timeframeDays)),
          i18n.language,
        )
      : "—";

  const singleLinkMetrics = [
    {
      id: "total_clicks",
      title: tA("metrics.totalClicks"),
      value: formatCount(totalClicks, i18n.language),
      icon: <TrendingUp {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("metrics.totalClicksSubtitle"),
    },
    {
      id: "unique_visitors",
      title: tA("metrics.uniqueVisitors"),
      value: formatCount(summary?.unique_visitors ?? 0, i18n.language),
      icon: <Users {...ICON_LG} />,
      color: "primary" as const,
      subtitle: undefined,
    },
    {
      id: "countries_reached",
      title: tA("metrics.countriesReached"),
      value: formatCount(summary?.countries_reached ?? 0, i18n.language),
      icon: <Globe {...ICON_LG} />,
      color: "secondary" as const,
      subtitle: undefined,
    },
    {
      id: "avg_daily_clicks",
      title: tA("metrics.avgDailyClicks"),
      value: avgDaily,
      icon: <BarChart3 {...ICON_LG} />,
      color: "warning" as const,
      subtitle: undefined,
    },
  ];

  // Overview da conta no padrão de referência: gráfico agregado em destaque
  // primeiro, stats compactos abaixo (label + número + trend + mini-curva).
  if (mode === "list") {
    const listStats = [
      {
        id: "total_links",
        label: t("metrics.links"),
        value: formatCount(totalLinks, i18n.language),
      },
      {
        id: "active_links",
        label: t("status.active"),
        value: formatCount(activeLinks, i18n.language),
      },
      {
        id: "total_clicks",
        label: t("metrics.totalClicks"),
        value: formatCount(totalClicks, i18n.language),
        trendPercent: aggregateTrendPercent,
        trendLabel: t("metrics.vsPrevWeek"),
        sparkline: aggregatedSparkline,
      },
      {
        id: "avg_clicks_per_link",
        label: t("metrics.avgClicksPerLink"),
        value: formatCount(avgClicksPerLink, i18n.language),
      },
    ];

    return (
      <Stack spacing={{ xs: 2, sm: 2.5 }}>
        <AccountClicksTrendPanel data={aggregatedSparkline} />
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {listStats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.id}>
              <OverviewStatCard
                label={stat.label}
                value={stat.value}
                trendPercent={stat.trendPercent ?? null}
                trendLabel={stat.trendLabel}
                sparkline={stat.sparkline}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  const metrics = singleLinkMetrics;

  if (noContainer) {
    return (
      <>
        {showTitle ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {titleText}
            </Typography>
          </Grid>
        ) : null}
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              subtitle={metric.subtitle}
            />
          </Grid>
        ))}
      </>
    );
  }

  return (
    <Box sx={{ mb: 0 }}>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {titleText}
        </Typography>
      ) : null}

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              subtitle={metric.subtitle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default LinkMetrics;
