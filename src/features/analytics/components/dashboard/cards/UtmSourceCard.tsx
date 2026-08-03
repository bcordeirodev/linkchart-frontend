"use client";
/**
 * UtmSourceCard — shows top UTM source values for a link.
 */
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { HorizontalBreakdownBars } from "@/features/analytics/components/audience/HorizontalBreakdownBars";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { HorizontalBreakdownItem } from "@/features/analytics/components/audience/HorizontalBreakdownBars";

interface UtmSourceEntry {
  source: string;
  clicks: number;
  percentage: number;
}

interface Props {
  data?: UtmSourceEntry[];
}

/**
 * Card showing top UTM source values for the link, in the Origem tab's
 * "Campanhas" sub-tab. Renders nothing when data is empty (no UTM-tagged
 * clicks), which is why it is easy to miss in development — the dev database
 * has no UTM rows at all.
 *
 * Renders through {@link ChartCard} and the shared
 * {@link HorizontalBreakdownBars} mark. It used to roll its own
 * `LinearProgress` rows with no track override, so the unfilled part of every
 * bar was MUI's default tint of `primary` — a blue track under a blue fill,
 * which reads as a half-filled bar. Same defect the other breakdowns had.
 */
export function UtmSourceCard({ data }: Props) {
  const { t } = useTranslation("analytics");

  if (!data || data.length === 0) return null;

  const items: HorizontalBreakdownItem[] = data.map((entry) => ({
    key: entry.source,
    label: entry.source,
    value: entry.clicks,
    percentage: entry.percentage,
  }));

  return (
    <ChartCard
      title={t("dashboard.utmSource.title")}
      subtitle={t("dashboard.utmSource.description")}
    >
      <HorizontalBreakdownBars items={items} />
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ mt: 1.5, display: "block" }}
      >
        {t("dashboard.utmSource.topLabel")}
      </Typography>
    </ChartCard>
  );
}
