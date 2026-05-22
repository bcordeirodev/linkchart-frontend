"use client";
import { useMemo } from "react";
import { Lightbulb, TrendingUp, Flag, BarChart3 } from "lucide-react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import { useInsightsData } from "../../hooks/useInsightsData";

import type { InsightPriority } from "@/features/links/hooks/useAnalyticsFilters";
import { BusinessInsights } from "./BusinessInsights";
import { InsightsFilterBar } from "./InsightsFilterBar";
import { RetentionAnalysisChart } from "./RetentionAnalysisChart";
import { SessionDepthChart } from "./SessionDepthChart";
import { TrafficSourceChart } from "./TrafficSourceChart";
import { TrafficQualityChart } from "./TrafficQualityChart";

/** Props accepted by the {@link InsightsAnalysis} component. */
interface InsightsAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** Maximum number of insights to display. Defaults to `50`. */
  maxInsights?: number;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /**
   * Active priority filter. When provided together with its setter the
   * {@link InsightsFilterBar} is rendered. Defaults to `"all"`.
   */
  priority?: InsightPriority;
  /** Array of active insight-type category filters. Defaults to `[]` (all types). */
  insightCategories?: string[];
  /** When `true`, only insights with `actionable === true` are shown. */
  actionableOnly?: boolean;
  /** Callback fired when the user changes the priority chip selection. */
  onPriorityChange?: (v: InsightPriority) => void;
  /** Callback fired when the user toggles a category chip. */
  onCategoriesChange?: (v: string[]) => void;
  /** Callback fired when the user toggles the actionable-only switch. */
  onActionableOnlyChange?: (v: boolean) => void;
}

/**
 * 💡 INSIGHTS ANALYSIS - COMPONENTE INTEGRADO
 *
 * @description
 * Componente principal do módulo de insights que usa o hook dedicado
 * useInsightsData para buscar e gerenciar insights de negócio.
 *
 * Renders an optional {@link InsightsFilterBar} when all three change
 * callbacks are provided.  The `actionableOnly` flag is applied as an
 * in-memory post-filter after the hook runs.
 *
 * @features
 * - Hook específico useInsightsData
 * - Filtros interativos por categoria e prioridade
 * - Métricas de confiança e impacto
 * - Insights acionáveis destacados
 * - Estatísticas em tempo real
 *
 * @usage
 * ```tsx
 * // Insights globais com filtros
 * <InsightsAnalysis
 *   maxInsights={10}
 * />
 *
 * // Insights de link específico
 * <InsightsAnalysis
 *   linkId="123"
 *   enableRealtime={false}
 * />
 * ```
 */
