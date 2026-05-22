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
        }}
      >
        {copied ? t("actions.copySuccess") : t("actions.copyLink")}
      </Button>
    );
  }

  const displayUrl = shortUrl?.replace(/^https?:\/\//, "") ?? "";

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
          alignItems: "stretch",
          minWidth: { sm: 200 },
          maxWidth: { sm: 300 },
          width: { xs: "100%", sm: "auto" },
          height: STRIP_HEIGHT,
          borderRadius: `${radiusTokens.md}px`,
          border: `1px solid ${
            copied
              ? alpha(theme.palette.success.main, 0.4)
              : theme.palette.divider
          }`,
          bgcolor: copied
            ? alpha(theme.palette.success.main, 0.05)
            : isDark
              ? alpha(theme.palette.common.white, 0.03)
              : alpha(theme.palette.common.black, 0.02),
          cursor: disabled || !shortUrl ? "not-allowed" : "pointer",
          opacity: disabled || !shortUrl ? 0.5 : 1,
          overflow: "hidden",
          flexShrink: 0,
          transition: "border-color 0.15s ease, background-color 0.15s ease",
          pointerEvents: disabled || !shortUrl ? "none" : "auto",
          "&:hover": {
            borderColor: copied
              ? alpha(theme.palette.success.main, 0.5)
              : alpha(primary, 0.28),
            bgcolor: copied
              ? alpha(theme.palette.success.main, 0.08)
              : alpha(primary, 0.04),
          },
          "&:focus-visible": {
            outline: `2px solid ${alpha(primary, 0.5)}`,
            outlineOffset: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            flexShrink: 0,
            bgcolor: copied ? theme.palette.success.main : primary,
            borderRight: `1px solid ${
              copied
                ? alpha(theme.palette.success.dark, 0.35)
                : alpha(theme.palette.primary.dark, 0.25)
            }`,
          }}
        >
          {copied ? (
            <Check
              size={14}
              strokeWidth={2.5}
              color={theme.palette.success.contrastText}
            />
          ) : (
            <Copy
              size={14}
              strokeWidth={2}
              color={theme.palette.primary.contrastText}
            />
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: "0.6875rem",
              color: copied
                ? theme.palette.success.contrastText
                : theme.palette.primary.contrastText,
              whiteSpace: "nowrap",
            }}
          >
            {copied ? t("actions.copySuccess") : t("actions.copy")}
          </Typography>
        </Box>
        <Typography
          component="span"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            px: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.75rem",
            fontFamily:
              'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
            fontWeight: 500,
            color: copied ? "success.main" : "text.primary",
          }}
        >
          {displayUrl}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default LinkActionsCopyButton;
