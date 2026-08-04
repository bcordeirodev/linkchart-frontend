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
      ? alpha(theme.palette.primary.main, isDark ? 0.06 : 0.045)
      : alpha(theme.palette.text.primary, isDark ? 0.03 : 0.035),
  };
}

/** Neutral panel for secondary content cards on public pages. */
export function getPublicElevatedSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  return {
    ...getPublicInsetSx(theme),
    backgroundImage: `linear-gradient(180deg, ${alpha(
      theme.palette.common.white,
      isDark ? 0.04 : 0.5,
    )} 0%, ${alpha(theme.palette.common.white, 0)} 22%)`,
    boxShadow: `inset 0 1px 0 ${alpha(
      theme.palette.common.white,
      isDark ? 0.05 : 0.6,
    )}`,
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
    minHeight: { xs: 116, md: 128 },
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
 *
 * Keeps conversion surfaces close to the base panel while adding a restrained
 * primary tint for hierarchy.
 */
export function getPublicFocalSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  return {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${alpha(primary, isDark ? 0.2 : 0.24)}`,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `linear-gradient(180deg, ${alpha(
      primary,
      isDark ? 0.13 : 0.09,
    )} 0%, ${alpha(primary, isDark ? 0.035 : 0.025)} 24%, ${alpha(
      primary,
      0,
    )} 58%)`,
    boxShadow: "none",
  };
}

/**
 * Hero/display heading style for public pages. Uses clamp() so the size
 * scales smoothly across viewports instead of jumping at the md breakpoint.
 *
 * `fontFamily` is sourced from `theme.typography.h1` — i.e. the same
 * `displayFontFamily` (Space Grotesk) the theme already declares for every
 * display heading — and NOT from a literal font stack repeated here. Public
 * heroes render `<Typography component="h1" sx={getPublicDisplaySx(theme)}>`,
 * and `component` only swaps the DOM tag: without an explicit `variant` MUI
 * still applies `body1`, so the brand display face was silently dropped and
 * the H1 came out in Inter. Reading the family off the theme fixes every
 * consumer of this helper at once and keeps a single source of truth.
 *
 * Weight is 700, not 800: `app/layout.tsx` loads Space Grotesk at 400/500/700
 * only, so 800 asked the browser to synthesise a bolder face — a smeared,
 * faux-bold headline instead of the real cut.
 */
export function getPublicDisplaySx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  return {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: "clamp(1.75rem, 1.05rem + 2.7vw, 2.75rem)",
    fontWeight: 700,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    color: alpha(theme.palette.text.primary, isDark ? 0.96 : 1),
  };
}

/**
 * Chart cards inside public analytics — flat, soft border, no shadow.
 *
 * Drops the gradient overlay and aligns the surface to the same flat inset
 * tint used by the metric tiles ({@link getPublicInsetSx}) so the chart boxes
 * read as part of the same family rather than a distinct, glossier surface.
 */
export function getPublicChartCardOverrideSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";
  const hairline = publicHairline(theme, "inset");

  return {
    "& .MuiCard-root": {
      border: `1px solid ${hairline}`,
      boxShadow: "none",
      borderRadius: `${radiusTokens.md}px`,
      backgroundImage: "none",
      bgcolor: alpha(theme.palette.text.primary, isDark ? 0.03 : 0.035),
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
