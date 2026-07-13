"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/** A single row rendered by {@link HorizontalBreakdownBars}. */
export interface HorizontalBreakdownItem {
  /** Stable React key for the row. */
  key: string;
  /** Human-readable category label (already translated). */
  label: string;
  /** Raw metric value (usually a click count) shown next to the percentage. */
  value: number;
  /** Share of the total, 0–100. Drives the fill width of the bar. */
  percentage: number;
  /** Optional per-row fill color; falls back to the `color` prop, then `theme.palette.primary.main`. */
  color?: string;
}

/** Props for {@link HorizontalBreakdownBars}. */
interface HorizontalBreakdownBarsProps {
  /** Rows to render, in the order given — callers sort largest-first. */
  items: HorizontalBreakdownItem[];
  /** Default fill color applied to rows without their own `color`. */
  color?: string;
  /** Unit label appended after the raw value (e.g. "cliques"). Omitted by default. */
  valueSuffix?: string;
}

/**
 * Horizontal-bar "mark" used across the Audience tab for every categorical
 * distribution (devices, browsers, systems, languages, traffic-quality
 * tiers). Each row is simultaneously the chart and the data table — label,
 * raw value and percentage all read directly off the same line — which is
 * what lets this component replace the previous pie/donut-chart +
 * ranked-list pairs that showed the exact same three numbers twice.
 *
 * It also degrades far better than a donut on narrow viewports: the label
 * truncates instead of the whole chart needing to shrink, so nothing
 * overflows at 360px.
 */
export function HorizontalBreakdownBars({
  items,
  color,
  valueSuffix,
}: HorizontalBreakdownBarsProps) {
  const theme = useTheme();
  const fallbackColor = color ?? theme.palette.primary.main;

  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Box key={item.key}>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 600, minWidth: 0, flex: 1 }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600 }}
            >
              {item.value}
              {valueSuffix ? ` ${valueSuffix}` : ""} ·{" "}
              {item.percentage.toFixed(1)}%
            </Typography>
          </Box>
          <Box
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.action.hover,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                height: "100%",
                borderRadius: 4,
                bgcolor: item.color ?? fallbackColor,
                transition: "width 0.4s ease",
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export default HorizontalBreakdownBars;
