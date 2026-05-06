import { Alert, Box, Container } from "@mui/material";
import { memo } from "react";

import { AdSlot } from "@/shared/components/ads/AdSlot";
import { URLShortenerForm } from "@/features/links/components/URLShortenerForm";
import { ShorterHero, ShorterStats } from "@/features/shorter/components";
import { useShorter } from "@/features/shorter/hooks";
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

function ShorterPage() {
  const {
    isRedirecting,
    error,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
  } = useShorter();

  return (
    <PublicLayout variant="shorter" showHeader showFooter>
      <style>{blobKeyframes}</style>
      <Box
        sx={{ position: "relative", minHeight: "100vh", background: "#080812" }}
      >
        {/* top-right blob */}
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
        {/* bottom-left blob */}
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
          maxWidth="md"
          sx={{ position: "relative", zIndex: 1, pb: 8 }}
        >
          <ShorterHero state={isRedirecting ? "success" : "idle"} />

          {error ? (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{ mb: 2, maxWidth: 640, mx: "auto", borderRadius: 2 }}
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
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM ?? ''}
            format="rectangle"
          />

          <BenefitBadges
            state={isRedirecting ? "success" : "idle"}
            onReset={handleReset}
          />

          <Box sx={{ mt: 6 }}>
            <ShorterStats />
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}

export default memo(ShorterPage);
