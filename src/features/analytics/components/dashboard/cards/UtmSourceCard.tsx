"use client";
/**
 * UtmSourceCard — shows top UTM source values for a link.
 */
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  HorizontalBreakdownBars,
  categoricalBreakdownColor,
} from "@/features/analytics/components/audience/HorizontalBreakdownBars";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { SocialBrandIcon, socialBrandColor } from "@/shared/ui/icons";

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
 *
 * Color pass (2026-08-18): rows cycle through the categorical dataViz ramp
 * like every other multi-row breakdown — they used to all render in the same
 * `primary` blue, so a five-source campaign list looked like one series. A
 * source whose name is a known social platform (`instagram`, `whatsapp`, …
 * the values `utm_source` is most often set to) additionally gets that
 * platform's brand glyph, tinted with its brand color via `iconColor`. The
 * tint stops at the glyph: the bar stays on the ramp, because the bar is the
 * series mark and brand hues there would read as a rainbow.
 */
export function UtmSourceCard({ data }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  if (!data || data.length === 0) return null;

  const items: HorizontalBreakdownItem[] = data.map((entry, index) => {
    const brand = socialBrandColor(entry.source, theme.palette.mode);

    return {
      key: entry.source,
      label: entry.source,
      value: entry.clicks,
      percentage: entry.percentage,
      color: categoricalBreakdownColor(index, theme.palette.mode),
      ...(brand
        ? {
            icon: <SocialBrandIcon platform={entry.source} size={14} />,
            iconColor: brand,
          }
        : {}),
    };
  });

  return (
    <ChartCard
      title={t("dashboard.utmSource.title")}
      subtitle={t("dashboard.utmSource.description")}
    >
      <HorizontalBreakdownBars items={items} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1.5, display: "block" }}
      >
        {t("dashboard.utmSource.topLabel")}
      </Typography>
    </ChartCard>
  );
}
