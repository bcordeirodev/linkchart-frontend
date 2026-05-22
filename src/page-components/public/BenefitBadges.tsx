"use client";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { SignUpCtaCard } from "@/shared/components";

const badgeSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  px: 1.5,
  py: 0.625,
  fontSize: "0.6875rem",
  color: "rgba(255,255,255,0.62)",
  letterSpacing: "0.2px",
  fontWeight: 500,
};

const checkMark = (
  <Typography
    component="span"
    sx={{ color: "#34d399", fontSize: "0.625rem", lineHeight: 1 }}
  >
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

  if (!isSuccess) {
    const features = [
      t("benefits.realtimeAnalytics"),
      t("benefits.freeSubdomain"),
      t("benefits.freeQr"),
      t("benefits.customSlug"),
      t("benefits.geoLocation"),
      t("benefits.utmCampaigns"),
      t("benefits.fullDashboard"),
      t("benefits.noExpiration"),
    ];

    return (
      <Box sx={{ mt: 2.5, maxWidth: 800, mx: "auto" }}>
        <SignUpCtaCard
          title={t("shorter.upgrade.title")}
          description={t("shorter.upgrade.description")}
          features={features}
          ctaLabel={t("shorter.upgrade.button")}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2.5, maxWidth: 800, mx: "auto" }}>
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
            border: "1px solid rgba(99,102,241,0.32)",
            color: "rgba(199,210,254,0.92)",
            background: "rgba(99,102,241,0.06)",
            transition: "border-color 160ms ease, background 160ms ease",
            "&:hover": {
              borderColor: "rgba(99,102,241,0.55)",
              background: "rgba(99,102,241,0.1)",
            },
          }}
        >
          {t("benefits.shortenAnother")}
        </Box>
      </Box>
    </Box>
  );
}
