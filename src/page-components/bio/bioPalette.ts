/**
 * Local color tokens for the public bio page.
 *
 * The page deliberately does NOT read `useTheme()` / the app's light-dark
 * toggle: `theme` here comes from the bio payload (the page owner's choice),
 * not from the visitor's app preference — a logged-out visitor from
 * Instagram never sees the app chrome at all. Every value below is pulled
 * from the existing design system (`src/lib/theme/colors/*` and
 * `publicActionColors.ts`) — no new colors are introduced.
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
  /** Page background. */
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
  /** Soft ambient glow rendered behind the avatar. */
  avatarGlow: string;
}

const AVATAR_GRADIENT = `linear-gradient(135deg, ${ANALYTICS_GRADIENT_FROM} 0%, ${ANALYTICS_GRADIENT_TO} 100%)`;

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
  };
}
