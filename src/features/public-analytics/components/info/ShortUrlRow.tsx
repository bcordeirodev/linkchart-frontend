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
 * This is the one action the user came for after shortening a link, so the URL
 * keeps the strongest typography in the card without adding a colored surface.
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
  const shortUrlColor = isDark
    ? alpha(theme.palette.common.white, 0.96)
    : theme.palette.primary.dark;
  const buttonTextColor = isDark
    ? alpha(theme.palette.common.white, 0.96)
    : theme.palette.primary.dark;

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
          ...getPublicInsetSx(theme),
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
            color: buttonTextColor,
            border: `1px solid ${alpha(
              isDark ? theme.palette.divider : theme.palette.primary.main,
              isDark ? 0.38 : 0.24,
            )}`,
            bgcolor: alpha(
              isDark
                ? theme.palette.background.paper
                : theme.palette.primary.main,
              isDark ? 0.55 : 0.08,
            ),
            transition: "background-color 160ms ease, border-color 160ms ease",
            "&:hover": {
              bgcolor: alpha(
                isDark
                  ? theme.palette.background.paper
                  : theme.palette.primary.main,
                isDark ? 0.72 : 0.12,
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
