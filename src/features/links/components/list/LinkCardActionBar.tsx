"use client";

import { BarChart3, Check, ChevronRight, Copy } from "lucide-react";
import {
  alpha,
  Box,
  Button,
  keyframes,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { KeyboardEvent, MouseEvent } from "react";

import useClipboard from "@/hooks/useClipboard";
import { radiusTokens } from "@/lib/theme/designSystem";

import type { SxProps, Theme } from "@mui/material";

const ACTION_HEIGHT = 34;

/** Subtle Analytics emphasis — slightly more visible than idle copy strip. */
const analyticsGlow = keyframes`
  0%, 100% {
    box-shadow: 0 1px 4px rgba(25, 118, 210, 0.18);
  }
  50% {
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.28);
  }
`;

interface LinkCardActionBarProps {
  shortUrl: string;
  displayUrl?: string;
  onAnalytics: () => void;
  withTopBorder?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Action row for link cards:
 * - Copy strip — primary utility: grab the short URL in one click (dominant width).
 * - Analytics — navigation CTA: open per-link stats (contained, visually anchored).
 */
export function LinkCardActionBar({
  shortUrl,
  displayUrl: displayUrlProp,
  onAnalytics,
  withTopBorder = false,
  sx,
}: LinkCardActionBarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const { t } = useTranslation("links");
  const { copied, copy } = useClipboard({ timeout: 1500 });

  const displayUrl = displayUrlProp ?? shortUrl.replace(/^https?:\/\//, "");

  const handleCopy = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    copy(shortUrl);
  };

  return (
    <Stack
      direction="row"
      alignItems="stretch"
      spacing={1}
      sx={{
        ...(withTopBorder
          ? {
              mt: 1,
              pt: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
            }
          : undefined),
        ...sx,
      }}
    >
      {/* Copy — the short URL is the product; make the control feel valuable */}
      <Tooltip title={copied ? t("actions.copySuccess") : shortUrl}>
        <Box
          role="button"
          tabIndex={0}
          aria-label={t("actions.copyLink")}
          onClick={handleCopy}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCopy(e);
            }
          }}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            minWidth: 0,
            height: ACTION_HEIGHT,
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
            cursor: "pointer",
            overflow: "hidden",
            transition:
              "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
            userSelect: "none",
            boxShadow: "none",
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
              px: 1.125,
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
              px: 1.125,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.8125rem",
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

      {/* Analytics — same height / radius / padding rhythm as copy strip */}
      <Tooltip title={t("actions.viewAnalytics", { ns: "common" })}>
        <Box
          sx={{
            flexShrink: 0,
            height: ACTION_HEIGHT,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<BarChart3 size={14} strokeWidth={2} />}
            endIcon={<ChevronRight size={14} strokeWidth={2.5} />}
            onClick={(e) => {
              e.stopPropagation();
              onAnalytics();
            }}
            sx={{
              height: ACTION_HEIGHT,
              minHeight: ACTION_HEIGHT,
              boxSizing: "border-box",
              borderRadius: `${radiusTokens.md}px`,
              px: 1.125,
              py: 0,
              fontSize: "0.8125rem",
              fontWeight: 600,
              textTransform: "none",
              lineHeight: 1,
              bgcolor: isDark ? alpha(primary, 0.82) : primary,
              color: theme.palette.primary.contrastText,
              animation: `${analyticsGlow} 4s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                boxShadow: `0 1px 4px ${alpha(primary, 0.2)}`,
              },
              "& .MuiButton-startIcon": {
                margin: 0,
                mr: 0.5,
              },
              "& .MuiButton-endIcon": {
                margin: 0,
                ml: 0.375,
                opacity: 0.9,
                display: { xs: "none", sm: "inherit" },
              },
              "&:hover": {
                animation: "none",
                bgcolor: "primary.dark",
                boxShadow: `0 2px 8px ${alpha(primary, isDark ? 0.35 : 0.28)}`,
              },
            }}
          >
            {t("actions.analytics")}
          </Button>
        </Box>
      </Tooltip>
    </Stack>
  );
}

export default LinkCardActionBar;
