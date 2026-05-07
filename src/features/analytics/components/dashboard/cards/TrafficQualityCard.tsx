"use client";
import { useTranslation } from "react-i18next";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { MetricCardOptimized } from "@/shared/ui/base/MetricCardOptimized";

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
 * Exibe a qualidade de tráfego do link usando o padrão MetricCardOptimized.
 * Cor dinâmica: verde ≥80% orgânico, amarelo ≥50%, vermelho <50%.
 */
export function TrafficQualityCard({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data) return null;

  const color: "success" | "warning" | "error" =
    data.organic_percentage >= 80
      ? "success"
      : data.organic_percentage >= 50
        ? "warning"
        : "error";

  return (
    <MetricCardOptimized
      title={t("quality.title")}
      value={`${data.organic_percentage}%`}
      icon={<VerifiedUserIcon />}
      color={color}
      subtitle={t("quality.subtitle", {
        suspicious: data.suspicious,
        fraud: data.likely_fraud,
      })}
    />
  );
}
