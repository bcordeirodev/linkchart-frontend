"use client";
import { Box, Typography, Chip, Divider } from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";

interface HolidayEntry {
  holiday: string;
  clicks: number;
  percentage: number;
}

interface HolidayImpact {
  holiday_clicks: number;
  non_holiday_clicks: number;
  holiday_percentage: number;
  top_holidays: HolidayEntry[];
}

interface Props {
  data?: HolidayImpact;
}

/**
 * Exibe o impacto de feriados nos cliques do link dentro de um ChartCard
 * com borda e hover consistentes com os demais gráficos da tab temporal.
 */
export function HolidayImpactCard({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data?.top_holidays?.length && !data?.holiday_clicks) return null;

  return (
    <ChartCard
      title={t("temporal.holiday.title", {
        defaultValue: "Impacto de Feriados",
      })}
      subtitle={t("temporal.holiday.description")}
      icon={<CelebrationIcon sx={{ fontSize: 18 }} color="primary" />}
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Chip
            label={`${data?.holiday_percentage ?? 0}%`}
            size="small"
            color="primary"
          />
          <Typography variant="body2" color="text.secondary">
            {t("temporal.holiday.inHolidays", {
              defaultValue: "dos cliques em feriados",
            })}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {data?.holiday_clicks?.toLocaleString() ?? 0}{" "}
          {t("temporal.holiday.holidayClicks", {
            defaultValue: "cliques em feriados",
          })}{" "}
          · {data?.non_holiday_clicks?.toLocaleString() ?? 0}{" "}
          {t("temporal.holiday.normalDays", {
            defaultValue: "em dias normais",
          })}
        </Typography>

        {(data?.top_holidays?.length ?? 0) > 0 && (
          <>
            <Divider sx={{ mb: 1 }} />
            {data!.top_holidays.map((h) => (
              <Box
                key={h.holiday}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                }}
              >
                <Typography variant="body2">{h.holiday}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {h.clicks.toLocaleString()} ({h.percentage}%)
                </Typography>
              </Box>
            ))}
          </>
        )}
      </Box>
    </ChartCard>
  );
}
