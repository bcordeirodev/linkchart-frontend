"use client";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import {
  Clock,
  Calendar,
  Star,
  Zap,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import type { PeakAnalysis } from "@/types";

interface PeakAnalysisCardProps {
  peakAnalysis: PeakAnalysis;
}

/**
 * Componente para exibir análise de picos temporais (do back-end)
 */
export function PeakAnalysisCard({ peakAnalysis }: PeakAnalysisCardProps) {
  const { t } = useTranslation("analytics");
  const { peak_hour, peak_day_name, peak_hour_clicks, peak_day_clicks } =
    peakAnalysis;

  if (peak_hour == null) {
    return null;
  }

  // Formatar hora para exibição
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  // Determinar período do dia
  const getPeriodOfDay = (
    hour: number,
  ): {
    label: string;
    icon: ReactNode;
    color: "warning" | "info" | "primary" | "secondary";
  } => {
    if (hour >= 6 && hour < 12) {
      return {
        label: t("temporal.period.morning"),
        icon: <Sunrise size={16} strokeWidth={1.5} />,
        color: "warning",
      };
    }

    if (hour >= 12 && hour < 18) {
      return {
        label: t("temporal.period.afternoon"),
        icon: <Sun size={16} strokeWidth={1.5} />,
        color: "info",
      };
    }

    if (hour >= 18 && hour < 22) {
      return {
        label: t("temporal.period.evening"),
        icon: <Sunset size={16} strokeWidth={1.5} />,
        color: "primary",
      };
    }

    return {
      label: t("temporal.period.dawn"),
      icon: <Moon size={16} strokeWidth={1.5} />,
      color: "secondary",
    };
  };

  const period = getPeriodOfDay(peak_hour);
  const performancePct =
    peak_day_clicks > 0
      ? `${((peak_hour_clicks / peak_day_clicks) * 100).toFixed(1)}%`
      : "--";

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Cards de Métricas */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={t("temporal.peak.peakHour")}
            value={formatHour(peak_hour)}
            icon={<Clock {...ICON_LG} />}
            color="primary"
            subtitle={`${peak_hour_clicks.toLocaleString()} ${t("temporal.peak.clicks")}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={t("temporal.peak.peakDay")}
            value={peak_day_name ?? "--"}
            icon={<Calendar {...ICON_LG} />}
            color="secondary"
            subtitle={`${peak_day_clicks.toLocaleString()} ${t("temporal.peak.clicks")}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={t("temporal.peak.periodOfDay")}
            value={period.label}
            icon={period.icon}
            color={period.color}
            subtitle={t("temporal.peak.highestActivityPeriod")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={t("temporal.peak.performance")}
            value={performancePct}
            icon={<Star {...ICON_LG} />}
            color="success"
            subtitle={t("temporal.peak.ofDailyActivity")}
          />
        </Grid>

        {/* Card de Insights */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <CardContent>
              <Stack>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Zap size={16} strokeWidth={1.5} />
                    {t("temporal.peak.engagementPeakAnalysis")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("charts.descriptions.peakAnalysis")}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Clock size={16} strokeWidth={1.5} />
                        {t("temporal.peak.highestImpactHour")}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mb: 0.5, fontWeight: 600 }}
                      >
                        {formatHour(peak_hour)}
                      </Typography>
                      <Typography variant="body2">
                        {t("temporal.peak.clicksConcentrated", {
                          total: peak_hour_clicks.toLocaleString(),
                        })}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Chip
                          label={period.label}
                          size="small"
                          color={period.color}
                          icon={
                            <Box sx={{ display: "flex", ml: 0.5 }}>
                              {period.icon}
                            </Box>
                          }
                        />
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="secondary"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Calendar size={16} strokeWidth={1.5} />
                        {t("temporal.peak.highestEngagementDay")}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mb: 0.5, fontWeight: 600 }}
                      >
                        {peak_day_name ?? "--"}
                      </Typography>
                      <Typography variant="body2">
                        {t("temporal.peak.clicksThisDay", {
                          total: peak_day_clicks.toLocaleString(),
                        })}
                      </Typography>
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t("temporal.peak.bestDayForLaunches")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Recomendações */}
                <Box
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {t("temporal.peak.strategicRecommendations")}
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      {t("temporal.peak.schedulePostsFor", {
                        day: peak_day_name ?? "--",
                        hour: formatHour(peak_hour),
                      })}
                    </Typography>
                    <Typography variant="body2">
                      {t("temporal.peak.peakHourRepresents", {
                        total: peak_hour_clicks,
                        percent:
                          peak_day_clicks > 0
                            ? (
                                (peak_hour_clicks / peak_day_clicks) *
                                100
                              ).toFixed(1)
                            : "0",
                      })}
                    </Typography>
                    <Typography variant="body2">
                      {t("temporal.peak.focusOnContent", {
                        period: period.label.toLowerCase(),
                      })}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PeakAnalysisCard;
