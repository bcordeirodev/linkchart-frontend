"use client";

import { Box, Button, Link, Stack, Typography, useTheme } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";

interface ShortUrlRowProps {
  /** Fully-resolved short URL to display and copy. */
  shortUrl: string;
  /** Whether the short URL was recently copied. */
  copied: boolean;
  /** Triggers clipboard write for the short URL. */
  onCopy: () => void;
  /**
   * Id for the section heading — enables `aria-labelledby` on the
   * wrapping `<section>` element.
   */
  headingId: string;
}

/**
 * Hero short-URL row: label + monospace link (the single visual protagonist of
 * the card) + a labelled copy `Button`.
 *
 * This is the one action the user came for after shortening a link, so it gets
 * the strongest treatment in the card short of the gradient "shorten another"
 * CTA: a larger tinted surface, the boldest/largest URL, and an explicit
 * "Copiar" button (instead of a bare icon) to make the primary action obvious.
 *
 * @remarks
 * Clipboard state is managed by the parent via `useClipboard`; this component
 * is purely presentational.
 */
export function ShortUrlRow({
  shortUrl,
  copied,
  onCopy,
  headingId,
}: ShortUrlRowProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const shortUrlColor = alpha(theme.palette.common.white, isDark ? 0.96 : 0.94);

  const sectionLabelSx = {
    display: "block",
    mb: 0.9,
    fontSize: "0.71875rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: alpha(theme.palette.text.primary, isDark ? 0.78 : 0.74),
  };

  return (
    <Box component="section" aria-labelledby={headingId}>
      <Typography
        id={headingId}
        component="h3"
        variant="overline"
        color="text.secondary"
        sx={sectionLabelSx}
      >
        {t("publicAnalytics.linkInfo.yourShortLink")}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={{ xs: 1, sm: 1.25 }}
        sx={{
          ...getPublicInsetSx(theme, { primaryTint: true }),
          /* Slightly stronger accent border so the hero stands apart. */
          borderColor: alpha(theme.palette.primary.main, isDark ? 0.32 : 0.28),
          p: { xs: 1.5, sm: 1.75 },
        }}
      >
        <Typography
          component="p"
          sx={{
            flex: 1,
            minWidth: 0,
            m: 0,
            fontFamily: "monospace",
            /* Short URL is the largest/boldest URL in the card */
            fontSize: { xs: "1rem", md: "1.0625rem" },
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
        <Button
          onClick={onCopy}
          disabled={!shortUrl}
          startIcon={
            copied ? (
              <Check {...ICON_SM} aria-hidden />
            ) : (
              <Copy {...ICON_SM} aria-hidden />
            )
          }
          sx={{
            flexShrink: 0,
            px: 1.75,
            py: 0.9,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 1.5,
            whiteSpace: "nowrap",
            color: alpha(theme.palette.common.white, isDark ? 0.96 : 0.94),
            border: `1px solid ${alpha(
              theme.palette.divider,
              isDark ? 0.38 : 0.42,
            )}`,
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.55 : 0.9),
            transition: "background-color 160ms ease, border-color 160ms ease",
            "&:hover": {
              bgcolor: alpha(
                theme.palette.background.paper,
                isDark ? 0.72 : 0.98,
              ),
              borderColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.5 : 0.45,
              ),
            },
            "&.Mui-disabled": { opacity: 0.4 },
          }}
        >
          {copied
            ? t("publicAnalytics.linkInfo.copied")
            : t("publicAnalytics.linkInfo.copy")}
        </Button>
      </Stack>
    </Box>
  );
}
