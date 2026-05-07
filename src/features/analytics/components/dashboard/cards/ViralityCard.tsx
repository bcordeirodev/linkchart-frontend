"use client";
import { useTranslation } from "react-i18next";
import WhatshotIcon from "@mui/icons-material/Whatshot";

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

  const color =
    RANK_COLORS[data.current_rank as keyof typeof RANK_COLORS] ?? "secondary";

  const subtitle = data.distribution?.length
    ? data.distribution
        .map((d) => `${t(`virality.rank.${d.rank}`)}: ${d.clicks}`)
        .join(" · ")
    : undefined;

  return (
    <MetricCardOptimized
      title={t("virality.title")}
      value={t(`virality.rank.${data.current_rank}`)}
      icon={<WhatshotIcon />}
      color={color}
      subtitle={subtitle}
    />
  );
}
