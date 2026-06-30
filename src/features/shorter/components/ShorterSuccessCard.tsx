"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { BarChart3, Check, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { DestinationRow } from "@/features/public-analytics/components/info/DestinationRow";
import { ShortUrlRow } from "@/features/public-analytics/components/info/ShortUrlRow";
import { useShareAPI } from "@/features/links/hooks/useShareAPI";
import useClipboard from "@/hooks/useClipboard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockTitleSx,
  getPublicFocalSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { radiusTokens } from "@/lib/theme/designSystem";
import { PublicBlockIcon } from "@/shared/ui/base";
import { WhatsAppIcon } from "@/shared/ui/icons";
import { useNavigate } from "@/shared/hooks";

import { SHORTER_CONTENT_MAX_WIDTH } from "../constants";
import { ShorterQrPanel } from "./ShorterQrPanel";

/** Props for the inline success card shown after a guest shortens a link. */
export interface ShorterSuccessCardProps {
  /** The freshly-created link's resolved short URL (or bare slug). */
  shortUrl: string;
  /** The original destination URL the short link points to. */
  destinationUrl: string;
  /** The link slug — used to build the opt-in "view analytics" navigation. */
  slug: string;
  /** Resets the landing back to the form so the user can shorten another link. */
  onReset: () => void;
}

/**
 * Inline success surface for the `/shorter` landing.
 *
 * Replaces the form (in place) once a guest creates a link, so the flow stays
 * on the landing instead of redirecting to the public-analytics screen.
 *
 * Layout reads top-to-bottom as the next steps a user takes: a live status pill
 * confirms the link is already active and tracking; the short URL is the hero
 * (copy is the primary action) paired with a scannable QR tile; quick share
 * actions sit below; and viewing analytics / shortening another are the closing
 * calls to action. The QR tile is the card's signature — it turns a text-only
 * confirmation into a tangible, ready-to-share artifact.
 *
 * Reuses the presentational `ShortUrlRow` / `DestinationRow` from the
 * public-analytics feature so the short-link treatment stays identical across
 * both contexts. Clipboard state is owned here via `useClipboard`.
 */
