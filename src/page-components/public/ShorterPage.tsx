"use client";
import { Alert, Box, Container, Typography, useTheme } from "@mui/material";
import { Link2, SlidersHorizontal, BarChart2 } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

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
  const theme = useTheme();
  const { t } = useTranslation("public");
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
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
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
              sx={{ mb: 2, maxWidth: 800, mx: "auto", borderRadius: 2 }}
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
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BELOW_FORM ?? ""}
            format="rectangle"
          />

          <BenefitBadges
            state={isRedirecting ? "success" : "idle"}
            onReset={handleReset}
          />

          <Box sx={{ mt: 6, maxWidth: 800, mx: "auto" }}>
            <ShorterStats />
          </Box>

          <Box sx={{ mt: 6, mb: 2, maxWidth: 800, mx: "auto" }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textAlign: "center",
                display: "block",
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              {t("shorter.howItWorks")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 3,
              }}
            >
              {(
                [
                  {
                    icon: <Link2 size={22} />,
                    step: "01",
                    title: "Cole o URL",
                    desc: "Insira qualquer link longo no campo acima.",
                  },
                  {
                    icon: <SlidersHorizontal size={22} />,
                    step: "02",
                    title: "Personalize",
                    desc: "Defina um slug personalizado ou deixe gerar automaticamente.",
                  },
                  {
                    icon: <BarChart2 size={22} />,
                    step: "03",
                    title: "Compartilhe",
                    desc: "Copie o link curto e acompanhe os cliques em tempo real.",
                  },
                ] as const
              ).map(({ icon, step, title, desc }) => (
                <Box
                  key={step}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Box
                    sx={{
                      color: "#6366f1",
                      mb: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {step}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 600,
                      display: "block",
                      mt: 0.5,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}
                  >
                    {desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  );
}

export default memo(ShorterPage);
