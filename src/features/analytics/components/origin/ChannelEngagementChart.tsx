"use client";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { tDynamic } from "@/lib/i18n/tDynamic";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { TrafficChannel } from "@/features/analytics/hooks/useInsightsData";

/** Props for {@link ChannelEngagementChart}. */
interface ChannelEngagementChartProps {
  /** Channel-level traffic breakdown, used for its `avg_session_depth` field. */
  channels: TrafficChannel[];
}

/**
 * Renders "Engajamento por Canal" — average session depth (clicks per
 * session) per traffic channel — as a small bar chart inside the Origin
 * tab's "Detalhes técnicos" accordion.
 *
 * Relocated here (collapsed, not deleted) because a number like "1.37
 * clicks per session" is engineering-flavoured: useful for someone
 * optimizing a channel, meaningless as a headline metric next to the
 * channel-share bar in `ChannelsBreakdown`.
 */
export function ChannelEngagementChart({
  channels,
}: ChannelEngagementChartProps) {
  const { t, i18n } = useTranslation("analytics");

  if (channels.length === 0) return null;

  // Channel names arrive as the tracking pipeline's raw values ("direct",
  // "paid_search"…) — translated for display the same way `ChannelsBreakdown`
  // does for the channel-share bar, falling back to the raw value for any
  // channel without a translation key yet.
  const chartData = channels.map((channel) => ({
    name: tDynamic(t, `origin.channels.${channel.channel}`, {
      defaultValue: channel.channel,
    }),
    value: channel.avg_session_depth,
  }));

  return (
    <ChartCard
      title={t("insights.traffic.engagementByChannel")}
      subtitle={t("insights.traffic.engagementByChannelDesc")}
    >
      <ApexChartWrapper
        type="bar"
        {...formatBarChart(
          chartData,
          "name",
          "value",
          false,
          {
            series: t("insights.traffic.seriesName"),
            clicksLabel: t("temporal.viralRank.clicksUnit"),
          },
          i18n.language,
        )}
        size="standard"
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, lineHeight: 1.45 }}
      >
        {t("insights.traffic.avgSessionByChannel")}
      </Typography>
    </ChartCard>
  );
}

export default ChannelEngagementChart;
