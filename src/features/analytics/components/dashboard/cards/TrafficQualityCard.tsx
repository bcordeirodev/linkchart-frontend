"use client";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

interface QualitySummary {
  organic: number;
  suspicious: number;
  likely_fraud: number;
  unscored: number;
  organic_percentage: number;
}

interface Props {
  data?: QualitySummary;
}

/**
 * TrafficQualityCard - Card resumido de qualidade de tráfego para dashboard
 *
 * @description
 * Exibe o percentual de tráfego orgânico e contagens de suspeitos/fraude
 * calculados pelo scoring de Phase 3. Cor do chip reflete saúde geral.
 */
export function TrafficQualityCard({ data }: Props) {
  if (!data) return null;

  const color: "success" | "warning" | "error" =
    data.organic_percentage >= 80
      ? "success"
      : data.organic_percentage >= 50
        ? "warning"
        : "error";

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <VerifiedUserIcon color="action" />
          <Typography variant="subtitle2">Qualidade</Typography>
        </Box>
        <Chip
          label={`${data.organic_percentage}% orgânico`}
          color={color}
          size="medium"
          sx={{ fontWeight: 700, mb: 1 }}
        />
        <Typography variant="caption" display="block" color="text.secondary">
          {data.suspicious} suspeitos · {data.likely_fraud} fraude
        </Typography>
      </CardContent>
    </Card>
  );
}
