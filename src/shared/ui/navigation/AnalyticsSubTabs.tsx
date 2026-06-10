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
 * Rendered as a compact left-aligned **segmented control** (pill buttons on a
 * subtle track) so it reads as a level below the main tab band — two stacked
 * full-width tab bars would look like duplicated navigation. No wrapper
 * border: the main tab panel already frames the content, and a second frame
 * would run parallel to it as a double border.
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
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label={ariaLabel}
          TabIndicatorProps={{ sx: { display: "none" } }}
          sx={{
            minHeight: 0,
            maxWidth: "100%",
            p: 0.5,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.03)",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${radiusTokens.md}px`,
            "& .MuiTabs-flexContainer": { gap: 0.5 },
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 36,
              minWidth: 0,
              px: 1.5,
              py: 0.75,
              color: "text.secondary",
              borderRadius: `${radiusTokens.sm + 2}px`,
              transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
              "&:hover": {
                color: "text.primary",
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.action.selected,
                color: "text.primary",
              },
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
