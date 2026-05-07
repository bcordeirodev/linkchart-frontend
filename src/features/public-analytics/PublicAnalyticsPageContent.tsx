"use client";

import {
  Box,
  Container,
  Fade,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { AdSlot } from "@/shared/components/ads/AdSlot";
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
  const theme = useTheme();
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
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
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
          sx={{ position: "relative", zIndex: 1, pb: 8 }}
        >
          <Stack spacing={2.5}>
            <Fade in timeout={200}>
              <Box sx={{ textAlign: "center", mt: { xs: 5, md: 7 }, mb: 1 }}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.15,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    mt: { xs: 3, md: 5 },
                  }}
                >
                  {t("publicAnalytics.title")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9375rem",
                    color: theme.palette.text.secondary,
                    lineHeight: 1.65,
                    maxWidth: 480,
                    mx: "auto",
                  }}
                >
                  {t("publicAnalytics.pageSubtitle")}
                </Typography>
              </Box>
            </Fade>

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

            <AdSlot
              slot={
                process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANALYTICS_ABOVE_CHARTS ??
                ""
              }
              format="leaderboard"
            />

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
