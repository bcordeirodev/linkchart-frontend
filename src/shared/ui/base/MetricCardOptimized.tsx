"use client";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { HelpHint } from "@/shared/ui/base/HelpHint";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { MetricCardProps } from "../components";

/**
 * Single-metric KPI card with optional trend indicator.
 *
 * Renders title + large numeric value + optional subtitle + icon, and an optional trend row (`↗ N%` in `success.main` when positive, `↘ N%` in `error.main` when negative) labelled with `t("analytics:metrics.vsPreviousPeriod")`. `MetricCardProps` is defined in `../components`.
 */
export function MetricCardOptimized({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  hint,
  trend,
  sx,
  ...other
}: MetricCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const colorConfig = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
  };

  const selectedColor = colorConfig[color];

  return (
    <Card
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${radiusTokens.md}px`,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? elevationTokens.xs
            : elevationLightTokens.xs,
        transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? elevationTokens.sm
              : elevationLightTokens.sm,
        },
        ...sx,
      }}
      {...other}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.25}
            sx={{ minWidth: 0 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            {hint ? <HelpHint label={hint} size={13} /> : null}
          </Stack>

          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: `${radiusTokens.sm}px`,
              // Solid-enough fill so the white glyph holds contrast in both
              // themes; the chip is the card's only accent.
              bgcolor: alpha(
                selectedColor,
                theme.palette.mode === "dark" ? 0.55 : 0.9,
              ),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.common.white,
              flexShrink: 0,
              "& svg": { width: 20, height: 20 },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* The number reads in ink — the icon chip alone carries the card's
            accent, so a row of KPIs doesn't turn into a rainbow. */}
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.01em",
            fontVariantNumeric: "tabular-nums",
            color: "text.primary",
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {value}
        </Typography>

        {subtitle ? (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}

        {trend ? (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: trend.isPositive ? "success.main" : "error.main",
                  fontWeight: 600,
                }}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("metrics.vsPreviousPeriod")}
              </Typography>
            </Box>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default MetricCardOptimized;
