"use client";

import { Box, Link, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";

import { CopyIconButton } from "./CopyIconButton";

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
 * Short URL row: label + monospace link (largest/boldest URL in the card) +
 * bordered copy `IconButton`.
 *
 * The short URL is the visual protagonist of the hero card and is rendered
 * at a larger font size than the destination row.
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
  const shortUrlColor = alpha(theme.palette.common.white, isDark ? 0.95 : 0.92);

  const sectionLabelSx = {
    display: "block",
    mb: 0.9,
    fontSize: "0.71875rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: alpha(theme.palette.text.primary, isDark ? 0.76 : 0.72),
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
        {t("publicAnalytics.linkInfo.shortenedLink")}
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={1}
        sx={{
          ...getPublicInsetSx(theme, { primaryTint: true }),
          p: { xs: 1.25, sm: 1.5 },
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
            fontSize: { xs: "0.9375rem", md: "1rem" },
            fontWeight: 600,
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
        <CopyIconButton
          copied={copied}
          onClick={onCopy}
          ariaLabel={t("publicAnalytics.linkInfo.copy")}
          disabled={!shortUrl}
        />
      </Stack>
    </Box>
  );
}
