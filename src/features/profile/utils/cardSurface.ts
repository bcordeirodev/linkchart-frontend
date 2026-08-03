import { alpha } from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";

/**
 * Translucent fill for this feature's in-page hairline cards (personal info,
 * security, preferences, account status/activity, danger zone) — same
 * formula as the global `MuiCard` override (`alpha(white, 0.03)` dark /
 * `alpha(black, 0.02)` light) and the sibling per-feature helpers
 * `getApiKeyCardSx`/`getSubdomainCardSx`/`getBioCardSx`, applied here via
 * `EnhancedPaper`'s `sx` prop since `EnhancedPaper` itself defaults to the
 * solid `background.paper` fill. Matches the "instrumento técnico" surface
 * rule: in-page cards read as a light veil over the page background, not an
 * opaque panel.
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
      ? alpha(theme.palette.common.white, 0.03)
      : alpha(theme.palette.common.black, 0.02),
  };
}
