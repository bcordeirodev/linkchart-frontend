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

/** Pulsing ring on a link card right after quick-create. */
export function getNewlyCreatedHighlightSx(theme: Theme) {
  const pulse = keyframes`
    0%, 100% {
      box-shadow: 0 0 0 0 ${alpha(theme.palette.primary.main, 0.12)};
    }
    50% {
      box-shadow: 0 0 0 10px ${alpha(theme.palette.primary.main, 0)};
    }
  `;

  return {
    border: `2px solid ${theme.palette.primary.main}`,
    animation: `${pulse} 1.25s ease-in-out 3`,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      outline: `2px solid ${theme.palette.primary.main}`,
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
    pt: 0.75,
    mt: 0.75,
    // Use the system divider token directly — no arbitrary alpha multiplier.
    borderTop: `1px solid ${theme.palette.divider}`,
    minWidth: 0,
  };
}

/** Thin separator between metric segments in the link card footer. */
export function getLinkCardMetricDividerSx(theme: Theme) {
  return {
    width: "1px",
    alignSelf: "stretch",
    minHeight: 18,
    mx: { xs: 1, sm: 1.25 },
    // Use the system divider token directly — no arbitrary alpha multiplier.
    bgcolor: theme.palette.divider,
    flexShrink: 0,
  };
}

/** Inline label + value metric (horizontal). */
export const linkCardMetricInlineSx = {
  display: "inline-flex",
  alignItems: "baseline",
  gap: 0.5,
  minWidth: 0,
  whiteSpace: "nowrap" as const,
} as const;

export const linkCardMetricLabelSx = {
  fontSize: "0.6875rem",
  lineHeight: 1.2,
  color: "text.secondary",
} as const;

/** Card inner padding. */
export const linkCardContentSx = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1, sm: 1.25 },
} as const;

/**
 * Header grid: favicon | main | actions.
 * @deprecated LinkCardRich now uses a Stack layout; kept for any external consumers.
 */
export const linkCardHeaderGridSx = {
  display: "grid",
  gridTemplateColumns: "24px minmax(0, 1fr) auto",
  gridTemplateRows: "auto auto",
  columnGap: 1.25,
  rowGap: 0.375,
  alignItems: "center",
  minWidth: 0,
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
