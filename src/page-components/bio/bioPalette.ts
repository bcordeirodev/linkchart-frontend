/**
 * Local design tokens (color + brand font stacks) for the public bio page.
 *
 * The page deliberately does NOT read `useTheme()` / the app's light-dark
 * toggle: `theme` here comes from the bio payload (the page owner's choice),
 * not from the visitor's app preference — a logged-out visitor from
 * Instagram never sees the app chrome at all. Both branches are first-class:
 * `dark` renders the "instrumento técnico" near-black grammar, `light`
 * renders its exact light-mode equivalent (light canvas, dark text, the same
 * hairline/veil roles resolved from the light neutrals).
 *
 * Every value is pulled from the app's own design system
 * (`src/lib/theme/colors/*`, `surfaceOverlayTokens`) — the page introduces no
 * color of its own. The single accent is the product's primary blue; the
 * violet→blue gradient this module used to carry (`ANALYTICS_GRADIENT_*`, in
 * the avatar fallback, the page's radial wash and every hover glow) is gone
 * with the 2026-08-04 "instrumento técnico" pass: "gradiente radial roxo
 * sobre dark" is named in the redesign spec as the AI-template tell this
 * product is moving away from. Depth comes from a hairline over the canvas;
 * the only wash is a restrained mono-blue halo (`glow`/`glowSoft`), brought
 * back on 2026-08-05 by owner request — the fully flat canvas read as broken.
 */
import { alpha } from "@mui/material/styles";

import { darkNeutral, darkPrimary } from "@/lib/theme/colors/dark";
import { lightNeutral, lightPrimary } from "@/lib/theme/colors/light";
import {
  surfaceOverlayTokens,
  typographyScale,
} from "@/lib/theme/designSystem";

import type { BioTheme } from "./types";

/**
 * Display stack (Space Grotesk) for the page's two "voice" glyphs: the `<h1>`
 * title and the avatar's initial-letter fallback. Same string the app's MUI
 * theme uses for headings (`lib/theme/config/muiComponents.ts`), repeated
 * here rather than imported because this page renders outside the MUI theme
 * on purpose (see the module docstring) and that constant is private to the
 * theme config.
 */
export const BIO_FONT_DISPLAY =
  "var(--font-space-grotesk), Inter, ui-sans-serif, system-ui, sans-serif";

/**
 * Mono stack (JetBrains Mono) for the page's technical text — each item's
 * destination host and the footer stamp. Sourced from the app's single mono
 * token so the bio page can never drift from the rest of the product.
 */
export const BIO_FONT_MONO = typographyScale.code.fontFamily;

/** Fully resolved color set a bio page component needs to render itself. */
export interface BioPalette {
  /** Page canvas base color. */
  background: string;
  /**
   * Halo radial do topo do canvas, atrás do avatar — o único wash da página.
   * Mono-azul (o primary do produto) em alpha baixíssimo: reintroduzido em
   * 2026-08-05 a pedido do dono do produto (o canvas 100% chapado lia como
   * inacabado, "background quebrado"), SEM voltar ao gradiente violeta de
   * template que a spec do redesign aposentou.
   */
  glow: string;
  /** Versão mais fraca do {@link glow}, ancorada no fim da página — dá um "chão" ao vazio final. */
  glowSoft: string;
  /** Primary text color (title, item labels). */
  textPrimary: string;
  /** Secondary/muted text (bio copy, destination host, footer stamp). */
  textSecondary: string;
  /**
   * Translucent veil shared by every raised element (item rows, social icon
   * circles, the avatar's fallback disc) — the app's card surface, same
   * `surfaceOverlayTokens.card` alpha every in-page card uses. A veil over
   * the canvas, never an opaque lighter grey.
   */
  surface: string;
  /** {@link surface} one step stronger — hover/active state only. */
  surfaceHover: string;
  /** Low-contrast 1px border. This is what creates elevation on this page. */
  hairline: string;
  /** {@link hairline} one step stronger — hover/active state only. */
  hairlineStrong: string;
  /**
   * The page's only accent: the product's primary blue. Spent on the avatar
   * monogram and the keyboard focus ring, nothing else.
   */
  accent: string;
  /** Accent-tinted highlight for selected text (`::selection`). */
  selectionBg: string;
  /** Neutral, page-scoped scrollbar thumb color. */
  scrollbarThumb: string;
  /** Keyboard focus ring — the accent at full strength, on both themes. */
  focusRing: string;
  /**
   * Value for the page-scoped CSS `color-scheme`. The page opts out of the
   * app's theme provider, so without this the browser would still paint its
   * own chrome (native scrollbars, form controls, the iOS status-bar tint it
   * samples from the canvas) for the *visitor's* preference — a light bio
   * page could end up with dark native scrollbars and vice versa.
   */
  colorScheme: "light" | "dark";
}

/**
 * Resolves the color set for a given bio page theme.
 *
 * The two branches are deliberately symmetric: same roles, same order, each
 * resolved from its own neutral ramp. `surfaceHover` is the one value with no
 * shared token — it is ~1.7× the card veil in both themes (the same "one step
 * above the card" derivation `getLinksInsetBg` uses in `/links`), because a
 * hover state has to separate itself from a surface that is already
 * translucent.
 *
 * @param theme - `"dark"` (product default) or `"light"`, as chosen by the
 *   page owner.
 * @returns the {@link BioPalette} to use for every color in the page.
 */
export function getBioPalette(theme: BioTheme): BioPalette {
  if (theme === "light") {
    return {
      background: lightNeutral.bg,
      glow: alpha(lightPrimary.main, 0.05),
      glowSoft: alpha(lightPrimary.main, 0.03),
      textPrimary: lightNeutral.text.primary,
      textSecondary: lightNeutral.text.secondary,
      surface: alpha("#000000", surfaceOverlayTokens.card.light),
      surfaceHover: alpha("#000000", 0.055),
      hairline: lightNeutral.border.default,
      hairlineStrong: lightNeutral.border.strong,
      accent: lightPrimary.main,
      selectionBg: alpha(lightPrimary.main, 0.2),
      scrollbarThumb: lightNeutral.border.strong,
      focusRing: lightPrimary.main,
      colorScheme: "light",
    };
  }

  return {
    background: darkNeutral.bg,
    glow: alpha(darkPrimary.main, 0.08),
    glowSoft: alpha(darkPrimary.main, 0.045),
    textPrimary: darkNeutral.text.primary,
    textSecondary: darkNeutral.text.secondary,
    surface: alpha("#FFFFFF", surfaceOverlayTokens.card.dark),
    surfaceHover: alpha("#FFFFFF", 0.075),
    hairline: darkNeutral.border.default,
    hairlineStrong: darkNeutral.border.strong,
    accent: darkPrimary.main,
    selectionBg: alpha(darkPrimary.main, 0.32),
    scrollbarThumb: darkNeutral.border.strong,
    focusRing: darkPrimary.main,
    colorScheme: "dark",
  };
}
