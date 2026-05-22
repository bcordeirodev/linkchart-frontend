import { Box, Container, Skeleton, Stack } from "@mui/material";

import {
  SHORTER_CONTENT_MAX_WIDTH,
  SHORTER_PAGE_CONTAINER_MAX_WIDTH,
} from "@/features/shorter/constants";
import { PublicLayout } from "@/shared/layout";

import { LinkFormSkeleton } from "./LinkFormSkeleton";

export function ShorterSkeleton() {
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
            mb: { xs: 4, md: 5 },
            mt: { xs: 1, md: 2 },
          }}
        >
          <Skeleton
            variant="text"
            width={320}
            height={56}
            sx={{ mx: "auto", mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={320}
            height={26}
            sx={{ mx: "auto" }}
          />
          <Skeleton
            variant="text"
            width={260}
            height={26}
            sx={{ mx: "auto" }}
          />
        </Box>

        {/* URLShortenerForm */}
        <LinkFormSkeleton />

        {/* BenefitBadges idle state — SignUpCtaCard */}
        <Box sx={{ mt: 2.5, maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "12px",
              p: 3,
            }}
          >
            <Skeleton variant="text" width={220} height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2.5 }}>
              {[100, 120, 90, 110, 130, 95, 115].map((w, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={w}
                  height={28}
                  sx={{ borderRadius: "8px" }}
                />
              ))}
            </Stack>
            <Skeleton
              variant="rounded"
              width={160}
              height={40}
              sx={{ borderRadius: "8px" }}
            />
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
                  textAlign: "center",
                  px: 2.5,
                  py: 3,
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
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
