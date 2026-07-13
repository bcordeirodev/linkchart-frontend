"use client";
import { useState } from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { Megaphone, Radio, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import { useDashboardData } from "@/features/analytics/hooks/useDashboardData";
import { useInsightsData } from "@/features/analytics/hooks/useInsightsData";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { AnalyticsSubTabs, resolveEnabledSubTab } from "@/shared/ui/navigation";

import { BehaviorSection } from "../audience/BehaviorSection";
import { FetchDestChart } from "../audience/FetchDestChart";
import { SocialPlatformSection } from "../audience/SocialPlatformSection";
import { UtmSourceCard, SocialAppCard } from "../dashboard/cards";
import { ChannelEngagementChart } from "./ChannelEngagementChart";
import { ChannelsBreakdown } from "./ChannelsBreakdown";

/** Grid used for the two-card rows (Campanhas, Contexto de navegação). */
function twoColGridSx(twoColumns: boolean) {
  return {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: twoColumns ? "1fr 1fr" : "1fr" },
    gap: { xs: 2, md: 3 },
  } as const;
}

/**
 * Loading skeleton that mirrors the sub-tabbed Origin tab layout: the
 * segmented sub-tab control followed by a single content block (the shape of
 * whichever sub-tab loads first).
 */
function OriginSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="rounded"
        animation="wave"
        height={40}
        sx={{ mb: 2, borderRadius: 2, maxWidth: 420 }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={220}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  );
}

/** Props accepted by the {@link OriginAnalysis} component. */
interface OriginAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /**
   * Index of the currently active sub-tab (0=Canais e redes, 1=Campanhas,
   * 2=Detalhes técnicos).
   *
   * When provided the component operates in **controlled mode** and the
   * caller is responsible for persisting this value (e.g. in URL search
   * params) so it survives RSC-triggered remounts on filter changes. When
   * omitted the component falls back to an internal `useState`.
   */
  subTabIndex?: number;
  /** Called when the user selects a different sub-tab. Pair with `subTabIndex`. */
  onSubTabChange?: (v: number) => void;
}

/**
 * "Origem" tab — answers "where does the traffic come from?" across three
 * sub-tabs: Canais e redes → Campanhas (UTM) → Detalhes técnicos.
 *
 * A sub-tab exists to separate *different questions*, not different zoom
 * levels of the same one. "Which channel brings traffic?" and "which social
 * network, inside that channel?" are one question at two zooms, so they share
 * a screen; "did my campaign work?" is a different question and keeps its own.
 *
 * Each of the four channels (direct/social/search/referral) previously
 * appeared five times on this tab — four KPI cards, a channel-distribution
 * donut, an "Engajamento por Canal" bar chart, a "Performance Detalhada por
 * Canal" list and a "Top 5 Fontes Individuais" list, all showing the same
 * numbers. `ChannelsBreakdown` is now the *only* representation of channel
 * share, in the "Canais" sub-tab; per-channel engagement (average session
 * depth) moved into "Contexto" via `ChannelEngagementChart` since it is an
 * engineering-flavoured number, not a headline metric. The "Fonte
 * Principal"/"Diversidade"/low-diversity-alert/individual-sources/
 * strategic-recommendations content that used to live in the deleted
 * `TrafficSourceChart` is intentionally not rendered anywhere else — it
 * duplicated (or was a finer-grained cut of) the channel data above.
 *
 * Combines three data sources:
 * - {@link useInsightsData} for `analytics_data.traffic_sources.channels`
 *   and the top-level `analytics_data.navigation_context` block.
 * - {@link useAudienceData} for `social_platform_breakdown` and
 *   `fetch_dest_breakdown`.
 * - {@link useDashboardData} for `summary.utm_top_sources` and
 *   `summary.social_iab`, which `UtmSourceCard`/`SocialAppCard` accept in this
 *   shape. They live *only* here now — the dashboard's "acquisition" section
 *   that used to render them too is gone.
 *
 * Every child component owns its own title + description, so this
 * orchestrator adds no redundant section headers beyond the sub-tab label
 * itself — each block is self-explanatory, matching the pattern already
 * used by `GeographicAnalysis`/`AudienceChart`.
 *
 * Loading/error gate on the two required sources (insights + audience); the
 * campaigns sub-tab is a progressive enhancement that appears once the
 * dashboard fetch resolves, exactly like `UtmSourceCard`/`SocialAppCard`
 * already behave inside the dashboard's acquisition section (they render
 * `null` until their data is ready).
 */
