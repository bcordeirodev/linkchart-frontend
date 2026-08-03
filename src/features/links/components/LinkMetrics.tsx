"use client";
import { TrendingUp, BarChart3, Users, Globe } from "lucide-react";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import { OverviewMetricRow } from "@/shared/ui/base/OverviewMetricRow";

import { getLinkStatus } from "@/features/links/utils/linkStatus";
import { formatCount } from "@/lib/utils";
import type { LinkResponse } from "@/types";
import type { OverviewMetric } from "@/shared/ui/base/OverviewMetricRow";

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
}

/**
 * Account/link metrics summary.
 *
 * `mode="list"` (default, used by `/links`): renders `total_links`,
 * `active_links`, `total_clicks`, `avg_clicks_per_link` as a bare
 * {@link OverviewMetricRow} — numbers-and-hairlines, no card shell, per the
 * "instrumento técnico" redesign (icon-chip stat cards are gone from this
 * surface; see `MetricCardOptimized` for the only other consumer).
 *
 * `mode="single-link"`: total_clicks, unique_visitors, countries_reached,
 * avg_daily_clicks — still rendered as `MetricCardOptimized` cards. Out of
 * scope for the `/links` redesign pass; left untouched here.
 */
export function LinkMetrics({
  summary,
  linksData = [],
  showTitle = false,
  title,
  mode = "list",
  timeframeDays = 7,
}: DashboardMetricsProps) {
  const { t, i18n } = useTranslation("links");
  const { t: tA } = useTranslation("analytics");

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

  if (mode === "single-link") {
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

    return (
      <Box sx={{ mb: 0 }}>
        {showTitle ? (
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {titleText}
          </Typography>
        ) : null}

        <Grid container spacing={{ xs: 1.5, sm: 3 }}>
          {singleLinkMetrics.map((metric) => (
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

  // mode === "list" — bare numbers row (instrumento técnico redesign):
  // OverviewMetricRow has no icon/hint slot, so the four `metrics.*Hint`
  // tooltip strings that used to back the card's "?" affordance are dropped
  // here (they're removed from both locales in this same change — see the
  // task-8 report).
  const listMetrics: OverviewMetric[] = [
    {
      label: t("metrics.links"),
      value: formatCount(totalLinks, i18n.language),
      caption: t("metrics.linksSubtitle"),
    },
    {
      // Chave própria ("Links ativos"), não `status.active`: o chip de status
      // precisa do singular "Ativo", mas como label de métrica ele lia como se
      // a conta inteira fosse uma coisa só "Ativo".
      label: t("metrics.activeLinks"),
      value: formatCount(activeLinks, i18n.language),
      caption: t("metrics.linksActive"),
    },
    {
      label: t("metrics.totalClicks"),
      // `totalClicksAllLinks`, não `totalClicksSubtitle`: aquele é compartilhado
      // com o dashboard de UM link, onde "somando todos os seus links" mentiria.
      value: formatCount(totalClicks, i18n.language),
      caption: t("metrics.totalClicksAllLinks"),
    },
    {
      label: t("metrics.avgClicksPerLink"),
      value: formatCount(avgClicksPerLink, i18n.language),
      caption: t("metrics.clicksPerLink"),
    },
  ];

  return (
    <Box sx={{ mb: 0 }}>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {titleText}
        </Typography>
      ) : null}

      <OverviewMetricRow metrics={listMetrics} />
    </Box>
  );
}

export default LinkMetrics;
