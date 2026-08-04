import { alpha } from "@mui/material/styles";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";

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

/**
 * `sx` for a **level-3 filter strip** — the third and last of the three
 * navigation/filter grammars the analytics screens use, and the only one that
 * says "this narrows the data" rather than "this moves you somewhere".
 *
 * Where {@link getSegmentedControlSx} (L0 period strip) and `AnalyticsSubTabs`
 * (L2 views) are both *tracked* controls — pills sitting inside one bounded,
 * low-contrast container — a filter strip is deliberately **trackless**:
 * free-standing outlined segments separated by a gap, so it reads as a row of
 * filter chips, not as a switch or a tab bar. That presence/absence of the
 * enclosing track is what makes the three levels tellable apart at a glance,
 * even side by side.
 *
 * Active segment = `primary.main` border + a soft primary tint, matching the
 * cue `AnalyticsFilterBar`'s custom date pickers already use for "this filter
 * is applied". The label stays `text.primary` (white in dark) rather than
 * `primary.light`: a pastel tone of the same hue on a tint of that hue is the
 * low-contrast combination the project bans for colored chips in dark mode.
 *
 * @param theme - Active MUI theme.
 * @param height - Segment height in px. Defaults to `36` — one step below the
 * `40` of the L0 strip, so a filter row never out-weighs the period strip.
 * @returns `sx` for the `ToggleButtonGroup` — segments are styled via nested
 * selectors.
 */
export function getFilterSegmentSx(theme: Theme, height = 36) {
  const radius = `${radiusTokens.sm}px`;
  const activeTint = alpha(
    theme.palette.primary.main,
    theme.palette.mode === "dark" ? 0.16 : 0.1,
  );

  return {
    gap: 0.75,
    height,
    flexShrink: 0,
    flexWrap: "wrap" as const,
    // Same defensive containment as the tracked strip: a long filter row on a
    // narrow phone scrolls inside itself instead of widening the page.
    maxWidth: "100%",
    overflowX: "auto",
    backgroundColor: "transparent",
    // MUI rounds only the outer edges of a grouped ToggleButtonGroup and drops
    // the inner borders, which is exactly the *tracked* look this grammar is
    // avoiding — every segment gets its own full border and radius back.
    "& .MuiToggleButtonGroup-grouped": {
      margin: 0,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: radius,
      "&:not(:first-of-type)": {
        marginLeft: 0,
        borderLeft: `1px solid ${theme.palette.divider}`,
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
      },
      "&:not(:last-of-type)": {
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
      },
    },
    "& .MuiToggleButton-root": {
      minHeight: height,
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.8125rem",
      px: { xs: 1.25, sm: 1.5 },
      color: theme.palette.text.secondary,
      whiteSpace: "nowrap",
      transition: theme.transitions.create(
        ["color", "background-color", "border-color"],
        { duration: theme.transitions.duration.shortest },
      ),
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
      "&.Mui-selected": {
        backgroundColor: activeTint,
        color: theme.palette.text.primary,
        fontWeight: 600,
        borderColor: theme.palette.primary.main,
        // Beats the `:not(:first-of-type)` divider border above.
        borderLeftColor: theme.palette.primary.main,
      },
      "&.Mui-selected:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.24 : 0.16,
        ),
        borderColor: theme.palette.primary.main,
        borderLeftColor: theme.palette.primary.main,
      },
    },
  };
}
