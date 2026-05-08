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

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  organic: { label: "Orgânico", color: "#4caf50" },
  suspicious: { label: "Suspeito", color: "#ff9800" },
  likely_fraud: { label: "Fraude", color: "#f44336" },
  unknown: { label: "Não analisado", color: "#9e9e9e" },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Qualidade do Tráfego
          </Typography>
          <Tooltip title="Score calculado com base em headers, comportamento e consistência de fingerprint. Sem APIs externas.">
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Tooltip>
          {data.avg_quality_score !== null &&
            data.avg_quality_score !== undefined && (
              <Chip
                label={`Score médio: ${data.avg_quality_score}`}
                size="small"
              />
            )}
        </Box>
        {data.tier_breakdown.map((t) => {
          const cfg = TIER_CONFIG[t.tier] ?? TIER_CONFIG.unknown;
          return (
            <Box key={t.tier} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Chip
                  label={cfg.label}
                  size="small"
                  sx={{ bgcolor: cfg.color, color: "#fff" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {t.clicks} ({t.percentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={t.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  "& .MuiLinearProgress-bar": { bgcolor: cfg.color },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
