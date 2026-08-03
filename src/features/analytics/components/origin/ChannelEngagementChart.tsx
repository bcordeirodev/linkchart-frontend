"use client";
import { Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { radiusTokens } from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

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
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  if (channels.length === 0) return null;

  const chartData = channels.map((channel) => ({
    name: channel.channel,
    value: channel.avg_session_depth,
  }));

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {t("insights.traffic.engagementByChannel")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t("insights.traffic.engagementByChannelDesc")}
        </Typography>
        <ApexChartWrapper
          type="bar"
          {...formatBarChart(chartData, "name", "value", false, {
            series: t("insights.traffic.seriesName"),
            clicksLabel: t("temporal.viralRank.clicksUnit"),
          })}
          size="standard"
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1, lineHeight: 1.45 }}
        >
          {t("insights.traffic.avgSessionByChannel")}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ChannelEngagementChart;
