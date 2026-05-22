import { alpha } from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material";

/** Label above fields on the public /shorter form. */
export function getUrlShortenerLabelSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    fontSize: "0.6875rem",
    fontWeight: 600,
    color: alpha(theme.palette.text.primary, isDark ? 0.45 : 0.5),
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    mb: 0.75,
  };
}

/** Native input inside public form fields. */
export function getUrlShortenerInputSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
    fontFamily: "inherit",
    minWidth: 0,
    "&::placeholder": {
      color: alpha(theme.palette.text.primary, isDark ? 0.28 : 0.38),
    },
  };
}
