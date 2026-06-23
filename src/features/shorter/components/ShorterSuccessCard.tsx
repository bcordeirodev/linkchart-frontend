"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { BarChart3, Check, RotateCcw } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { DestinationRow } from "@/features/public-analytics/components/info/DestinationRow";
import { ShortUrlRow } from "@/features/public-analytics/components/info/ShortUrlRow";
import useClipboard from "@/hooks/useClipboard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockTitleSx,
  getPublicFocalSx,
} from "@/lib/theme/publicPageStyles";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { PublicBlockIcon } from "@/shared/ui/base";
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
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
          }}
        >
          <PublicBlockIcon
            icon={Check}
            sx={{
              color: alpha(theme.palette.common.white, isDark ? 0.96 : 0.94),
            }}
          />
          <Box sx={{ minWidth: 0 }}>
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
        </Box>

        {/* Hero short URL + its destination read as one unit. */}
        <Stack spacing={1}>
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 1, sm: 1.25 }}
          sx={{ pt: 0.25 }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            disableElevation
            onClick={handleViewAnalytics}
            startIcon={<BarChart3 {...ICON_MD} aria-hidden />}
            sx={{
              minHeight: 46,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              bgcolor: theme.palette.primary.dark,
              color: alpha(theme.palette.common.white, 0.95),
              border: `1px solid ${alpha(theme.palette.primary.light, 0.22)}`,
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.light, 0.34),
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
              minHeight: 46,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: theme.palette.text.primary,
              borderColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.45 : 0.34,
              ),
              bgcolor: "transparent",
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
            }}
          >
            {t("shorter.createAnother")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
