"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { BarChart3, Check, RotateCcw } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { DestinationRow } from "@/features/public-analytics/components/info/DestinationRow";
import { ShortUrlRow } from "@/features/public-analytics/components/info/ShortUrlRow";
import useClipboard from "@/hooks/useClipboard";
import { ICON_LG, ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicFocalSx,
  PUBLIC_CARD_GAP,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { useNavigate } from "@/shared/hooks";

import { SHORTER_CONTENT_MAX_WIDTH } from "../constants";

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
 * on the landing instead of redirecting to the public-analytics screen. The
 * short URL is the hero (copy is the primary action); the destination is a
 * quiet confirmation; viewing analytics is an explicit, opt-in secondary link.
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

  return (
    <Box
      component="article"
      aria-labelledby={cardHeadingId}
      sx={{
        /* Same premium focal treatment as the form it replaces and the signup
           CTA — a soft top glow + glass edge instead of a flat colored border.
           The green check badge carries the success cue. */
        ...getPublicFocalSx(theme),
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
      }}
    >
      <Stack spacing={PUBLIC_CARD_GAP} sx={{ p: { xs: 2.5, md: 3 } }}>
        {/* Success header: green check + "Link criado!" + share hint. */}
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Box
            aria-hidden
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: "50%",
              color: theme.palette.success.main,
              border: `1px solid ${alpha(
                theme.palette.success.main,
                isDark ? 0.5 : 0.45,
              )}`,
              bgcolor: alpha(theme.palette.success.main, isDark ? 0.16 : 0.12),
            }}
          >
            <Check {...ICON_LG} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id={cardHeadingId}
              component="h2"
              sx={{
                m: 0,
                fontSize: "1.0625rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                color: theme.palette.text.primary,
              }}
            >
              {t("shorter.successTitle")}
            </Typography>
            <Typography
              component="p"
              sx={{
                m: 0,
                mt: 0.25,
                fontSize: "0.8125rem",
                color: theme.palette.text.secondary,
                lineHeight: 1.4,
              }}
            >
              {t("shorter.successCopiedHint")}
            </Typography>
          </Box>
        </Stack>

        {/* Hero short URL + its destination read as one unit. */}
        <Stack spacing={0.85}>
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

        {/* Next steps. "View analytics" is the primary forward action (muted
            navy fill); "shorten another" is a lighter blue-accented outline. */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 1, sm: 1.25 }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            disableElevation
            onClick={handleViewAnalytics}
            startIcon={<BarChart3 {...ICON_MD} aria-hidden />}
            sx={{
              /* Muted navy fill — clearly the primary action, but softer than
                 the bright primary.main; brightens on hover. */
              bgcolor: theme.palette.primary.dark,
              color: alpha(theme.palette.common.white, 0.95),
              "&:hover": { bgcolor: theme.palette.primary.main },
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
              /* White label on a blue-accented outline — distinct and inviting,
                 but lighter than the filled primary "view analytics". */
              color: theme.palette.text.primary,
              borderColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.65 : 0.5,
              ),
              bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.14),
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
