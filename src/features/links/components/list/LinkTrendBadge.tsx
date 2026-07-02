import { TrendingDown, Minus, TrendingUp } from "lucide-react";
import { Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { LinkTrend } from "@/types";
import { formatCount } from "@/lib/utils";

interface LinkTrendBadgeProps {
  trend?: LinkTrend | null;
  compact?: boolean;
}

/**
 * Displays the click trend for a link as a badge with an icon, count and
 * percentage change relative to the previous period.
 *
 * When trend data is unavailable a dash placeholder is shown with a tooltip
 * explaining that no data is available yet.
 *
 * @param trend - Trend data object containing `current` count and `percent_change`.
 * @param compact - When true renders a smaller inline variant.
 */
export function LinkTrendBadge({
  trend,
  compact = false,
}: LinkTrendBadgeProps) {
  const { t, i18n } = useTranslation("links");

  if (!trend) {
    return (
      <Tooltip title={t("metrics.trendNoData")}>
        <Typography
          variant="caption"
          component="span"
          color="text.disabled"
          aria-label={t("metrics.trendNoData")}
          sx={{
            fontSize: compact ? "0.75rem" : undefined,
            lineHeight: compact ? "20px" : undefined,
            m: 0,
          }}
        >
          —
        </Typography>
      </Tooltip>
    );
  }

  const { percent_change, current } = trend;
  const isPositive = percent_change > 0;
  const isNeutral = percent_change === 0;
  // A drop in clicks is information, not a failure — declines stay neutral so
  // red remains reserved for real problems (broken destination, limit hit).
  const color = isPositive ? "success.main" : "text.secondary";
  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const sign = isPositive ? "+" : "";

  if (compact) {
    return (
      <Tooltip title={t("metrics.trendTooltip")}>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ minHeight: 20, lineHeight: "20px" }}
        >
          <Typography
            variant="caption"
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              lineHeight: "20px",
              m: 0,
            }}
          >
            {formatCount(current, i18n.language)}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.25}
            sx={{ color }}
          >
            <Icon size={12} strokeWidth={1.5} />
            <Typography
              variant="caption"
              component="span"
              sx={{
                color,
                fontWeight: 600,
                fontSize: "0.75rem",
                lineHeight: "20px",
                m: 0,
              }}
            >
              {sign}
              {percent_change.toFixed(1)}%
            </Typography>
          </Stack>
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={t("metrics.trendTooltip")}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {formatCount(current, i18n.language)}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ color }}>
          <Icon size={14} strokeWidth={1.5} />
          <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
            {sign}
            {percent_change.toFixed(1)}%
          </Typography>
        </Stack>
      </Stack>
    </Tooltip>
  );
}
