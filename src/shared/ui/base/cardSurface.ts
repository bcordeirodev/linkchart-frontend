import { alpha } from "@mui/material/styles";

import { surfaceOverlayTokens } from "@/lib/theme";

import type { Theme } from "@mui/material/styles";

/**
 * Translucent fill shared by every feature's in-page hairline cards
 * (`/links`, `/bio`, `/subdomains`, `/api-keys`, `/profile`, the `/sign-in`
 * door card) — same formula as the global `MuiCard` override
 * (`lib/theme/config/muiComponents.ts`), sourced from `surfaceOverlayTokens
 * .card` (single place to retune the intensity for all of them at once).
 * Consolidated 2026-08-04 from six near-identical per-feature
 * `get*CardSx` copies (`getLinksCardSx`/`getBioCardSx`/`getSubdomainCardSx`/
 * `getApiKeyCardSx`/`getProfileCardSx`/`getAuthCardSx`) that only differed
 * by name.
 *
 * Applied via `EnhancedPaper`'s `sx` prop (or spread directly into an `sx`
 * object) since `EnhancedPaper` itself defaults to the solid
 * `background.paper` fill. Matches the "instrumento técnico" surface rule:
 * in-page cards read as a light veil over the page background, not an
 * opaque panel; floating surfaces (`Dialog`/`Popover`/`Menu`) stay opaque
 * and are not covered by this helper.
 *
 * Returns a plain object (not `SxProps<Theme>`) so call sites can safely
 * spread it into another `sx` object literal — `SxProps` is a union that
 * also admits functions/arrays, which TypeScript refuses to spread.
 *
 * @param theme - Active MUI theme.
 * @returns `sx` fragment overriding just the background color.
 */
export function getCardSurfaceSx(theme: Theme): { backgroundColor: string } {
  const isDark = theme.palette.mode === "dark";

  return {
    backgroundColor: isDark
      ? alpha(theme.palette.common.white, surfaceOverlayTokens.card.dark)
      : alpha(theme.palette.common.black, surfaceOverlayTokens.card.light),
  };
}
