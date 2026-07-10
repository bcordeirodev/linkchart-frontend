"use client";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AccountClicksTrendPanel } from "@/features/links/components/AccountClicksTrendPanel";
import {
  getLinksBorderColor,
  getLinksPanelSx,
} from "@/features/links/components/list/linksPanelStyles";
import { getLinkStatus } from "@/features/links/utils/linkStatus";
import { aggregateSparklines } from "@/features/links/utils/overviewAggregation";
import { formatCount } from "@/lib/utils";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import type { BatchMetaResponse, LinkResponse } from "@/types";

interface AccountOverviewPanelProps {
  /** Todos os links do usuário (fonte dos contadores). */
  links: LinkResponse[];
  /** Meta batch (`useLinksMeta`) — alimenta o gráfico agregado; opcional. */
  meta?: BatchMetaResponse;
}

/**
 * Painel único de visão geral da conta — substitui a antiga grade de quatro
 * `MetricCardOptimized` + painel de gráfico separado. As métricas viram uma
 * faixa compacta de stats (número forte + label, sem caixa própria) e o
 * gráfico agregado vive no mesmo painel, logo abaixo: uma superfície densa
 * em vez de cinco caixas de peso igual disputando a tela.
 *
 * @param links - links do usuário para os contadores.
 * @param meta - meta batch para o gráfico agregado (sem ele, só os stats).
 */
export function AccountOverviewPanel({
  links,
  meta,
}: AccountOverviewPanelProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("links");

  const totalLinks = links.length;
  const activeLinks = links.filter(
    (link) => getLinkStatus(link) === "active",
  ).length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const avgClicksPerLink =
    totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  const aggregatedSparkline = useMemo(
    () => aggregateSparklines(meta ?? {}),
    [meta],
  );
  const hasChartSignal = aggregatedSparkline.some((point) => point.clicks > 0);

  const stats = [
    { key: "links", label: t("metrics.links"), value: totalLinks },
    { key: "active", label: t("status.active"), value: activeLinks },
    { key: "clicks", label: t("metrics.totalClicks"), value: totalClicks },
    {
      key: "avg",
      label: t("metrics.avgClicksPerLink"),
      value: avgClicksPerLink,
    },
  ];

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={getLinksPanelSx(theme)}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="overline"
          component="h2"
          sx={{
            display: "block",
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            lineHeight: 1.4,
            mb: { xs: 1.5, sm: 2 },
          }}
        >
          {t("list.sections.overview")}
        </Typography>

        {/* Faixa de stats: 2x2 no mobile, 4 colunas com divisores no desktop. */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            rowGap: { xs: 2, sm: 0 },
            "& > *": {
              px: { xs: 0, sm: 2.5 },
              "&:first-of-type": { pl: 0 },
            },
            "& > *:not(:first-of-type)": {
              borderLeft: {
                xs: "none",
                sm: `1px solid ${getLinksBorderColor(theme)}`,
              },
            },
          }}
        >
          {stats.map((stat) => (
            <Box key={stat.key} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.375rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatCount(stat.value, i18n.language)}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                  display: "block",
                  mt: 0.25,
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {hasChartSignal ? (
          <>
            <Divider
              sx={{
                my: { xs: 2, sm: 2.5 },
                borderColor: getLinksBorderColor(theme),
              }}
            />
            <AccountClicksTrendPanel data={aggregatedSparkline} bare />
          </>
        ) : null}
      </Box>
    </EnhancedPaper>
  );
}

export default AccountOverviewPanel;
