"use client";
import { Box, Container, Skeleton, useTheme } from "@mui/material";

import { SHORTER_PAGE_CONTAINER_MAX_WIDTH } from "@/features/shorter/constants";
import { radiusTokens } from "@/lib/theme/designSystem";
import {
  getPublicElevatedSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";
import { getCardSurfaceSx } from "@/shared/ui/base";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";

export function ShorterSkeleton() {
  const theme = useTheme();

  /**
   * Same hairline + translucent veil the real form and CTA cards now use, so
   * the fallback does not flash a different surface (previously the focal
   * gradient wash) before the page resolves.
   */
  const cardShellSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${publicHairline(theme)}`,
    ...getCardSurfaceSx(theme),
  };

  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <Container
        maxWidth={SHORTER_PAGE_CONTAINER_MAX_WIDTH}
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 7, md: 8 },
          pb: { xs: 6, md: 8 },
        }}
      >
        {/* ShorterHero */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 3.5, md: 4.5 },
            mt: { xs: 1, md: 2 },
          }}
        >
          <Skeleton
            variant="text"
            width={320}
            height={52}
            sx={{ mx: "auto", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={420}
            height={22}
            sx={{ mx: "auto", maxWidth: "90%" }}
          />
          <Skeleton
            variant="text"
            width={300}
            height={22}
            sx={{ mx: "auto", maxWidth: "70%" }}
          />
        </Box>

        {/* URLShortenerForm — mirrors the real card: bare title + value line,
            the 52px destination row with the action beside it, then the
            short-link group under its micro-label. */}
        <Box sx={{ maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}>
          <Box sx={{ ...cardShellSx, p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Skeleton variant="text" width={170} height={26} />
            <Skeleton
              variant="text"
              width="68%"
              height={18}
              sx={{ mb: 2.25 }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { sm: "center" },
                gap: { xs: 1.25, sm: 1.5 },
              }}
            >
              <Skeleton
                variant="rounded"
                height={52}
                sx={{ flexGrow: 1, borderRadius: `${radiusTokens.md}px` }}
              />
              <Skeleton
                variant="rounded"
                height={52}
                sx={{
                  flexShrink: 0,
                  width: { xs: "100%", sm: 168 },
                  borderRadius: `${radiusTokens.md}px`,
                }}
              />
            </Box>

            <Box sx={{ mt: { xs: 1.75, sm: 2 } }}>
              <Skeleton
                variant="text"
                width={150}
                height={14}
                sx={{ mb: 0.5 }}
              />
              <Skeleton
                variant="rounded"
                height={44}
                sx={{ borderRadius: `${radiusTokens.md}px` }}
              />
            </Box>
          </Box>
        </Box>

        {/* BenefitBadges idle state — SignUpCtaCard: title + description, then
            the two-column list of checked features. */}
        <Box sx={{ mt: 2.5, maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}>
          <Box sx={{ ...cardShellSx, p: { xs: "20px", md: "22px 26px" } }}>
            <Skeleton variant="text" width={220} height={26} sx={{ mb: 0.5 }} />
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              sx={{ mb: 2.25 }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                columnGap: { sm: 3 },
                rowGap: 0.875,
                borderTop: "1px solid",
                borderColor: "divider",
                pt: 1.75,
              }}
            >
              {[62, 58, 70, 66, 74, 68, 72, 64].map((w, i) => (
                <Skeleton key={i} variant="text" width={`${w}%`} height={20} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* ShorterStats — label + xs "1fr 1fr", md "repeat(4, 1fr)" grid */}
        <Box
          sx={{
            mt: { xs: 6, md: 7 },
            maxWidth: SHORTER_CONTENT_MAX_WIDTH,
            mx: "auto",
          }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={18}
            sx={{ mx: "auto", mb: { xs: 3, md: 3.5 } }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 3, md: 0 },
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{ textAlign: "center", px: { xs: 1, md: 2 }, py: 0.5 }}
              >
                <Skeleton
                  variant="text"
                  width={80}
                  height={40}
                  sx={{ mx: "auto" }}
                />
                <Skeleton
                  variant="text"
                  width={90}
                  height={16}
                  sx={{ mx: "auto", mt: 0.75 }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* How it works — label + 3-column step cards */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            mb: 2,
            maxWidth: SHORTER_CONTENT_MAX_WIDTH,
            mx: "auto",
          }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={18}
            sx={{ mx: "auto", mb: 3 }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  // Mesma superfície do card real (`ShorterHowItWorks`): o
                  // hairline/veil hardcoded que existia aqui não acompanhava
                  // os tokens e lia invisível no dark.
                  ...getPublicElevatedSx(theme),
                  textAlign: "center",
                  px: 2.5,
                  py: 3,
                }}
              >
                <Skeleton
                  variant="circular"
                  width={22}
                  height={22}
                  sx={{ mx: "auto", mb: 1.25 }}
                />
                <Skeleton
                  variant="text"
                  width={30}
                  height={14}
                  sx={{ mx: "auto" }}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={20}
                  sx={{ mx: "auto", mt: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width={140}
                  height={14}
                  sx={{ mx: "auto", mt: 0.75 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </PublicLayout>
  );
}

export default ShorterSkeleton;
