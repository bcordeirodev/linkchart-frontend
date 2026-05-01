"use client";
import { Box, Container, Fade, Stack, Typography } from "@mui/material";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";

import {
  LinkInfoCard,
  PublicMetrics,
  PublicCharts,
  PublicAnalyticsCtaStrip,
  SaveAnalyticsUrlBanner,
  ErrorState,
  usePublicAnalytics,
} from "@/features/public-analytics";
import { PublicLayout } from "@/shared/layout";
import { PublicAnalyticsSkeleton } from "@/shared/ui/feedback/skeletons";

function PublicAnalyticsPage() {
  const { t } = useTranslation("public");
  const { slug } = useParams<{ slug: string }>();
  const {
    linkData,
    analyticsData,
    loading,
    error,
    debugInfo,
    handleCopyLink,
    handleCreateLink,
    handleVisitLink,
  } = usePublicAnalytics({ slug });

  const actions = useMemo(
    () => ({ handleCopyLink, handleCreateLink, handleVisitLink }),
    [handleCopyLink, handleCreateLink, handleVisitLink],
  );

  if (loading) {
    return <PublicAnalyticsSkeleton />;
  }

  if (error || !linkData || !analyticsData) {
    return (
      <ErrorState
        error={error || "Link nao encontrado"}
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
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {t("publicAnalytics.title")}
              </Typography>
            </Fade>

            <Fade in timeout={600}>
              <Box>
                <LinkInfoCard linkData={linkData} actions={actions} />
              </Box>
            </Fade>

            <Fade in timeout={800}>
              <Box>
                <SaveAnalyticsUrlBanner />
              </Box>
            </Fade>

            <Fade in timeout={900}>
              <Box>
                <PublicMetrics analyticsData={analyticsData} />
              </Box>
            </Fade>

            <Fade in timeout={1100}>
              <Box>
                <PublicCharts analyticsData={analyticsData} />
              </Box>
            </Fade>

            <Fade in timeout={1300}>
              <Box>
                <PublicAnalyticsCtaStrip />
              </Box>
            </Fade>
          </Stack>
        </Container>
      </Box>
    </PublicLayout>
  );
}

export default memo(PublicAnalyticsPage);
