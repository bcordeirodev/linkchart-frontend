"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { SectionLabel } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { SocialBrandIcon } from "@/shared/ui/icons";

import { HorizontalBreakdownBars } from "./HorizontalBreakdownBars";

import type { HorizontalBreakdownItem } from "./HorizontalBreakdownBars";

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
 * Breakdown of clicks by social platform (referer-identified).
 *
 * Renders through the shared {@link HorizontalBreakdownBars} mark rather than
 * its own `LinearProgress` rows. It used to roll its own, and MUI's default
 * progress track is a tint of `primary` — a *blue* track under a blue fill,
 * which reads as a half-filled bar. Sitting next to `ChannelsBreakdown` in the
 * "Canais e redes" sub-tab, the two breakdowns would have disagreed on what an
 * empty bar looks like. One mark, one look.
 */
export function SocialPlatformSection({ platforms, showTitle = true }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  if (platforms.length === 0) return null;

  const items: HorizontalBreakdownItem[] = platforms.map((entry) => ({
    key: entry.platform,
    label: PLATFORM_DISPLAY[entry.platform] ?? entry.platform,
    value: entry.clicks,
    percentage: entry.percentage,
    color: PLATFORM_COLORS[entry.platform] ?? theme.palette.primary.main,
    icon: <SocialBrandIcon platform={entry.platform} size={16} />,
  }));

  return (
    <Box>
      {showTitle ? (
        <Box sx={{ mb: 2 }}>
          <SectionLabel headingLevel={2}>
            {t("audience.socialPlatform.title")}
          </SectionLabel>
        </Box>
      ) : null}
      <ChartCard
        title={t("audience.socialPlatform.subtitle")}
        subtitle={t("audience.socialPlatform.description")}
      >
        <HorizontalBreakdownBars items={items} />
      </ChartCard>
    </Box>
  );
}

export default SocialPlatformSection;
