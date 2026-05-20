"use client";
import { Share2 } from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

interface SocialPlatformEntry {
  platform: string;
  clicks: number;
  percentage: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e1306c",
  tiktok: "#69C9D0",
  facebook: "#1877f2",
  youtube: "#ff0000",
  twitter: "#1da1f2",
  whatsapp: "#25d366",
  telegram: "#0088cc",
  linkedin: "#0077b5",
};

const PLATFORM_DISPLAY: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
  twitter: "Twitter / X",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  linkedin: "LinkedIn",
};

interface Props {
  platforms: SocialPlatformEntry[];
}

/**
 * Breakdown bar chart of clicks by social platform (referer-identified).
 * Matches the visual style of BehaviorSection.
 */
export function SocialPlatformSection({ platforms }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  if (platforms.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t("audience.socialPlatform.title")}
      </Typography>
      <Card
        sx={{ borderRadius: `${radiusTokens.lg}px`, boxShadow: elevation.xs }}
      >
        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Share2 {...ICON_MD} />
            {t("audience.socialPlatform.subtitle")}
          </Typography>
          <Stack spacing={2}>
            {platforms.map((entry) => {
              const color =
                PLATFORM_COLORS[entry.platform] ?? theme.palette.primary.main;
              return (
                <Box key={entry.platform}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">
                      {PLATFORM_DISPLAY[entry.platform] ?? entry.platform}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.clicks} ({entry.percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={entry.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: color,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SocialPlatformSection;
