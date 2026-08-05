"use client";

import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { getPublicDisplaySx } from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";

import { AdSlot } from "@/shared/components/ads/AdSlot";
import {
  LinkHeroCard,
  PublicMetrics,
  PublicCharts,
  PublicCtaBlock,
  ErrorState,
  usePublicAnalytics,
} from "@/features/public-analytics";
import { LockedFeaturesTeaser } from "@/features/public-analytics/components/teaser/LockedFeaturesTeaser";
import { PublicLayout } from "@/shared/layout";
import { PublicAnalyticsSkeleton } from "@/shared/ui/feedback/skeletons";
import { PublicBlobBackground } from "@/shared/ui/PublicBlobBackground";

import type { PublicLinkData, PublicAnalyticsData } from "./types";

interface PublicAnalyticsPageContentProps {
  slug: string;
  /** Server-prefetched payloads (from the RSC page) to seed React Query and
   *  avoid a client refetch on first paint. */
  initialLinkData?: PublicLinkData | null;
  initialAnalyticsData?: PublicAnalyticsData | null;
}

/**
 * Standalone `/public-analytics/[slug]` page body.
 *
 * Entrance motion is the app's single orchestrated page load: the CSS-only
 * `reveal`/`reveal-N` classes from `styles/animations.css`, which already opt
 * out under `prefers-reduced-motion`. It replaced a stack of MUI `<Fade>`
 * wrappers with hand-passed timeouts — same effect, one mechanism, and the
 * same one every logged-in page uses. The ad slots are deliberately left out
 * of the sequence: nothing this page owns should animate a third-party frame.
 */
function PublicAnalyticsPageContent({
  slug,
  initialLinkData,
  initialAnalyticsData,
}: PublicAnalyticsPageContentProps) {
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
  } = usePublicAnalytics({ slug, initialLinkData, initialAnalyticsData });

  if (loading) {
    return <PublicAnalyticsSkeleton />;
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
    <PublicLayout variant="shorter" chrome="minimal">
      <PublicBlobBackground />
      <Box sx={{ position: "relative", minHeight: "100dvh" }}>
        <Container
          maxWidth={false}
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1080,
            mx: "auto",
            pt: { xs: 7, md: 8 },
            pb: { xs: 6, md: 8 },
          }}
        >
          <Stack spacing={{ xs: 2.5, md: 3 }}>
            <Box
              className="reveal reveal-1"
              sx={{ textAlign: "center", mt: { xs: 1, md: 2 }, mb: 0.5 }}
            >
              {/* `variant="h1"` is load-bearing: `component` alone only swaps
                  the DOM tag and leaves MUI's default `body1` (Inter) on the
                  page's most important heading. Same pairing as `ShorterHero`. */}
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

            <Box className="reveal reveal-2">
              <LinkHeroCard
                linkData={linkData}
                onCreateLink={handleCreateLink}
              />
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
                  process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_ABOVE_CHARTS ??
                  ""
                }
                format="auto"
              />
            ) : null}

            <Box className="reveal reveal-4">
              <PublicCharts
                analyticsData={analyticsData}
                shortUrl={getShortUrl(linkData.short_url)}
              />
            </Box>

            {hasClicks ? (
              <AdSlot
                slot={
                  process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_BELOW_CHARTS ??
                  ""
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
        </Container>
      </Box>
    </PublicLayout>
  );
}

export default memo(PublicAnalyticsPageContent);
export { PublicAnalyticsPageContent };
