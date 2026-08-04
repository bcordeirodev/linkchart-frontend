import { alpha } from "@mui/material/styles";

import { surfaceOverlayTokens } from "@/lib/theme";

import type { Theme } from "@mui/material/styles";

/**
 * Translucent fill for the `/sign-in` door card — same `surfaceOverlayTokens`
 * formula as the global `MuiCard` override and the sibling per-feature
 * helpers `getApiKeyCardSx`/`getSubdomainCardSx`/`getProfileCardSx`/
 * `getBioCardSx`, applied here via `EnhancedPaper`'s `sx` prop since
 * `EnhancedPaper` itself defaults to the solid `background.paper` fill.
 * Matches the "instrumento técnico" surface rule: the door reads as a light
 * veil over the near-black page background, not an opaque panel.
 *
 * Returns a plain object (not `SxProps<Theme>`) so call sites can safely
 * spread it into another `sx` object literal — `SxProps` is a union that
 * also admits functions/arrays, which TypeScript refuses to spread.
 *
 * @param theme - Active MUI theme.
 * @returns `sx` fragment overriding just the background color.
 */
export function getAuthCardSx(theme: Theme): { backgroundColor: string } {
  const isDark = theme.palette.mode === "dark";

  return {
    backgroundColor: isDark
      ? alpha(theme.palette.common.white, surfaceOverlayTokens.card.dark)
      : alpha(theme.palette.common.black, surfaceOverlayTokens.card.light),
  };
}