export function OriginAnalysis({
  linkId,
  dateFrom,
  dateTo,
  excludeBots,
  subTabIndex,
  onSubTabChange,
}: OriginAnalysisProps) {
  const { t } = useTranslation("analytics");

  // Uncontrolled fallback — used only when `subTabIndex` is not provided.
  const [localSubTab, setLocalSubTab] = useState(0);
  /** The active sub-tab index: controlled (URL-persisted) when provided, otherwise local. */
  const activeSubTab = subTabIndex ?? localSubTab;

  /**
   * Handles sub-tab changes (Canais e redes / Campanhas / Detalhes técnicos).
   *
   * In controlled mode (`onSubTabChange` provided) the caller owns the state
   * (typically writing to URL search params); otherwise local state is
   * updated directly.
   *
   * @param newValue - The index of the newly selected sub-tab.
   */
  const handleSubTabChange = (newValue: number) => {
    if (onSubTabChange) {
      onSubTabChange(newValue);
    } else {
      setLocalSubTab(newValue);
    }
  };

  const {
    data: insightsData,
    loading: insightsLoading,
    error: insightsError,
    refresh: refreshInsights,
  } = useInsightsData({ linkId, dateFrom, dateTo, excludeBots });

  const {
    data: audienceData,
    loading: audienceLoading,
    error: audienceError,
    refresh: refreshAudience,
  } = useAudienceData({
    linkId,
    enableRealtime: false,
    dateFrom,
    dateTo,
    excludeBots,
  });

  const { data: dashboardData, refresh: refreshDashboard } = useDashboardData({
    linkId,
    enableRealtime: false,
    dateFrom,
    dateTo,
    excludeBots,
  });

  const channels =
    insightsData?.analytics_data?.traffic_sources?.channels ?? [];
  const navigationContextEntries =
    insightsData?.analytics_data?.navigation_context ?? [];
  const socialPlatforms = audienceData?.social_platform_breakdown ?? [];
  const fetchDestBreakdown = audienceData?.fetch_dest_breakdown;
  const utmTopSources = dashboardData?.summary?.utm_top_sources;
  const socialIab = dashboardData?.summary?.social_iab;

  const hasChannels = channels.length > 0;
  const hasSocial = socialPlatforms.length > 0;
  const hasUtm = (utmTopSources?.length ?? 0) > 0;
  // Mirrors DashboardChartSection's `hasSocial` flag: render the card either
  // when there is IAB traffic or to show the phase-availability disclaimer.
  const hasSocialIab =
    !!socialIab &&
    (socialIab.total > 0 || !socialIab.navigation_context_available);
  const hasCampaigns = hasUtm || hasSocialIab;
  const hasNavigationContext = navigationContextEntries.length > 0;
  const hasFetchDest = !!fetchDestBreakdown;
  // "Contexto" bundles navigation-context, fetch-dest and per-channel
  // engagement — the same three engineering-flavoured datasets that used to
  // live together in the "Detalhes técnicos" accordion before sub-tabs came
  // back; only the wrapper changed from a collapsed accordion to a sub-tab.
  const hasContext = hasNavigationContext || hasFetchDest || hasChannels;

  const hasData = hasChannels || hasSocial || hasCampaigns || hasContext;
  const loading = insightsLoading || audienceLoading;
  const error = insightsError || audienceError;

  /** Refetches every data source backing this tab. */
  const handleRefresh = () => {
    refreshInsights();
    refreshAudience();
    refreshDashboard();
  };

  const subTabs = [
    {
      label: t("origin.subtabs.channelsAndSocial"),
      icon: <Radio {...ICON_SM} />,
      disabled: !hasChannels && !hasSocial,
    },
    {
      label: t("origin.subtabs.campaigns"),
      icon: <Megaphone {...ICON_SM} />,
      disabled: !hasCampaigns,
    },
    {
      label: t("origin.sections.technicalDetails"),
      icon: <Wrench {...ICON_SM} />,
      disabled: !hasContext,
    },
  ];

  // The index comes from the URL, so it can point at a sub-tab whose dataset is
  // empty (deep link, or a filter that emptied it). Without this, that sub-tab
  // renders disabled *and* selected, and its panel renders nothing at all.
  const visibleSubTab = resolveEnabledSubTab(activeSubTab, subTabs);

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={hasData}
        skeleton={<OriginSkeleton />}
        onRetry={handleRefresh}
        loadingMessage={t("origin.loading")}
        emptyMessage={t("origin.empty")}
        minHeight={300}
      >
        <AnalyticsSubTabs
          value={visibleSubTab}
          onChange={handleSubTabChange}
          ariaLabel={t("tabs.origin")}
          tabs={subTabs}
        >
          {/* Sub-tab 0: Canais e redes — the per-platform social breakdown is
              the natural zoom of the `social` channel, not a separate
              question, so both live on one screen. */}
          {visibleSubTab === 0 && (hasChannels || hasSocial) ? (
            <Stack spacing={3}>
              {hasChannels ? <ChannelsBreakdown channels={channels} /> : null}
              {hasSocial ? (
                <SocialPlatformSection platforms={socialPlatforms} />
              ) : null}
            </Stack>
          ) : null}

          {/* Sub-tab 1: Campanhas (UTM) — relocated from the dashboard's
              acquisition section */}
          {visibleSubTab === 1 && hasCampaigns ? (
            <Box sx={twoColGridSx(hasUtm && hasSocialIab)}>
              {hasUtm ? <UtmSourceCard data={utmTopSources} /> : null}
              {hasSocialIab ? <SocialAppCard data={socialIab} /> : null}
            </Box>
          ) : null}

          {/* Sub-tab 2: Detalhes técnicos — engineering-only data: navigation
              context, request type and per-channel engagement all describe
              *how* traffic arrived, not *how much*, which sub-tab 0 already
              answers. Same name and icon as Público's last sub-tab, so the
              pattern is recognisable across tabs. */}
          {visibleSubTab === 2 && hasContext ? (
            <Stack spacing={3}>
              {hasNavigationContext || hasFetchDest ? (
                <Box sx={twoColGridSx(hasNavigationContext && hasFetchDest)}>
                  {hasNavigationContext ? (
                    <BehaviorSection
                      navigationContext={navigationContextEntries}
                    />
                  ) : null}
                  {hasFetchDest ? (
                    <FetchDestChart fetchDestBreakdown={fetchDestBreakdown!} />
                  ) : null}
                </Box>
              ) : null}

              {hasChannels ? (
                <ChannelEngagementChart channels={channels} />
              ) : null}
            </Stack>
          ) : null}
        </AnalyticsSubTabs>
      </AnalyticsStateManager>
    </Box>
  );
}

export default OriginAnalysis;
