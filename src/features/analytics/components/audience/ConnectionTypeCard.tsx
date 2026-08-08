"use client";
import { Alert } from "@mui/material";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import type { ConnectionTypeBreakdown } from "@/types/analytics/audience";

import { normaliseBreakdown } from "./normaliseBreakdown";

/**
 * Height cap for the single-row stacked bar below — a horizontal stacked
 * bar is one line of segments plus its legend, not a chart that needs
 * hundreds of pixels of vertical room (spec: "barra horizontal empilhada
 * única … altura do chart ≤ 120px").
 */
const STACKED_BAR_HEIGHT = 110;

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
      : formatAnalyticsLabel(c.type),
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
        height={STACKED_BAR_HEIGHT}
        {...formatHorizontalStackedBar(chartData, "name", "value")}
      />
    </ChartCard>
  );
}

export default ConnectionTypeCard;
