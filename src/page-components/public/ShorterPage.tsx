"use client";
import { Box, Container } from "@mui/material";
import { memo, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { SHORTER_PAGE_CONTAINER_MAX_WIDTH } from "@/features/shorter/constants";
import { useShorter } from "@/features/shorter/hooks/useShorter";
import { PublicLayout } from "@/shared/layout";
import { ShorterSkeleton } from "@/shared/ui/feedback/skeletons/ShorterSkeleton";
import { PublicBlobBackground } from "@/shared/ui/PublicBlobBackground";

import { ShorterLanding } from "./ShorterLanding";
import { ShorterEmbeddedAnalytics } from "./ShorterEmbeddedAnalytics";

/**
 * Inner content for the `/shorter` page — reads the `?slug=` param and
 * decides which branch to render.  Wrapped in `<Suspense>` by the exported
 * default so `useSearchParams` never blocks SSR.
 *
 * Keeps all shared state (`useShorter`) and the analytics-slug tracking
 * effect so neither child component needs to reach outside its own boundary.
 */
function ShorterPageContent() {
  const searchParams = useSearchParams();
  const analyticsSlug = searchParams.get("slug")?.trim() || null;
  const previousAnalyticsSlugRef = useRef<string | null>(analyticsSlug);

  const {
    isRedirecting,
    createdLink,
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
      <Box sx={{ position: "relative", minHeight: "100dvh" }}>
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
            <ShorterEmbeddedAnalytics slug={analyticsSlug} />
          ) : null}

          {showLanding ? (
            <ShorterLanding
              isRedirecting={isRedirecting}
              createdLink={createdLink}
              error={error}
              formKey={formKey}
              onSuccess={handleSuccess}
              onError={handleError}
              onClearError={clearError}
              onReset={handleReset}
            />
          ) : null}
        </Container>
      </Box>
    </PublicLayout>
  );
}

/**
 * Public `/shorter` page component — thin container that renders the URL
 * shortener landing or the embedded analytics depending on the `?slug=`
 * query parameter.
 *
 * Wrapped in `<Suspense>` so the inner `useSearchParams()` call is safe for
 * Next.js 15 SSR (no dynamic rendering waterfall).
 */
function ShorterPage() {
  return (
    <Suspense fallback={<ShorterSkeleton />}>
      <ShorterPageContent />
    </Suspense>
  );
}

export default memo(ShorterPage);
