"use client";
import { CheckCircle, BarChart3, Zap } from "lucide-react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";

import { useLinkPerformance } from "@/features/analytics/hooks/useLinkPerformance";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import TabDescription from "@/shared/ui/base/TabDescription";

import { PerformanceMetrics } from "./PerformanceMetrics";

interface PerformanceAnalysisProps {
  linkId: string;
  title?: string;
  enableRealtime?: boolean;
}

/**
 * 🚀 ANÁLISE DE PERFORMANCE OTIMIZADA
 *
 * @description
 * Componente integrado para análise de performance dos links com métricas reais.
 * Refatorado para seguir padrões do projeto e usar AnalyticsStateManager.
 *
 * @features
 * - Métricas de velocidade e disponibilidade
 * - Monitoramento em tempo real
 * - Interface consistente com outros módulos
 * - Dados reais do backend
 */
export function PerformanceAnalysis({
  linkId,
  title,
  enableRealtime = false,
}: PerformanceAnalysisProps) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("performance.title");
  const theme = useTheme();
  const cardShadow =
    theme.palette.mode === "dark"
      ? elevationTokens.xs
      : elevationLightTokens.xs;
  const cardShadowHover =
    theme.palette.mode === "dark"
      ? elevationTokens.sm
      : elevationLightTokens.sm;
  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: cardShadow,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: cardShadowHover,
    },
    height: "100%",
  } as const;

  const {
    data: performanceData,
    loading,
    error,
    refetch,
  } = useLinkPerformance({
    linkId,
    enableRealtime,
    refreshInterval: 60000,
  });

  // Calcular métricas de performance
  const performanceMetrics = {
    totalClicks: performanceData?.total_redirects_24h || 0,
    uniqueVisitors: performanceData?.unique_visitors || 0,
    successRate: performanceData?.success_rate || 100,
    avgResponseTime: performanceData?.avg_response_time || 0,
    totalRedirects: performanceData?.total_redirects_24h || 0,
    totalLinks: performanceData?.total_links || 0,
  };

  return (
    <Box>
      {/* 1. BOX DE APRESENTAÇÃO DO MÓDULO - SEMPRE VISÍVEL */}
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Zap {...ICON_LG} />}
          title={displayTitle}
          description={t("performance.description")}
          highlight={t("performance.highlight", { rate: performanceMetrics.successRate, time: performanceMetrics.avgResponseTime })}
          metadata={enableRealtime ? t("performance.metadata.realtime") : t("performance.metadata.updated")}
        />
      </Box>

      {/* 2. CONTEÚDO COM LOADER */}
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!performanceData}
        onRetry={refetch}
        loadingMessage={t("performance.loading")}
        emptyMessage={t("performance.empty")}
        minHeight={300}
      >
        <Box>
          {/* MÉTRICAS DE PERFORMANCE */}
          <PerformanceMetrics
            performanceData={performanceData || undefined}
            showTitle
            title={t("performance.metrics.title")}
          />

          {/* RESTANTE DO CONTEÚDO */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Status Atual */}
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircle
                      {...ICON_LG}
                      style={{
                        color: "var(--mui-palette-success-main)",
                        marginRight: 16,
                      }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {t("performance.status.title")}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {performanceMetrics.successRate >= 99
                        ? t("performance.status.allGood")
                        : performanceMetrics.successRate >= 95
                          ? t("performance.status.good")
                          : t("performance.status.issues")}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "primary.main",
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        <strong>{t("performance.status.activeLinks")}</strong>{" "}
                        {performanceMetrics.totalLinks}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sistema */}
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BarChart3
                      {...ICON_LG}
                      style={{
                        color: "var(--mui-palette-info-main)",
                        marginRight: 16,
                      }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {t("performance.system.title")}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {t("performance.system.description")}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "warning.main",
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        <strong>{t("performance.system.avgResponse")}</strong>{" "}
                        {performanceMetrics.avgResponseTime}ms
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "secondary.main",
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        <strong>{t("performance.system.totalRedirects")}</strong>{" "}
                        {performanceMetrics.totalRedirects.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Insights de performance */}
          <Box sx={{ mt: 4 }}>
            <Card sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BarChart3
                    {...ICON_LG}
                    style={{
                      marginRight: 8,
                      color: "var(--mui-palette-info-main)",
                    }}
                  />
                  {t("performance.insights.title")}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  • <strong>{t("performance.insights.successRate")}</strong>{" "}
                  {performanceMetrics.successRate}% {t("performance.insights.ofRedirects")}
                  <br />• <strong>{t("performance.insights.responseTime")}</strong>{" "}
                  {performanceMetrics.avgResponseTime}ms (
                  {performanceMetrics.avgResponseTime < 200
                    ? t("performance.quality.excellent")
                    : performanceMetrics.avgResponseTime < 500
                      ? t("performance.quality.good")
                      : t("performance.quality.slow")}
                  )
                  <br />• <strong>{t("performance.insights.redirects24h")}</strong>{" "}
                  {performanceMetrics.totalRedirects.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default PerformanceAnalysis;
