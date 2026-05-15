"use client";
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

const TIER_COLORS: Record<string, string> = {
  organic: "#4caf50",
  suspicious: "#ff9800",
  likely_fraud: "#f44336",
  unknown: "#9e9e9e",
};

interface TierEntry {
  tier: string;
  clicks: number;
  percentage: number;
  avg_score: number;
}

interface QualityData {
  avg_quality_score: number | null;
  tier_breakdown: TierEntry[];
  organic_percentage: number;
}

interface Props {
  data?: QualityData;
}

/**
 * TrafficQualityChart - Visualização de qualidade do tráfego por tier
 *
 * @description
 * Exibe a distribuição de qualidade de cliques em tiers (orgânico, suspeito,
 * fraude, não analisado) com barras de progresso coloridas e score médio.
 * Dados calculados no backend via Phase 3 scoring (sem APIs externas).
 */
export function TrafficQualityChart({ data }: Props) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  if (!data?.tier_breakdown?.length) return null;

  return (
    <Card
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t("insights.trafficQuality.title")}
          </Typography>
          <Tooltip title={t("insights.trafficQuality.tooltipNote")}>
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Tooltip>
          {data.avg_quality_score !== null &&
            data.avg_quality_score !== undefined && (
              <Chip
                label={t("insights.trafficQuality.avgScore", {
                  score: data.avg_quality_score,
                })}
                size="small"
              />
            )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("insights.trafficQuality.description")}
        </Typography>
        {data.tier_breakdown.map((entry) => {
          const color = TIER_COLORS[entry.tier] ?? TIER_COLORS.unknown;
          const label = t(`insights.trafficQuality.tiers.${entry.tier}`, {
            defaultValue: entry.tier,
          });
          return (
            <Box key={entry.tier} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Chip
                  label={label}
                  size="small"
                  sx={{ bgcolor: color, color: "#fff" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {entry.clicks} ({entry.percentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={entry.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  "& .MuiLinearProgress-bar": { bgcolor: color },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
