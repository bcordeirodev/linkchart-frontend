"use client";
import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Chip,
  Collapse,
  Button,
} from "@mui/material";
import {
  Clock,
  Calendar,
  Zap,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { getWeekdayLabel } from "@/features/analytics/utils/weekday";
import { formatHourShort } from "@/features/analytics/utils/displayLabels";
import { radiusTokens } from "@/lib/theme/designSystem";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { PeakAnalysis, TemporalData } from "@/types";

import { ViralRankMiniChart } from "./ViralRankMiniChart";

interface PeakAnalysisCardProps {
  peakAnalysis: PeakAnalysis;
  /** Viral rank by day data — rendered between the metric cards and the insights card. */
  viralRankByDay?: TemporalData["viral_rank_by_day"];
}

/**
 * Componente para exibir análise de picos temporais (do back-end)
 */
export function PeakAnalysisCard({
  peakAnalysis,
  viralRankByDay,
}: PeakAnalysisCardProps) {
  const { t, i18n } = useTranslation("analytics");
  const {
    peak_hour,
    peak_day,
    peak_day_name,
    peak_hour_clicks,
    peak_day_clicks,
  } = peakAnalysis;

  // `peak_day_name` arrives hardcoded in Portuguese from the API; the ISO
  // `peak_day` number is what can actually be localized. The name is kept only
  // as a last-resort fallback for payloads without the number.
  const peakDayLabel = getWeekdayLabel(peak_day, t, peak_day_name ?? "--");

  const [showRecs, setShowRecs] = useState(false);

  if (peak_hour == null) {
    return null;
  }

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

  return (
    <Box>
      <Grid container spacing={3}>
        {/* A fileira de MetricCards que vivia aqui repetia, com nomes
            sinônimos, os KPIs do topo da aba (Pico de Hora / Pico de Dia).
            O resumo mora nos KPIs da aba; este card guarda só a análise
            rica (boxes de hora/dia, período e recomendações). */}

        {/* Viral Rank Mini Chart */}
        {viralRankByDay && viralRankByDay.length > 0 && (
          <Grid item xs={12}>
            <ViralRankMiniChart data={viralRankByDay} />
          </Grid>
        )}

        {/* Card de Insights */}
        <Grid item xs={12}>
          <ChartCard
            title={t("temporal.peak.engagementPeakAnalysis")}
            icon={<Zap size={16} strokeWidth={1.5} />}
            subtitle={t("charts.descriptions.peakAnalysis")}
          >
            <Stack>
              {/* Painéis internos (varredura de temas 2026-08-17): o fill era
                  `background.paper`, que dentro de um `ChartCard` é o próprio
                  fill do card no tema claro (painel invisível, só a hairline
                  aparecia) e é mais ESCURO que o véu do card no dark —
                  elevação invertida. `action.hover` clareia no dark e escurece
                  no claro, o degrau correto nos dois temas; a hairline de
                  `divider` continua definindo a caixa. */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "action.hover",
                      borderRadius: `${radiusTokens.md}px`,
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
                    <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 600 }}>
                      {formatHourShort(peak_hour)}
                    </Typography>
                    <Typography variant="body2">
                      {t("temporal.peak.clicksConcentrated", {
                        total: peak_hour_clicks.toLocaleString(i18n.language),
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
                      bgcolor: "action.hover",
                      borderRadius: `${radiusTokens.md}px`,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
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
                    <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 600 }}>
                      {peakDayLabel}
                    </Typography>
                    <Typography variant="body2">
                      {t("temporal.peak.clicksThisDay", {
                        total: peak_day_clicks.toLocaleString(i18n.language),
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

              {/* Collapsible recommendations */}
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="text"
                  endIcon={
                    showRecs ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  }
                  onClick={() => setShowRecs((v) => !v)}
                  sx={{ px: 0, minWidth: 0 }}
                >
                  {showRecs
                    ? t("temporal.peak.hideRecommendations")
                    : t("temporal.peak.showRecommendations")}
                </Button>
                <Collapse in={showRecs}>
                  <Box
                    sx={{
                      p: 2,
                      mt: 1,
                      bgcolor: "action.hover",
                      borderRadius: `${radiusTokens.md}px`,
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
                          day: peakDayLabel,
                          hour: formatHourShort(peak_hour),
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
                </Collapse>
              </Box>
            </Stack>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PeakAnalysisCard;
