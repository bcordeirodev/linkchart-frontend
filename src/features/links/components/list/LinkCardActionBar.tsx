"use client";

import { BarChart3, Check, ChevronRight, Copy } from "lucide-react";
import { alpha, Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { KeyboardEvent, MouseEvent } from "react";

import useClipboard from "@/hooks/useClipboard";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { SxProps, Theme } from "@mui/material";

const ACTION_HEIGHT = 36;
const ANALYTICS_MIN_WIDTH = { xs: 128, sm: 152 };

interface LinkCardActionBarProps {
  shortUrl: string;
  displayUrl?: string;
  onAnalytics: () => void;
  withTopBorder?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Action row for link cards: copy control (button-like strip) + Analytics CTA.
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
  const elevation = isDark ? elevationTokens : elevationLightTokens;
  const { t } = useTranslation("links");
  const { copied, copy } = useClipboard({ timeout: 1500 });

  const displayUrl = displayUrlProp ?? shortUrl.replace(/^https?:\/\//, "");

  const handleCopy = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    copy(shortUrl);
  };

  const idleCopyShadow = isDark ? elevation.xs : elevationLightTokens.xs;
  const copyBorderIdle = copied
    ? alpha(theme.palette.success.main, isDark ? 0.42 : 0.38)
    : alpha(primary, isDark ? 0.32 : 0.26);
  const copyBorderHover = copied
    ? alpha(theme.palette.success.main, isDark ? 0.55 : 0.5)
    : alpha(primary, isDark ? 0.48 : 0.4);

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
      <Tooltip title={copied ? t("actions.copySuccess") : shortUrl}>
        <Button
          variant="outlined"
          color={copied ? "success" : "primary"}
          fullWidth
          aria-label={t("actions.copyLink")}
          onClick={handleCopy}
          startIcon={
            copied ? (
              <Check size={15} strokeWidth={2.5} />
            ) : (
              <Copy size={15} strokeWidth={2} />
            )
          }
          sx={{
            flex: 1,
            minWidth: 0,
            height: ACTION_HEIGHT,
            minHeight: ACTION_HEIGHT,
            borderRadius: `${radiusTokens.md}px`,
            textTransform: "none",
            justifyContent: "flex-start",
            gap: 1.25,
            px: 1.5,
            py: 0,
            border: "1.5px solid",
            borderColor: copyBorderIdle,
            bgcolor: copied
              ? alpha(theme.palette.success.main, 0.06)
              : theme.palette.background.paper,
            boxShadow: copied
              ? `0 1px 4px ${alpha(theme.palette.success.main, 0.2)}`
              : idleCopyShadow,
            "& .MuiButton-startIcon": {
              margin: 0,
              mr: 0.625,
            },
            "&:hover": {
              border: "1.5px solid",
              borderColor: copyBorderHover,
              bgcolor: copied
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(primary, isDark ? 0.08 : 0.04),
              boxShadow: isDark ? elevation.sm : elevationLightTokens.sm,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              fontSize: "0.875rem",
              lineHeight: 1.25,
              letterSpacing: "0.01em",
              fontFamily: theme.typography.fontFamily,
              fontVariantNumeric: "tabular-nums",
              fontFeatureSettings: '"tnum"',
              fontWeight: 500,
              color: copied ? "success.main" : "text.primary",
            }}
          >
            {displayUrl}
          </Typography>
          <Typography
            component="span"
            sx={{
              flexShrink: 0,
              fontSize: "0.8125rem",
              lineHeight: 1.25,
              letterSpacing: "0.02em",
              fontWeight: 600,
              color: copied ? "success.main" : "primary.main",
            }}
          >
            {copied ? t("actions.copySuccess") : t("actions.copy")}
          </Typography>
        </Button>
      </Tooltip>

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
              minWidth: ANALYTICS_MIN_WIDTH,
              width: { xs: ANALYTICS_MIN_WIDTH.xs, sm: ANALYTICS_MIN_WIDTH.sm },
              boxSizing: "border-box",
              borderRadius: `${radiusTokens.md}px`,
              px: { xs: 1.5, sm: 2 },
              py: 0,
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.01em",
              textTransform: "none",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              bgcolor: isDark ? alpha(primary, 0.88) : primary,
              color: theme.palette.primary.contrastText,
              boxShadow: `0 1px 3px ${alpha(primary, isDark ? 0.35 : 0.25)}`,
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
                bgcolor: "primary.dark",
                boxShadow: `0 2px 8px ${alpha(primary, isDark ? 0.4 : 0.3)}`,
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
