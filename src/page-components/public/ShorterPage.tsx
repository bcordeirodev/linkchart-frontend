"use client";
import { Alert, Box, Container, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { memo, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { AdSlot } from "@/shared/components/ads/AdSlot";
import { URLShortenerForm } from "@/features/links/components/URLShortenerForm";
import {
  ShorterHero,
  ShorterStats,
  ShorterHowItWorks,
  ShorterSubdomainPromo,
  ShorterFaq,
} from "@/features/shorter/components";
import {
  SHORTER_CONTENT_MAX_WIDTH,
  SHORTER_PAGE_CONTAINER_MAX_WIDTH,
} from "@/features/shorter/constants";
import { useShorter } from "@/features/shorter/hooks/useShorter";
import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";
import { PublicAnalyticsSections } from "@/features/public-analytics";
import { PublicLayout } from "@/shared/layout";
import { ShorterSkeleton } from "@/shared/ui/feedback/skeletons/ShorterSkeleton";
import { PublicBlobBackground } from "@/shared/ui/PublicBlobBackground";

import { BenefitBadges } from "./BenefitBadges";

function ShorterPageContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const analyticsSlug = searchParams.get("slug")?.trim() || null;
  const previousAnalyticsSlugRef = useRef<string | null>(analyticsSlug);
  const isDark = theme.palette.mode === "dark";

  const {
    isRedirecting,
    error,
    formKey,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
  } = useShorter();

  const showAnalytics = Boolean(analyticsSlug);
  const showLanding = !showAnalytics;

  useEffect(() => {
    const previousSlug = previousAnalyticsSlugRef.current;
    const returnedFromAnalytics = Boolean(previousSlug) && !analyticsSlug;

    if (returnedFromAnalytics) {
      handleReset();
    }

    previousAnalyticsSlugRef.current = analyticsSlug;
  }, [analyticsSlug, handleReset]);

  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <PublicBlobBackground />
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        <Container
          maxWidth={SHORTER_PAGE_CONTAINER_MAX_WIDTH}
          sx={{
            position: "relative",
            zIndex: 1,
            pt: { xs: 7, md: 8 },
            pb: { xs: 6, md: 8 },
          }}
        >
          {showAnalytics && analyticsSlug ? (
            <PublicAnalyticsSections
              slug={analyticsSlug}
              showPageHeading={false}
            />
          ) : null}

          {showLanding ? (
            <>
              <ShorterHero state={isRedirecting ? "success" : "idle"} />

              {error ? (
                <Alert
                  severity="error"
                  onClose={clearError}
                  sx={{
                    mb: 2,
                    ...getPublicInsetSx(theme),
                    maxWidth: SHORTER_CONTENT_MAX_WIDTH,
                    mx: "auto",
                    borderColor: alpha(
                      theme.palette.error.main,
                      isDark ? 0.42 : 0.35,
                    ),
                    bgcolor: alpha(
                      theme.palette.error.main,
                      isDark ? 0.14 : 0.08,
                    ),
                    color: theme.palette.text.primary,
                    "& .MuiAlert-icon": {
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  {error}
                </Alert>
              ) : null}

              <URLShortenerForm
                key={formKey}
                onSuccess={handleSuccess}
                onError={handleError}
                loading={isRedirecting}
              />

              <Box
                sx={{
                  maxWidth: SHORTER_CONTENT_MAX_WIDTH,
                  mx: "auto",
                }}
              >
                <AdSlot
                  slot={
                    process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM ??
                    ""
                  }
                  format="rectangle"
                />
              </Box>

              <BenefitBadges
                state={isRedirecting ? "success" : "idle"}
                onReset={handleReset}
              />

              {!isRedirecting ? <ShorterSubdomainPromo /> : null}

              <Box
                sx={{
                  mt: { xs: 6, md: 7 },
                  maxWidth: SHORTER_CONTENT_MAX_WIDTH,
                  mx: "auto",
                }}
              >
                <ShorterStats />
              </Box>

              <Box
                sx={{
                  maxWidth: SHORTER_CONTENT_MAX_WIDTH,
                  mx: "auto",
                }}
              >
                <AdSlot
                  slot={
                    process.env
                      .NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BETWEEN_SECTIONS ?? ""
                  }
                  format="auto"
                />
              </Box>

              {!isRedirecting ? <ShorterHowItWorks /> : null}

              {!isRedirecting ? <ShorterFaq /> : null}
            </>
          ) : null}
        </Container>
      </Box>
    </PublicLayout>
  );
}

function ShorterPage() {
  return (
    <Suspense fallback={<ShorterSkeleton />}>
      <ShorterPageContent />
    </Suspense>
  );
}

export default memo(ShorterPage);
