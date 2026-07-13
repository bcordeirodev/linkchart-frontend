"use client";
import { Box, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import { useDashboardData } from "@/features/analytics/hooks/useDashboardData";
import { useInsightsData } from "@/features/analytics/hooks/useInsightsData";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";

import { BehaviorSection } from "../audience/BehaviorSection";
import { FetchDestChart } from "../audience/FetchDestChart";
import { SocialPlatformSection } from "../audience/SocialPlatformSection";
import { UtmSourceCard, SocialAppCard } from "../dashboard/cards";
import { TrafficSourceChart } from "../insights/TrafficSourceChart";

/** Grid used for the two-card rows (Campanhas, Contexto de navegação). */
function twoColGridSx(twoColumns: boolean) {
  return {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: twoColumns ? "1fr 1fr" : "1fr" },
    gap: { xs: 2, md: 3 },
  } as const;
}

/**
 * Loading skeleton that mirrors the Origin tab layout: channels chart block
 * (KPI row + wide chart) → social platforms block → campaigns two-card row →
 * navigation-context two-card row.
 */
function OriginSkeleton() {
  return (
    <Stack spacing={4}>
      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: 2,
            mb: 2,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              animation="wave"
              height={110}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={280}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        animation="wave"
        height={220}
        sx={{ borderRadius: 2 }}
      />

      <Box sx={twoColGridSx(true)}>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={200}
          sx={{ borderRadius: 2 }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          height={200}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      <Box sx={twoColGridSx(true)}>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={220}
          sx={{ borderRadius: 2 }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          height={220}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Stack>
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
}

/**
 * "Origem" tab — answers "where does the traffic come from?" in stacked,
 * scrollable sections (not sub-tabs): Canais → Redes sociais → Campanhas
 * (UTM) → Contexto de navegação.
 *
 * Combines three data sources:
 * - {@link useInsightsData} for `analytics_data.traffic_sources` (channels)
 *   and the top-level `analytics_data.navigation_context` block.
 * - {@link useAudienceData} for `social_platform_breakdown` and
 *   `fetch_dest_breakdown`.
 * - {@link useDashboardData} for `summary.utm_top_sources` and
 *   `summary.social_iab`, which `UtmSourceCard`/`SocialAppCard` still only
 *   accept in this shape (they are relocated here from the dashboard's
 *   "acquisition" section, which keeps rendering them too until the
 *   duplicate is removed in a later task).
 *
 * Every child component owns its own title + description, so this
 * orchestrator adds no redundant section headers — each block is
 * self-explanatory, matching the pattern already used by `GeographicAnalysis`.
 *
 * Loading/error gate on the two required sources (insights + audience); the
 * campaigns row is a progressive enhancement that appears once the
 * dashboard fetch resolves, exactly like `UtmSourceCard`/`SocialAppCard`
 * already behave inside the dashboard's acquisition section (they render
 * `null` until their data is ready).
 */
export function OriginAnalysis({
  linkId,
  dateFrom,
  dateTo,
  excludeBots,
}: OriginAnalysisProps) {
  const { t } = useTranslation("analytics");

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

  const trafficSources = insightsData?.analytics_data?.traffic_sources;
  const navigationContextEntries =
    insightsData?.analytics_data?.navigation_context ?? [];
  const socialPlatforms = audienceData?.social_platform_breakdown ?? [];
  const fetchDestBreakdown = audienceData?.fetch_dest_breakdown;
  const utmTopSources = dashboardData?.summary?.utm_top_sources;
  const socialIab = dashboardData?.summary?.social_iab;

  const hasChannels = (trafficSources?.sources?.length ?? 0) > 0;
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
  const hasNavigationSection = hasNavigationContext || hasFetchDest;

  const hasData =
    hasChannels || hasSocial || hasCampaigns || hasNavigationSection;
  const loading = insightsLoading || audienceLoading;
  const error = insightsError || audienceError;

  /** Refetches every data source backing this tab. */
  const handleRefresh = () => {
    refreshInsights();
    refreshAudience();
    refreshDashboard();
  };

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
        <Stack spacing={4} sx={{ "& > *": { minWidth: 0 } }}>
          {/* 1. Canais — already orchestrates channels + individual sources */}
          {hasChannels ? <TrafficSourceChart data={trafficSources!} /> : null}

          {/* 2. Redes sociais */}
          {hasSocial ? (
            <SocialPlatformSection platforms={socialPlatforms} />
          ) : null}

          {/* 3. Campanhas (UTM) — relocated from the dashboard's acquisition section */}
          {hasCampaigns ? (
            <Box sx={twoColGridSx(hasUtm && hasSocialIab)}>
              {hasUtm ? <UtmSourceCard data={utmTopSources} /> : null}
              {hasSocialIab ? <SocialAppCard data={socialIab} /> : null}
            </Box>
          ) : null}

          {/* 4. Contexto de navegação */}
          {hasNavigationSection ? (
            <Box sx={twoColGridSx(hasNavigationContext && hasFetchDest)}>
              {hasNavigationContext ? (
                <BehaviorSection navigationContext={navigationContextEntries} />
              ) : null}
              {hasFetchDest ? (
                <FetchDestChart fetchDestBreakdown={fetchDestBreakdown!} />
              ) : null}
            </Box>
          ) : null}
        </Stack>
      </AnalyticsStateManager>
    </Box>
  );
}

export default OriginAnalysis;
