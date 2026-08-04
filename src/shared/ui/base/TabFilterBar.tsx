// src/shared/ui/base/TabFilterBar.tsx
"use client";

import type { ReactNode, MouseEvent } from "react";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getSegmentedControlSx } from "./segmentedControl";

import type { Theme } from "@mui/material/styles";

/** A single selectable chip item within a filter group. */
export interface FilterChipItem {
  /** Unique value for this option (used as React key and for equality checks). */
  value: string;
  /** Display label shown inside the segment. */
  label: string;
  /** Whether this segment is currently selected. */
  selected: boolean;
  /** Called when the user selects this segment. */
  onSelect: () => void;
}

/** A group of segmented-control options, optionally followed by an inline addon node. */
export interface FilterGroup {
  /**
   * Descriptive label for this group — rendered as the `aria-label` of its
   * `ToggleButtonGroup` (not visible copy; the segmented control's selected
   * pill speaks for itself, same "instrument strip" rule as `/links`).
   */
  label: string;
  /**
   * Selection mode.
   * - `"single"` — exactly one item selected at a time (`ToggleButtonGroup exclusive`).
   * - `"multi"` — multiple items can be selected at once.
   */
  type: "single" | "multi";
  items: FilterChipItem[];
  /** Extra node rendered after the segmented control — e.g. a Switch for a boolean toggle. */
  addon?: ReactNode;
}

interface TabFilterBarProps {
  groups: FilterGroup[];
  /**
   * When provided and there are active filters, renders a clear-all (×) button in
   * the header. Pass `undefined` to hide the button.
   */
  onClearAll?: () => void;
  /**
   * Render as a boxless, level-0 control row — no card/border of its own —
   * without the "FILTERS" header block or its divider. The clear-all (×)
   * affordance moves to the end of the segmented control(s). Defaults to `false`.
   */
  attached?: boolean;
}

/**
 * Counts the number of non-default active filters across all groups.
 *
 * For single-select groups the first item is the "all" default — any other
 * selected item contributes 1 to the count.
 * For multi-select groups every selected item contributes 1.
 */
function countActiveFilters(groups: FilterGroup[]): number {
  return groups.reduce((acc, g) => {
    if (g.type === "single") {
      const firstIsSelected = g.items[0]?.selected ?? true;
      return acc + (firstIsSelected ? 0 : 1);
    }
    return acc + g.items.filter((i) => i.selected).length;
  }, 0);
}

/**
 * Renders one {@link FilterGroup} as an attached-pill `ToggleButtonGroup` —
 * the same segmented-control language as `/links`' STATUS filter
 * (`getSegmentedControlSx`) — instead of a row of individually outlined,
 * soft-tinted `Chip`s.
 *
 * `"single"` groups map directly onto `ToggleButtonGroup exclusive`: the
 * selected value is whichever item has `selected: true` (or `null` — no
 * segment lit — when none do), and a click resolves the clicked item's own
 * `onSelect`. `"multi"` groups pass the full array of currently-selected
 * values to `ToggleButtonGroup`; on change, every item whose membership in
 * the new array differs from its current `selected` gets its `onSelect`
 * called — in practice exactly the one segment the user just clicked.
 *
 * @param group - The group to render.
 * @param theme - Active MUI theme (for {@link getSegmentedControlSx}).
 */
