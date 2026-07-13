"use client";
import { Radio } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/lib/i18n/tDynamic";
import { ICON_MD } from "@/lib/theme/iconDefaults";
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

  return (
    <ChartCard
      title={t("origin.sections.channels")}
      subtitle={t("origin.sections.channelsDesc")}
      icon={<Radio {...ICON_MD} />}
    >
      <HorizontalBreakdownBars items={items} />
    </ChartCard>
  );
}

export default ChannelsBreakdown;