export function InsightsAnalysis({
  linkId,
  enableRealtime = false,
  maxInsights = 50,
  dateFrom,
  dateTo,
  excludeBots,
  priority = "all",
  insightCategories = [],
  actionableOnly = false,
  onPriorityChange,
  onCategoriesChange,
  onActionableOnlyChange,
}: InsightsAnalysisProps) {
  const { t } = useTranslation("analytics");

  const { data, stats, loading, error, refresh, isRealtime } = useInsightsData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    minConfidence: 0.5,
    categories: [],
    refreshInterval: 300000,
  });

  /** Client-side post-filter applied on top of the hook's confidence/category filters. */
  const filteredInsights = useMemo(() => {
    let list = data?.insights ?? [];
    if (priority !== "all") {
      list = list.filter((i) => i.priority === priority);
    }
    if (insightCategories.length > 0) {
      list = list.filter((i) => insightCategories.includes(i.type));
    }
    if (actionableOnly) {
      list = list.filter((i) => i.actionable);
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.insights, priority, JSON.stringify(insightCategories), actionableOnly]);

  /** Whether to render the filter bar — requires all three callbacks to be present. */
  const showFilterBar =
    !!onPriorityChange && !!onCategoriesChange && !!onActionableOnlyChange;

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data?.insights?.length}
        skeleton={<AnalyticsTabSkeleton hasFilter metricCards={4} />}
        onRetry={refresh}
        loadingMessage={t("insights.loading")}
        emptyMessage={t("insights.empty")}
        minHeight={300}
      >
        <Box>
          {/* FILTROS */}
          {showFilterBar ? (
            <InsightsFilterBar
              priority={priority}
              insightCategories={insightCategories}
              actionableOnly={actionableOnly}
              onPriorityChange={onPriorityChange!}
              onCategoriesChange={onCategoriesChange!}
              onActionableOnlyChange={onActionableOnlyChange!}
            />
          ) : null}

          {/* MÉTRICAS */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.total")}
                  value={stats?.totalInsights?.toString() || "0"}
                  icon={<Lightbulb {...ICON_LG} />}
                  color="primary"
                  subtitle={t("insights.metrics.totalSub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.highPriority")}
                  value={stats?.highPriorityCount?.toString() || "0"}
                  icon={<Flag {...ICON_LG} />}
                  color="error"
                  subtitle={t("insights.metrics.highPrioritySub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.actionable")}
                  value={stats?.actionableCount?.toString() || "0"}
                  icon={<TrendingUp {...ICON_LG} />}
                  color="success"
                  subtitle={t("insights.metrics.actionableSub")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title={t("insights.metrics.avgConfidence")}
                  value={`${Math.round((stats?.avgConfidence || 0) * 100)}%`}
                  icon={<BarChart3 {...ICON_LG} />}
                  color="info"
                  subtitle={t("insights.metrics.confidenceSub")}
                />
              </Grid>
            </Grid>
          </Box>

          {/* 1. Insights acionáveis — primeiro porque é o que o usuário deve agir */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Lightbulb size={16} strokeWidth={1.5} />
              {t("insights.autoInsights")}
            </Typography>
            <BusinessInsights
              insights={filteredInsights}
              showTitle={false}
              maxItems={maxInsights}
            />
          </Box>

          {/* 2. Gráficos analíticos — ordem por importância estratégica */}
          {data?.analytics_data ? (
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {/* Fontes de Tráfego: de onde vêm os visitantes? (mais estratégico) */}
                {data.analytics_data.traffic_sources ? (
                  <Grid item xs={12}>
                    <TrafficSourceChart
                      data={data.analytics_data.traffic_sources}
                      loading={loading}
                      showTitle
                    />
                  </Grid>
                ) : null}

                {/* Qualidade do Tráfego: o tráfego é legítimo? (diagnóstico crítico) */}
                {data.analytics_data.quality ? (
                  <Grid item xs={12}>
                    <TrafficQualityChart data={data.analytics_data.quality} />
                  </Grid>
                ) : null}

                {/* Retenção: visitantes voltam? (fidelização) */}
                {data.analytics_data.retention ? (
                  <Grid item xs={12}>
                    <RetentionAnalysisChart
                      data={data.analytics_data.retention}
                      loading={loading}
                      showTitle
                    />
                  </Grid>
                ) : null}

                {/* Profundidade de Sessão: o quanto os visitantes se engajam? (mais granular) */}
                {data.analytics_data.session_depth ? (
                  <Grid item xs={12}>
                    <SessionDepthChart
                      data={data.analytics_data.session_depth}
                      loading={loading}
                      showTitle
                    />
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          ) : null}

          {/* Informações adicionais */}
          {stats ? (
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: `${radiusTokens.md}px`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t("insights.footer.topCategory", {
                  category: stats.topCategory,
                })}{" "}
                • {t("insights.footer.lastGenerated")}{" "}
                {new Date(stats.lastGenerated).toLocaleString()} •{" "}
                {t("insights.footer.showing", {
                  shown: filteredInsights.length,
                  total: data?.insights?.length ?? stats.totalInsights,
                })}
                {isRealtime ? ` • ${t("insights.footer.autoUpdate")}` : null}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default InsightsAnalysis;
