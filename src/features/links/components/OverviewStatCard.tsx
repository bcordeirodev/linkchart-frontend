"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import { alpha, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { darkNeutral } from "@/lib/theme/colors";
import {
  getLinksBorderColor,
  getLinksTopHighlight,
  linksRadius,
} from "@/features/links/components/list/linksPanelStyles";

import type { SparklinePoint } from "@/types";

interface OverviewStatCardProps {
  /** Nome da métrica (ex.: "Total de cliques"). */
  label: string;
  /** Valor já formatado para exibição. */
  value: string;
  /** Variação percentual do período (positivo = alta); `null` oculta o trend. */
  trendPercent?: number | null;
  /** Legenda ao lado do percentual (ex.: "vs. semana anterior"). */
  trendLabel?: string;
  /** Série para o mini-gráfico cinza ancorado no rodapé do card. */
  sparkline?: SparklinePoint[];
}

/**
 * Mini-gráfico neutro do rodapé do stat card — curva cinza discreta, sem
 * eixos nem tooltip, colada na borda inferior (full-bleed).
 */
function MutedSparkline({ data }: { data: SparklinePoint[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const line = alpha(theme.palette.text.primary, isDark ? 0.45 : 0.35);

  const series = useMemo(() => [{ data: data.map((d) => d.clicks) }], [data]);
  const options = useMemo(
    () => ({
      chart: {
        sparkline: { enabled: true },
        animations: { enabled: false },
        parentHeightOffset: 0,
      },
      stroke: { curve: "smooth" as const, width: 1.5 },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: isDark ? 0.18 : 0.12, opacityTo: 0 },
      },
      colors: [line],
      tooltip: { enabled: false },
      xaxis: { labels: { show: false }, axisBorder: { show: false } },
      yaxis: { labels: { show: false } },
      grid: { show: false },
    }),
    [line, isDark],
  );

  if (data.length < 2) {
    return null;
  }

  return (
    <ApexChartWrapper
      type="area"
      height={44}
      width="100%"
      series={series}
      options={options}
    />
  );
}

/**
 * Stat card do overview no padrão de dashboard de referência: label em cima,
 * número grande, variação percentual colorida e um mini-gráfico cinza
 * full-bleed no rodapé. Sem ícone decorado nem subtítulo — o dado é o visual.
 */
export function OverviewStatCard({
  label,
  value,
  trendPercent = null,
  trendLabel,
  sparkline,
}: OverviewStatCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const trendUp = (trendPercent ?? 0) >= 0;
  const trendColor = trendUp
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 132,
        overflow: "hidden",
        borderRadius: `${linksRadius.panel}px`,
        border: `1px solid ${getLinksBorderColor(theme)}`,
        backgroundColor: isDark
          ? darkNeutral.elevated
          : theme.palette.background.paper,
        boxShadow: getLinksTopHighlight(theme),
      }}
    >
      <Box sx={{ px: 2.5, pt: 2, pb: sparkline?.length ? 0.5 : 2 }}>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "text.secondary",
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.75rem",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
            mt: 0.25,
          }}
        >
          {value}
        </Typography>
        {trendPercent !== null && trendLabel ? (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
          >
            {trendUp ? (
              <TrendingUp size={13} strokeWidth={2} color={trendColor} />
            ) : (
              <TrendingDown size={13} strokeWidth={2} color={trendColor} />
            )}
            <Typography
              component="span"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: trendColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {trendUp ? "+" : ""}
              {trendPercent.toFixed(1)}%
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: "0.75rem", color: "text.secondary" }}
            >
              {trendLabel}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {sparkline?.length ? (
        // Full-bleed: o gráfico encosta nas bordas laterais e inferior.
        <Box sx={{ mt: "auto", mx: 0, mb: 0, lineHeight: 0 }}>
          <MutedSparkline data={sparkline} />
        </Box>
      ) : null}
    </Box>
  );
}

export default OverviewStatCard;
