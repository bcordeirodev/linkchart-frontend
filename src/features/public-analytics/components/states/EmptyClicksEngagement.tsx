"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  publicHairline,
  PUBLIC_CARD_GAP,
  PUBLIC_INSET_PAD,
} from "@/lib/theme/publicPageStyles";
import useClipboard from "@/shared/hooks/useClipboard";
import { getCardSurfaceSx } from "@/shared/ui/base";

interface EmptyClicksEngagementProps {
  /** Fully-resolved short URL to display and copy. */
  shortUrl: string;
}

/**
 * Engagement empty-state shown when a link has zero clicks: the link is live,
 * the data starts when it is shared, and the button shares it.
 *
 * A hairline card with text and one action — the 48×48 primary-tinted icon
 * shell that used to sit on top was decoration standing in for a headline.
 * The copy already says the thing.
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
  const { copied, copy } = useClipboard();

  return (
    <Box
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${publicHairline(theme)}`,
        ...getCardSurfaceSx(theme),
        px: PUBLIC_INSET_PAD,
        py: { xs: 3.5, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: PUBLIC_CARD_GAP,
        textAlign: "center",
      }}
    >
      <Stack spacing={0.75} alignItems="center">
        <Typography
          component="p"
          sx={{
            fontSize: { xs: "0.9375rem", md: "1rem" },
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            color: theme.palette.text.primary,
          }}
        >
          {t("publicAnalytics.emptyClicks.title")}
        </Typography>
        <Typography
          component="p"
          sx={{ ...getPublicBlockDescriptionSx(theme), maxWidth: 360 }}
        >
          {t("publicAnalytics.emptyClicks.description")}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        disabled={!shortUrl}
        startIcon={copied ? undefined : <Share2 {...ICON_MD} aria-hidden />}
        onClick={() => copy(shortUrl)}
        sx={{
          minHeight: 44,
          px: 2.5,
          borderRadius: `${radiusTokens.md}px`,
          fontSize: "0.8125rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "& .MuiButton-startIcon": { mr: 0.75 },
          ...(copied
            ? {
                bgcolor: theme.palette.success.main,
                "&:hover": {
                  bgcolor: theme.palette.success.dark,
                  boxShadow: "none",
                },
              }
            : { "&:hover": { boxShadow: "none" } }),
        }}
      >
        {copied
          ? t("publicAnalytics.saveUrlBanner.copied")
          : t("publicAnalytics.emptyClicks.shareLabel")}
      </Button>
    </Box>
  );
}
