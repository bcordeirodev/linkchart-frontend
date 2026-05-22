// src/features/links/components/analytics/LinkAnalyticsTabs.tsx
"use client";

import { useEffect, useState } from "react";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
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
import { LinkDashboard } from "@/features/analytics/components/dashboard/LinkDashboard";

import { AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { ClicksTable } from "./ClicksTable";
import {
  useAnalyticsFilters,
  TAB_IDS,
  type TabId,
} from "@/features/links/hooks/useAnalyticsFilters";

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
 * is rendered above the tab navigation.
 *
 * ### Mount-once pattern
 * A `visitedTabs` Set tracks which tabs have been opened. Each visited tab
 * stays in the DOM (hidden via `display:none`) so its hook state survives
 * tab switching — no refetch on revisit. Unvisited tabs are not rendered at
 * all, preserving lazy loading on first access.
 *
 * ### URL-named tabs
 * The `tab` URL param uses named slugs (`?tab=temporal`) instead of numeric
 * indices. Invalid or missing values fall back to `"overview"`.
 */
export function LinkAnalyticsTabsOptimized({
  linkId,
  loading: _loading = false,
}: LinkAnalyticsTabsOptimizedProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const filters = useAnalyticsFilters();

  /** Numeric index of the active tab — required by MUI `<Tabs value>`. */
  const tabIndex = TAB_IDS.indexOf(filters.tab);

  /**
   * Set of tabs that have been visited at least once in this session.
   * Initialised with the tab coming from the URL so deep-linked tabs
   * are mounted immediately.
   */
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(
    () => new Set([filters.tab]),
  );

  useEffect(() => {
    setVisitedTabs((prev) =>
      prev.has(filters.tab) ? prev : new Set([...prev, filters.tab]),
    );
  }, [filters.tab]);

  /** Converts a MUI Tabs numeric index back to a named TabId. */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    filters.setTab(TAB_IDS[newValue]);
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

  /**
   * Renders a tab's content panel.
   *
   * The panel is only added to the DOM on the first visit (`visitedTabs.has(id)`).
   * Once mounted it persists across tab switches via `display` toggling, keeping
   * the hook's data alive without re-fetching.
   *
   * @param id - the TabId for this panel
   * @param children - the tab component to render
   */
  const tabPanel = (id: TabId, children: React.ReactNode) => {
    if (!visitedTabs.has(id)) return null;
    return (
      <Box
        role="tabpanel"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${TAB_IDS.indexOf(id)}`}
        sx={{
          display: filters.tab === id ? "block" : "none",
          pt: 2,
          pb: 3,
        }}
      >
        {children}
      </Box>
    );
  };

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

      {/* Tab navigation */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${theme.palette.divider}`,
          mb: "10px",
        }}
      >
        <Tabs
          value={tabIndex}
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
              id={`tab-${index}`}
              aria-controls={`tabpanel-${TAB_IDS[index]}`}
              label={label}
              icon={<Icon {...ICON_SM} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab panels — mount-once, hidden via display:none when inactive */}

      {tabPanel(
        "overview",
        <LinkDashboard
          linkId={linkId}
          showTitle={false}
          enableRealtime={false}
          compact={false}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          excludeBots={filters.excludeBots}
        />,
      )}

      {tabPanel(
        "temporal",
        <TemporalAnalysis
          linkId={linkId}
          enableRealtime={false}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          excludeBots={filters.excludeBots}
          segment={filters.segment}
          onSegmentChange={filters.setSegment}
        />,
      )}

      {tabPanel(
        "geographic",
        <GeographicAnalysis
          linkId={linkId}
          enableRealtime={false}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          excludeBots={filters.excludeBots}
          continent={filters.continent}
          onContinentChange={filters.setContinent}
          subTabIndex={filters.geoSubTab}
          onSubTabChange={filters.setGeoSubTab}
        />,
      )}

      {tabPanel(
        "audience",
        <AudienceAnalysis
          linkId={linkId}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          excludeBots={filters.excludeBots}
        />,
      )}

      {tabPanel(
        "insights",
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
        />,
      )}

      {tabPanel(
        "clicks",
        <ClicksTable
          linkId={linkId}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          excludeBots={filters.excludeBots}
        />,
      )}
    </Box>
  );
}

export default LinkAnalyticsTabsOptimized;
