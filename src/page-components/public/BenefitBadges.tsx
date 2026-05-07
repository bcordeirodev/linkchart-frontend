"use client";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const badgeSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  px: 1.5,
  py: 0.625,
  fontSize: "0.6875rem",
  color: "rgba(255,255,255,0.4)",
  letterSpacing: "0.2px",
};

const checkMark = (
  <Typography component="span" sx={{ color: "#10b981", fontSize: "0.625rem" }}>
    &#x2713;
  </Typography>
);

interface BenefitBadgesProps {
  state: "idle" | "success";
  onReset: () => void;
}

export function BenefitBadges({ state, onReset }: BenefitBadgesProps) {
  const { t } = useTranslation("public");
  const isSuccess = state === "success";
  return (
    <Box sx={{ mt: 2.5, maxWidth: 800, mx: "auto" }}>
      {isSuccess ? (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Box sx={badgeSx}>
            {checkMark} {t("benefits.active")}
          </Box>
          <Box sx={badgeSx}>
            {checkMark} {t("benefits.analytics")}
          </Box>
          <Box
            component="button"
            onClick={onReset}
            sx={{
              ...badgeSx,
              cursor: "pointer",
              border: "1px solid rgba(99,102,241,0.28)",
              color: "rgba(165,180,252,0.75)",
              background: "transparent",
              "&:hover": { borderColor: "rgba(99,102,241,0.45)" },
            }}
          >
            {t("benefits.shortenAnother")}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: "20px 22px",
            borderRadius: "12px",
            background:
              "linear-gradient(#0c0c1e, #0c0c1e) padding-box, linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.2)) border-box",
            border: "1px solid transparent",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.realtimeAnalytics")}
            </Box>
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.freeQr")}
            </Box>
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.noExpiration")}
            </Box>
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.customSlug")}
            </Box>
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.geoLocation")}
            </Box>
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.utmCampaigns")}
            </Box>
            <Box sx={badgeSx}>
              {checkMark} {t("benefits.fullDashboard")}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.5, sm: 2 },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  mb: 0.4,
                }}
              >
                Acesse todos esses recursos de graça
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}
              >
                Crie sua conta e desbloqueie tudo isso gratuitamente.
              </Typography>
            </Box>
            <Box
              component="a"
              href="/register"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                borderRadius: "8px",
                px: 2.25,
                py: 0.875,
                fontSize: "0.8125rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                textDecoration: "none",
                flexShrink: 0,
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.85 },
              }}
            >
              Criar conta grátis →
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
