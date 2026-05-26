"use client";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";
import { getPublicChipSx } from "@/lib/theme/publicPageStyles";
import { SignUpCtaCard } from "@/shared/components";

interface BenefitBadgesProps {
  state: "idle" | "success";
  onReset: () => void;
}

export function BenefitBadges({ state, onReset }: BenefitBadgesProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isSuccess = state === "success";
  const chipSx = getPublicChipSx(theme);
  const isDark = theme.palette.mode === "dark";

  const checkMark = (
    <Typography
      component="span"
      sx={{
        color: theme.palette.success.main,
        fontSize: "0.625rem",
        lineHeight: 1,
      }}
    >
      &#x2713;
    </Typography>
  );

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
      <Box sx={{ mt: 2.5, maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}>
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
    <Box sx={{ mt: 2.5, maxWidth: SHORTER_CONTENT_MAX_WIDTH, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            ...chipSx,
            fontSize: "0.6875rem",
            color: alpha(theme.palette.text.primary, isDark ? 0.72 : 0.68),
            letterSpacing: "0.02em",
            fontWeight: 500,
          }}
        >
          {checkMark} {t("benefits.active")}
        </Box>
        <Box
          sx={{
            ...chipSx,
            fontSize: "0.6875rem",
            color: alpha(theme.palette.text.primary, isDark ? 0.72 : 0.68),
            letterSpacing: "0.02em",
            fontWeight: 500,
          }}
        >
          {checkMark} {t("benefits.analytics")}
        </Box>
        <Button
          onClick={onReset}
          sx={{
            ...chipSx,
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
            textTransform: "none",
            color: theme.palette.primary.main,
            borderColor: alpha(
              theme.palette.primary.main,
              isDark ? 0.28 : 0.32,
            ),
            bgcolor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.05),
            "&:hover": {
              borderColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.4 : 0.42,
              ),
              bgcolor: alpha(theme.palette.primary.main, isDark ? 0.1 : 0.08),
            },
          }}
        >
          {t("benefits.shortenAnother")}
        </Button>
      </Box>
    </Box>
  );
}
