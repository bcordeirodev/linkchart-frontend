"use client";

import { Box, Button, Tooltip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, ClipboardCopy, Copy } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { KeyboardEvent, MouseEvent } from "react";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import useClipboard from "@/shared/hooks/useClipboard";

const STRIP_HEIGHT = 34;

interface LinkActionsCopyButtonProps {
  shortUrl?: string;
  disabled?: boolean;
  /** Full-width contained button (mobile). */
  fullWidth?: boolean;
}

export function LinkActionsCopyButton({
  shortUrl,
  disabled = false,
  fullWidth = false,
}: LinkActionsCopyButtonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const copyFg = theme.palette.common.white;
  const { t } = useTranslation("links");
  const { copied, copy } = useClipboard({ timeout: 1500 });

  const handleCopy = useCallback(
    (e?: MouseEvent | KeyboardEvent) => {
      e?.stopPropagation?.();
      if (shortUrl) {
        void copy(shortUrl);
      }
    },
    [shortUrl, copy],
  );

  if (fullWidth) {
    return (
      <Button
        variant="contained"
        color={copied ? "success" : "primary"}
        onClick={() => handleCopy()}
        startIcon={
          copied ? <Check {...ICON_MD} /> : <ClipboardCopy {...ICON_MD} />
        }
        disabled={disabled || !shortUrl}
        fullWidth
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 600,
          py: 0.875,
          // Comfortable tap height on phones (full-width copy CTA).
          minHeight: { xs: 44, sm: "auto" },
          color: copyFg,
          "& .MuiButton-startIcon": { color: copyFg },
        }}
      >
        {copied ? t("actions.copySuccess") : t("actions.copyLink")}
      </Button>
    );
  }

  const displayUrl = shortUrl?.replace(/^https?:\/\//, "") ?? "";

  // Same identity split as the /links copy strip: dim host, strong slug.
  const slashIndex = displayUrl.lastIndexOf("/");
  const urlPrefix = slashIndex >= 0 ? displayUrl.slice(0, slashIndex + 1) : "";
  const urlSlug =
    slashIndex >= 0 ? displayUrl.slice(slashIndex + 1) : displayUrl;

  const labelFg = copied
    ? isDark
      ? theme.palette.success.light
      : theme.palette.success.dark
    : theme.palette.text.secondary;

  return (
    <Tooltip title={copied ? t("actions.copySuccess") : shortUrl ?? ""}>
      <Box
        role="button"
        tabIndex={disabled || !shortUrl ? -1 : 0}
        aria-label={t("actions.copyLink")}
        aria-disabled={disabled || !shortUrl}
        onClick={(e) => {
          if (!disabled && shortUrl) {
            handleCopy(e);
          }
        }}
        onKeyDown={(e) => {
          if (disabled || !shortUrl) {
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCopy(e);
          }
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.25,
          minWidth: { sm: 200 },
          maxWidth: { sm: 300 },
          width: { xs: "100%", sm: "auto" },
          height: STRIP_HEIGHT,
          borderRadius: `${radiusTokens.sm}px`,
          border: `1px solid ${
            copied
              ? alpha(theme.palette.success.dark, isDark ? 0.46 : 0.36)
              : theme.palette.divider
          }`,
          bgcolor: copied
            ? alpha(theme.palette.success.main, isDark ? 0.1 : 0.06)
            : isDark
              ? alpha(theme.palette.common.white, 0.03)
              : alpha(theme.palette.common.black, 0.025),
          cursor: disabled || !shortUrl ? "not-allowed" : "pointer",
          opacity: disabled || !shortUrl ? 0.5 : 1,
          overflow: "hidden",
          flexShrink: 0,
          transition: "border-color 0.15s ease, background-color 0.15s ease",
          pointerEvents: disabled || !shortUrl ? "none" : "auto",
          "&:hover": {
            borderColor: copied
              ? alpha(theme.palette.success.dark, isDark ? 0.56 : 0.42)
              : alpha(theme.palette.text.primary, isDark ? 0.22 : 0.18),
            bgcolor: copied
              ? alpha(theme.palette.success.main, isDark ? 0.14 : 0.08)
              : theme.palette.action.hover,
          },
          "&:focus-visible": {
            outline: `2px solid ${alpha(primary, 0.5)}`,
            outlineOffset: 1,
          },
        }}
      >
        {copied ? (
          <Check size={14} strokeWidth={2.5} color={labelFg} />
        ) : (
          <Copy size={14} strokeWidth={2} color={labelFg} />
        )}
        <Typography
          component="span"
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.8125rem",
            fontFamily: theme.typography.fontFamily,
            fontVariantNumeric: "tabular-nums",
            fontFeatureSettings: '"tnum"',
            fontWeight: 500,
            color: alpha(theme.palette.text.primary, isDark ? 0.88 : 0.82),
          }}
        >
          {urlPrefix ? (
            <Box
              component="span"
              sx={{
                color: alpha(theme.palette.text.primary, isDark ? 0.5 : 0.45),
              }}
            >
              {urlPrefix}
            </Box>
          ) : null}
          <Box component="span" sx={{ fontWeight: 600 }}>
            {urlSlug}
          </Box>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: "0.75rem",
            color: labelFg,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {copied ? t("actions.copySuccess") : t("actions.copy")}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default LinkActionsCopyButton;
