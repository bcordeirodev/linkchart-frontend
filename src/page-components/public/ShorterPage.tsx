"use client";
import { Alert, Box, Container } from "@mui/material";
import { memo, Suspense } from "react";
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
`;

function ShorterPageContent() {
  const searchParams = useSearchParams();
  const analyticsSlug = searchParams.get("slug")?.trim() || null;

  const {
    isRedirecting,
    error,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
  } = useShorter();

  const showAnalytics = Boolean(analyticsSlug);
  const showLanding = !showAnalytics;

  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <style>{blobKeyframes}</style>
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
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
            background:
              "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)",
            animation: "floatA 12s ease-in-out infinite",
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
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 60%)",
            animation: "floatB 16s ease-in-out infinite",
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
                    maxWidth: SHORTER_CONTENT_MAX_WIDTH,
                    mx: "auto",
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              ) : null}

              <URLShortenerForm
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
