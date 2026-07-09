"use client";

import { useState, useEffect, useId } from "react";
import { Box, Button, Link, Stack, Typography, useTheme } from "@mui/material";
import { alpha, lighten } from "@mui/material/styles";
import { Check, Copy, Globe, RotateCcw, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useShareAPI } from "@/features/links/hooks/useShareAPI";
import useClipboard from "@/shared/hooks/useClipboard";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import {
  RESTART_HUE,
  SHARE_HUE,
  WHATSAPP_GREEN,
  WHATSAPP_GREEN_HOVER,
} from "@/lib/theme/publicActionColors";
import {
  getPublicFocalSx,
  getPublicInsetSx,
  publicHairline,
  PUBLIC_CARD_GAP,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { WhatsAppIcon } from "@/shared/ui/icons";

import type { PublicLinkData } from "../../types";

import { BookmarkRow } from "./BookmarkRow";
import { LinkIdentity } from "./LinkIdentity";

interface LinkHeroCardProps {
  linkData: PublicLinkData;
  onCreateLink: () => void;
}

/**
 * Hero card for /public-analytics/[slug].
 *
 * Mirrors the guest "link created" card (`/shorter`) so the two surfaces stay
 * consistent: a single inset holds the short URL and its favicon-tagged
 * destination, one action row groups copy/share/restart, and the page-only
 * `BookmarkRow` reminder closes the card. Clipboard state is owned here.
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

  const sectionLabelSx = {
    display: "block",
    fontSize: "0.6875rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    lineHeight: 1.2,
    color: alpha(theme.palette.text.primary, isDark ? 0.78 : 0.74),
  };

  /** Solid, white-on-color action (matches the /shorter action row). */
  const solidActionSx = (bg: string, bgHover: string) => ({
    flex: 1,
    minHeight: 44,
    px: 1.5,
    borderRadius: 1.5,
    fontSize: "0.8125rem",
    fontWeight: 700,
    textTransform: "none" as const,
    letterSpacing: "-0.01em",
    color: theme.palette.common.white,
    bgcolor: bg,
    border: "1px solid transparent",
    transition: "background-color 160ms ease, transform 120ms ease",
    "& .MuiButton-startIcon": { mr: 0.625 },
    "&:hover": { bgcolor: bgHover },
    "&:active": { transform: "translateY(1px)" },
    "&.Mui-disabled": {
      opacity: 0.5,
      color: alpha(theme.palette.common.white, 0.7),
    },
  });

  /** Coordinated-color action sized to content (only Copy grows widest). */
  const colorActionSx = (base: string) => ({
    ...solidActionSx(base, lighten(base, 0.1)),
    flex: "0 0 auto",
  });

  /** Squares off an action into an icon-only button (spread after a base sx). */
  const iconSquareSx = {
    flex: "0 0 auto",
    width: 48,
    minWidth: 48,
    px: 0,
  } as const;

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
      sx={getPublicFocalSx(theme)}
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
              sx={{ ...sectionLabelSx, mb: 0.75 }}
            >
              {t("publicAnalytics.linkInfo.yourShortLink")}
            </Typography>
            <Typography
              component="p"
              sx={{
                m: 0,
                minWidth: 0,
                fontFamily: "monospace",
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
                fontFamily: "monospace",
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

        {/* One action row: copy · restart · share · whatsapp. */}
        <Stack
          direction="row"
          useFlexGap
          flexWrap="wrap"
          alignItems="stretch"
          spacing={1}
        >
          <Button
            onClick={() => copyShort(shortUrl)}
            disabled={!shortUrl}
            startIcon={
              copiedShort ? (
                <Check {...ICON_MD} aria-hidden />
              ) : (
                <Copy {...ICON_MD} aria-hidden />
              )
            }
            sx={solidActionSx(
              theme.palette.primary.dark,
              theme.palette.primary.main,
            )}
          >
            {copiedShort
              ? t("publicAnalytics.linkInfo.copied")
              : t("publicAnalytics.linkInfo.copy")}
          </Button>
          <Button
            onClick={onCreateLink}
            startIcon={<RotateCcw {...ICON_MD} aria-hidden />}
            sx={colorActionSx(RESTART_HUE)}
          >
            {t("publicAnalytics.linkInfo.shortenAnother")}
          </Button>
          <Button
            onClick={handleShare}
            aria-label={t("publicAnalytics.linkInfo.share")}
            title={t("publicAnalytics.linkInfo.share")}
            sx={{ ...colorActionSx(SHARE_HUE), ...iconSquareSx }}
          >
            <Share2 {...ICON_MD} aria-hidden />
          </Button>
          <Button
            onClick={handleWhatsApp}
            aria-label={t("publicAnalytics.linkInfo.shareWhatsapp")}
            title={t("publicAnalytics.linkInfo.shareWhatsapp")}
            sx={{
              ...solidActionSx(WHATSAPP_GREEN, WHATSAPP_GREEN_HOVER),
              ...iconSquareSx,
            }}
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