export function ShorterSuccessCard({
  shortUrl,
  destinationUrl,
  slug,
  onReset,
}: ShorterSuccessCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const navigate = useNavigate();
  const { shareOrCopy } = useShareAPI();
  const isDark = theme.palette.mode === "dark";

  const resolvedShortUrl = getShortUrl(shortUrl);
  const { copy, copied } = useClipboard({ timeout: 1500 });

  /*
   * The short URL is auto-copied to the clipboard on creation (in `useShorter`),
   * so the copy control lands in its "copied" state to make that obvious — then
   * settles back to the idle "copy" affordance after a moment. A manual copy
   * clears the seed and hands control back to the live clipboard flag.
   */
  const [autoCopied, setAutoCopied] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setAutoCopied(false), 2600);
    return () => clearTimeout(id);
  }, []);

  /** Copies the short URL and dismisses the initial auto-copied seed. */
  const handleCopy = (): void => {
    setAutoCopied(false);
    copy(resolvedShortUrl);
  };

  const cardHeadingId = useId();
  const shortUrlHeadingId = useId();
  const destinationHeadingId = useId();

  /** Opt-in navigation to the dedicated public analytics page for this link. */
  const handleViewAnalytics = (): void => {
    navigate(`/public-analytics/${encodeURIComponent(slug)}`);
  };

  /** Native share sheet with clipboard fallback for the short URL. */
  const handleShare = (): void => {
    void shareOrCopy({ url: resolvedShortUrl });
  };

  /** Opens WhatsApp pre-filled with the short URL. */
  const handleWhatsApp = (): void => {
    const href = `https://wa.me/?text=${encodeURIComponent(resolvedShortUrl)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  /** Quiet, soft-tinted styling shared by the secondary share buttons. */
  const shareButtonSx = {
    flex: 1,
    minHeight: 42,
    px: 2,
    fontSize: "0.8125rem",
    fontWeight: 700,
    textTransform: "none" as const,
    letterSpacing: "-0.01em",
    borderRadius: `${radiusTokens.md}px`,
    color: theme.palette.text.primary,
    border: `1px solid ${publicHairline(theme, "inset")}`,
    bgcolor: alpha(theme.palette.text.primary, isDark ? 0.04 : 0.04),
    transition:
      "background-color 160ms ease, border-color 160ms ease, transform 120ms ease",
    "& .MuiButton-startIcon": { mr: 1 },
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.1 : 0.07),
      borderColor: alpha(theme.palette.primary.main, isDark ? 0.4 : 0.3),
    },
    "&:active": { transform: "translateY(1px)" },
    "&.Mui-focusVisible": {
      borderColor: alpha(theme.palette.primary.main, 0.55),
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.14)}`,
    },
  };

  return (
    <Box
      component="article"
      aria-labelledby={cardHeadingId}
      sx={{
        ...getPublicFocalSx(theme),
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={{ xs: 2, md: 2.25 }}
        sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}
      >
        {/* Header: success + live status pill */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 1.25,
          }}
        >
          <PublicBlockIcon
            icon={Check}
            sx={{
              color: alpha(theme.palette.common.white, isDark ? 0.96 : 0.94),
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              id={cardHeadingId}
              component="h2"
              sx={{ ...getPublicBlockTitleSx(theme), mb: 0.5 }}
            >
              {t("shorter.successTitle")}
            </Typography>
            <Typography component="p" sx={getPublicBlockDescriptionSx(theme)}>
              {t("shorter.successCopiedHint")}
            </Typography>
          </Box>
          <LiveStatusPill />
        </Box>

        {/* Hero short URL + QR — the protagonist and its scannable twin. */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 2, sm: 2.5 },
          }}
        >
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <ShortUrlRow
              shortUrl={resolvedShortUrl}
              copied={copied || autoCopied}
              onCopy={handleCopy}
              headingId={shortUrlHeadingId}
            />
            <DestinationRow
              destinationUrl={destinationUrl}
              headingId={destinationHeadingId}
            />
          </Stack>
          <ShorterQrPanel shortUrl={resolvedShortUrl} slug={slug} />
        </Box>

        {/* Quick share — the most common next step. */}
        <Stack direction="row" gap={1}>
          <Button
            onClick={handleShare}
            startIcon={<Share2 {...ICON_MD} aria-hidden />}
            sx={shareButtonSx}
          >
            {t("shorter.share")}
          </Button>
          <Button
            onClick={handleWhatsApp}
            startIcon={<WhatsAppIcon size={18} aria-hidden />}
            sx={shareButtonSx}
          >
            {t("shorter.shareWhatsapp")}
          </Button>
        </Stack>

        {/* Closing calls to action. */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 1, sm: 1.25 }}
          sx={{
            pt: { xs: 1.75, sm: 2 },
            borderTop: `1px solid ${publicHairline(theme, "inset")}`,
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            disableElevation
            onClick={handleViewAnalytics}
            startIcon={<BarChart3 {...ICON_MD} aria-hidden />}
            sx={{
              minHeight: 48,
              px: 2.5,
              borderRadius: `${radiusTokens.md}px`,
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              bgcolor: theme.palette.primary.dark,
              color: alpha(theme.palette.common.white, 0.95),
              border: `1px solid ${alpha(theme.palette.primary.light, 0.22)}`,
              boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, isDark ? 0.4 : 0.18)}`,
              transition:
                "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 120ms ease",
              "& .MuiButton-startIcon": { mr: 1 },
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.light, 0.34),
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.dark, isDark ? 0.5 : 0.28)}`,
              },
              "&:active": { transform: "translateY(1px)" },
              "&.Mui-focusVisible": {
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.22)}`,
              },
            }}
          >
            {t("shorter.viewAnalytics")}
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={onReset}
            startIcon={<RotateCcw {...ICON_MD} aria-hidden />}
            sx={{
              minHeight: 48,
              px: 2.5,
              borderRadius: `${radiusTokens.md}px`,
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: theme.palette.text.primary,
              borderColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.45 : 0.34,
              ),
              bgcolor: "transparent",
              transition:
                "background-color 160ms ease, border-color 160ms ease, transform 120ms ease",
              "& .MuiButton-startIcon": { mr: 1 },
              "&:hover": {
                borderColor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.62 : 0.48,
                ),
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.08 : 0.06,
                ),
              },
              "&:active": { transform: "translateY(1px)" },
              "&.Mui-focusVisible": {
                borderColor: alpha(theme.palette.primary.main, 0.55),
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.14)}`,
              },
            }}
          >
            {t("shorter.createAnother")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

/**
 * Small "Active · tracking clicks" pill with a pulsing dot.
 *
 * Reinforces the product's core value the instant a link is created: it is
 * already live and already measuring. The pulse animation is disabled under
 * `prefers-reduced-motion`.
 */
function LiveStatusPill() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.success.main;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        flexShrink: 0,
        height: 26,
        px: 1.125,
        borderRadius: 999,
        border: `1px solid ${alpha(accent, isDark ? 0.4 : 0.3)}`,
        bgcolor: alpha(accent, isDark ? 0.16 : 0.1),
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: accent,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            bgcolor: accent,
            animation: "lcLivePulse 1800ms ease-out infinite",
          },
          "@keyframes lcLivePulse": {
            "0%": { transform: "scale(1)", opacity: 0.6 },
            "70%": { transform: "scale(2.6)", opacity: 0 },
            "100%": { transform: "scale(2.6)", opacity: 0 },
          },
          "@media (prefers-reduced-motion: reduce)": {
            "&::before": { animation: "none" },
          },
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 800,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          color: isDark ? alpha(accent, 0.95) : theme.palette.success.dark,
        }}
      >
        {t("shorter.statusLive")}
      </Typography>
    </Box>
  );
}
