/**
 * Local color tokens for the public bio page.
 *
 * The page deliberately does NOT read `useTheme()` / the app's light-dark
 * toggle: `theme` here comes from the bio payload (the page owner's choice),
 * not from the visitor's app preference — a logged-out visitor from
 * Instagram never sees the app chrome at all. Every value below is pulled
 * from the existing design system (`src/lib/theme/colors/*` and
 * `publicActionColors.ts`) — no new colors are introduced; the "new" fields
 * (background wash, selection, scrollbar, glow, focus ring) are all alpha
 * derivations of the same two hexes (`ANALYTICS_GRADIENT_FROM/TO`) already
 * used for the avatar, so every accent on the page reads as one signature
 * rather than several unrelated ones.
 */
import { alpha } from "@mui/material/styles";

import { darkNeutral } from "@/lib/theme/colors/dark";
import { lightNeutral } from "@/lib/theme/colors/light";
import {
  ANALYTICS_GRADIENT_FROM,
  ANALYTICS_GRADIENT_TO,
} from "@/lib/theme/publicActionColors";

import type { BioTheme } from "./types";

/** Fully resolved color set a bio page component needs to render itself. */
export interface BioPalette {
  /** Page background (flat fallback painted under `backgroundImage`). */
  background: string;
  /** Primary text color (title, button labels). */
  textPrimary: string;
  /** Secondary/muted text color (bio copy, footer badge). */
  textSecondary: string;
  /** Link-button resting background. */
  buttonBg: string;
  /** Link-button hover/active background. */
  buttonBgHover: string;
  /** Link-button border. */
  buttonBorder: string;
  /** Avatar initial gradient — same in both themes, it's the page's signature. */
  avatarGradient: string;
  /** Soft ambient glow rendered close behind the avatar. */
  avatarGlow: string;
  /**
   * Full-page `background-image`: a brand-tinted radial wash anchored above
   * the avatar plus a barely-there vertical tonal shift (surface → base
   * color). Layered *under* {@link avatarGlow}, which stays a tighter,
   * brighter accent right behind the circle — near light + far ambient,
   * so dark and light both read as deliberately lit rather than flat-filled.
   */
  backgroundImage: string;
  /** Brand-tinted highlight for selected text (`::selection`). */
  selectionBg: string;
  /** Brand-tinted, page-scoped scrollbar thumb color. */
  scrollbarThumb: string;
  /** Soft brand-tinted glow behind interactive elements on hover (box-shadow). */
  interactiveGlow: string;
  /** Brand-tinted keyboard focus ring, strong enough to read on both themes. */
  focusRing: string;
}

const AVATAR_GRADIENT = `linear-gradient(135deg, ${ANALYTICS_GRADIENT_FROM} 0%, ${ANALYTICS_GRADIENT_TO} 100%)`;

/**
 * Builds the shared multi-layer `background-image` value for a theme: two
 * brand-hued radial washes (violet upper-left of center, blue upper-right)
 * over a subtle top-to-base tonal gradient. CSS paints the first-listed
 * layer on top, so the radials sit above the tonal wash and let it show
 * through their transparent edges.
 *
 * @param glowFromAlpha - opacity of the violet radial (`ANALYTICS_GRADIENT_FROM`).
 * @param glowToAlpha - opacity of the blue radial (`ANALYTICS_GRADIENT_TO`).
 * @param tonalFrom - top color of the base tonal wash (a lighter/elevated neutral).
 * @param tonalTo - color the tonal wash settles into (the page's flat background).
 */
function buildBackgroundImage(
  glowFromAlpha: number,
  glowToAlpha: number,
  tonalFrom: string,
  tonalTo: string,
): string {
  return [
    `radial-gradient(120% 55% at 50% -12%, ${alpha(ANALYTICS_GRADIENT_FROM, glowFromAlpha)} 0%, transparent 62%)`,
    `radial-gradient(70% 38% at 84% -4%, ${alpha(ANALYTICS_GRADIENT_TO, glowToAlpha)} 0%, transparent 58%)`,
    `linear-gradient(180deg, ${tonalFrom} 0%, ${tonalTo} 38%)`,
  ].join(", ");
}

/**
 * Resolves the color set for a given bio page theme.
 *
 * @param theme - `"dark"` (product default) or `"light"`, as chosen by the
 *   page owner.
 * @returns the {@link BioPalette} to use for every color in the page.
 */
export function getBioPalette(theme: BioTheme): BioPalette {
  if (theme === "light") {
    return {
      background: lightNeutral.bg,
      textPrimary: lightNeutral.text.primary,
      textSecondary: lightNeutral.text.secondary,
      buttonBg: lightNeutral.surface,
      buttonBgHover: lightNeutral.input,
      buttonBorder: lightNeutral.border.default,
      avatarGradient: AVATAR_GRADIENT,
      avatarGlow: alpha(ANALYTICS_GRADIENT_TO, 0.28),
      backgroundImage: buildBackgroundImage(
        0.1,
        0.07,
        lightNeutral.surface,
        lightNeutral.bg,
      ),
      selectionBg: alpha(ANALYTICS_GRADIENT_TO, 0.25),
      scrollbarThumb: alpha(ANALYTICS_GRADIENT_TO, 0.35),
      interactiveGlow: alpha(ANALYTICS_GRADIENT_TO, 0.2),
      focusRing: alpha(ANALYTICS_GRADIENT_TO, 0.6),
    };
  }

  return {
    background: darkNeutral.bg,
    textPrimary: darkNeutral.text.primary,
    textSecondary: darkNeutral.text.secondary,
    buttonBg: darkNeutral.surface,
    buttonBgHover: darkNeutral.elevated,
    buttonBorder: darkNeutral.border.default,
    avatarGradient: AVATAR_GRADIENT,
    avatarGlow: alpha(ANALYTICS_GRADIENT_TO, 0.35),
    backgroundImage: buildBackgroundImage(
      0.18,
      0.12,
      darkNeutral.elevated,
      darkNeutral.bg,
    ),
    selectionBg: alpha(ANALYTICS_GRADIENT_TO, 0.35),
    scrollbarThumb: alpha(ANALYTICS_GRADIENT_TO, 0.45),
    interactiveGlow: alpha(ANALYTICS_GRADIENT_TO, 0.3),
    focusRing: alpha(ANALYTICS_GRADIENT_TO, 0.6),
  };
}
