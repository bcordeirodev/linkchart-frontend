"use client";

import { useState, useEffect, useId } from "react";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import useClipboard from "@/hooks/useClipboard";
import { radiusTokens } from "@/lib/theme/designSystem";
import {
  getPublicPanelSx,
  PUBLIC_CARD_GAP,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";

import type { PublicLinkData } from "../../types";

import { BookmarkRow } from "./BookmarkRow";
import { DestinationRow } from "./DestinationRow";
import { LinkIdentity } from "./LinkIdentity";
import { ShortUrlRow } from "./ShortUrlRow";

interface LinkHeroCardProps {
  linkData: PublicLinkData;
  onCreateLink: () => void;
}

/**
 * Hero card for /public-analytics/[slug].
 *
 * Composes `LinkIdentity`, a hero `ShortUrlRow` paired tightly with its
 * `DestinationRow` confirmation line, and a discreet `BookmarkRow` callout
 * inside the canonical `getPublicPanelSx` shell. The card follows a clear
 * single-hero hierarchy: the short URL is the protagonist, the destination is
 * a quiet confirmation, and the save-this-page reminder is a supporting strip.
 *
 * Clipboard state is managed here so it can be passed down to the
 * presentational row components without them owning independent hook calls.
 *
 * The `analyticsUrl` is set on mount via `window.location.href` (SSR-safe:
 * it remains `""` during server rendering and is populated client-side).
 *
 * @remarks
 * The `domain` field on `PublicLinkData` is not displayed — it has no
 * corresponding i18n key and was never rendered in the original component.
 * It remains on the type for future use.
 */
export function LinkHeroCard({ linkData, onCreateLink }: LinkHeroCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  /* ── Accessible heading IDs ── */
  const cardHeadingId = useId();
  const shortUrlHeadingId = useId();
  const destinationHeadingId = useId();
  const saveHeadingId = useId();

  /* ── Clipboard ── */
  const shortUrl = getShortUrl(linkData.short_url);
  const { copy: copyShort, copied: copiedShort } = useClipboard({
    timeout: 1500,
  });
  const { copy: copyAnalytics, copied: copiedAnalytics } = useClipboard({
    timeout: 2000,
  });

  /* ── Analytics URL (SSR-safe: populated on mount) ── */
  const [analyticsUrl, setAnalyticsUrl] = useState("");
  useEffect(() => {
    setAnalyticsUrl(window.location.href);
  }, []);

  /* ── Visual tokens ── */
  const ctaTextColor = isDark
    ? theme.palette.common.white
    : "rgba(255,255,255,0.96)";

  return (
    <Box
      component="article"
      aria-labelledby={cardHeadingId}
      sx={getPublicPanelSx(theme)}
    >
      <Stack spacing={PUBLIC_CARD_GAP} sx={{ p: { xs: 2.5, md: 3 } }}>
        <LinkIdentity
          slug={linkData.slug}
          title={linkData.title}
          headingId={cardHeadingId}
        />

        {/* Hero short URL + its destination read as one unit. */}
        <Stack spacing={0.85}>
          <ShortUrlRow
            shortUrl={shortUrl}
            copied={copiedShort}
            onCopy={() => copyShort(shortUrl)}
            headingId={shortUrlHeadingId}
          />

          <DestinationRow
            destinationUrl={linkData.original_url}
            headingId={destinationHeadingId}
          />
        </Stack>

        <BookmarkRow
          analyticsUrl={analyticsUrl}
          copied={copiedAnalytics}
          onCopy={() => copyAnalytics(analyticsUrl)}
          headingId={saveHeadingId}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={onCreateLink}
          sx={{
            py: 1.25,
            fontWeight: 600,
            borderRadius: `${radiusTokens.md}px`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: ctaTextColor,
            boxShadow: `0 2px 14px rgba(0,0,0,${isDark ? 0.26 : 0.18})`,
            transition:
              "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease",
            "&:hover": {
              boxShadow: `0 4px 20px rgba(0,0,0,${isDark ? 0.34 : 0.24})`,
              opacity: 0.93,
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
          }}
        >
          {t("publicAnalytics.linkInfo.shortenAnother")}
        </Button>
      </Stack>
    </Box>
  );
}
