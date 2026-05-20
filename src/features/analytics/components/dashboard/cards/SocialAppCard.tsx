"use client";
/**
 * SocialAppCard — shows share of clicks from mobile in-app browsers.
 */
import { Smartphone } from "lucide-react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { createPresetAnimations } from "@/lib/theme";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

interface SocialIabStats {
  total: number;
  percentage: number;
  ios_pct: number;
  android_pct: number;
}

interface Props {
  data?: SocialIabStats;
}

/**
 * Card showing share of clicks from mobile in-app browsers (Instagram, TikTok, WhatsApp…).
 * Renders nothing when total is 0.
 */
export function SocialAppCard({ data }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;
  const animations = createPresetAnimations(theme);

  if (!data || data.total === 0) return null;

  const otherPct = Math.max(0, 100 - data.ios_pct - data.android_pct);

  return (
    <Box sx={{ height: "100%", width: "100%", ...animations.cardHover }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: `${radiusTokens.lg}px`,
          boxShadow: elevation.xs,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <Smartphone {...ICON_MD} />
            {t("dashboard.socialApp.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {t("dashboard.socialApp.description")}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
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
    </Box>
  );
}
