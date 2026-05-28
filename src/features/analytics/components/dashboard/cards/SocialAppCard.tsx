"use client";
/**
 * SocialAppCard — shows share of clicks from mobile in-app browsers.
 */
import { Smartphone } from "lucide-react";
import { Alert, Box, Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

interface SocialIabStats {
  total: number;
  percentage: number;
  ios_pct: number;
  android_pct: number;
  /**
   * True when at least 20% of clicks in the filter window have a non-null
   * navigation_context value (Phase 1 field). When false the data predates
   * Phase 1 tracking and a disclaimer should be shown.
   */
  navigation_context_available: boolean;
}

interface Props {
  data?: SocialIabStats;
}

/**
 * Card showing share of clicks from mobile in-app browsers (Instagram, TikTok, WhatsApp…).
 *
 * When `navigation_context_available` is false, renders a MUI info chip/alert
 * explaining that IAB data is only available for recent clicks (Phase 1 tracking)
 * instead of silently showing empty data.
 *
 * Renders nothing when `data` is undefined (hook has not resolved yet).
 */
export function SocialAppCard({ data }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  if (!data) return null;

  // Phase 1 disclaimer: navigation_context field is not available for old clicks.
  // Show the card frame with an informational notice rather than hiding it entirely.
  if (!data.navigation_context_available) {
    return (
      <Card
        sx={{
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: elevation.xs,
          transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
          "&:hover": {
            boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
          },
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Smartphone {...ICON_MD} />
            {t("dashboard.socialApp.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {t("dashboard.socialApp.description")}
          </Typography>
          <Alert severity="info" sx={{ mt: 1 }}>
            {t("dashboard.socialIab.phaseDisclaimer")}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // No IAB traffic and data is available — nothing to display.
  if (data.total === 0) return null;

  const otherPct = Math.max(0, 100 - data.ios_pct - data.android_pct);

  return (
    <Card
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: elevation.xs,
        transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&:hover": {
          boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Smartphone {...ICON_MD} />
          {t("dashboard.socialApp.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t("dashboard.socialApp.description")}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {data.percentage.toFixed(0)}%
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          {t("dashboard.socialApp.subtitle")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            borderRadius: 1.5,
            overflow: "hidden",
            height: 28,
            mb: 1,
          }}
        >
          {data.ios_pct > 0 && (
            <Box
              sx={{
                flex: data.ios_pct,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "primary.contrastText",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                iOS {data.ios_pct.toFixed(0)}%
              </Typography>
            </Box>
          )}
          {data.android_pct > 0 && (
            <Box
              sx={{
                flex: data.android_pct,
                bgcolor: "primary.dark",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "primary.contrastText",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                Android {data.android_pct.toFixed(0)}%
              </Typography>
            </Box>
          )}
          {otherPct > 0 && (
            <Box
              sx={{
                flex: otherPct,
                bgcolor: "action.disabledBackground",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ fontWeight: 600, fontSize: 11 }}
              >
                {t("dashboard.socialApp.other")} {otherPct.toFixed(0)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="caption" color="text.disabled">
          {t("dashboard.socialApp.note")}
        </Typography>
      </CardContent>
    </Card>
  );
}
