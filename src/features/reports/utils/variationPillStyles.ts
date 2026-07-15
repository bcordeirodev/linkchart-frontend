/**
 * Shared "up/down" pill styling for percentage-variation values in the
 * Reports module — a colored-tint background behind a signed percentage
 * (`▲ 12%` / `▼ 5%` / `—`).
 *
 * Follows the project's "colored chip" rule: a tinted background needs
 * WHITE text in dark mode (a lightened tint of the accent sitting on a tint
 * of that same accent never separates enough to read) and a darkened tone
 * of the accent in light mode. `positive === null` renders a neutral pill —
 * used when there is no comparable previous period to derive a sign from.
 */

import { alpha, darken } from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";

/**
 * Resolves the `color`/`bgcolor` pair for a variation pill.
 *
 * @param theme - active MUI theme (read for palette + mode).
 * @param positive - `true` for an upward variation, `false` for downward,
 * `null` when there is no baseline to compare against (renders neutral).
 * @returns an `sx`-compatible partial style object with `color` and `bgcolor`.
 */
export function getVariationPillSx(theme: Theme, positive: boolean | null) {
  const isDark = theme.palette.mode === "dark";

  if (positive === null) {
    return {
      color: "text.disabled",
      bgcolor: alpha(theme.palette.text.disabled, isDark ? 0.16 : 0.1),
    };
  }

  const color = positive
    ? theme.palette.success.main
    : theme.palette.error.main;

  return {
    color: isDark ? theme.palette.common.white : darken(color, 0.3),
    bgcolor: alpha(color, isDark ? 0.16 : 0.1),
  };
}

/**
 * Formats a signed percentage as `"▲ 12.3%"` / `"▼ 5%"`, or `"—"` when
 * `null` (no comparable baseline).
 *
 * @param value - signed percentage, or `null`.
 * @returns the formatted label.
 */
export function formatSignedPct(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return `${value >= 0 ? "▲" : "▼"} ${Math.abs(value)}%`;
}
