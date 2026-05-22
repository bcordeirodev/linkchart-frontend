"use client";

import { Box, useTheme } from "@mui/material";

import { getPublicBlockIconShellSx } from "@/lib/theme/publicPageStyles";

import type { LucideIcon } from "lucide-react";
import type { SxProps, Theme } from "@mui/material";

export type PublicBlockIconVariant = "block" | "step";

const ICON_PROPS = {
  block: { size: 18, strokeWidth: 1.75 },
  step: { size: 22, strokeWidth: 1.75 },
} as const;

const SHELL_SIZE = { block: 36, step: 40 } as const;

interface PublicBlockIconProps {
  icon: LucideIcon;
  variant?: PublicBlockIconVariant;
  sx?: SxProps<Theme>;
}

/**
 * Lucide icon in the canonical public-page shell (primary tint, 10px radius).
 * Use `block` beside titles (CTA, subdomain promo); `step` centered in how-it-works cards.
 */
export function PublicBlockIcon({
  icon: Icon,
  variant = "block",
  sx,
}: PublicBlockIconProps) {
  const theme = useTheme();
  const shellSize = SHELL_SIZE[variant];

  return (
    <Box
      aria-hidden
      sx={[
        getPublicBlockIconShellSx(theme, {
          size: shellSize,
          centered: variant === "step",
        }),
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
    >
      <Icon {...ICON_PROPS[variant]} />
    </Box>
  );
}
