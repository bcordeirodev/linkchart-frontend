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
 * ### Wraps, never scrolls
 * A filter row that does not fit lays its remaining segments onto a second
 * line with a tight row gap. It must not become a scroll strip: the first
 * draft of this helper pinned the group to a hard `height` and set
 * `overflowX: "auto"`, and per CSS a non-`visible` `overflow-x` forces
 * `overflow-y` to compute to `auto` as well — so a 36px-tall box ended up
 * holding 100px of 47px-tall segments (MUI's own `ToggleButton` padding wins
 * over `minHeight`). Every filter row was clipped top and bottom at every
 * viewport, and on a phone the wrapped segments — "Horário comercial",
 * "Oceania" — were invisible and unreachable behind a 36px window. Hence:
 * `minHeight` on the group, an exact `height` forced onto the segments, and
 * no `overflow` at all.
 *
 * @param theme - Active MUI theme.
 * @param height - Segment height in px. Defaults to `32` — one step below the
 * level-2 sub-tabs (36) and two below the level-0 strip (40), so a filter row
 * never out-weighs the navigation above it.
 * @returns `sx` for the `ToggleButtonGroup` — segments are styled via nested
 * selectors.
 */
export function getFilterSegmentSx(theme: Theme, height = 32) {
  const radius = `${radiusTokens.sm}px`;
  const activeTint = alpha(
    theme.palette.primary.main,
    theme.palette.mode === "dark" ? 0.16 : 0.1,
  );

  return {
    columnGap: 0.75,
    rowGap: 0.75,
    // `minHeight`, never `height`: the group has to be free to grow to two
    // lines. See the "wraps, never scrolls" note above.
    minHeight: height,
    flexWrap: "wrap" as const,
    alignItems: "center",
    alignContent: "flex-start",
    // `minWidth: 0` lets the group shrink inside a flex parent instead of
    // forcing its max-content width on it — without it, `maxWidth: "100%"`
    // resolves against the *inflated* parent and the row runs off-screen
    // (this is what pushed `/reports`' "Personalizado" preset past the right
    // edge of a 390px phone, where nothing could reach it).
    minWidth: 0,
    maxWidth: "100%",
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
      // Exact box, not a floor: MUI's `ToggleButton` ships 11px of vertical
      // padding, which silently turns a 32px `minHeight` into a 47px control.
      height,
      minHeight: height,
      py: 0,
      lineHeight: 1.2,
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
