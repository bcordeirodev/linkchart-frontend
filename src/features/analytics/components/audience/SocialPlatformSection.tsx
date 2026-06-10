"use client";
import { Share2 } from "lucide-react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { SectionDivider } from "@/shared/ui/SectionDivider";

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
  /**
   * Whether to render the section heading. Pass `false` inside the Sources
   * sub-tab, whose tab label already provides the context.
   */
  showTitle?: boolean;
}

/**
 * Breakdown bar chart of clicks by social platform (referer-identified).
 * Matches the visual style of BehaviorSection.
 */
export function SocialPlatformSection({ platforms, showTitle = true }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  if (platforms.length === 0) return null;

  return (
    <Box>
      {showTitle ? (
        <SectionDivider title={t("audience.socialPlatform.title")} />
      ) : null}
      <ChartCard
        title={t("audience.socialPlatform.subtitle")}
        subtitle={t("audience.socialPlatform.description")}
        icon={<Share2 {...ICON_MD} />}
      >
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
      </ChartCard>
    </Box>
  );
}

export default SocialPlatformSection;
