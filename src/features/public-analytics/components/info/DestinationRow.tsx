"use client";

import { Box, Link, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { ICON_SM } from "@/lib/theme/iconDefaults";

interface DestinationRowProps {
  /** The original (long) destination URL. */
  destinationUrl: string;
  /**
   * Id for the inline label — enables `aria-labelledby` on the
   * wrapping element.
   */
  headingId: string;
}

/**
 * Destination confirmation: a full-width, very soft chip ("🌐 Destino: <url>")
 * shown directly under the hero short-URL row. The subtle surface and leading
 * globe icon set the destination apart quietly; the white label/URL keep it
 * legible while the short URL stays the protagonist.
 *
 * @remarks
 * The link opens in a new tab. The full URL is preserved in the link target
 * while a cleaned host+path (no scheme/www/trailing slash) is shown.
 */
export function DestinationRow({
  destinationUrl,
  headingId,
}: DestinationRowProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  /* Cleaner display: drop the scheme, a leading www., and any trailing slash.
     The full URL is preserved in the link target. */
  const displayUrl = destinationUrl
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        minWidth: 0,
        width: "100%",
        px: 1.25,
        py: 0.875,
        borderRadius: `${radiusTokens.md}px`,
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.2 : 0.24)}`,
        bgcolor: alpha(theme.palette.text.primary, isDark ? 0.03 : 0.035),
      }}
    >
      <Globe
        {...ICON_SM}
        aria-hidden
        style={{
          color: alpha(theme.palette.primary.light, isDark ? 0.9 : 0.78),
          flexShrink: 0,
        }}
      />
      <Typography
        id={headingId}
        component="span"
        sx={{
          flexShrink: 0,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: alpha(theme.palette.text.primary, isDark ? 0.64 : 0.66),
        }}
      >
        {t("publicAnalytics.linkInfo.destination")}:
      </Typography>
      <Link
        href={destinationUrl}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: alpha(theme.palette.text.primary, isDark ? 0.88 : 0.9),
          fontFamily: "monospace",
          fontSize: "0.8125rem",
          "&:hover": { color: theme.palette.primary.light },
        }}
      >
        {displayUrl}
      </Link>
    </Box>
  );
}
