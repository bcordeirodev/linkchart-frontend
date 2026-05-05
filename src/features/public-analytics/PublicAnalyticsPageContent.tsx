"use client";

import { Box, Container, Fade, Stack } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import {
  LinkHeroCard,
  PublicMetrics,
  PublicCharts,
  PublicCtaBlock,
  ErrorState,
  usePublicAnalytics,
} from "@/features/public-analytics";
import { PublicLayout } from "@/shared/layout";
import { PublicAnalyticsSkeleton } from "@/shared/ui/feedback/skeletons";

interface PublicAnalyticsPageContentProps {
  slug: string;
}

function PublicAnalyticsPageContent({ slug }: PublicAnalyticsPageContentProps) {
  const { t } = useTranslation("public");
  const {
    linkData,
    analyticsData,
    loading,
    error,
    debugInfo,
    handleCreateLink,
  } = usePublicAnalytics({ slug });

  if (loading) {
    return <PublicAnalyticsSkeleton />;
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

  return (
    <PublicLayout variant="shorter" showHeader showFooter>
      <Box
        sx={{ position: "relative", minHeight: "100vh", background: "#080812" }}
      >
        <Box
          sx={{
            position: "fixed",
            top: "-10%",
            right: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 60%)",
          }}
        />

        <Container
          maxWidth="md"
          sx={{ position: "relative", zIndex: 1, py: { xs: 4, md: 6 }, pb: 8 }}
        >
          <Stack spacing={2.5}>
            <Fade in timeout={400}>
              <Box>
                <LinkHeroCard
                  linkData={linkData}
                  onCreateLink={handleCreateLink}
                />
              </Box>
            </Fade>

            <Fade in timeout={600}>
              <Box>
                <PublicMetrics analyticsData={analyticsData} />
              </Box>
            </Fade>

            <Fade in timeout={800}>
              <Box>
                <PublicCharts analyticsData={analyticsData} />
              </Box>
            </Fade>

            <Fade in timeout={1000}>
              <Box>
                <PublicCtaBlock />
              </Box>
            </Fade>
          </Stack>
        </Container>
      </Box>
    </PublicLayout>
  );
}

export default memo(PublicAnalyticsPageContent);
export { PublicAnalyticsPageContent };
