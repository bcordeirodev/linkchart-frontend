"use client";
/**
 * 🚫 EMPTY STATE - COMPONENTE BASE
 * Componente para estados vazios padronizado
 */

import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import type { BaseComponentProps } from "../components";
import type React from "react";

interface EmptyStateProps extends BaseComponentProps {
  /** Preset that picks a default emoji and title colour. */
  variant?: "default" | "charts" | "data" | "search";
  /** Icon override — either an emoji/text string or a ReactNode. Defaults to the variant emoji. */
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
 * Centred empty-state placeholder with icon, title, description and optional CTA.
 *
 * Used by analytics widgets, list pages with no rows, and search results with zero matches. Variant only affects the default icon + title colour — actual layout is identical across variants.
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
  const _theme = useTheme();

  const variantConfig = {
    default: { icon: "📭", color: "text.secondary" },
    charts: { icon: "📊", color: "primary.main" },
    data: { icon: "📄", color: "info.main" },
    search: { icon: "🔍", color: "warning.main" },
  };

  const config = variantConfig[variant];
  const displayIcon = icon || config.icon;

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
          fontSize: { xs: "2.25rem", sm: "3rem" },
          mb: 2,
          opacity: 0.7,
        }}
      >
        {typeof displayIcon === "string" ? displayIcon : displayIcon}
      </Box>

      <Typography
        variant="h6"
        component="h3"
        sx={{
          mb: 1,
          color: config.color,
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
