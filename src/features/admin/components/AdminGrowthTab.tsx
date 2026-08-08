"use client";
/**
 * Tab Crescimento do painel `/admin` — fileira de totais (usuários, links,
 * cliques, cada um com a variação do período vs anterior) seguida das três
 * séries diárias (cliques, cadastros, links) em area charts, no idioma
 * visual "instrumento técnico" (`OverviewMetricRow` + `ChartCard`, sem
 * donut/ícone-chip).
 */

import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { useAdminOverview } from "@/features/admin/hooks/useAdmin";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { OverviewMetricRow } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type {
  AdminRange,
  AdminSeriesPoint,
  AdminPeriodComparison,
} from "@/features/admin/types";

interface AdminGrowthTabProps {
  /** Janela ativa (7d/30d/90d). */
  range: AdminRange;
}

/**
 * Formata a variação percentual como caption (▲ +12,3% / ▼ -4,1% / "—" sem
 * baseline), seguindo o padrão de cor semântica do OverviewMetricRow.
 */
function variationCaption(cmp: AdminPeriodComparison | undefined): string {
  if (!cmp || cmp.variation_pct === null) {
    return "—";
  }
  const arrow = cmp.variation_pct >= 0 ? "▲" : "▼";
  return `${arrow} ${cmp.variation_pct > 0 ? "+" : ""}${cmp.variation_pct.toLocaleString("pt-BR")}%`;
}

/**
 * Tab Crescimento: fileira de métricas (totais + variação do período) e as
 * três séries diárias (cliques, cadastros, links) em area charts.
 */
export function AdminGrowthTab({ range }: AdminGrowthTabProps) {
  const { t } = useTranslation("admin");
  const query = useAdminOverview(range);
  const data = query.data;

  return (
    <AnalyticsStateManager
      loading={query.isLoading}
      error={query.error ? t("errors.loadFailed") : null}
      hasData={Boolean(data)}
      onRetry={() => query.refetch()}
    >
      {data ? (
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <OverviewMetricRow
            size="md"
            metrics={[
              {
                label: t("growth.totalUsers"),
                value: data.totals.users.toLocaleString("pt-BR"),
                caption: variationCaption(data.period.signups),
              },
              {
                label: t("growth.totalLinks"),
                value: data.totals.links.toLocaleString("pt-BR"),
                caption: variationCaption(data.period.links),
              },
              {
                label: t("growth.totalClicks"),
                value: data.totals.clicks.toLocaleString("pt-BR"),
                caption: variationCaption(data.period.clicks),
              },
            ]}
          />

          <ChartCard
            title={t("growth.clicksChartTitle")}
            subtitle={t("growth.clicksChartSubtitle")}
          >
            <GrowthAreaChart
              series={data.series.clicks}
              name={t("growth.clicksChartTitle")}
            />
          </ChartCard>

          <Box
            sx={{
              display: "grid",
              gap: { xs: 2.5, sm: 3 },
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <ChartCard
              title={t("growth.signupsChartTitle")}
              subtitle={t("growth.signupsChartSubtitle")}
            >
              <GrowthAreaChart
                series={data.series.signups}
                name={t("growth.signupsChartTitle")}
              />
            </ChartCard>
            <ChartCard
              title={t("growth.linksChartTitle")}
              subtitle={t("growth.linksChartSubtitle")}
            >
              <GrowthAreaChart
                series={data.series.links}
                name={t("growth.linksChartTitle")}
              />
            </ChartCard>
          </Box>
        </Stack>
      ) : (
        <Box />
      )}
    </AnalyticsStateManager>
  );
}

interface GrowthAreaChartProps {
  /** Pontos diários zero-filled do backend. */
  series: AdminSeriesPoint[];
  /** Nome da série (tooltip). */
  name: string;
}

/**
 * Monta `options`/`series` do Apex para uma única série diária — mesma
 * assinatura de `buildHeroChart` (`ReportsOverviewHero.tsx`) reduzida ao
 * caso de série única: sem overlay de período anterior, sem legend. A cor
 * fica por conta do tema base (`buildApexBaseOptions` já injeta
 * `dataVizPalette.primary` como primeira cor da paleta) — nada de `colors`
 * explícito aqui, para herdar o mesmo azul de todo gráfico de série única
 * do app em vez de fixar um tom local.
 */
function buildGrowthAreaChart(
  series: AdminSeriesPoint[],
  name: string,
  isDark: boolean,
) {
  const categories = series.map((point) => point.date);
  const values = series.map((point) => point.value);

  return {
    series: [{ name, data: values }],
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        animations: { enabled: true, easing: "easeinout", speed: 600 },
      },
      stroke: { dashArray: [0] },
      // Mesmo gradiente 18%→0 que a base do tema já usa para "area" — repetido
      // aqui só porque `buildHeroChart` também o faz explicitamente para o
      // caso de série única (sem overlay), mantendo os dois lado a lado
      // idênticos em vez de depender implicitamente do default.
      fill: {
        gradient: { opacityFrom: 0.18, opacityTo: 0 },
      },
      dataLabels: { enabled: false },
      markers: { size: 0, hover: { size: 6 } },
      legend: { show: false },
      xaxis: {
        categories,
        labels: {
          rotate: 0,
          hideOverlappingLabels: true,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: { formatter: (value: number) => value.toLocaleString() },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        shared: true,
        intersect: false,
      },
    } as Record<string, unknown>,
  };
}

/**
 * Area chart diário padrão do painel — wrapper fino sobre ApexChartWrapper
 * com a primeira cor da dataVizPalette (herdada do tema base) e eixo de
 * datas em mono.
 */
function GrowthAreaChart({ series, name }: GrowthAreaChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const chart = buildGrowthAreaChart(series, name, isDark);

  return (
    <ApexChartWrapper
      type="area"
      size="standard"
      series={chart.series}
      options={chart.options}
    />
  );
}

export default AdminGrowthTab;
