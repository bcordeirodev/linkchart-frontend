"use client";
import { useTranslation } from "react-i18next";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box } from "@mui/material";

import { MetricCardOptimized } from "@/shared/ui/base/MetricCardOptimized";

const RANK_COLORS = {
  cold: "secondary",
  warming: "primary",
  trending: "warning",
  viral: "error",
} as const;

interface ViralityData {
  current_rank: string;
  distribution: Array<{ rank: string; clicks: number }>;
}

interface Props {
  data?: ViralityData;
}

/**
 * Exibe o rank de viralidade do link usando o padrão MetricCardOptimized.
 */
export function ViralityCard({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data) return null;

  const rankLabels = {
    cold: t("virality.rank.cold"),
    warming: t("virality.rank.warming"),
    trending: t("virality.rank.trending"),
    viral: t("virality.rank.viral"),
  };

  const color =
    RANK_COLORS[data.current_rank as keyof typeof RANK_COLORS] ?? "secondary";

  const rankLabel =
    rankLabels[data.current_rank as keyof typeof rankLabels] ??
    data.current_rank;

  const subtitle = data.distribution?.length
    ? data.distribution
        .map(
          (d) =>
            `${rankLabels[d.rank as keyof typeof rankLabels] ?? d.rank}: ${d.clicks}`,
        )
        .join(" · ")
    : undefined;

  return (
    <Box>
      <MetricCardOptimized
        title={t("virality.title")}
        value={rankLabel}
        icon={<WhatshotIcon />}
        color={color}
        subtitle={subtitle}
      />
    </Box>
  );
}
