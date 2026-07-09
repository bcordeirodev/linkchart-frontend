"use client";
import { Box, Typography, useTheme } from "@mui/material";
import { Inbox } from "lucide-react";

import { createPresetAnimations } from "@/lib/theme";

import type { ReactNode } from "react";

/** Props for {@link AnalyticsEmptyState}. */
interface AnalyticsEmptyStateProps {
  /** Centred heading (already translated). Required. */
  title: string;
  /** Optional supporting line below the title (already translated), capped at 360px. */
  description?: string;
  /**
   * Icon override. Defaults to a muted `<Inbox />`. Pass a lucide icon element
   * sized to match (≈48px, or ≈32px in `compact` mode) for a coherent look.
   */
  icon?: ReactNode;
  /** Min height of the block in px (default `320`; `200` in `compact` mode). */
  minHeight?: number;
  /** Compact density for smaller cards — shrinks the icon, min height and gaps. */
  compact?: boolean;
}

/**
 * Centred, panel-filling empty state for analytics sub-tabs and cards.
 *
 * Standardises every "no data for this view" placeholder onto one calm, muted
 * block (muted lucide icon → title → optional description) so sub-tabs keep a
 * consistent height and never collapse into a small top-anchored notice. The
 * message text stays in each domain's i18n keys — only the visual container is
 * unified here. Sibling to {@link AnalyticsStateManager}'s top-level empty block.
 */
export function AnalyticsEmptyState({
  title,
  description,
  icon,
  minHeight,
  compact = false,
}: AnalyticsEmptyStateProps) {
  const theme = useTheme();
  const animations = createPresetAnimations(theme);
  const resolvedMinHeight = minHeight ?? (compact ? 200 : 320);
  const iconSize = compact ? 32 : 48;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: resolvedMinHeight,
        gap: compact ? 1 : 1.5,
        px: 2,
        py: compact ? 3 : 4,
        color: "text.secondary",
        ...animations.fadeIn,
      }}
    >
      <Box sx={{ opacity: 0.3, lineHeight: 0 }}>
        {icon ?? <Inbox size={iconSize} strokeWidth={1.5} />}
      </Box>

      <Typography
        variant={compact ? "body1" : "subtitle1"}
        component="p"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        {title}
      </Typography>

      {description ? (
        <Typography variant="body2" sx={{ maxWidth: 360 }}>
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}

export default AnalyticsEmptyState;
