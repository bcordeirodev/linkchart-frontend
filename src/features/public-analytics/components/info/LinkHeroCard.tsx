"use client";

import { useState, useEffect, useId } from "react";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useShareAPI } from "@/features/links/hooks/useShareAPI";
import useClipboard from "@/hooks/useClipboard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicFocalSx,
  publicHairline,
  PUBLIC_CARD_GAP,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { WhatsAppIcon } from "@/shared/ui/icons";

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
  const { shareOrCopy } = useShareAPI();
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

        {/* Quick share — re-share this short link without leaving the page. */}
        <Stack direction="row" gap={1}>
          {[
            {
              key: "share",
              label: t("publicAnalytics.linkInfo.share"),
              icon: <Share2 {...ICON_MD} aria-hidden />,
              onClick: () => shareOrCopy({ url: shortUrl }),
            },
            {
              key: "whatsapp",
              label: t("publicAnalytics.linkInfo.shareWhatsapp"),
              icon: <WhatsAppIcon size={18} aria-hidden />,
              onClick: () =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(shortUrl)}`,
                  "_blank",
                  "noopener,noreferrer",
                ),
            },
          ].map(({ key, label, icon, onClick }) => (
            <Button
              key={key}
              onClick={onClick}
              startIcon={icon}
              sx={{
                flex: 1,
                minHeight: 42,
                px: 2,
                fontSize: "0.8125rem",
                fontWeight: 700,
                textTransform: "none",
                letterSpacing: "-0.01em",
                borderRadius: 2,
                color: theme.palette.text.primary,
                border: `1px solid ${publicHairline(theme, "inset")}`,
                bgcolor: alpha(theme.palette.text.primary, 0.04),
                transition:
                  "background-color 160ms ease, border-color 160ms ease, transform 120ms ease",
                "& .MuiButton-startIcon": { mr: 1 },
                "&:hover": {
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.1 : 0.07,
                  ),
                  borderColor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.4 : 0.3,
                  ),
                },
                "&:active": { transform: "translateY(1px)" },
              }}
            >
              {label}
            </Button>
          ))}
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
