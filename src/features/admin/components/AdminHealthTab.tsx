"use client";
/**
 * Tab Saúde do painel `/admin` — fila de jobs (Redis), jobs falhados
 * 24h/7d, estados dos links (ativos/inativos/quebrados) e a distribuição de
 * `quality_tier` dos cliques dos últimos 7 dias em barras horizontais, no
 * idioma visual "instrumento técnico" (`OverviewMetricRow` + `ChartCard`,
 * sem donut/ícone-chip). `warning.main` só aparece nos dois indicadores que
 * o brief marca como alerta acionável (jobs falhados nas últimas 24h e
 * links quebrados) — nunca nos tiers de qualidade, que ficam só na família
 * azul de `dataVizPalette`.
 */

import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { DistributionBars } from "@/features/admin/components/DistributionBars";
import { useAdminHealth } from "@/features/admin/hooks/useAdmin";
import { dataVizPalette } from "@/lib/theme";
import { formatCount } from "@/lib/utils/formatNumber";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { OverviewMetricRow } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

/** Chave de tier conhecida pelo backend (`AdminStatsService::qualityTiers7d`). */
type QualityTier = "organic" | "suspicious" | "likely_fraud";

/**
 * Cor de `dataVizPalette` por tier — família azul intocada mesmo para
 * `likely_fraud` (o design directive do task proíbe introduzir vermelho/
 * laranja aqui; `warning.main` fica reservado só para os dois contadores
 * acionáveis da fileira de métricas acima).
 */
const TIER_COLORS: Record<QualityTier, string> = {
  organic: dataVizPalette.primary,
  suspicious: dataVizPalette.tertiary,
  likely_fraud: dataVizPalette.muted,
};

/**
 * Tab Saúde: fila de jobs (Redis), jobs falhados 24h/7d, estados dos links
 * (ativos/inativos/quebrados) e a distribuição de `quality_tier` dos
 * cliques dos últimos 7 dias em barras horizontais.
 *
 * @returns Conteúdo da tab, gated por `AnalyticsStateManager`.
 */
export function AdminHealthTab() {
  const { t, i18n } = useTranslation("admin");
  const locale = i18n.language;
  const query = useAdminHealth();
  const data = query.data;

  /**
   * Traduz o `tier` cru do backend via mapa explícito — `t()` tipado não
   * aceita chave de template literal (`health.tiers.${tier}`), e um tier
   * futuro fora do mapa cai no valor cru em vez de quebrar a UI.
   */
  const tierLabel = (tier: string): string => {
    const labels: Record<string, string> = {
      organic: t("health.tiers.organic"),
      suspicious: t("health.tiers.suspicious"),
      likely_fraud: t("health.tiers.likely_fraud"),
    };
    return labels[tier] ?? tier;
  };

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
                label: t("health.queueDepth"),
                value:
                  data.queue_depth === null
                    ? t("health.queueUnavailable")
                    : formatCount(data.queue_depth, locale),
                caption: t("health.queueDepthCaption"),
              },
              {
                label: t("health.failedJobs24h"),
                value: formatCount(data.failed_jobs_24h, locale),
                valueColor:
                  data.failed_jobs_24h > 0 ? "warning.main" : undefined,
              },
              {
                label: t("health.failedJobs7d"),
                value: formatCount(data.failed_jobs_7d, locale),
              },
            ]}
          />

          <OverviewMetricRow
            size="md"
            metrics={[
              {
                label: t("health.activeLinks"),
                value: formatCount(data.links.active, locale),
              },
              {
                label: t("health.inactiveLinks"),
                value: formatCount(data.links.inactive, locale),
              },
              {
                label: t("health.brokenLinks"),
                value: formatCount(data.links.broken, locale),
                valueColor: data.links.broken > 0 ? "warning.main" : undefined,
                caption: t("health.brokenLinksCaption"),
              },
            ]}
          />

          <ChartCard
            title={t("health.qualityTitle")}
            subtitle={t("health.qualitySubtitle")}
          >
            <DistributionBars
              rows={data.quality_tiers_7d.map((tier) => ({
                label: tierLabel(tier.tier),
                value: tier.clicks,
                pct: tier.pct,
                color:
                  TIER_COLORS[tier.tier as QualityTier] ??
                  dataVizPalette.secondary,
              }))}
              emptyMessage={t("health.qualityEmpty")}
            />
          </ChartCard>
        </Stack>
      ) : null}
    </AnalyticsStateManager>
  );
}

export default AdminHealthTab;
