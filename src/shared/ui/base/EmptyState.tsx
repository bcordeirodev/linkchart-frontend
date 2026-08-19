"use client";
/**
 * 🚫 EMPTY STATE - COMPONENTE BASE
 * Componente para estados vazios padronizado
 */

import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import { AppIcon } from "@/shared/ui/icons";

import type { BaseComponentProps } from "../components";
import type { AnyIconName } from "@/shared/ui/icons";
import type React from "react";

interface EmptyStateProps extends BaseComponentProps {
  /** Preset that picks the default lucide icon (and, for `data`, an info tint on it). */
  variant?: "default" | "charts" | "data" | "search";
  /**
   * Icon override rendered inside the recessed well. Pass a lucide element
   * (≈22px, `currentColor`) so it inherits the well's colour; a plain string
   * still renders as text for legacy callers. Defaults to the variant icon.
   */
  icon?: string | React.ReactNode;
  /** Primary heading text. Required. */
  title: string;
  /** Optional body text shown below the title (capped at 400 px). */
  description?: string;
  /** Optional CTA rendered as an outlined `<Button>`. */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Container height (number → px, string passed as-is). Default `300`. */
  height?: number | string;
}

/**
 * Preset → icon map. Only `data` carries a semantic tint (blue = info); the
 * other presets stay neutral because nothing here is a warning or a success,
 * and orange/green are reserved for those states by the design language.
 */
const VARIANT_CONFIG: Record<
  NonNullable<EmptyStateProps["variant"]>,
  { icon: AnyIconName; color: string }
> = {
  default: { icon: "data.inbox", color: "text.secondary" },
  charts: { icon: "analytics.chart", color: "text.secondary" },
  data: { icon: "content.text", color: "info.main" },
  search: { icon: "tools.search", color: "text.secondary" },
};

/**
 * Centred empty-state placeholder with icon, title, description and optional CTA.
 *
 * Used by analytics widgets, list pages with no rows, and search results with
 * zero matches. The visual anchor is the app-wide "recessed well" (48px circle,
 * `darkNeutral.elevated` in dark / `lightNeutral.bg` in light, 1px divider
 * hairline) holding a muted lucide icon — the same recipe as the API keys and
 * subdomains empty states. Variant only swaps that icon (and tints it for
 * `data`); layout and title colour are identical across variants.
 */
export function EmptyState({
  variant = "default",
  icon,
  title,
  description,
  action,
  height = 300,
  sx,
  ...other
}: EmptyStateProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const config = VARIANT_CONFIG[variant];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: typeof height === "number" ? `${height}px` : height,
        textAlign: "center",
        py: 4,
        px: 2,
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          mb: 2,
          borderRadius: `${radiusTokens.full}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Poço recuado: um degrau abaixo da superfície que hospeda o bloco
          // nos DOIS temas (elevado no dark, canvas no light), fechado por
          // hairline — elevação por borda, nunca por cinza.
          backgroundColor: isDark ? darkNeutral.elevated : lightNeutral.bg,
          border: `1px solid ${theme.palette.divider}`,
          color: config.color,
        }}
      >
        {icon ?? <AppIcon name={config.icon} size={22} aria-hidden />}
      </Box>

      <Typography
        variant="h6"
        component="h3"
        sx={{
          mb: 1,
          color: "text.primary",
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      {description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400 }}
        >
          {description}
        </Typography>
      ) : null}

      {action ? (
        <Button variant="outlined" onClick={action.onClick} sx={{ mt: 1 }}>
          {action.label}
        </Button>
      ) : null}
    </Box>
  );
}

export default EmptyState;
