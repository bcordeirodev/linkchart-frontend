"use client";
import {
  TrendingUp,
  Link2,
  CheckCircle,
  BarChart3,
  Users,
  Globe,
} from "lucide-react";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

import { getLinkStatus } from "@/features/links/utils/linkStatus";
import type { LinkResponse } from "@/types";

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
}: DashboardMetricsProps) {
  const { t } = useTranslation("links");
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
      ? Math.round(totalClicks / Math.max(0.001, timeframeDays)).toString()
      : "—";

  const singleLinkMetrics = [
    {
      id: "total_clicks",
      title: tA("metrics.totalClicks"),
      value: totalClicks.toLocaleString(),
      icon: <TrendingUp {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("metrics.totalClicksSubtitle"),
    },
    {
      id: "unique_visitors",
      title: tA("metrics.uniqueVisitors"),
      value: (summary?.unique_visitors ?? 0).toLocaleString(),
      icon: <Users {...ICON_LG} />,
      color: "primary" as const,
      subtitle: undefined,
    },
    {
      id: "countries_reached",
      title: tA("metrics.countriesReached"),
      value: (summary?.countries_reached ?? 0).toString(),
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

  const listMetrics = [
    {
      id: "total_links",
      title: t("list.pageTitle"),
      value: totalLinks.toString(),
      icon: <Link2 {...ICON_LG} />,
      color: "primary" as const,
      subtitle: t("metrics.linksCreated"),
    },
    {
      id: "active_links",
      title: t("status.active"),
      value: activeLinks.toString(),
      icon: <CheckCircle {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("metrics.linksActive"),
    },
    {
      id: "total_clicks_list",
      title: t("metrics.totalClicks"),
      value: totalClicks.toLocaleString(),
      icon: <TrendingUp {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("metrics.totalClicksSubtitle"),
    },
    {
      id: "avg_clicks_per_link",
      title: t("metrics.avgClicksPerLink"),
      value: avgClicksPerLink.toString(),
      icon: <BarChart3 {...ICON_LG} />,
      color: "warning" as const,
      subtitle: t("metrics.clicksPerLink"),
    },
  ];

  const metrics = mode === "single-link" ? singleLinkMetrics : listMetrics;

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
