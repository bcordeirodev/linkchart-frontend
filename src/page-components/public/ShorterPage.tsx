import { Alert, Box, Container } from "@mui/material";
import { memo } from "react";

import { URLShortenerForm } from "@/features/links/components/URLShortenerForm";
import {
  ShorterHero,
  ShorterStats,
  ShorterSuccessState,
} from "@/features/shorter/components";
import { useShorter } from "@/features/shorter/hooks";
import { PublicLayout } from "@/shared/layout";

import { BenefitBadges } from "./BenefitBadges";

function ShorterPage() {
  const {
    isRedirecting,
    result,
    error,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
  } = useShorter();

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
            width: 480,
            height: 480,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)",
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

          {isRedirecting && result ? (
            <ShorterSuccessState
              shortUrl={result.short_url}
              onReset={handleReset}
            />
          ) : (
            <URLShortenerForm onSuccess={handleSuccess} onError={handleError} />
          )}

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
