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
import { getLinksBorderColor } from "./linksPanelStyles";

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
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;
  const success = theme.palette.success.main;
  const successDark = theme.palette.success.dark;
  const elevation = isDark ? elevationTokens : elevationLightTokens;
  const { t } = useTranslation("links");
  const { copied, copy } = useClipboard({ timeout: 1500 });

  const displayUrl = displayUrlProp ?? shortUrl.replace(/^https?:\/\//, "");

  const handleCopy = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    copy(shortUrl);
  };

  const copyFg = isDark ? theme.palette.common.white : primaryDark;
  const copyBgIdle = isDark ? alpha(primaryLight, 0.08) : alpha(primary, 0.05);
  const copyBgCopied = isDark ? alpha(success, 0.1) : alpha(success, 0.06);
  const idleCopyShadow = isDark ? elevation.xs : elevationLightTokens.xs;
  const copyBorderIdle = copied
    ? alpha(successDark, isDark ? 0.46 : 0.36)
    : alpha(primaryDark, isDark ? 0.42 : 0.3);
  const copyBorderHover = copied
    ? alpha(successDark, isDark ? 0.56 : 0.42)
    : alpha(primaryDark, isDark ? 0.5 : 0.36);
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
              borderTop: `1px solid ${getLinksBorderColor(theme)}`,
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
              <Check size={15} strokeWidth={2.5} color={copyFg} />
            ) : (
              <Copy size={15} strokeWidth={2} color={copyFg} />
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
            border: "2px solid",
            borderColor: copyBorderIdle,
            bgcolor: copied ? copyBgCopied : copyBgIdle,
            boxShadow: copied
              ? `0 1px 4px ${alpha(success, 0.2)}`
              : idleCopyShadow,
            "& .MuiButton-startIcon": {
              margin: 0,
              mr: 0.625,
              color: copyFg,
            },
            "&:hover": {
              border: "2px solid",
              borderColor: copyBorderHover,
              bgcolor: copied
                ? alpha(success, isDark ? 0.14 : 0.08)
                : alpha(primary, isDark ? 0.14 : 0.08),
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
              color: copied
                ? alpha(copyFg, 0.92)
                : alpha(theme.palette.text.primary, isDark ? 0.88 : 0.82),
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
              color: copyFg,
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
            variant="outlined"
            color="primary"
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
              border: "2px solid",
              borderColor: alpha(primaryDark, isDark ? 0.5 : 0.32),
              bgcolor: isDark ? alpha(primary, 0.58) : alpha(primary, 0.88),
              color: alpha(theme.palette.common.white, 0.96),
              boxShadow: isDark ? elevation.xs : elevationLightTokens.xs,
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
                borderColor: alpha(primaryDark, isDark ? 0.62 : 0.42),
                bgcolor: isDark ? alpha(primary, 0.68) : primaryDark,
                boxShadow: isDark ? elevation.sm : elevationLightTokens.sm,
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
