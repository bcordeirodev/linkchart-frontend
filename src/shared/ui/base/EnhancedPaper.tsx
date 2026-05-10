"use client";
/**
 * 📄 ENHANCED PAPER - COMPONENTE BASE
 * Paper aprimorado com glass effect e animações
 */

import { Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { createPresetAnimations } from "@/lib/theme";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { PaperProps } from "@mui/material";

interface EnhancedPaperProps extends Omit<PaperProps, "variant"> {
  /** Visual preset: `"glass"` (subtle xs elevation, md radius), `"elevated"` (sm elevation, lg radius), `"outlined"` (1px divider, lg radius). Default `"glass"`. */
  variant?: "glass" | "elevated" | "outlined";
  /** When true (default), applies the `fadeIn` mount animation and a `translateY(-1px)` hover lift. */
  animated?: boolean;
}

/**
 * MUI `<Paper>` wrapper that applies design-system elevation/radius tokens and an optional hover-lift animation.
 *
 * Elevation tokens swap between `elevationTokens` (dark) and `elevationLightTokens` (light) based on `theme.palette.mode`.
 */
function EnhancedPaper({
  variant = "glass",
  animated = true,
  children,
  sx,
  ...other
}: EnhancedPaperProps) {
  const theme = useTheme();
  const animations = createPresetAnimations(theme);

  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const variantStyles = {
    glass: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: `${radiusTokens.md}px`,
      boxShadow: elevation.xs,
    },
    elevated: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: `${radiusTokens.lg}px`,
      boxShadow: elevation.sm,
    },
    outlined: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${radiusTokens.lg}px`,
    },
  };

  return (
    <Paper
      sx={
        {
          ...variantStyles[variant],
          ...(animated && animations.fadeIn),
          transition: `transform ${motionTokens.duration.base} ${motionTokens.easing.default}, box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
          "&:hover": animated
            ? {
                transform: "translateY(-1px)",
                boxShadow: elevation.md,
              }
            : {},
          ...sx,
        } as Record<string, unknown>
      }
      {...other}
    >
      {children}
    </Paper>
  );
}

export default EnhancedPaper;
