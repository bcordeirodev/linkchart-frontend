"use client";
import { Alert, Box, Container, Typography, useTheme } from "@mui/material";
import { Link2, SlidersHorizontal, BarChart2 } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { AdSlot } from "@/shared/components/ads/AdSlot";
import { URLShortenerForm } from "@/features/links/components/URLShortenerForm";
import { ShorterHero, ShorterStats } from "@/features/shorter/components";
import { useShorter } from "@/features/shorter/hooks/useShorter";
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
    <PublicLayout variant="shorter" chrome="minimal">
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
          sx={{
            position: "relative",
            zIndex: 1,
            pt: { xs: 7, md: 8 },
            pb: { xs: 6, md: 8 },
          }}
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

          <Box sx={{ mt: { xs: 6, md: 7 }, maxWidth: 800, mx: "auto" }}>
            <ShorterStats />
          </Box>

          <AdSlot
            slot={
              process.env.NEXT_PUBLIC_ADSENSE_SLOT_SHORTER_BETWEEN_SECTIONS ??
              ""
            }
            format="auto"
          />

          <Box sx={{ mt: { xs: 6, md: 8 }, mb: 2, maxWidth: 800, mx: "auto" }}>
            <Typography
              component="h2"
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
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              {[
                {
                  icon: <Link2 size={22} />,
                  step: "01",
                  title: t("shorter.steps.paste.title"),
                  desc: t("shorter.steps.paste.desc"),
                },
                {
                  icon: <SlidersHorizontal size={22} />,
                  step: "02",
                  title: t("shorter.steps.customize.title"),
                  desc: t("shorter.steps.customize.desc"),
                },
                {
                  icon: <BarChart2 size={22} />,
                  step: "03",
                  title: t("shorter.steps.share.title"),
                  desc: t("shorter.steps.share.desc"),
                },
              ].map(({ icon, step, title, desc }) => (
                <Box
                  key={step}
                  sx={{
                    textAlign: "center",
                    px: 2.5,
                    py: 3,
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.025)",
                    transition:
                      "border-color 200ms ease, background 200ms ease",
                    "&:hover": {
                      borderColor: "rgba(99,102,241,0.28)",
                      background: "rgba(255,255,255,0.04)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 1.25,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      display: "block",
                    }}
                  >
                    {step}
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{
                      color: "rgba(255,255,255,0.92)",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      display: "block",
                      mt: 0.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      mt: 0.75,
                      fontSize: "0.8125rem",
                      lineHeight: 1.55,
                    }}
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
