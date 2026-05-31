import type { Theme } from "@mui/material/styles";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

/** Inner padding for {@link EnhancedPaper} blocks in the Insights tab. */
export const INSIGHTS_BLOCK_PAD = { xs: 2, md: 2.5 } as const;

/** Vertical gap between major sections inside a paper block. */
export const INSIGHTS_SECTION_SPACING = 3;

/** Subsection title (Top sources, recommendations, chart panels, etc.). */
export const insightsSectionHeadingSx = {
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1.5,
} as const;

/** Bordered panel behind charts — full padding so content does not touch edges. */
export function insightsChartPanelSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  return {
    p: INSIGHTS_BLOCK_PAD,
    borderRadius: `${radiusTokens.lg}px`,
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
  };
}

/** Compact bordered list / recommendation tile. */
export function insightsTileSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  return {
    p: 2,
    borderRadius: `${radiusTokens.md}px`,
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
  };
}

/** Two-column chart row without MUI Grid negative margins. */
export const insightsChartRowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 2,
} as const;

/** Metric cards row (up to 4 columns) without MUI Grid negative margins. */
export const insightsMetricRowSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, 1fr)",
    lg: "repeat(4, 1fr)",
  },
  gap: 2,
} as const;

/** Grouped block inside a traffic/insights paper (channels, sources, etc.). */
export function insightsSectionBlockSx(theme: Theme) {
  return {
    p: INSIGHTS_BLOCK_PAD,
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: theme.palette.action.hover,
  };
}

/** Side-by-side subsections on large screens (e.g. top sources + navigation). */
export const insightsTwoColSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
  gap: { xs: 3, lg: 3 },
  alignItems: "start",
} as const;

/** Chart panel title — left-aligned for scanability. */
export const insightsChartPanelTitleSx = {
  fontWeight: 600,
  mb: 0.5,
} as const;

export const insightsChartPanelDescSx = {
  color: "text.secondary",
  fontSize: "0.8125rem",
  lineHeight: 1.55,
  mb: 2,
} as const;

/** Rank position badge in ranked lists (#1 highlighted). */
export function insightsRankBadgeSx(theme: Theme, rank: number) {
  const isTop = rank === 0;
  return {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderRadius: `${radiusTokens.sm}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    bgcolor: isTop ? theme.palette.primary.main : theme.palette.action.selected,
    color: isTop
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
  };
}
