"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_XL, ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicPanelSx,
  PUBLIC_INSET_PAD,
  PUBLIC_CARD_GAP,
} from "@/lib/theme/publicPageStyles";
import useClipboard from "@/shared/hooks/useClipboard";

interface EmptyClicksEngagementProps {
  /** Fully-resolved short URL to display and copy. */
  shortUrl: string;
}

/**
 * Engagement empty-state shown when a link has zero clicks.
 *
 * Renders a neutral panel with a copy-to-clipboard CTA so visitors can
 * immediately share the link.
 *
 * @remarks
 * Clipboard state is managed internally via `useClipboard`; the component is
 * self-contained and needs only the `shortUrl` prop.
 */
export function EmptyClicksEngagement({
  shortUrl,
}: EmptyClicksEngagementProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const { copied, copy } = useClipboard();

  const iconShellColor = alpha(
    theme.palette.primary.main,
    isDark ? 0.18 : 0.12,
  );
  const iconColor = theme.palette.primary.main;
  const titleColor = alpha(theme.palette.text.primary, isDark ? 0.92 : 0.95);
  const descColor = alpha(theme.palette.text.primary, isDark ? 0.62 : 0.68);

  return (
    <Box
      sx={{
        ...getPublicPanelSx(theme),
        px: PUBLIC_INSET_PAD,
        py: { xs: 3.5, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: PUBLIC_CARD_GAP,
        textAlign: "center",
      }}
    >
      {/* Icon shell */}
      <Box
        aria-hidden
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: iconShellColor,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        }}
      >
        <Share2 {...ICON_XL} color={iconColor} />
      </Box>

      {/* Text */}
      <Stack spacing={0.75} alignItems="center">
        <Typography
          sx={{
            fontSize: { xs: "0.9375rem", md: "1rem" },
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            color: titleColor,
          }}
        >
          {t("publicAnalytics.emptyClicks.title")}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            color: descColor,
            maxWidth: 360,
          }}
        >
          {t("publicAnalytics.emptyClicks.description")}
        </Typography>
      </Stack>

      {/* Copy CTA */}
      <Button
        variant="contained"
        size="small"
        disabled={!shortUrl}
        startIcon={copied ? undefined : <Share2 {...ICON_MD} aria-hidden />}
        onClick={() => copy(shortUrl)}
        sx={{
          fontWeight: 600,
          fontSize: "0.8125rem",
          px: 2.5,
          py: 0.875,
          borderRadius: "8px",
          textTransform: "none",
          bgcolor: copied
            ? theme.palette.success.main
            : theme.palette.primary.main,
          "&:hover": {
            bgcolor: copied
              ? theme.palette.success.dark
              : theme.palette.primary.dark,
          },
        }}
      >
        {copied
          ? t("publicAnalytics.saveUrlBanner.copied")
          : t("publicAnalytics.emptyClicks.shareLabel")}
      </Button>
    </Box>
  );
}
