"use client";
import { alpha, Box } from "@mui/material";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { LinksListSectionHeading } from "@/features/links/components/list/LinksListSectionHeading";
import { linksRadius } from "@/features/links/components/list/linksPanelStyles";
import { formatCount } from "@/lib/utils";
import type { SparklinePoint } from "@/types";

interface AccountClicksTrendPanelProps {
  /** Aggregated `{ date, clicks }` series, ascending by date — see `aggregateSparklines`. */
  data: SparklinePoint[];
}

/**
 * Formats an ISO `YYYY-MM-DD` date as a short, locale-aware day/month label.
 *
 * Parses the date parts directly instead of `new Date(isoString)`, which
 * UTC-anchors the string and can roll the displayed day back by one in
 * negative-offset timezones (e.g. Brazil).
 *
 * @param isoDate - date in `YYYY-MM-DD` format.
 * @param locale - BCP-47 UI locale, used for day/month ordering.
 * @returns a short formatted date, or the raw input when it doesn't parse.
 */
function formatShortDate(isoDate: unknown, locale: string): string {
  // O Apex chama formatters com slots undefined (eixo de categoria com poucos
  // pontos) e com índices numéricos (tooltip) — só strings seguem adiante.
  if (typeof isoDate !== "string" || !isoDate) {
    return "";
  }

  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(year, month - 1, day));
}

/**
 * Full-width panel showing the account's aggregated daily click trend — the
 * single chart in the "Overview vivo" block, rendered below the KPI metric
 * cards in {@link LinkMetrics}.
 *
 * Sums every link's per-day sparkline (`aggregateSparklines`) into one curve
 * so the static totals above gain a sense of motion. Deliberately the only
 * chart in the account overview (kept lean by design): a compact area chart
 * with a light axis and hover tooltip, not a full analytics panel.
 *
 * Renders nothing when every day in the window has zero clicks, so a
 * brand-new account doesn't show an empty flat line under its metrics.
 *
 * @param data - aggregated click series for the account.
 */
export function AccountClicksTrendPanel({
  data,
}: AccountClicksTrendPanelProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("links");

  // Só apresenta com dados de verdade: pelo menos 2 pontos no período e
  // algum clique — área de 1 ponto renderiza quebrada e zero vira linha morta.
  const hasSignal = data.length >= 2 && data.some((point) => point.clicks > 0);

  // Desaturated business blue, matching the primary hue used across /links —
  // no standalone chart accent color to keep the dark theme calm.
  const color =
    theme.palette.mode === "dark"
      ? theme.palette.primary.light
      : theme.palette.primary.main;
  const gridLine = alpha(theme.palette.text.primary, 0.07);

  const series = useMemo(
    () => [
      {
        name: t("metrics.totalClicks"),
        data: data.map((point) => point.clicks),
      },
    ],
    [data, t],
  );

  const categories = useMemo(() => data.map((point) => point.date), [data]);

  const options = useMemo(
    () => ({
      // parentHeightOffset: o Apex reserva ~15px extras abaixo do gráfico por
      // padrão — zerar mata o "respiro fantasma" dentro da caixa.
      chart: { parentHeightOffset: 0 },
      stroke: { curve: "smooth" as const, width: 2.5 },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.45, opacityTo: 0.04 },
      },
      colors: [color],
      dataLabels: { enabled: false },
      xaxis: {
        type: "category" as const,
        categories,
        // tickAmount em eixo de categoria com poucos pontos faz o Apex gerar
        // slots de label undefined; só limitamos quando há rótulos de sobra.
        ...(categories.length > 7 ? { tickAmount: 6 } : {}),
        labels: {
          formatter: (value: string) => formatShortDate(value, i18n.language),
          style: { fontSize: "11px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { show: false } },
      // Grade nos dois eixos (como o dashboard de referência) — hairlines
      // sólidas de baixíssimo alpha em vez de tracejado disperso.
      grid: {
        borderColor: gridLine,
        strokeDashArray: 0,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
        padding: { top: -12, bottom: 0, left: 8, right: 12 },
      },
      tooltip: {
        x: {
          // Em eixo de categoria o tooltip recebe o índice 1-based do ponto,
          // não a data — mapeia de volta para a categoria antes de formatar.
          formatter: (value: string | number) =>
            formatShortDate(
              typeof value === "number" ? categories[value - 1] : value,
              i18n.language,
            ),
        },
        y: { formatter: (value: number) => formatCount(value, i18n.language) },
      },
    }),
    [color, gridLine, categories, i18n.language],
  );

  if (!hasSignal) {
    return null;
  }

  return (
    // Mesmo tile quieto dos stat cards (véu sutil, sem borda/moldura) — o
    // overview inteiro lê como um bloco de dados, distinto dos painéis de ação.
    <Box
      sx={{
        borderRadius: `${linksRadius.card}px`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.035)
            : alpha(theme.palette.common.black, 0.03),
        overflow: "hidden",
        px: { xs: 2, sm: 2.5 },
        pt: { xs: 1.5, sm: 2 },
        pb: 0.75,
      }}
    >
      {/* Mesmo heading dos demais painéis — uma escala tipográfica só. */}
      <LinksListSectionHeading
        title={t("metrics.trendChartTitle")}
        description={t("metrics.trendChartLabel", { count: data.length })}
        titleVariant="section"
        sx={{ mb: { xs: 1.5, sm: 2 } }}
      />
      <ApexChartWrapper
        type="area"
        height={220}
        series={series}
        options={options}
      />
    </Box>
  );
}

export default AccountClicksTrendPanel;
