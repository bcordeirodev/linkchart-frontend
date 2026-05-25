"use client";
import { Box, Typography, LinearProgress } from "@mui/material";
import { Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";

const SEASON_COLORS: Record<string, string> = {
  summer: "#ff9800",
  winter: "#2196f3",
  spring: "#4caf50",
  fall: "#ff5722",
};

interface SeasonEntry {
  season: string;
  clicks: number;
  percentage: number;
}

interface Props {
  data?: SeasonEntry[];
}

/**
 * Exibe a distribuição de cliques por estação do ano dentro de um ChartCard
 * com borda e hover consistentes com os demais gráficos da tab temporal.
 */
export function SeasonalDistributionChart({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data?.length) return null;

  return (
    <ChartCard
      title={t("temporal.seasonal.title")}
      subtitle={t("temporal.seasonal.description")}
      icon={<Leaf size={18} />}
    >
      <Box sx={{ pt: 1 }}>
        {data.map((s) => (
          <Box key={s.season} sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="body2">
                {t(`temporal.seasonal.labels.${s.season}`, {
                  defaultValue: s.season,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.clicks.toLocaleString()} ({s.percentage}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={s.percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                "& .MuiLinearProgress-bar": {
                  bgcolor: SEASON_COLORS[s.season] ?? "primary.main",
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </ChartCard>
  );
}
