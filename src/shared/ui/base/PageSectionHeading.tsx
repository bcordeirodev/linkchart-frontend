"use client";

import { alpha, Box, Typography, useTheme } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

export interface PageSectionHeadingProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  /** `page` — main page title (larger); `section` — in-card section headings */
  titleVariant?: "page" | "section";
  /** Icon size in px; defaults to 18 (section) or 22 (page). */
  iconSize?: number;
  sx?: SxProps<Theme>;
  /** Extra styles for the description line (e.g. hide on mobile). */
  descriptionSx?: SxProps<Theme>;
}

/**
 * Page and section titles — icon + title + optional caption (no card shell).
 * Used at page top (links, profile) and inside panel sections.
 */
export function PageSectionHeading({
  icon,
  title,
  description,
  action,
  titleVariant = "section",
  iconSize,
  sx,
  descriptionSx,
}: PageSectionHeadingProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isPageTitle = titleVariant === "page";
  const resolvedIconSize = iconSize ?? (isPageTitle ? 22 : 18);
  const primary = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: action && isPageTitle ? "center" : "flex-start",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        mb: isPageTitle ? 0 : 1.75,
        ...sx,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          display: isPageTitle ? "flex" : "block",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* Page titles carry the icon in a tinted chip — a single quiet accent
            that anchors the page identity without adding another loud color. */}
        {icon && isPageTitle ? (
          <Box
            component="span"
            aria-hidden
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: `${radiusTokens.md}px`,
              // Solid-enough fill so the white glyph holds contrast in both
              // themes (a 12% tint would swallow white in light mode).
              bgcolor: alpha(primary, isDark ? 0.55 : 0.9),
              color: theme.palette.common.white,
              "& svg": {
                width: resolvedIconSize,
                height: resolvedIconSize,
              },
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component={isPageTitle ? "h1" : "h2"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              fontWeight: isPageTitle ? 700 : 600,
              letterSpacing: isPageTitle ? "-0.01em" : 0,
              fontSize: isPageTitle
                ? { xs: "1.375rem", sm: "1.5rem" }
                : { xs: "1.0625rem", sm: "1.125rem" },
              lineHeight: isPageTitle ? 1.3 : 1.35,
              mb: description ? 0.375 : 0,
            }}
          >
            {icon && !isPageTitle ? (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  color: "text.secondary",
                  flexShrink: 0,
                  "& svg": {
                    width: resolvedIconSize,
                    height: resolvedIconSize,
                  },
                }}
              >
                {icon}
              </Box>
            ) : null}
            {title}
          </Typography>
          {description ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: isPageTitle ? "0.8125rem" : "0.75rem",
                lineHeight: 1.4,
                display: "block",
                ...descriptionSx,
              }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>
      </Box>
      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Box>
  );
}

export default PageSectionHeading;
