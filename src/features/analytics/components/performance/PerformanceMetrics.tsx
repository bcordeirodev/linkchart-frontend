"use client";
import { CheckCircle, Zap } from "lucide-react";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

interface PerformanceMetricsProps {
  data?: unknown;
  performanceData?: {
    total_redirects_24h?: number;
    unique_visitors?: number;
    success_rate?: number;
    avg_response_time?: number;
    total_links?: number;
  };
  showTitle?: boolean;
  title?: string;
}

export function PerformanceMetrics({
  data: _data,
  performanceData,
  showTitle = false,
  title,
}: PerformanceMetricsProps) {
  const { t } = useTranslation("analytics");

  const successRate = Math.round(performanceData?.success_rate || 100);
  const responseTime = Math.round(performanceData?.avg_response_time || 0);

  const displayTitle = title ?? t("performance.metrics.title");

  const metrics = [
    {
      id: "response_time",
      title: t("performance.metrics.responseTime"),
      value: `${responseTime}ms`,
      icon: <Zap {...ICON_LG} />,
      color:
        responseTime < 200
          ? ("success" as const)
          : responseTime < 400
            ? ("warning" as const)
            : ("error" as const),
      subtitle: t("performance.metrics.avgTime"),
    },
    {
      id: "success_rate",
      title: t("performance.metrics.successRate"),
      value: `${successRate}%`,
      icon: <CheckCircle {...ICON_LG} />,
      color:
        successRate >= 99
          ? ("success" as const)
          : successRate >= 95
            ? ("info" as const)
            : ("warning" as const),
      subtitle: t("performance.metrics.redirects"),
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {displayTitle}
        </Typography>
      ) : null}

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={metric.id}>
            <Box sx={{ height: "100%" }}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
                subtitle={metric.subtitle}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PerformanceMetrics;
