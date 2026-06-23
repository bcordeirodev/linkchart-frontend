"use client";

import { useState, useEffect, useId } from "react";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import useClipboard from "@/hooks/useClipboard";
import {
  getPublicFocalSx,
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
 * inside the same focal shell used by the public shortener boxes. The card follows a clear
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

  return (
    <Box
      component="article"
      aria-labelledby={cardHeadingId}
      sx={getPublicFocalSx(theme)}
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
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: theme.palette.primary.dark,
            color: alpha(theme.palette.common.white, 0.96),
            "&:hover": {
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          {t("publicAnalytics.linkInfo.shortenAnother")}
        </Button>
      </Stack>
    </Box>
  );
}
