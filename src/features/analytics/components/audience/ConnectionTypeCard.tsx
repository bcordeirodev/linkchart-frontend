"use client";
import { Alert } from "@mui/material";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import type { ConnectionTypeBreakdown } from "@/types/analytics/audience";

import { normaliseBreakdown } from "./normaliseBreakdown";

/** Entry in the connection type breakdown array returned by the audience API. */
interface ConnectionEntry {
  type: string;
  clicks: number;
  percentage: number;
}

/** Connection type keys with a translated label in the locale files. */
const KNOWN_CONNECTION_TYPES = [
  "residential",
  "mobile",
  "cellular",
  "datacenter",
  "broadband",
  "wifi",
  "education",
  "unknown",
] as const;

interface ConnectionTypeCardProps {
  /**
   * Connection type distribution data from `audience.connection_type_breakdown`.
   * Accepts both the new phase-aware shape and the legacy flat array.
   */
  breakdown: ConnectionTypeBreakdown | ConnectionEntry[];
}

/**
 * Horizontal stacked bar of the ISP connection type classified from network
 * data (Phase 2). Datacenter-heavy traffic is a strong bot/fraud signal,
 * which is why this card lives in the Quality sub-tab.
 */
export function ConnectionTypeCard({ breakdown }: ConnectionTypeCardProps) {
  const { t } = useTranslation("analytics");

  const conn = normaliseBreakdown<ConnectionEntry>(breakdown);
  if (conn.data.length === 0) return null;

  const tStr = t as (k: string) => string;
  const chartData = conn.data.map((c) => ({
    name: (KNOWN_CONNECTION_TYPES as readonly string[]).includes(c.type)
      ? tStr(`audience.extraCharts.connectionLabels.${c.type}`)
      : c.type,
    value: c.clicks,
  }));

  return (
    <ChartCard
      title={t("audience.extraCharts.connectionType")}
      subtitle={t("audience.extraCharts.connectionTypeDescription")}
    >
      {!conn.phaseAvailable && (
        <Alert
          severity="info"
          icon={<Info {...ICON_MD} />}
          sx={{ mb: 1.5, borderRadius: `${radiusTokens.md}px` }}
        >
          {t("audience.phaseData.unavailable")}
        </Alert>
      )}
      <ApexChartWrapper
        type="bar"
        size="compact"
        {...formatHorizontalStackedBar(chartData, "name", "value")}
      />
    </ChartCard>
  );
}

export default ConnectionTypeCard;
