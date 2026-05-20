"use client";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

const SEASON_LABELS: Record<string, string> = {
  summer: "Verão",
  winter: "Inverno",
  spring: "Primavera",
  fall: "Outono",
};

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
 * Exibe a distribuição de cliques por estação do ano.
 */
export function SeasonalDistributionChart({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data?.length) return null;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {t("temporal.seasonal.title", {
          defaultValue: "Distribuição por Estação",
        })}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("temporal.seasonal.description")}
      </Typography>
      {data.map((s) => (
        <Box key={s.season} sx={{ mb: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="body2">
              {SEASON_LABELS[s.season] ?? s.season}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {s.clicks} ({s.percentage}%)
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
  );
}
