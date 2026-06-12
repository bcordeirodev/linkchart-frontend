"use client";

import { Box, Divider, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { radiusTokens } from "@/lib/theme/designSystem";

import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

interface ProfileSectionProps {
  children: ReactNode;
  /** Featured card — subtle brand accent (e.g. custom subdomain). */
  emphasized?: boolean;
}

/** Card shell shared by profile settings sections. */
export function ProfileSection({
  children,
  emphasized = false,
}: ProfileSectionProps) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;

  const emphasizedSx = emphasized
    ? {
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: "3px 0 0 3px",
          background: `linear-gradient(
            180deg,
            ${alpha(accent, 0.5)} 0%,
            ${alpha(accent, 0.2)} 100%
          )`,
        },
      }
    : undefined;

  return (
    <EnhancedPaper variant="outlined" sx={emphasizedSx}>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          ...(emphasized ? { pl: { xs: 2.5, sm: 3.25 } } : undefined),
        }}
      >
        {children}
      </Box>
    </EnhancedPaper>
  );
}

interface ProfileSectionHeaderProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** Icon badge gets a subtle neutral treatment (featured sections). */
  featured?: boolean;
}

export function ProfileSectionHeader({
  icon,
  title,
  description,
  action,
  featured = false,
}: ProfileSectionHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              fontWeight: 600,
              fontSize: { xs: "1.0625rem", sm: "1.125rem" },
              lineHeight: 1.35,
              mb: description ? 0.375 : 0,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                ...(featured
                  ? {
                      p: 0.75,
                      borderRadius: `${radiusTokens.md}px`,
                      color: "common.white",
                      bgcolor: alpha(
                        theme.palette.common.white,
                        isDark ? 0.06 : 0.04,
                      ),
                      border: `1px solid ${theme.palette.divider}`,
                    }
                  : { color: "text.secondary" }),
              }}
            >
              {icon}
            </Box>
            {title}
          </Typography>
          {description ? (
            <Box sx={{ color: "text.secondary" }}>
              {typeof description === "string" ? (
                <Typography
                  variant="caption"
                  color="inherit"
                  sx={{
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                    display: "block",
                  }}
                >
                  {description}
                </Typography>
              ) : (
                description
              )}
            </Box>
          ) : null}
        </Box>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );
}

interface ProfileMutedBoxProps {
  label?: string;
  children: ReactNode;
  /** Lighter inset for URL previews (less contrast than default). */
  soft?: boolean;
  /** Subtle brand-tinted inset (featured subdomain previews). */
  accent?: boolean;
  sx?: SxProps<Theme>;
}

/** Neutral inset for previews, URLs, and monospace samples. */
export function ProfileMutedBox({
  label,
  children,
  soft = false,
  accent = false,
  sx,
}: ProfileMutedBoxProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const brand = theme.palette.primary.main;

  const insetBg = accent
    ? alpha(brand, isDark ? 0.08 : 0.05)
    : soft
      ? alpha(theme.palette.action.hover, 0.18)
      : alpha(theme.palette.action.hover, 0.35);

  const insetBorder = accent
    ? alpha(brand, isDark ? 0.2 : 0.14)
    : alpha(theme.palette.divider, soft ? 0.4 : 0.65);

  return (
    <Box sx={sx}>
      {label ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.75, fontWeight: 600 }}
        >
          {label}
        </Typography>
      ) : null}
      <Box
        sx={{
          p: 1.5,
          borderRadius: `${radiusTokens.md}px`,
          bgcolor: insetBg,
          border: `1px solid ${insetBorder}`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

interface ProfileStatItemProps {
  label: string;
  value: ReactNode;
}

interface ProfileStatGridProps {
  items: ProfileStatItemProps[];
  columns?: 2 | 3;
}

/** Stat grid for sidebar activity (neutral, theme-aligned). */
export function ProfileStatGrid({ items, columns = 2 }: ProfileStatGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          columns === 3
            ? { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }
            : "repeat(2, 1fr)",
        gap: 2,
      }}
    >
      {items.map((item) => (
        <Box key={item.label}>
          <Typography
            variant="h5"
            component="p"
            sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.25 }}
          >
            {item.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

interface ProfileInfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

/** Single metadata row (account status, member since). */
export function ProfileInfoRow({ icon, label, value }: ProfileInfoRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 1.25,
        "&:not(:last-child)": {
          borderBottom: 1,
          borderColor: "divider",
        },
      }}
    >
      <Box
        sx={{
          color: "text.secondary",
          display: "flex",
          mt: 0.15,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
