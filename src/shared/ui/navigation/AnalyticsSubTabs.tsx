"use client";
import { Box, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";

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
 * Standard sub-tab navigation for analytics tabs (Temporal, Geographic,
 * Audience). Mirrors the main `LinkAnalyticsTabs` styling — leading icons,
 * selected-state background, scrollable on mobile / full-width on desktop —
 * and wraps nav + content in a bordered container so the sub-tab area reads
 * as one hierarchical level, distinct from the metric cards above it.
 */
export function AnalyticsSubTabs({
  value,
  onChange,
  tabs,
  children,
  ariaLabel,
}: AnalyticsSubTabsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /** Forwards MUI's numeric tab index to the `onChange` callback. */
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: `${radiusTokens.lg}px`,
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label={ariaLabel}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 48,
              transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
              "&.Mui-selected": {
                backgroundColor: theme.palette.action.selected,
                borderRadius: `${radiusTokens.md}px`,
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
