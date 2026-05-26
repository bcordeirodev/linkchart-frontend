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

import { BenefitBadges } from "./BenefitBadges";

const blobKeyframes = `
  @keyframes floatA {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(30px,-20px) scale(1.06); }
    66% { transform: translate(-20px,15px) scale(0.96); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0,0) scale(1); }
    40% { transform: translate(-25px,20px) scale(1.04); }
    70% { transform: translate(18px,-15px) scale(0.97); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(20px,-25px) scale(1.05); }
  }
`;

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
      <style>{blobKeyframes}</style>
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: `radial-gradient(circle at 20% 18%, ${alpha(theme.palette.primary.main, isDark ? 0.16 : 0.1)} 0%, transparent 55%),
                         radial-gradient(circle at 78% 86%, ${alpha(theme.palette.secondary.main, isDark ? 0.12 : 0.08)} 0%, transparent 52%)`,
          }}
        />
        <Box
          sx={{
            position: "fixed",
            top: "-10%",
            right: "-5%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.13)} 0%, transparent 60%)`,
            animation: "floatA 12s ease-in-out infinite",
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        />
        <Box
          sx={{
            position: "fixed",
            bottom: "-15%",
            left: "-8%",
            width: 440,
            height: 440,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isDark ? 0.14 : 0.1)} 0%, transparent 60%)`,
            animation: "floatB 16s ease-in-out infinite",
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        />
        <Box
          sx={{
            position: "fixed",
            top: "45%",
            right: "-4%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background: `radial-gradient(circle, ${alpha(theme.palette.success.main, isDark ? 0.12 : 0.08)} 0%, transparent 60%)`,
            animation: "floatC 20s ease-in-out infinite",
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        />

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

              <AdSlot
                slot={
                  process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM ?? ""
                }
                format="rectangle"
              />

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

              <AdSlot
                slot={
                  process.env
                    .NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BETWEEN_SECTIONS ?? ""
                }
                format="auto"
              />

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
    <Suspense fallback={null}>
      <ShorterPageContent />
    </Suspense>
  );
}

export default memo(ShorterPage);
