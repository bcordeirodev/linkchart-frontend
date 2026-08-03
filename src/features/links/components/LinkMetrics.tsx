"use client";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
}

interface DashboardMetricsProps {
  summary?: LinkMetricsSummary;
  linksData?: LinkResponse[];
  showTitle?: boolean;
  title?: string;
}

/**
 * `/links` account overview metrics — `total_links`, `active_links`,
 * `total_clicks`, `avg_clicks_per_link` rendered as a bare
 * {@link OverviewMetricRow} (numbers-and-hairlines, no card shell), per the
 * "instrumento técnico" redesign.
 *
 * This component used to also have a `mode="single-link"` branch rendering
 * per-link KPIs (`MetricCardOptimized` cards) for the analytics dashboard —
 * removed: it had zero callers (the analytics dashboard's KPI row is
 * `OverviewKpiHeader`, which never imported this component) and duplicated
 * that component's job. `LinkListPage.tsx` is this component's only consumer.
 */
export function LinkMetrics({
  summary,
  linksData = [],
  showTitle = false,
  title,
}: DashboardMetricsProps) {
  const { t, i18n } = useTranslation("links");

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

  // OverviewMetricRow has no icon/hint slot, so the four `metrics.*Hint`
  // tooltip strings that used to back the card's "?" affordance were dropped
  // (removed from both locales — see the task-8 report).
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

      {/* size="md": a fileira não deve ocupar tanta altura vertical nesta
          página — ver o prop no OverviewMetricRow. Analytics/relatórios/
          perfil continuam em "lg" (default). */}
      <OverviewMetricRow metrics={listMetrics} size="md" />
    </Box>
  );
}

export default LinkMetrics;
