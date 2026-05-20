"use client";

import { Tabs, Tab, Box, useTheme } from "@mui/material";
import {
  LayoutDashboard,
  Globe,
  Clock,
  Users,
  Lightbulb,
  MousePointer2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { ICON_SM } from "@/lib/theme/iconDefaults";

import { AudienceAnalysis } from "@/features/analytics/components/audience/AudienceAnalysis";
import { GeographicAnalysis } from "@/features/analytics/components/geographic/GeographicAnalysis";
import { InsightsAnalysis } from "@/features/analytics/components/insights/InsightsAnalysis";
import { TemporalAnalysis } from "@/features/analytics/components/temporal";
import { TabPanel } from "@/shared/ui/base/TabPanel";

import { LinkDashboard } from "@/features/analytics/components/dashboard/LinkDashboard";

import { AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { useAnalyticsFilters } from "@/features/links/hooks/useAnalyticsFilters";
import { ClicksTable } from "./ClicksTable";

interface LinkAnalyticsTabsOptimizedProps {
  /** The ID of the link whose analytics are displayed. */
  linkId: string;
  /** Reserved for future loading-skeleton integration. */
  loading?: boolean;
}

/**
 * Tabs for individual-link analytics with URL-persisted filters.
 *
 * Instantiates `useAnalyticsFilters` once and fans filter state out to every
 * tab component. The global `AnalyticsFilterBar` (period presets + bot toggle)
 * is rendered above the tab navigation. Tab-specific filter controls live
 * inside each analysis component and receive their slice of filter state via
 * props.
 *
 * AudienceAnalysis and ClicksTable receive no filter props (Phase 2).
 */
export function LinkAnalyticsTabsOptimized({
  linkId,
  loading: _loading = false,
}: LinkAnalyticsTabsOptimizedProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const filters = useAnalyticsFilters();

  /** Handles tab switch triggered by user interaction. */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    filters.setTab(newValue);
  };

  /** Ordered tab metadata used to render the navigation row. */
  const tabLabels = [
    { label: t("analytics.tabs.overview"), Icon: LayoutDashboard },
    { label: t("analytics.tabs.temporal"), Icon: Clock },
    { label: t("analytics.tabs.geographic"), Icon: Globe },
    { label: t("analytics.tabs.audience"), Icon: Users },
    { label: t("analytics.tabs.insights"), Icon: Lightbulb },
    { label: t("analytics.clicksTable.title"), Icon: MousePointer2 },
  ];

  return (
    <Box>
      {/* Global filter bar — date range + shortcut presets + bot-exclusion toggle */}
      <AnalyticsFilterBar
        period={filters.period}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        excludeBots={filters.excludeBots}
        onPeriodChange={filters.setPeriod}
        onDateRangeChange={filters.setDateRange}
        onExcludeBotsChange={filters.setExcludeBots}
      />

      {/* Tabs Navigation */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <Tabs
          value={filters.tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
              "&.Mui-selected": {
                backgroundColor: theme.palette.action.selected,
                borderRadius: `${radiusTokens.md}px`,
              },
            },
          }}
        >
          {tabLabels.map(({ label, Icon }, index) => (
            <Tab
              key={index}
              label={label}
              icon={<Icon {...ICON_SM} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels - LAZY LOADING: only the active tab is rendered */}

      {/* Dashboard Tab */}
      <TabPanel value={filters.tab} index={0}>
        {filters.tab === 0 && (
          <LinkDashboard
            linkId={linkId}
            showTitle={false}
            enableRealtime={false}
            compact={false}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
          />
        )}
      </TabPanel>

      {/* Temporal Tab */}
      <TabPanel value={filters.tab} index={1}>
        {filters.tab === 1 && (
          <TemporalAnalysis
            linkId={linkId}
            enableRealtime={false}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
            groupBy={filters.groupBy}
            segment={filters.segment}
            onGroupByChange={filters.setGroupBy}
            onSegmentChange={filters.setSegment}
          />
        )}
      </TabPanel>

      {/* Geographic Tab */}
      <TabPanel value={filters.tab} index={2}>
        {filters.tab === 2 && (
          <GeographicAnalysis
            linkId={linkId}
            enableRealtime={false}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
            continent={filters.continent}
            minClicks={filters.minClicks}
            geoLevel={filters.geoLevel}
            onContinentChange={filters.setContinent}
            onMinClicksChange={filters.setMinClicks}
            onGeoLevelChange={filters.setGeoLevel}
          />
        )}
      </TabPanel>

      {/* Audience Tab — Phase 2: no filter props yet */}
      <TabPanel value={filters.tab} index={3}>
        {filters.tab === 3 && <AudienceAnalysis linkId={linkId} />}
      </TabPanel>

      {/* Insights Tab */}
      <TabPanel value={filters.tab} index={4}>
        {filters.tab === 4 && (
          <InsightsAnalysis
            linkId={linkId}
            enableRealtime={false}
            maxInsights={10}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
            priority={filters.priority}
            insightCategories={filters.insightCategories}
            actionableOnly={filters.actionableOnly}
            onPriorityChange={filters.setPriority}
            onCategoriesChange={filters.setInsightCategories}
            onActionableOnlyChange={filters.setActionableOnly}
          />
        )}
      </TabPanel>

      {/* Clicks Tab — Phase 2: no filter props yet */}
      <TabPanel value={filters.tab} index={5}>
        {filters.tab === 5 && <ClicksTable linkId={linkId} />}
      </TabPanel>
    </Box>
  );
}

export default LinkAnalyticsTabsOptimized;
