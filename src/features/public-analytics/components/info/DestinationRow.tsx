"use client";

import { Box, Link, Typography, useTheme } from "@mui/material";
import { ExternalLink } from "lucide-react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";

interface DestinationRowProps {
  /** The original (long) destination URL. */
  destinationUrl: string;
  /**
   * Id for the section heading — enables `aria-labelledby` on the
   * wrapping `<section>` element.
   */
  headingId: string;
}

/**
 * Destination row: label + external-link icon + truncated destination URL.
 *
 * Rendered at a smaller font size than `ShortUrlRow` to keep the visual
 * hierarchy clear — short URL is the protagonist, destination is secondary.
 *
 * @remarks
 * Read-only; no clipboard action. The link opens in a new tab.
 */
export function DestinationRow({
  destinationUrl,
  headingId,
}: DestinationRowProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const iconColor = alpha(theme.palette.common.white, isDark ? 0.95 : 0.92);

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
        {t("publicAnalytics.linkInfo.destination")}
      </Typography>
      <Box
        sx={{
          ...getPublicInsetSx(theme),
          p: { xs: 1.15, sm: 1.25 },
          display: "flex",
          alignItems: "center",
          gap: 0.75,
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <ExternalLink size={14} strokeWidth={1.75} aria-hidden />
        </Box>
        <Link
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: alpha(theme.palette.text.primary, isDark ? 0.74 : 0.78),
            fontFamily: "monospace",
            fontSize: "0.8125rem",
            "&:hover": { color: "text.primary" },
          }}
        >
          {destinationUrl}
        </Link>
      </Box>
    </Box>
  );
}
