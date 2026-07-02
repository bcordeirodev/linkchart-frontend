import { alpha, lighten } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";

/**
 * Shared `sx` for selectable filter chips ("cor só quando é sinal").
 *
 * Unselected chips stay outlined and neutral; the selected chip gets a soft
 * translucent tint of the accent color instead of a solid fill, so a row of
 * filters never shouts. Used by the /links status filter, the analytics
 * period presets and the per-tab filter bars.
 *
 * @param theme - the active MUI theme (for mode-aware alphas).
 * @param selected - whether this chip is the active option.
 * @param accent - accent color for the selected state; defaults to primary.
 * @returns an `sx` object to spread onto a small outlined `Chip`.
 */
export function getSoftSelectedChipSx(
  theme: Theme,
  selected: boolean,
  accent?: string,
) {
  const isDark = theme.palette.mode === "dark";
  const color = accent ?? theme.palette.primary.main;
  // Text needs to be lighter than the tint in dark mode to stay readable.
  const selectedFg = isDark ? lighten(color, 0.35) : color;

  return {
    borderRadius: `${radiusTokens.sm}px`,
    fontWeight: selected ? 600 : 400,
    ...(selected
      ? {
          bgcolor: alpha(color, isDark ? 0.16 : 0.1),
          color: selectedFg,
          borderColor: alpha(color, 0.4),
          "&:hover": {
            bgcolor: alpha(color, isDark ? 0.22 : 0.14),
          },
        }
      : {}),
  };
}
