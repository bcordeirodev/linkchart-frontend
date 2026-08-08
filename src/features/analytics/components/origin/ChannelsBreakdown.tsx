"use client";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/lib/i18n/tDynamic";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { TrafficChannel } from "@/features/analytics/hooks/useInsightsData";

import { getChannelColor } from "./channelColors";
import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "../audience/HorizontalBreakdownBars";

/** Props for {@link ChannelsBreakdown}. */
interface ChannelsBreakdownProps {
  /** Channel-level traffic breakdown (direct/social/search/referral/…). */
  channels: TrafficChannel[];
}

/**
 * Renders the "Canais" card for the Origin tab: a single horizontal-bar
 * breakdown of traffic by channel (direct / social / search / referral / …),
 * value and percentage on every row.
 *
 * This replaces five previous representations of the exact same four
 * channels — four "Fonte Principal / Diversidade / Total / Canais Ativos"
 * KPI cards, a channel-distribution donut, a "Performance Detalhada por
 * Canal" list and a "Top 5 Fontes Individuais" list — with the one chart
 * that answers the question ("which channel, how much"). Per-channel
 * engagement (average session depth) moves to the "Detalhes técnicos"
 * accordion via `ChannelEngagementChart`, since a raw "clicks per session"
 * number is engineering-flavoured, not something a channel-share bar needs
 * to carry.
 */
export function ChannelsBreakdown({ channels }: ChannelsBreakdownProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  if (channels.length === 0) return null;

  const sorted = [...channels].sort((a, b) => b.percentage - a.percentage);
  const items: HorizontalBreakdownItem[] = sorted.map((channel) => ({
    key: channel.channel,
    label: tDynamic(t, `origin.channels.${channel.channel}`, {
      defaultValue: channel.channel,
    }),
    value: channel.clicks,
    percentage: channel.percentage,
    color: getChannelColor(channel.channel, theme.palette.text.secondary),
  }));

  // Only "direct" traffic recorded so far: the bar alone reads as "nothing
  // interesting happened" rather than "no UTM-tagged traffic has arrived
  // yet" — the hint below teaches the next step instead of leaving a bare
  // single-row chart to speak for itself.
  const isDirectOnly =
    channels.length === 1 && channels[0]?.channel === "direct";

  return (
    <ChartCard
      title={t("origin.sections.channels")}
      subtitle={t("origin.sections.channelsDesc")}
    >
      <HorizontalBreakdownBars items={items} />
      {isDirectOnly ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t("origin.channelsEmptyHint")}
        </Typography>
      ) : null}
    </ChartCard>
  );
}

export default ChannelsBreakdown;
