"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { KeyboardEvent, ReactNode } from "react";

import { dataVizCategorical } from "@/lib/theme/dataViz";

/**
 * Resolves the fill color for row `index` of a multi-category breakdown,
 * cycling through {@link dataVizCategorical} (blue → teal → violet → amber →
 * slate).
 *
 * Single source of truth for the "which color is category N" question every
 * {@link HorizontalBreakdownBars} consumer that lists true categories
 * (devices, browsers, operating systems, …) has to answer. Before this
 * existed, each of those consumers derived its own cycle from
 * `dataVizPalette` — a *sequential* ramp of five blues meant for a single
 * series' intensity, not five distinct categories — so every one of those
 * breakdowns rendered as "blue + slightly different blue", indistinguishable
 * from a single-series chart. Consumers that render one semantic series
 * (e.g. a single quality tier, a brand-colored platform) keep passing their
 * own `color`/`item.color` — this helper is purely opt-in and does not
 * change {@link HorizontalBreakdownBars}' own API or rendering.
 *
 * @param index - zero-based row position in the breakdown list.
 * @returns a hex color string from `dataVizCategorical`.
 */
export function categoricalBreakdownColor(index: number): string {
  return dataVizCategorical[index % dataVizCategorical.length]!;
}

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
  /**
   * Optional leading glyph rendered before the label (e.g. a social platform's
   * brand mark). Inherits the row's fill color, so callers do not colour it.
   */
  icon?: ReactNode;
}

/** Props for {@link HorizontalBreakdownBars}. */
interface HorizontalBreakdownBarsProps {
  /** Rows to render, in the order given — callers sort largest-first. */
  items: HorizontalBreakdownItem[];
  /** Default fill color applied to rows without their own `color`. */
  color?: string;
  /** Unit label appended after the raw value (e.g. "cliques"). Omitted by default. */
  valueSuffix?: string;
  /**
   * When provided, every row becomes an interactive control (button
   * semantics, keyboard-activatable) and calls back with the clicked row's
   * `key`. Used by `ContinentBreakdown` to double as a continent filter —
   * omit for a purely read-only breakdown (the common case).
   */
  onItemClick?: (key: string) => void;
  /**
   * Key of the row currently active/selected, highlighted with a filled
   * background and outline. Only meaningful when `onItemClick` is set.
   */
  selectedKey?: string | null;
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
 *
 * Rows are read-only by default. Passing `onItemClick` (e.g. from
 * `ContinentBreakdown`, which doubles as a continent filter) turns each row
 * into a keyboard-accessible button that highlights when its `key` matches
 * `selectedKey`.
 */
export function HorizontalBreakdownBars({
  items,
  color,
  valueSuffix,
  onItemClick,
  selectedKey,
}: HorizontalBreakdownBarsProps) {
  const theme = useTheme();
  const fallbackColor = color ?? theme.palette.primary.main;
  const interactive = !!onItemClick;

  return (
    <Stack spacing={1.5}>
      {items.map((item) => {
        const isSelected = interactive && selectedKey === item.key;
        return (
          <Box
            key={item.key}
            {...(interactive
              ? {
                  role: "button",
                  tabIndex: 0,
                  onClick: () => onItemClick(item.key),
                  onKeyDown: (event: KeyboardEvent) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onItemClick(item.key);
                    }
                  },
                }
              : {})}
            sx={{
              ...(interactive
                ? {
                    cursor: "pointer",
                    borderRadius: 1,
                    p: 0.75,
                    mx: -0.75,
                    bgcolor: isSelected ? "action.selected" : "transparent",
                    outline: isSelected
                      ? `1px solid ${theme.palette.primary.main}40`
                      : "none",
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.15s",
                  }
                : {}),
            }}
          >
            <Box
              sx={{
                display: "flex",
                // `center`, not `baseline`: rows may carry a leading brand icon,
                // which baseline alignment would push off the text's line.
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              {item.icon ? (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                    color: item.color ?? fallbackColor,
                  }}
                >
                  {item.icon}
                </Box>
              ) : null}
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: isSelected ? 700 : 600,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                color={isSelected ? "primary" : "text.secondary"}
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
        );
      })}
    </Stack>
  );
}

export default HorizontalBreakdownBars;
