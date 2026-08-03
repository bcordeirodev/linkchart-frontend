import { alpha } from "@mui/material/styles";

import { surfaceOverlayTokens } from "@/lib/theme";

import type { Theme } from "@mui/material/styles";

/**
 * Translucent fill for this feature's in-page hairline cards (personal info,
 * security, preferences, account status/activity, danger zone) — same
 * formula as the global `MuiCard` override and the sibling per-feature
 * helpers `getApiKeyCardSx`/`getSubdomainCardSx`/`getBioCardSx`/
 * `getLinksCardSx`, all sourced from `surfaceOverlayTokens.card` (single
 * place to retune the intensity for every one of them at once), applied
 * here via `EnhancedPaper`'s `sx` prop since `EnhancedPaper` itself defaults
 * to the solid `background.paper` fill. Matches the "instrumento técnico"
 * surface rule: in-page cards read as a light veil over the page
 * background, not an opaque panel.
 *
 * Returns a plain object (not `SxProps<Theme>`) so call sites can safely
 * spread it into another `sx` object literal — `SxProps` is a union that
 * also admits functions/arrays, which TypeScript refuses to spread.
 *
 * @param theme - Active MUI theme.
 * @returns `sx` fragment overriding just the background color.
 */
export function getProfileCardSx(theme: Theme): { backgroundColor: string } {
  const isDark = theme.palette.mode === "dark";

  return {
    backgroundColor: isDark
      ? alpha(theme.palette.common.white, surfaceOverlayTokens.card.dark)
      : alpha(theme.palette.common.black, surfaceOverlayTokens.card.light),
  };
}
