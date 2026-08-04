import type { Theme } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

/**
 * Track + selected-segment `sx` for an attached-pill `ToggleButtonGroup` —
 * the "instrument strip" segmented-control language approved on `/links`
 * (`LinksFilters.tsx`'s STATUS control, itself shared with
 * `LinkActionsViewSwitch`'s Analytics/Editar/QR switch): a low-contrast
 * track (`action.hover`) holding pill-shaped segments, with the active one
 * filled by `background.paper` plus a level-1 shadow so it reads as
 * "pressed in", not just a color swap.
 *
 * Extracted 2026-08-04 so the analytics screen's period/segment/continent
 * controls can mirror `/links` exactly instead of the outlined,
 * soft-tinted `Chip` row they used before — `LinksFilters.tsx` itself keeps
 * its own inline copy (the approved reference implementation is not
 * refactored to depend on this file, to keep its blast radius at zero).
 *
 * @param theme - Active MUI theme.
 * @param height - Track height in px. Defaults to `40`, the shared control
 * height every instrument in a strip like this one uses.
 * @returns `sx` for the `ToggleButtonGroup` (track) — the segments
 * (`.MuiToggleButton-root`) are styled via a nested selector.
 */
export function getSegmentedControlSx(theme: Theme, height = 40) {
  return {
    gap: 0.375,
    p: 0.375,
    height,
    flexShrink: 0,
    // Defensive: a strip with many segments (e.g. the 6-way period control)
    // can get tight on a narrow phone. `maxWidth` + `overflowX` contain any
    // overflow to a scroll *inside* the group instead of pushing the page
    // itself wider — normally invisible, since groups fit without scrolling
    // on every viewport this was checked against.
    maxWidth: "100%",
    overflowX: "auto",
    backgroundColor: theme.palette.action.hover,
    borderRadius: `${radiusTokens.md}px`,
    "& .MuiToggleButtonGroup-grouped": {
      margin: 0,
      border: 0,
      borderRadius: `${radiusTokens.sm}px`,
      "&:not(:first-of-type)": { marginLeft: 0, borderLeft: 0 },
    },
    "& .MuiToggleButton-root": {
      minHeight: height - 6,
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.8125rem",
      px: { xs: 1, sm: 1.25 },
      color: theme.palette.text.secondary,
      whiteSpace: "nowrap",
      transition: theme.transitions.create(
        ["color", "background-color", "box-shadow"],
        { duration: theme.transitions.duration.shortest },
      ),
      "&:hover": {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
      },
      "&.Mui-selected": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontWeight: 600,
        boxShadow: theme.shadows[1],
      },
      "&.Mui-selected:hover": {
        backgroundColor: theme.palette.background.paper,
      },
    },
  };
}
