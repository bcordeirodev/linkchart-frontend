"use client";

import { Box, Fade, Stack, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";
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
 */
function PublicAnalyticsSections({
  slug,
  showPageHeading = true,
}: PublicAnalyticsSectionsProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const reduced = usePrefersReducedMotion();
  const {
    linkData,
    analyticsData,
    loading,
    error,
    debugInfo,
    handleCreateLink,
  } = usePublicAnalytics({ slug });

  /**
   * Returns 0 when the user has requested reduced motion so all Fade elements
   * appear immediately; otherwise returns the given staggered timeout in ms.
   */
  const fadeTimeout = (ms: number): number => (reduced ? 0 : ms);

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
      />
    );
  }

  const hasClicks = analyticsData.total_clicks >= 1;

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      {showPageHeading ? (
        <Fade in timeout={fadeTimeout(120)}>
          <Box sx={{ textAlign: "center", mt: { xs: 1, md: 2 }, mb: 0.5 }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.875rem", md: "2.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: theme.palette.text.primary,
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
        </Fade>
      ) : null}

      <Fade in timeout={fadeTimeout(240)}>
        <Box>
          <LinkHeroCard linkData={linkData} onCreateLink={handleCreateLink} />
        </Box>
      </Fade>

      {hasClicks ? (
        <Fade in timeout={fadeTimeout(360)}>
          <Box>
            <PublicMetrics analyticsData={analyticsData} />
          </Box>
        </Fade>
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

      <Fade in timeout={fadeTimeout(480)}>
        <Box>
          <PublicCharts
            analyticsData={analyticsData}
            shortUrl={linkData.short_url}
          />
        </Box>
      </Fade>

      {hasClicks ? (
        <AdSlot
          slot={
            process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_BELOW_CHARTS ?? ""
          }
          format="auto"
        />
      ) : null}

      <Fade in timeout={fadeTimeout(480)}>
        <Box>
          <LockedFeaturesTeaser />
        </Box>
      </Fade>

      <Fade in timeout={fadeTimeout(600)}>
        <Box>
          <PublicCtaBlock />
        </Box>
      </Fade>
    </Stack>
  );
}

export default memo(PublicAnalyticsSections);
export { PublicAnalyticsSections };
