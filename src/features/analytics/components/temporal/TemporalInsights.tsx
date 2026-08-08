"use client";
import { Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  getWeekdayLabel,
  isWeekendDay,
} from "@/features/analytics/utils/weekday";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { TemporalInsightsProps } from "@/types/analytics";

/**
 * 💡 Componente de Insights Temporais
 *
 * @description
 * Componente dedicado para exibir insights e análises dos dados temporais.
 * Extraído do TemporalChart para uso independente.
 *
 * @features
 * - Análise de picos de horário
 * - Identificação de padrões semanais
 * - Insights de negócio acionáveis
 * - Recomendações baseadas em dados
 */
export function TemporalInsights({
  hourlyData,
  weeklyData,
  showAdvancedInsights: _showAdvancedInsights = true,
  showRecommendations: _showRecommendations = true,
}: TemporalInsightsProps) {
  const { t, i18n } = useTranslation("analytics");

  // Função auxiliar para obter total de cliques
  const getTotalClicks = (data: { clicks: number }[]) =>
    data.reduce((sum, item) => sum + item.clicks, 0);

  const hourlyTotal = getTotalClicks(hourlyData);
  const weeklyTotal = getTotalClicks(weeklyData);

  // Calcular insights temporais
  const avgClicksPerHour = hourlyTotal / 24;
  const avgClicksPerDay = weeklyTotal / 7;

  // Encontrar pico de hora
  const peakHour = hourlyData.reduce(
    (prev, current) => (current.clicks > prev.clicks ? current : prev),
    hourlyData[0] || { hour: 0, clicks: 0, label: "00:00" },
  );

  // Encontrar pico de dia. O fallback não carrega nome: ele só existe para o
  // reduce não estourar com a lista vazia, e nesse caso `clicks` é 0, então o
  // bloco que renderiza o nome nem chega a montar.
  const peakDay = weeklyData.reduce(
    (prev, current) => (current.clicks > prev.clicks ? current : prev),
    weeklyData[0] || { day: 0, clicks: 0, day_name: "" },
  );

  // Análise de horário comercial (9h às 17h)
  const businessHoursClicks = hourlyData
    .filter((item) => item.hour >= 9 && item.hour <= 17)
    .reduce((sum, item) => sum + item.clicks, 0);
  const isBusinessHoursActive = businessHoursClicks > hourlyTotal * 0.4;

  // Análise de fim de semana (sábado e domingo). O backend numera os dias em
  // ISO — 1=Segunda … 7=Domingo — então `5 || 6`, que era o filtro aqui, somava
  // Sexta e Sábado e nunca contava Domingo.
  const weekendClicks = weeklyData
    .filter((item) => isWeekendDay(item.day))
    .reduce((sum, item) => sum + item.clicks, 0);
  const isWeekendActive = weekendClicks > weeklyTotal * 0.3;

  // Se não há dados suficientes, não mostrar insights
  if (hourlyTotal === 0 && weeklyTotal === 0) {
    return null;
  }

  return (
    <ChartCard title={t("temporal.insights.title")}>
      <Stack spacing={1.5}>
        <Typography variant="body2">
          {t("temporal.insights.summary", {
            total: hourlyTotal.toLocaleString(i18n.language),
            perHour: avgClicksPerHour.toFixed(1),
            perDay: avgClicksPerDay.toFixed(1),
          })}
        </Typography>

        {peakHour.clicks > 0 && (
          <Typography variant="body2">
            • <strong>{peakHour.label}</strong>{" "}
            {t("temporal.insights.peakHourTip", { clicks: peakHour.clicks })}
          </Typography>
        )}

        {peakDay.clicks > 0 && (
          <Typography variant="body2">
            •{" "}
            <strong>{getWeekdayLabel(peakDay.day, t, peakDay.day_name)}</strong>{" "}
            {t("temporal.insights.peakDayTip", { clicks: peakDay.clicks })}
          </Typography>
        )}

        {isBusinessHoursActive ? (
          <Typography variant="body2">
            {t("temporal.insights.businessHoursActive", {
              percent: ((businessHoursClicks / hourlyTotal) * 100).toFixed(1),
            })}
          </Typography>
        ) : null}

        {!isBusinessHoursActive && hourlyTotal > 0 && (
          <Typography variant="body2">
            {t("temporal.insights.afterHoursActive")}
          </Typography>
        )}

        {isWeekendActive ? (
          <Typography variant="body2">
            {t("temporal.insights.weekendActive", {
              percent: ((weekendClicks / weeklyTotal) * 100).toFixed(1),
            })}
          </Typography>
        ) : null}

        {!isWeekendActive && weeklyTotal > 0 && (
          <Typography variant="body2">
            {t("temporal.insights.weekdaysActive")}
          </Typography>
        )}

        {hourlyTotal > 0 && weeklyTotal > 0 && (
          <Typography variant="body2">
            <strong>•</strong> {t("temporal.insights.consistencyTip")}
          </Typography>
        )}
      </Stack>
    </ChartCard>
  );
}

export default TemporalInsights;
