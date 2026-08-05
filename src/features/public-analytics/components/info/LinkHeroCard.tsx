"use client";

import { useState, useEffect, useId } from "react";
import { Box, Button, Link, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, Copy, Globe, RotateCcw, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useShareAPI } from "@/shared/hooks/useShareAPI";
import useClipboard from "@/shared/hooks/useClipboard";
import { radiusTokens, typographyScale } from "@/lib/theme";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { WHATSAPP_GREEN } from "@/lib/theme/publicActionColors";
import {
  getPublicInsetSx,
  publicHairline,
  PUBLIC_CARD_GAP,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { getCardSurfaceSx } from "@/shared/ui/base";
import { WhatsAppIcon } from "@/shared/ui/icons";

import type { PublicLinkData } from "../../types";

import { BookmarkRow } from "./BookmarkRow";
import { LinkIdentity } from "./LinkIdentity";

interface LinkHeroCardProps {
  linkData: PublicLinkData;
  onCreateLink: () => void;
}

/** Shared height of every control in the action row (also the icon-button side). */
const ACTION_HEIGHT = 44;

/**
 * Hero card for /public-analytics/[slug].
 *
 * The card is a hairline over the translucent card veil ({@link getCardSurfaceSx}) —
 * the same surface as every in-page card in the app. It used to be
 * `getPublicFocalSx`, a primary-tinted gradient wash: on a page whose job is to
 * present data, the container was the loudest thing on screen.
 *
 * Inside: the slug identity, one inset holding the short URL and its
 * favicon-tagged destination (the mono box is the point of the page and is
 * kept), a single action row, and the page-only `BookmarkRow` reminder.
 *
 * The action row has one filled button. `Copiar` is the action a visitor came
 * for, so it is the only solid primary; `Encurtar outro link` is an outlined
 * hairline; share and WhatsApp are square icon buttons in that same quiet
 * grammar. Before, all four were solid blocks in four different hues (blue,
 * navy, teal, green), which read as four equally urgent choices. WhatsApp keeps
 * its brand green — in the glyph, not as a block.
 *
 * Clipboard state is owned here.
 */
export function LinkHeroCard({ linkData, onCreateLink }: LinkHeroCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const { shareOrCopy } = useShareAPI();
  const isDark = theme.palette.mode === "dark";

  /* ── Accessible heading IDs ── */
  const cardHeadingId = useId();
  const linkHeadingId = useId();
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

  const displayDestination = linkData.original_url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");

  /** Bare destination host, used to fetch its favicon. */
  const destinationHost = (() => {
    try {
      return new URL(linkData.original_url).hostname.replace(/^www\./i, "");
    } catch {
      return "";
    }
  })();

  const shortUrlColor = isDark
    ? alpha(theme.palette.common.white, 0.96)
    : theme.palette.primary.dark;

  /**
   * Field label inside the card ("SEU LINK CURTO") — mono caps at label size.
   * A field caption, not a section anchor, so it stays quiet: no `/` prefix
   * and no hairline rule (that dress belongs to `SectionLabel`).
   */
  const fieldLabelSx = {
    display: "block",
    fontFamily: typographyScale.code.fontFamily,
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    lineHeight: 1.2,
    color: theme.palette.text.secondary,
  };

  /** Geometry every action in the row shares. */
  const actionBaseSx = {
    minHeight: ACTION_HEIGHT,
    borderRadius: `${radiusTokens.md}px`,
    fontSize: "0.8125rem",
    fontWeight: 600,
    textTransform: "none" as const,
    letterSpacing: "-0.01em",
    boxShadow: "none",
    "& .MuiButton-startIcon": { mr: 0.75 },
  };

  /**
   * The row's single filled action. Full width on phones so the row breaks
   * into "the action" and "everything else" instead of stranding the two icon
   * buttons on a line of their own.
   */
  const primaryActionSx = {
    ...actionBaseSx,
    flex: { xs: "1 1 100%", sm: 1 },
    minWidth: 132,
    px: 2,
    "&:hover": { boxShadow: "none" },
  };

  /** Hairline action — present, not competing. */
  const quietActionSx = {
    ...actionBaseSx,
    flex: "0 0 auto",
    px: 1.75,
    color: theme.palette.text.primary,
    borderColor: publicHairline(theme),
    "&:hover": {
      borderColor: theme.palette.text.disabled,
      bgcolor: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
    },
  };

  /** Same quiet grammar, squared off for an icon-only action. */
  const quietIconActionSx = {
    ...quietActionSx,
    width: ACTION_HEIGHT,
    minWidth: ACTION_HEIGHT,
    px: 0,
  };

  const handleShare = (): void => {
    void shareOrCopy({ url: shortUrl });
  };

  const handleWhatsApp = (): void => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shortUrl)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Box
      component="article"
      aria-labelledby={cardHeadingId}
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${publicHairline(theme)}`,
        ...getCardSurfaceSx(theme),
        overflow: "hidden",
      }}
    >
      <Stack spacing={PUBLIC_CARD_GAP} sx={{ p: { xs: 2.5, md: 3 } }}>
        <LinkIdentity
          slug={linkData.slug}
          title={linkData.title}
          headingId={cardHeadingId}
        />

        {/* Short link + destination — one inset (mirrors /shorter). */}
        <Box
          component="section"
          aria-labelledby={linkHeadingId}
          sx={{
            ...getPublicInsetSx(theme),
            p: { xs: 1.75, sm: 2 },
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id={linkHeadingId}
              component="h3"
              variant="overline"
              color="text.secondary"
              sx={{ ...fieldLabelSx, mb: 0.75 }}
            >
              {t("publicAnalytics.linkInfo.yourShortLink")}
            </Typography>
            <Typography
              component="p"
              sx={{
                m: 0,
                minWidth: 0,
                fontFamily: typographyScale.code.fontFamily,
                fontSize: { xs: "1rem", sm: "1.0625rem" },
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: shortUrlColor,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Link
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: "inherit", fontWeight: "inherit" }}
              >
                {shortUrl}
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              minWidth: 0,
              pt: 1.25,
              borderTop: `1px solid ${publicHairline(theme, "inset")}`,
            }}
          >
            <DestinationFavicon host={destinationHost} />
            <Link
              href={linkData.original_url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: typographyScale.code.fontFamily,
                fontSize: "0.8125rem",
                lineHeight: 1.35,
                color: alpha(theme.palette.text.primary, isDark ? 0.72 : 0.7),
                "&:hover": { color: theme.palette.primary.light },
              }}
            >
              {displayDestination}
            </Link>
          </Box>
        </Box>

        {/* One action row: copy · shorten another · share · whatsapp. */}
        <Stack
          direction="row"
          useFlexGap
          flexWrap="wrap"
          alignItems="stretch"
          spacing={1}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => copyShort(shortUrl)}
            disabled={!shortUrl}
            startIcon={
              copiedShort ? (
                <Check {...ICON_MD} aria-hidden />
              ) : (
                <Copy {...ICON_MD} aria-hidden />
              )
            }
            sx={primaryActionSx}
          >
            {copiedShort
              ? t("publicAnalytics.linkInfo.copied")
              : t("publicAnalytics.linkInfo.copy")}
          </Button>
          <Button
            variant="outlined"
            onClick={onCreateLink}
            startIcon={<RotateCcw {...ICON_MD} aria-hidden />}
            sx={quietActionSx}
          >
            {t("publicAnalytics.linkInfo.shortenAnother")}
          </Button>
          <Button
            variant="outlined"
            onClick={handleShare}
            aria-label={t("publicAnalytics.linkInfo.share")}
            title={t("publicAnalytics.linkInfo.share")}
            sx={quietIconActionSx}
          >
            <Share2 {...ICON_MD} aria-hidden />
          </Button>
          <Button
            variant="outlined"
            onClick={handleWhatsApp}
            aria-label={t("publicAnalytics.linkInfo.shareWhatsapp")}
            title={t("publicAnalytics.linkInfo.shareWhatsapp")}
            sx={{ ...quietIconActionSx, color: WHATSAPP_GREEN }}
          >
            <WhatsAppIcon size={18} aria-hidden style={{ flexShrink: 0 }} />
          </Button>
        </Stack>

        <BookmarkRow
          analyticsUrl={analyticsUrl}
          copied={copiedAnalytics}
          onCopy={() => copyAnalytics(analyticsUrl)}
          headingId={saveHeadingId}
        />
      </Stack>
    </Box>
  );
}

/**
 * Destination site favicon with a Globe fallback (DuckDuckGo icon service),
 * matching the guest success card's destination cue.
 */
function DestinationFavicon({ host }: { host: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [failed, setFailed] = useState(false);

  if (!host || failed) {
    return (
      <Globe
        {...ICON_SM}
        aria-hidden
        style={{
          color: alpha(theme.palette.text.primary, isDark ? 0.5 : 0.45),
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      sx={{
        width: 16,
        height: 16,
        flexShrink: 0,
        borderRadius: "3px",
        objectFit: "contain",
      }}
    />
  );
}
