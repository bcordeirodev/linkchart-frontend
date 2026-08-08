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
import { formatCount } from "@/lib/utils/formatNumber";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { OverviewMetricRow } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type {
  AdminRange,
  AdminSeriesPoint,
  AdminPeriodComparison,
} from "@/features/admin/types";
import type { ReactNode } from "react";
import type { TFunction } from "i18next";

interface AdminGrowthTabProps {
  /** Janela ativa (7d/30d/90d). */
  range: AdminRange;
}

/**
 * Formata a variação percentual como caption (▲ +12,3% / ▼ -4,1% / "—" sem
 * baseline), seguindo o padrão de cor semântica do OverviewMetricRow.
 *
 * @param cmp Par atual/anterior vindo do backend.
 * @param locale Idioma ativo (`i18n.language`) — decide o separador decimal.
 */
function variationCaption(
  cmp: AdminPeriodComparison | undefined,
  locale: string,
): string {
  if (!cmp || cmp.variation_pct === null) {
    return "—";
  }
  const arrow = cmp.variation_pct >= 0 ? "▲" : "▼";
  return `${arrow} ${cmp.variation_pct > 0 ? "+" : ""}${formatCount(cmp.variation_pct, locale)}%`;
}

/**
 * Legenda de duas linhas de uma métrica de crescimento. O número grande é o
 * total acumulado da base, mas a variação ao lado é do período selecionado —
 * sem rotular as duas coisas, a fileira lia como se os 12% fossem do total.
 * Linha 1 qualifica o valor ("desde o início"), linha 2 qualifica a variação
 * ("no período vs anterior"), num tom mais apagado para não competir com o
 * número.
 *
 * @param t Tradutor do namespace `admin`.
 * @param cmp Par atual/anterior da métrica.
 * @param locale Idioma ativo (`i18n.language`).
 * @returns Nó de legenda para `OverviewMetric.caption`.
 */
function growthCaption(
  t: TFunction<"admin">,
  cmp: AdminPeriodComparison | undefined,
  locale: string,
): ReactNode {
  return (
    <Box component="span" sx={{ display: "block" }}>
      {t("growth.totalsCaption")}
      <Box
        component="span"
        sx={{
          display: "block",
          color: "text.disabled",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {`${variationCaption(cmp, locale)} ${t("growth.periodCaption")}`}
      </Box>
    </Box>
  );
}

/**
 * Tab Crescimento: fileira de métricas (totais + variação do período) e as
 * três séries diárias (cliques, cadastros, links) em area charts.
 */
export function AdminGrowthTab({ range }: AdminGrowthTabProps) {
  const { t, i18n } = useTranslation("admin");
  const locale = i18n.language;
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
                value: formatCount(data.totals.users, locale),
                caption: growthCaption(t, data.period.signups, locale),
              },
              {
                label: t("growth.totalLinks"),
                value: formatCount(data.totals.links, locale),
                caption: growthCaption(t, data.period.links, locale),
              },
              {
                label: t("growth.totalClicks"),
                value: formatCount(data.totals.clicks, locale),
                caption: growthCaption(t, data.period.clicks, locale),
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
              locale={locale}
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
                locale={locale}
              />
            </ChartCard>
            <ChartCard
              title={t("growth.linksChartTitle")}
              subtitle={t("growth.linksChartSubtitle")}
            >
              <GrowthAreaChart
                series={data.series.links}
                name={t("growth.linksChartTitle")}
                locale={locale}
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
  /** Idioma ativo (`i18n.language`) — separador de milhar do eixo Y. */
  locale: string;
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
  locale: string,
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
        labels: { formatter: (value: number) => formatCount(value, locale) },
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
function GrowthAreaChart({ series, name, locale }: GrowthAreaChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const chart = buildGrowthAreaChart(series, name, isDark, locale);

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
