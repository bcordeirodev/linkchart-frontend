"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const PROTOCOL_PREFIX = /^https?:\/\//;

interface LinkActionsShortUrlProps {
  url: string;
  /** MUI typography variant for the wrapper */
  variant?: "body2" | "caption";
}

/**
 * Monospace short URL with a muted `https://` prefix — same rhythm as
 * list cards and the /shorter subdomain preview.
 */
export function LinkActionsShortUrl({
  url,
  variant = "body2",
}: LinkActionsShortUrlProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const hasProtocol = PROTOCOL_PREFIX.test(url);
  const protocol = hasProtocol ? url.match(PROTOCOL_PREFIX)?.[0] ?? "" : "";
  const remainder = hasProtocol ? url.replace(PROTOCOL_PREFIX, "") : url;

  const mutedColor = alpha(theme.palette.text.primary, isDark ? 0.55 : 0.58);
  const bodyColor = alpha(theme.palette.text.primary, isDark ? 0.88 : 0.85);

  return (
    <Typography
      variant={variant}
      component="p"
      sx={{
        m: 0,
        fontFamily:
          'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
        fontSize:
          variant === "caption"
            ? "0.75rem"
            : { xs: "0.75rem", sm: "0.8125rem" },
        fontWeight: 600,
        lineHeight: 1.45,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: bodyColor,
      }}
    >
      {protocol ? (
        <Box component="span" sx={{ fontWeight: 600, color: mutedColor }}>
          {protocol}
        </Box>
      ) : null}
      {remainder}
    </Typography>
  );
}

export default LinkActionsShortUrl;
