// src/features/links/components/analytics/LinkAnalyticsTabs.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  LayoutDashboard,
  Share2,
  Globe,
  Users,
  Clock,
  MousePointer2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { motionTokens } from "@/lib/theme/designSystem";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { SectionLabel } from "@/shared/ui/base";

import { AnalyticsPanelActiveProvider } from "@/features/analytics/context/AnalyticsPanelActiveContext";
import { AudienceAnalysis } from "@/features/analytics/components/audience/AudienceAnalysis";
import { GeographicAnalysis } from "@/features/analytics/components/geographic/GeographicAnalysis";
import { OriginAnalysis } from "@/features/analytics/components/origin/OriginAnalysis";
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
 * The `tab` URL param uses named slugs (`?tab=places`) instead of numeric
 * indices. Invalid or missing values fall back to `"overview"`.
 */
export function LinkAnalyticsTabsOptimized({
  linkId,
  loading: _loading = false,
}: LinkAnalyticsTabsOptimizedProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation("analytics");
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
    filters.setTab(TAB_IDS[newValue] ?? "overview");
  };

  /**
   * Ordered tab metadata used to render the nav row and the panel headers.
   *
   * **Parallel to `TAB_IDS`** — index `i` here describes `TAB_IDS[i]`. Reorder
   * one and you must reorder the other, or every tab renders another tab's
   * label and description.
   */
  const tabLabels = [
    {
      label: t("tabs.overview"),
      description: t("tabDescriptions.overview"),
      Icon: LayoutDashboard,
    },
    {
      label: t("tabs.when"),
      description: t("tabDescriptions.when"),
      Icon: Clock,
    },
    {
      label: t("tabs.audience"),
      description: t("tabDescriptions.audience"),
      Icon: Users,
    },
    {
      label: t("tabs.places"),
      description: t("tabDescriptions.places"),
      Icon: Globe,
    },
    {
      label: t("tabs.origin"),
      description: t("tabDescriptions.origin"),
      Icon: Share2,
    },
    {
      label: t("tabs.clicks"),
      description: t("tabDescriptions.clicks"),
      Icon: MousePointer2,
    },
  ];

  /**
   * Renders a tab's content panel with the standard header (a `/ LABEL`
   * {@link SectionLabel} + description) above the tab component.
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
    const index = TAB_IDS.indexOf(id);
    const meta = tabLabels[index]!;
    const isActive = filters.tab === id;
    return (
      <Box
        role="tabpanel"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${index}`}
        sx={{ display: isActive ? "block" : "none" }}
      >
        {/* Standard tab header — names the active panel and explains it.
            No icon beside the label: the redesign kills title icon-chips,
            and the Tab strip above already carries the icon as a nav cue. */}
        <Box sx={{ mb: 2 }}>
          <SectionLabel headingLevel={2}>{meta.label}</SectionLabel>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: { xs: 1.5, sm: 2 } }}
          >
            {meta.description}
          </Typography>
        </Box>
        {/* Mounted-but-hidden panels keep their cached data and stop fetching:
            without this, changing the period refetched every tab the user had
            ever opened, all at once, to render one of them. */}
        <AnalyticsPanelActiveProvider active={isActive}>
          {children}
        </AnalyticsPanelActiveProvider>
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

      {/* Tab nav — level 0, no card of its own. A single hairline below the
           strip is what separates it from the active panel's content, same
           gutter as the rest of the page. */}
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            sx: {
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            },
          }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 52,
              color: "text.secondary",
              transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
              "&:hover": {
                color: "text.primary",
                backgroundColor: theme.palette.action.hover,
              },
              "&.Mui-focusVisible": {
                backgroundColor: theme.palette.action.hover,
              },
              "&.Mui-selected": {
                color: theme.palette.common.white,
                backgroundColor: alpha(theme.palette.primary.main, 0.22),
              },
              "&.Mui-selected:hover": {
                color: theme.palette.common.white,
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
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
              icon={
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  <Icon {...ICON_SM} />
                </Box>
              }
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab panels — mount-once, hidden via display:none when inactive.
           Same gutter as the tab nav above — no extra card padding. */}
      <Box sx={{ mt: { xs: 2, md: 3 } }}>
        {tabPanel(
          "overview",
          <LinkDashboard
            linkId={linkId}
            enableRealtime={false}
            compact={false}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
          />,
        )}

        {tabPanel(
          "origin",
          <OriginAnalysis
            linkId={linkId}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
            subTabIndex={filters.originSubTab}
            onSubTabChange={filters.setOriginSubTab}
          />,
        )}

        {tabPanel(
          "places",
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
            subTabIndex={filters.audienceSubTab}
            onSubTabChange={filters.setAudienceSubTab}
          />,
        )}

        {tabPanel(
          "when",
          <TemporalAnalysis
            linkId={linkId}
            enableRealtime={false}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            excludeBots={filters.excludeBots}
            segment={filters.segment}
            onSegmentChange={filters.setSegment}
            subTabIndex={filters.temporalSubTab}
            onSubTabChange={filters.setTemporalSubTab}
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
    </Box>
  );
}

export default LinkAnalyticsTabsOptimized;
