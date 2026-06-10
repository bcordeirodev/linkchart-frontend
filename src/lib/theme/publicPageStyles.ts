import { alpha } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material";

/**
 * Vertical gap between top-level sections on public pages.
 * Use as the `rowGap`/`mt` between hero, social proof, how-it-works, FAQ, etc.
 */
export const PUBLIC_SECTION_GAP = { xs: 6, md: 7 } as const;

/** Standard inner padding for bordered public panels/insets. */
export const PUBLIC_INSET_PAD = { xs: 2.5, md: 3 } as const;

/** Gap between stacked elements inside a single public card. */
export const PUBLIC_CARD_GAP = { xs: 2, md: 2.5 } as const;

/** Shared hairline border opacity for public pages (/shorter, /public-analytics). */
export function publicHairline(
  theme: Theme,
  strength: "default" | "inset" = "default",
) {
  const isDark = theme.palette.mode === "dark";
  const opacity =
    strength === "inset" ? (isDark ? 0.2 : 0.22) : isDark ? 0.28 : 0.3;
  return alpha(theme.palette.divider, opacity);
}

/** Outer panel (hero card, CTA card shell). */
export function getPublicPanelSx(theme: Theme): SxProps<Theme> {
  return {
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${publicHairline(theme)}`,
    borderRadius: `${radiusTokens.lg}px`,
  };
}

/** Inset field / metric tile / short-URL row. */
export function getPublicInsetSx(
  theme: Theme,
  options?: { primaryTint?: boolean },
): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    border: `1px solid ${publicHairline(theme, "inset")}`,
    borderRadius: `${radiusTokens.md}px`,
    bgcolor: options?.primaryTint
      ? alpha(theme.palette.primary.main, isDark ? 0.05 : 0.04)
      : alpha(theme.palette.text.primary, isDark ? 0.03 : 0.035),
  };
}

/** Metric cards grid on public analytics. */
export function getPublicMetricCardSx(
  theme: Theme,
  accent = false,
): SxProps<Theme> {
  return {
    ...getPublicInsetSx(theme, accent ? { primaryTint: true } : undefined),
    p: { xs: "18px", md: "20px" },
  };
}

/** Form shell on /shorter (panel + subtle fill, no heavy shadow). */
export function getPublicFormShellSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    ...getPublicPanelSx(theme),
    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.34 : 0.38)}`,
    bgcolor: alpha(theme.palette.text.primary, isDark ? 0.045 : 0.055),
    p: { xs: 3, md: 3.5 },
    boxShadow: "none",
  };
}

/** Input rows inside the shorter form. */
export function getPublicFormFieldSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    ...getPublicInsetSx(theme),
    px: 2,
    py: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    transition: "border-color 0.2s, background 0.2s",
    "&:hover": {
      borderColor: publicHairline(theme),
    },
    "&:focus-within": {
      borderColor: alpha(theme.palette.primary.main, isDark ? 0.4 : 0.38),
      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.05),
    },
  };
}

/**
 * Centered section label — e.g. “Como Funciona”, “Números que Impressionam”.
 * Use on standalone sections (not titles inside a card header row).
 */
export function getPublicSectionHeadingSx(theme: Theme): SxProps<Theme> {
  return {
    display: "block",
    textAlign: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
    mb: { xs: 3, md: 3.5 },
  };
}

/** Title inside a bordered panel (CTA card, subdomain promo, step cards). */
export function getPublicBlockTitleSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    fontSize: "0.9375rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    lineHeight: 1.35,
    color: alpha(theme.palette.text.primary, isDark ? 0.92 : 0.95),
  };
}

/** Body copy below a block title. */
export function getPublicBlockDescriptionSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    fontSize: "0.8125rem",
    lineHeight: 1.55,
    color: alpha(theme.palette.text.primary, isDark ? 0.62 : 0.68),
  };
}

/** 36×36 (block) or 40×40 (step) shell for Lucide icons on public pages. */
export function getPublicBlockIconShellSx(
  theme: Theme,
  options?: { size?: 36 | 40; centered?: boolean },
): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  const boxSize = options?.size ?? 36;

  return {
    width: boxSize,
    height: boxSize,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
    ...(options?.centered ? { mx: "auto", mb: 1.25 } : { mt: 0.125 }),
  };
}

/** Small chips / step cards on public landing pages. */
export function getPublicChipSx(theme: Theme): SxProps<Theme> {
  return {
    ...getPublicInsetSx(theme),
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    px: 1.5,
    py: 0.625,
    borderRadius: `${radiusTokens.sm}px`,
    boxShadow: "none",
  };
}

/**
 * Focal surface for conversion points (shortener form, signup CTA).
 * Emphasis border + soft primary glow; never a heavy drop shadow.
 */
export function getPublicFocalSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  return {
    ...getPublicPanelSx(theme),
    border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.32 : 0.3)}`,
    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.045),
    boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.06)}, 0 18px 48px -28px ${alpha(
      theme.palette.primary.main,
      isDark ? 0.55 : 0.4,
    )}`,
  };
}

/**
 * Hero/display heading style for public pages. Uses clamp() so the size
 * scales smoothly across viewports instead of jumping at the md breakpoint.
 */
export function getPublicDisplaySx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  return {
    fontSize: "clamp(1.625rem, 1.1rem + 2.4vw, 2.5rem)",
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    color: alpha(theme.palette.text.primary, isDark ? 0.96 : 1),
  };
}

/** Chart cards inside public analytics — soft border, no heavy shadow. */
export function getPublicChartCardOverrideSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  const hairline = publicHairline(theme, "inset");

  return {
    "& .MuiCard-root": {
      border: `1px solid ${hairline}`,
      boxShadow: "none",
      borderRadius: `${radiusTokens.md}px`,
      ...(isDark
        ? { bgcolor: alpha(theme.palette.text.primary, 0.03) }
        : { bgcolor: theme.palette.background.paper }),
    },
    "& .MuiCardContent-root .MuiTypography-h5": {
      fontSize: "0.8125rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
      ...(isDark ? { color: alpha(theme.palette.text.primary, 0.82) } : {}),
    },
    "& .MuiCardContent-root .MuiTypography-body2": {
      ...(isDark ? { color: alpha(theme.palette.text.primary, 0.68) } : {}),
    },
  };
}
