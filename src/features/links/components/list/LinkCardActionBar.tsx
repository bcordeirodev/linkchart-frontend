"use client";

import { BarChart3, Check, ChevronRight, Copy } from "lucide-react";
import { alpha, Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { KeyboardEvent, MouseEvent } from "react";

import useClipboard from "@/shared/hooks/useClipboard";
import { radiusTokens } from "@/lib/theme/designSystem";
import { getLinksBorderColor } from "./linksPanelStyles";

import type { SxProps, Theme } from "@mui/material";

const ACTION_HEIGHT = 36;
/** Taller copy control on touch viewports (≥44px tap target) when analytics moves to the card body. */
const ACTION_HEIGHT_TOUCH = { xs: 44, sm: ACTION_HEIGHT } as const;
const ANALYTICS_MIN_WIDTH = { xs: 128, sm: 152 };

interface LinkCardActionBarProps {
  shortUrl: string;
  displayUrl?: string;
  onAnalytics: () => void;
  withTopBorder?: boolean;
  /**
   * How the user reaches analytics from this card.
   * - `"inline"` (default, desktop): renders the Analytics button beside copy.
   * - `"card"` (mobile): hides the Analytics button (the card body is tappable
   *   instead) and lets the copy control fill the row at a ≥44px tap height.
   */
  analyticsAccess?: "inline" | "card";
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
  analyticsAccess = "inline",
  sx,
}: LinkCardActionBarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const successDark = theme.palette.success.dark;
  const { t } = useTranslation("links");
  const { copied, copy } = useClipboard({ timeout: 1500 });

  const displayUrl = displayUrlProp ?? shortUrl.replace(/^https?:\/\//, "");

  // Split host/path prefix from the slug so the part the user actually chose
  // (and scans for) reads strong while the repeated host stays dim.
  const slashIndex = displayUrl.lastIndexOf("/");
  const urlPrefix = slashIndex >= 0 ? displayUrl.slice(0, slashIndex + 1) : "";
  const urlSlug =
    slashIndex >= 0 ? displayUrl.slice(slashIndex + 1) : displayUrl;

  const handleCopy = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    copy(shortUrl);
  };

  // Quiet-by-default copy strip: neutral at rest, green only while "Copied".
  const copyLabelFg = copied
    ? isDark
      ? theme.palette.success.light
      : successDark
    : theme.palette.text.secondary;
  const copyBgIdle = isDark
    ? alpha(theme.palette.common.white, 0.03)
    : alpha(theme.palette.common.black, 0.025);
  const copyBgCopied = isDark ? alpha(success, 0.1) : alpha(success, 0.06);
  const copyBorderIdle = copied
    ? alpha(successDark, isDark ? 0.46 : 0.36)
    : getLinksBorderColor(theme);
  const copyBorderHover = copied
    ? alpha(successDark, isDark ? 0.56 : 0.42)
    : alpha(theme.palette.text.primary, isDark ? 0.22 : 0.18);

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
          color={copied ? "success" : "inherit"}
          fullWidth
          aria-label={t("actions.copyLink")}
          onClick={handleCopy}
          startIcon={
            copied ? (
              <Check size={15} strokeWidth={2.5} color={copyLabelFg} />
            ) : (
              <Copy size={15} strokeWidth={2} color={copyLabelFg} />
            )
          }
          sx={{
            flex: 1,
            minWidth: 0,
            height:
              analyticsAccess === "card" ? ACTION_HEIGHT_TOUCH : ACTION_HEIGHT,
            minHeight:
              analyticsAccess === "card" ? ACTION_HEIGHT_TOUCH : ACTION_HEIGHT,
            borderRadius: `${radiusTokens.sm}px`,
            textTransform: "none",
            justifyContent: "flex-start",
            gap: 1.25,
            px: 1.5,
            py: 0,
            border: "1px solid",
            borderColor: copyBorderIdle,
            bgcolor: copied ? copyBgCopied : copyBgIdle,
            boxShadow: "none",
            "& .MuiButton-startIcon": {
              margin: 0,
              mr: 0.625,
              color: copyLabelFg,
            },
            "&:hover": {
              border: "1px solid",
              borderColor: copyBorderHover,
              bgcolor: copied
                ? alpha(success, isDark ? 0.14 : 0.08)
                : theme.palette.action.hover,
              boxShadow: "none",
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
            component="span"
            sx={{
              flexShrink: 0,
              fontSize: "0.8125rem",
              lineHeight: 1.25,
              letterSpacing: "0.02em",
              fontWeight: 600,
              color: copyLabelFg,
            }}
          >
            {copied ? t("actions.copySuccess") : t("actions.copy")}
          </Typography>
        </Button>
      </Tooltip>

      {analyticsAccess === "inline" ? (
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
                width: {
                  xs: ANALYTICS_MIN_WIDTH.xs,
                  sm: ANALYTICS_MIN_WIDTH.sm,
                },
                boxSizing: "border-box",
                borderRadius: `${radiusTokens.sm}px`,
                px: { xs: 1.5, sm: 2 },
                py: 0,
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                textTransform: "none",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                bgcolor: isDark ? alpha(primary, 0.58) : alpha(primary, 0.88),
                color: alpha(theme.palette.common.white, 0.96),
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
                  bgcolor: isDark
                    ? alpha(primary, 0.68)
                    : theme.palette.primary.dark,
                },
              }}
            >
              {t("actions.analytics")}
            </Button>
          </Box>
        </Tooltip>
      ) : null}
    </Stack>
  );
}

export default LinkCardActionBar;
