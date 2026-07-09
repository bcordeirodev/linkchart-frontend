"use client";

import { Box, Chip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { semanticDark, semanticLight } from "@/lib/theme/colors";

export function LinkExample({
  url,
  highlightPrefix,
}: {
  url: string;
  highlightPrefix?: string;
}) {
  if (highlightPrefix && url.startsWith(highlightPrefix)) {
    const rest = url.slice(highlightPrefix.length);
    return (
      <Typography
        variant="caption"
        component="div"
        sx={{
          fontFamily: "monospace",
          lineHeight: 1.9,
          wordBreak: "break-all",
        }}
      >
        <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
          {highlightPrefix}
        </Box>
        <Box component="span" sx={{ color: "text.secondary" }}>
          {rest}
        </Box>
      </Typography>
    );
  }

  return (
    <Typography
      variant="caption"
      component="div"
      sx={{
        fontFamily: "monospace",
        color: "text.secondary",
        lineHeight: 1.9,
        wordBreak: "break-all",
      }}
    >
      {url}
    </Typography>
  );
}

export function SubdomainStatusChip({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const semantic = isDark ? semanticDark : semanticLight;
  const free = semantic.success;

  const main = active
    ? isDark
      ? theme.palette.common.white
      : theme.palette.text.primary
    : free.main;
  const bg = active
    ? alpha(theme.palette.common.white, isDark ? 0.08 : 0.04)
    : free.subtleBg;
  const border = active ? theme.palette.divider : free.border;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        fontWeight: 600,
        fontSize: "0.6875rem",
        letterSpacing: 0.2,
        bgcolor: bg,
        color: main,
        border: `1px solid ${border}`,
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}
