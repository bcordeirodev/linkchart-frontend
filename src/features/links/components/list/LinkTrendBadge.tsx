import { TrendingDown, Minus, TrendingUp } from "lucide-react";
import { Stack, Typography } from "@mui/material";
import type { LinkTrend } from "@/types";

interface LinkTrendBadgeProps {
  trend?: LinkTrend | null;
  compact?: boolean;
}

export function LinkTrendBadge({
  trend,
  compact = false,
}: LinkTrendBadgeProps) {
  if (!trend) {
    return (
      <Typography
        variant="caption"
        component="span"
        color="text.disabled"
        sx={{
          fontSize: compact ? "0.75rem" : undefined,
          lineHeight: compact ? "20px" : undefined,
          m: 0,
        }}
      >
        —
      </Typography>
    );
  }

  const { percent_change, current } = trend;
  const isPositive = percent_change > 0;
  const isNeutral = percent_change === 0;
  const color = isPositive
    ? "success.main"
    : isNeutral
      ? "text.secondary"
      : "error.main";
  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const sign = isPositive ? "+" : "";

  if (compact) {
    return (
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
          {current.toLocaleString("pt-BR")}
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
    );
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {current.toLocaleString("pt-BR")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ color }}>
        <Icon size={14} strokeWidth={1.5} />
        <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
          {sign}
          {percent_change.toFixed(1)}%
        </Typography>
      </Stack>
    </Stack>
  );
}
