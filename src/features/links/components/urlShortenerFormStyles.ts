import { alpha } from "@mui/material/styles";

import { typographyScale } from "@/lib/theme";

import {
  getLinksBorderColor,
  getLinksControlFillBg,
  linksRadius,
} from "./list/linksPanelStyles";

import type { Theme } from "@mui/material/styles";

/**
 * Height of the destination row on the public shortener — the URL field and
 * the "Encurtar agora" button beside it share this number, so the action is
 * never smaller than the invitation.
 *
 * Same 52px as the logged-in quick-create (`CONTROL_HEIGHT` in
 * `list/LinksQuickCreate.tsx`) on purpose: the public page is the same
 * product's front door, and the short-link group below it steps down to 44px
 * exactly like there, which is what makes the cluster read input-first.
 * 52px also clears the 16px font floor that stops iOS zooming on focus.
 */
export const PUBLIC_CONTROL_HEIGHT = 52;

/**
 * Opaque stand-in for the translucent control fill, used ONLY by the
 * `-webkit-autofill` paint trick below. Browsers paint their own yellow
 * autofill tint *behind* the input's declared background, and the standard
 * `box-shadow: inset` cover-up only works with a fully opaque colour — at ~3%
 * alpha the yellow bleeds straight through.
 *
 * Values are the shared pair documented at length in `AUTOFILL_OPAQUE_BG`
 * (`list/LinksQuickCreate.tsx`): `getLinksControlFillBg`'s overlay flattened
 * over `background.default`. Recompute both if either input changes.
 */
const AUTOFILL_OPAQUE_BG = { dark: "#0B0C0D", light: "#F5F5F5" } as const;

/**
 * Micro-label above a field group on the public shortener — caps in JetBrains
 * Mono, one step below `SectionLabel` (11px vs 14px) and without its "/"
 * prefix, because the "/" is already the joint of the short-link control
 * directly underneath and repeating it would put two slashes on one cluster.
 *
 * Replaces the previous label grammar (0.7rem Inter, weight 700, uppercase,
 * plus a primary-coloured `*` and an inline "opcional"), which read as generic
 * form chrome rather than as this product's voice. Mirrors `groupLabelSx` in
 * `list/LinksQuickCreate.tsx`.
 */
export const publicGroupLabelSx = {
  display: "block",
  fontFamily: typographyScale.code.fontFamily,
  fontSize: "0.6875rem",
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "text.secondary",
} as const;

/**
 * The destination field on the public shortener — the page's invitation.
 *
 * Same formula as the logged-in quick-create's `getInputRootSx`: the
 * translucent control veil instead of an opaque fill, a control-step radius
 * one notch below the card that holds it, and an explicit primary focus ring
 * (border + 3px halo) so this field and the short-link group below answer the
 * keyboard identically. The border never jumps 1px→2px on focus — the ring is
 * what signals focus; in error the ring only changes colour.
 *
 * @param theme - Active MUI theme.
 * @returns `sx` for the destination `TextField`.
 */
export function getPublicShortenerFieldSx(theme: Theme) {
  const bg = getLinksControlFillBg(theme);
  const borderColor = getLinksBorderColor(theme);
  const primary = theme.palette.primary.main;
  const error = theme.palette.error.main;
  const autofillBg =
    theme.palette.mode === "dark"
      ? AUTOFILL_OPAQUE_BG.dark
      : AUTOFILL_OPAQUE_BG.light;

  return {
    "& .MuiOutlinedInput-root": {
      height: PUBLIC_CONTROL_HEIGHT,
      borderRadius: `${linksRadius.control}px`,
      bgcolor: bg,
      fontSize: "1rem",
      transition: theme.transitions.create(["border-color", "box-shadow"], {
        duration: 150,
      }),
      "&:hover": { bgcolor: bg },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor,
        borderWidth: "1px !important",
      },
      "&.Mui-focused": {
        bgcolor: `${bg} !important`,
        boxShadow: `0 0 0 3px ${alpha(primary, 0.35)}`,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: primary },
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: error },
      "&.Mui-error.Mui-focused": {
        boxShadow: `0 0 0 3px ${alpha(error, 0.35)}`,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: error },
      },
      "& input": {
        py: 0,
        height: "100%",
        boxSizing: "border-box",
      },
      "& input:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 100px ${autofillBg} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
      },
    },
    "& .MuiFormHelperText-root": {
      mx: 0,
      mt: 0.75,
    },
  };
}
