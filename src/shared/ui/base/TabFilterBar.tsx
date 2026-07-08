// src/shared/ui/base/TabFilterBar.tsx
"use client";

import type { ReactNode } from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getSoftSelectedChipSx } from "@/lib/theme/softChip";

/** A single selectable chip item within a filter group. */
export interface FilterChipItem {
  /** Unique value for this option (used as React key and for equality checks). */
  value: string;
  /** Display label shown inside the chip. */
  label: string;
  /** Whether this chip is currently selected. */
  selected: boolean;
  /** Called when the user clicks this chip. */
  onSelect: () => void;
}

/** A labelled row of filter chips, optionally followed by an inline addon node. */
export interface FilterGroup {
  /** Short label rendered to the left of the chips (uppercase caption). */
  label: string;
  /**
   * Selection mode.
   * - `"single"` — exactly one item selected at a time; active chips use `color="primary"`.
   * - `"multi"` — multiple items can be selected; active chips use `color="secondary"`.
   */
  type: "single" | "multi";
  items: FilterChipItem[];
  /** Extra node rendered after the chips — e.g. a Switch for a boolean toggle. */
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
   * Render as a slim strip without the "FILTERS" header block or its divider.
   * The clear-all (×) affordance moves to the end of the chips row.
   * Defaults to `false`.
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
 * Standardised filter bar for analytics tabs (Temporal, Geographic, Insights).
 *
 * Renders a header row (icon + "Filtros" label + active badge + clear button),
 * a Divider, and one row per {@link FilterGroup}.
 *
 * @example
 * ```tsx
 * <TabFilterBar
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
              px: 2,
              py: 1.25,
              mb: 2,
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
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

      {/* Filter groups */}
      <Stack spacing={1}>
        {groups.map((group, idx) => (
          <Stack
            key={idx}
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                minWidth: 90,
              }}
            >
              {group.label}
            </Typography>

            {group.items.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                size="small"
                variant="outlined"
                onClick={item.onSelect}
                sx={{
                  cursor: "pointer",
                  ...getSoftSelectedChipSx(
                    theme,
                    item.selected,
                    group.type === "multi"
                      ? theme.palette.secondary.main
                      : undefined,
                  ),
                  // Larger tap target on phones.
                  height: { xs: 34, sm: "auto" },
                  "& .MuiChip-label": { px: { xs: 1.5, sm: 1.25 } },
                }}
              />
            ))}

            {group.addon}

            {/* Clear-all affordance moves inline at the end of chips in attached mode */}
            {attached &&
              idx === groups.length - 1 &&
              onClearAll &&
              activeCount > 0 && (
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
        ))}
      </Stack>
    </Box>
  );
}

export default TabFilterBar;