function FilterGroupControl({
  group,
  theme,
}: {
  group: FilterGroup;
  theme: Theme;
}) {
  if (group.type === "single") {
    const selectedValue = group.items.find((i) => i.selected)?.value ?? null;

    const handleChange = (
      _event: MouseEvent<HTMLElement>,
      next: string | null,
    ) => {
      if (next === null) return;
      group.items.find((i) => i.value === next)?.onSelect();
    };

    return (
      <ToggleButtonGroup
        exclusive
        value={selectedValue}
        onChange={handleChange}
        aria-label={group.label}
        sx={getSegmentedControlSx(theme)}
      >
        {group.items.map((item) => (
          <ToggleButton key={item.value} value={item.value}>
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  // "multi" — every currently-selected value; a click flips exactly the
  // clicked segment's own `onSelect`, since MUI hands back the *whole* next
  // array rather than which single value toggled.
  const selectedValues = group.items
    .filter((i) => i.selected)
    .map((i) => i.value);

  const handleMultiChange = (
    _event: MouseEvent<HTMLElement>,
    next: string[],
  ) => {
    group.items.forEach((item) => {
      if (next.includes(item.value) !== item.selected) {
        item.onSelect();
      }
    });
  };

  return (
    <ToggleButtonGroup
      value={selectedValues}
      onChange={handleMultiChange}
      aria-label={group.label}
      sx={getSegmentedControlSx(theme)}
    >
      {group.items.map((item) => (
        <ToggleButton key={item.value} value={item.value}>
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

/**
 * Standardised filter bar for analytics tabs (Temporal, Geographic) and the
 * reports date filter.
 *
 * In `attached` mode (every current consumer) it's a boxless row of
 * segmented `ToggleButtonGroup` controls, one per {@link FilterGroup} — the
 * same attached-pill language `/links`' `LinksFilters` STATUS control uses,
 * aligned 2026-08-04 in the post-cycle pass that brought the analytics
 * screen up to that standard (was: outlined, soft-tinted `Chip` rows with a
 * visible caps label per group). In the (currently unused by any consumer)
 * full/non-attached mode it additionally renders the "Filtros" header row
 * with an active-count badge and clear-all button, above the same segmented
 * groups.
 *
 * @example
 * ```tsx
 * <TabFilterBar
 *   attached
 *   groups={[{
 *     label: t("filters.segment"),
 *     type: "single",
 *     items: SEGMENT_OPTIONS.map(opt => ({
 *       value: opt,
 *       label: t(`filters.segmentOptions.${opt}`),
 *       selected: segment === opt,
 *       onSelect: () => onSegmentChange(opt),
 *     })),
 *   }]}
 * />
 * ```
 */
export function TabFilterBar({
  groups,
  onClearAll,
  attached = false,
}: TabFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const activeCount = countActiveFilters(groups);

  return (
    <Box
      sx={
        attached
          ? {
              // Level 0 — no card of its own. The caller supplies whatever
              // hairline separates this control row from the content below
              // (same "toolbar is boxless" rule as the /links search/sort row).
              mb: 2,
            }
          : {
              display: "flex",
              flexDirection: "column",
              px: 2,
              pt: 1.25,
              pb: 1.5,
              mb: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }
      }
    >
      {/* Header row — only shown in full (non-attached) mode */}
      {!attached && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <SlidersHorizontal
                size={13}
                strokeWidth={2.5}
                color={theme.palette.text.secondary}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t("filters.title")}
              </Typography>
              {activeCount > 0 && (
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontWeight: 600, letterSpacing: "0.02em" }}
                >
                  {activeCount} {t("filters.active")}
                </Typography>
              )}
            </Stack>

            {onClearAll && activeCount > 0 && (
              <IconButton
                size="small"
                onClick={onClearAll}
                aria-label={t("filters.clearAll")}
                sx={{ p: 0.25 }}
              >
                <X size={14} />
              </IconButton>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />
        </>
      )}

      {/* Filter groups — one segmented control per group */}
      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1.5}>
        {groups.map((group, idx) => (
          <Box
            key={idx}
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <FilterGroupControl group={group} theme={theme} />
            {group.addon}
          </Box>
        ))}

        {/* Clear-all affordance, inline at the end of the groups row — only
            in attached mode; non-attached mode already has it in the header. */}
        {attached && onClearAll && activeCount > 0 && (
          <IconButton
            size="small"
            onClick={onClearAll}
            aria-label={t("filters.clearAll")}
            sx={{
              p: 0.25,
              // Reach a usable hit area on touch (was ~22px).
              minWidth: { xs: 40, sm: "auto" },
              minHeight: { xs: 40, sm: "auto" },
            }}
          >
            <X size={14} />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}

export default TabFilterBar;
