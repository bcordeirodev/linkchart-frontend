"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { getPublicDisplaySx } from "@/lib/theme/publicPageStyles";
import { AdSlot } from "@/shared/components/ads/AdSlot";
import { PublicAnalyticsSkeleton } from "@/shared/ui/feedback/skeletons";

import { PublicCharts } from "./components/charts/PublicCharts";
import { LinkHeroCard } from "./components/info/LinkHeroCard";
import { PublicCtaBlock } from "./components/info/PublicCtaBlock";
import { LockedFeaturesTeaser } from "./components/teaser/LockedFeaturesTeaser";
import { PublicMetrics } from "./components/metrics/PublicMetrics";
import { ErrorState } from "./components/states/ErrorState";
import { usePublicAnalytics } from "./hooks/usePublicAnalytics";

interface PublicAnalyticsSectionsProps {
  slug: string;
  /** When false, hides the page title block (e.g. embedded in /shorter). */
  showPageHeading?: boolean;
}

/**
 * Analytics body without `PublicLayout` — for embedding in /shorter?slug=….
 *
 * Mirrors `PublicAnalyticsPageContent` section for section, including the
 * CSS-only `reveal`/`reveal-N` page-load sequence.
 */
function PublicAnalyticsSections({
  slug,
  showPageHeading = true,
}: PublicAnalyticsSectionsProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const {
    linkData,
    analyticsData,
    loading,
    error,
    debugInfo,
    handleCreateLink,
    handleRetry,
  } = usePublicAnalytics({ slug });

  if (loading) {
    return (
      <PublicAnalyticsSkeleton embedded showPageHeading={showPageHeading} />
    );
  }

  if (error || !linkData || !analyticsData) {
    return (
      <ErrorState
        error={error || t("publicAnalytics.error.loadFailed")}
        debugInfo={debugInfo}
        onCreateLink={handleCreateLink}
        onRetry={handleRetry}
      />
    );
  }

  const hasClicks = analyticsData.total_clicks >= 1;

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      {showPageHeading ? (
        <Box
          className="reveal reveal-1"
          sx={{ textAlign: "center", mt: { xs: 1, md: 2 }, mb: 0.5 }}
        >
          {/* `variant="h1"` alongside `component="h1"` — see the note in
              `PublicAnalyticsPageContent`. */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              ...getPublicDisplaySx(theme),
              mb: 0.75,
            }}
          >
            {t("publicAnalytics.title")}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
              maxWidth: 460,
              mx: "auto",
            }}
          >
            {t("publicAnalytics.pageSubtitle")}
          </Typography>
        </Box>
      ) : null}

      <Box className="reveal reveal-2">
        <LinkHeroCard linkData={linkData} onCreateLink={handleCreateLink} />
      </Box>

      {hasClicks ? (
        <Box className="reveal reveal-3">
          <PublicMetrics analyticsData={analyticsData} />
        </Box>
      ) : null}

      {/* Only show ads on pages that have analytics data — avoids
          "screens without publisher-content" AdSense policy violation
          on zero-click links where the page is essentially empty. */}
      {hasClicks ? (
        <AdSlot
          slot={
            process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_ABOVE_CHARTS ?? ""
          }
          format="auto"
        />
      ) : null}

      <Box className="reveal reveal-4">
        <PublicCharts
          analyticsData={analyticsData}
          shortUrl={linkData.short_url}
        />
      </Box>

      {hasClicks ? (
        <AdSlot
          slot={
            process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_BELOW_CHARTS ?? ""
          }
          format="auto"
        />
      ) : null}

      <Box className="reveal reveal-5">
        <LockedFeaturesTeaser />
      </Box>

      <Box className="reveal reveal-5">
        <PublicCtaBlock />
      </Box>
    </Stack>
  );
}

export default memo(PublicAnalyticsSections);
export { PublicAnalyticsSections };
