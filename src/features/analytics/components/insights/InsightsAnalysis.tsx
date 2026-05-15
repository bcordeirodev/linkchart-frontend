"use client";
import { Lightbulb, TrendingUp, Flag, BarChart3 } from "lucide-react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import TabDescription from "@/shared/ui/base/TabDescription";

import { useInsightsData } from "../../hooks/useInsightsData";

import { BusinessInsights } from "./BusinessInsights";
import { RetentionAnalysisChart } from "./RetentionAnalysisChart";
import { SessionDepthChart } from "./SessionDepthChart";
import { TrafficSourceChart } from "./TrafficSourceChart";
import { TrafficQualityChart } from "./TrafficQualityChart";

interface InsightsAnalysisProps {
  linkId: string;
  title?: string;
  enableRealtime?: boolean;
  maxInsights?: number;
}

/**
 * 💡 INSIGHTS ANALYSIS - COMPONENTE INTEGRADO
 *
 * @description
 * Componente principal do módulo de insights que usa o hook dedicado
 * useInsightsData para buscar e gerenciar insights de negócio.
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
 *   showFilters={true}
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

  title,
  enableRealtime = false,
  maxInsights = 50,
}: InsightsAnalysisProps) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.title");
  // Usar hook específico para dados de insights
  const { data, stats, loading, error, refresh, isRealtime } = useInsightsData({
    linkId,
    enableRealtime,
    refreshInterval: 300000, // 5 minutos (insights não mudam frequentemente)
  });

  return (
    <Box>
      {/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Lightbulb {...ICON_LG} />}
          title={displayTitle}
          description={t("insights.description")}
          highlight={t("insights.available", {
            count: data?.insights?.length || 0,
          })}
          metadata={
            isRealtime
              ? t("dashboard.realtime")
              : t("insights.intelligentAnalysis")
          }
        />
      </Box>

      {/* 2. CONTEÚDO COM LOADER */}
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data?.insights?.length}
        onRetry={refresh}
        loadingMessage={t("insights.loading")}
        emptyMessage={t("insights.empty")}
        minHeight={300}
      >
        <Box>
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
              insights={data?.insights || []}
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
                  shown: data?.insights?.length || 0,
                  total: stats.totalInsights,
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
