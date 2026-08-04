"use client";
import { Box, Tab, Tabs, useTheme } from "@mui/material";

import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";

import type { ReactElement, ReactNode, SyntheticEvent } from "react";

/** A single sub-tab entry rendered by {@link AnalyticsSubTabs}. */
export interface AnalyticsSubTabItem {
  /** Visible tab label (already translated). */
  label: string;
  /** Optional leading icon (use lucide icons with `ICON_SM`). */
  icon?: ReactElement;
  /** Disables the tab when its data set is empty. */
  disabled?: boolean;
}

/**
 * Clamps a sub-tab index onto a tab that actually has data.
 *
 * Sub-tab indices are persisted in the URL, and a tab is disabled when its
 * dataset is empty — so a deep link (or a filter change that empties a dataset)
 * can select a disabled tab. MUI happily renders it as *disabled and selected*
 * at once, and the panel's `hasData` guard then renders nothing: a blank
 * screen with no way back except clicking another tab.
 *
 * Falls back to the first enabled tab, or to `0` when every tab is empty (in
 * which case the caller's own empty state takes over).
 *
 * @param index - Requested index, typically read from a URL search param.
 * @param tabs - The same tab list handed to {@link AnalyticsSubTabs}.
 */
export function resolveEnabledSubTab(
  index: number,
  tabs: AnalyticsSubTabItem[],
): number {
  if (!tabs[index]?.disabled) return index;
  const firstEnabled = tabs.findIndex((tab) => !tab.disabled);
  return firstEnabled === -1 ? 0 : firstEnabled;
}

/** Props for the {@link AnalyticsSubTabs} component. */
interface AnalyticsSubTabsProps {
  /** Index of the currently active sub-tab. */
  value: number;
  /** Called with the newly selected sub-tab index. */
  onChange: (value: number) => void;
  /** Ordered sub-tab definitions. */
  tabs: AnalyticsSubTabItem[];
  /** Active sub-tab content. */
  children: ReactNode;
  /** Accessible label for the tab list. */
  ariaLabel?: string;
}

/**
 * Secondary navigation for analytics tabs (Temporal, Geographic, Audience).
 *
 * **Level 2 of the screen's three control grammars.** Rendered as a compact
 * left-aligned segmented control — pill buttons on a subtle *track* — so it
 * reads as a level below the main tab band (two stacked full-width tab bars
 * would look like duplicated navigation) while staying clearly apart from the
 * level-3 filter strips it often sits beside, which are trackless outlined
 * segments (`getFilterSegmentSx`).
 *
 * The active pill is a **neutral** white-alpha fill (`action.selected`), never
 * the primary accent: primary is reserved for the level-1 tab underline and
 * the level-3 active filter border/tint, so each level owns one unmistakable
 * cue. The track is a fill and nothing else — no border, no elevation: the
 * main tab panel already frames the content, and an outlined track read as a
 * loose fragment of a card wedged between the level-1 hairline and the panel.
 *
 * The row **wraps** rather than scrolls. Only the level-1 band may scroll on a
 * narrow phone; a level-2 row of two or three views has to show all of them,
 * and a scrolled one hid its last view off the right edge on every tab whose
 * labels ran long (Momento, Público, Origem at 390px). Icons drop below `sm`,
 * the same rule the level-1 band follows, which buys back most of the width.
 */
export function AnalyticsSubTabs({
  value,
  onChange,
  tabs,
  children,
  ariaLabel,
}: AnalyticsSubTabsProps) {
  const theme = useTheme();

  /** Forwards MUI's numeric tab index to the `onChange` callback. */
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Box>
      {/* Segmented control track — visually subordinate to the main tab band */}
      <Box sx={{ mb: { xs: 2, md: 2.5 }, display: "flex" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            minHeight: 0,
            maxWidth: "100%",
            p: 0.5,
            // Track without a frame. It used to carry a 1px `divider` border
            // *and* a fill, which read as a stray fragment of a card sitting
            // between the level-1 hairline above it and the panel below —
            // three horizontal frames in ~80px. The fill alone still groups
            // the pills into one switch; it is raised from .03 to .05 so it
            // survives losing the border, and stays under the level-0 strip's
            // `action.hover` (.08) so it keeps reading as the quieter level.
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            borderRadius: `${radiusTokens.md}px`,
            // Wraps to a second line instead of scrolling. `variant="scrollable"`
            // turned every row that did not fit into a scroll strip with the
            // last view hidden off-edge — at 390px that was Momento, Público
            // and Origem, i.e. most of the screen's sub-navigation. Scroll is
            // only acceptable for the level-1 band, which has six entries and
            // sits above the fold; a level-2 row of two or three views must
            // show all of them.
            "& .MuiTabs-scroller": { overflow: "visible" },
            "& .MuiTabs-flexContainer": {
              flexWrap: "wrap",
              columnGap: 0.5,
              rowGap: 0.5,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              // One step under the level-0 strip (40) and one over the
              // level-3 filters (32); 40 on phones keeps the tap target
              // comfortable now that rows can wrap onto two lines.
              minHeight: { xs: 40, md: 36 },
              minWidth: 0,
              px: 1.5,
              py: 0.5,
              // One step down from the level-1 tab band, same type scale as
              // the level-0 period strip and level-3 filters.
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "text.secondary",
              borderRadius: `${radiusTokens.sm + 2}px`,
              transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
              "&:hover": {
                color: "text.primary",
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.action.selected,
                color: "text.primary",
                fontWeight: 600,
              },
            },
            // Same rule the level-1 band already follows: the icon is a
            // desktop affordance. Dropping it below `sm` buys ~24px per view
            // and is what keeps a three-view row down to two lines on a phone
            // instead of three.
            "& .MuiTab-iconWrapper": {
              display: { xs: "none", sm: "inline-flex" },
            },
          }}
        >
          {tabs.map(({ label, icon, disabled }, index) => (
            <Tab
              key={index}
              label={label}
              icon={icon}
              iconPosition="start"
              disabled={disabled}
            />
          ))}
        </Tabs>
      </Box>
      {children}
    </Box>
  );
}

export default AnalyticsSubTabs;
