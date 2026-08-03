"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { typographyScale } from "@/lib/theme";

const PROTOCOL_PREFIX = /^https?:\/\//;

interface LinkActionsShortUrlProps {
  url: string;
  /** MUI typography variant for the wrapper */
  variant?: "body2" | "caption";
}

/**
 * Short URL line — dim host/path prefix, strong slug, JetBrains Mono
 * (`typographyScale.code.fontFamily`). Same identity treatment as the copy
 * strips in the /links cards and quick-create — "instrumento técnico"
 * redesign (2026-08-03) restores mono here: a prior pass had moved this one
 * spot to the body face for visual consistency with its neighbors, but the
 * redesign's rule has no exception for URLs/slugs, so this now matches the
 * rest of the app instead of being the one outlier.
 */
export function LinkActionsShortUrl({
  url,
  variant = "body2",
}: LinkActionsShortUrlProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const remainder = url.replace(PROTOCOL_PREFIX, "");

  const slashIndex = remainder.lastIndexOf("/");
  const prefix = slashIndex >= 0 ? remainder.slice(0, slashIndex + 1) : "";
  const slug = slashIndex >= 0 ? remainder.slice(slashIndex + 1) : remainder;

  const mutedColor = alpha(theme.palette.text.primary, isDark ? 0.5 : 0.45);
  const bodyColor = alpha(theme.palette.text.primary, isDark ? 0.88 : 0.85);

  return (
    <Typography
      variant={variant}
      component="p"
      sx={{
        m: 0,
        fontFamily: typographyScale.code.fontFamily,
        fontSize:
          variant === "caption"
            ? "0.75rem"
            : { xs: "0.75rem", sm: "0.8125rem" },
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum"',
        lineHeight: 1.45,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: bodyColor,
      }}
    >
      {prefix ? (
        <Box component="span" sx={{ color: mutedColor }}>
          {prefix}
        </Box>
      ) : null}
      <Box component="span" sx={{ fontWeight: 600 }}>
        {slug}
      </Box>
    </Typography>
  );
}

export default LinkActionsShortUrl;
