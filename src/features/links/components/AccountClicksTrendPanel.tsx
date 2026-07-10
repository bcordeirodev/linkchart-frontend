"use client";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
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
function formatShortDate(isoDate: string | undefined, locale: string): string {
  // O Apex chama o formatter com slots undefined em eixos de categoria com
  // poucos pontos — devolver vazio evita crash sem mascarar dados reais.
  if (!isoDate) {
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

  const hasSignal = data.some((point) => point.clicks > 0);

  // Desaturated business blue, matching the primary hue used across /links —
  // no standalone chart accent color to keep the dark theme calm.
  const color =
    theme.palette.mode === "dark"
      ? theme.palette.primary.light
      : theme.palette.primary.main;

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
      stroke: { curve: "smooth" as const, width: 2 },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.35, opacityTo: 0.02 },
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
      grid: { strokeDashArray: 3, padding: { left: 8, right: 12 } },
      tooltip: {
        x: {
          formatter: (value: string) => formatShortDate(value, i18n.language),
        },
        y: { formatter: (value: number) => formatCount(value, i18n.language) },
      },
    }),
    [color, categories, i18n.language],
  );

  if (!hasSignal) {
    return null;
  }

  return (
    <ChartCard
      title={t("metrics.trendChartTitle")}
      subtitle={t("metrics.trendChartLabel", { count: data.length })}
      height="auto"
      sx={{ mt: { xs: 2, sm: 2.5 } }}
    >
      <ApexChartWrapper
        type="area"
        height={150}
        series={series}
        options={options}
      />
    </ChartCard>
  );
}

export default AccountClicksTrendPanel;
