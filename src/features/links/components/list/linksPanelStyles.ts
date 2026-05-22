import { alpha, keyframes } from "@mui/material/styles";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";

/** Shell styles aligned with `MetricCardOptimized` (border, radius, shadow). */
export function getLinksPanelSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    backgroundColor: theme.palette.background.paper,
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
  };
}

/** Quick-create panel — metric base with a thicker neutral border. */
export function getLinksQuickCreatePanelSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    ...getLinksPanelSx(theme),
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
  };
}

/** Expanding ring pulse after quick-create (visible outside the card). */
export function getNewlyCreatedHighlightSx(theme: Theme) {
  const primary = theme.palette.primary.main;
  const accentInset = `inset 3px 0 0 0 ${alpha(
    theme.palette.primary.light,
    theme.palette.mode === "dark" ? 0.45 : 0.4,
  )}`;

  const ringPulse = keyframes`
    0% {
      box-shadow: 0 0 0 0 ${alpha(primary, 0.5)}, ${accentInset};
    }
    55% {
      box-shadow: 0 0 0 9px ${alpha(primary, 0)}, ${accentInset};
    }
    100% {
      box-shadow: 0 0 0 0 ${alpha(primary, 0)}, ${accentInset};
    }
  `;

  return {
    position: "relative" as const,
    overflow: "visible" as const,
    zIndex: 2,
    margin: "3px",
    border: `2px solid ${primary}`,
    animation: `${ringPulse} 1.6s cubic-bezier(0.33, 1, 0.68, 1) 3`,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      outline: `2px solid ${primary}`,
      outlineOffset: 2,
    },
  };
}

/** Shell for desktop/mobile link cards in the browse list. */
export function getLinkCardShellSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden" as const,
    backgroundColor: theme.palette.background.paper,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  };
}

/** Compact inset strip (short URL copy on mobile). */
export function getLinkCardUrlBarSx(theme: Theme) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    px: 1,
    py: 0.5,
    borderRadius: `${radiusTokens.sm}px`,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.03)
        : alpha(theme.palette.common.black, 0.025),
    minWidth: 0,
  };
}

/** Footer metrics — single row with vertical dividers between segments. */
export function getLinkCardMetricsRowSx(theme: Theme) {
  return {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    columnGap: 0,
    rowGap: 0.5,
    pt: 0.625,
    mt: 0.625,
    // Use the system divider token directly — no arbitrary alpha multiplier.
    borderTop: `1px solid ${theme.palette.divider}`,
    minWidth: 0,
  };
}

/** Shared row height so sparkline, badges and inline metrics align on one axis. */
export const LINK_CARD_METRIC_ROW_HEIGHT = 20;

/** Thin separator between metric segments in the link card footer. */
export function getLinkCardMetricDividerSx(theme: Theme) {
  return {
    width: "1px",
    alignSelf: "stretch",
    minHeight: LINK_CARD_METRIC_ROW_HEIGHT,
    mx: { xs: 1, sm: 1.25 },
    bgcolor: theme.palette.divider,
    flexShrink: 0,
  };
}

/** Wrapper for each segment in the metrics row (centers content vertically). */
export const linkCardMetricSegmentSx = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: LINK_CARD_METRIC_ROW_HEIGHT,
  flexShrink: 0,
} as const;

/** Inline label + value on one horizontal line. */
export const linkCardMetricInlineSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.375,
  minHeight: LINK_CARD_METRIC_ROW_HEIGHT,
  minWidth: 0,
  whiteSpace: "nowrap" as const,
} as const;

const metricTextLineHeight = `${LINK_CARD_METRIC_ROW_HEIGHT}px`;

export const linkCardMetricLabelSx = {
  fontSize: "0.6875rem",
  lineHeight: metricTextLineHeight,
  fontWeight: 500,
  color: "text.secondary",
  m: 0,
  p: 0,
} as const;

/** Compact metric value — same scale as other card captions. */
export const linkCardMetricValueSx = {
  fontSize: "0.75rem",
  lineHeight: metricTextLineHeight,
  fontWeight: 600,
  color: "text.primary",
  fontVariantNumeric: "tabular-nums",
  m: 0,
  p: 0,
} as const;

/** Card inner padding. */
export const linkCardContentSx = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1, sm: 1.25 },
} as const;

/** Subtle inset for filter toolbar inside a links panel. */
export function getLinksFilterInsetSx(theme: Theme) {
  return {
    borderRadius: `${radiusTokens.md}px`,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.03)
        : alpha(theme.palette.common.black, 0.02),
    overflow: "hidden" as const,
  };
}
