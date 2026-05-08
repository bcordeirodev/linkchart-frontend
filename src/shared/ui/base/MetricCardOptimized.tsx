"use client";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { MetricCardProps } from "../components";

/**
 * Card de métricas otimizado e reutilizável
 */
export function MetricCardOptimized({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
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
        borderRadius: `${radiusTokens.lg}px`,
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
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: selectedColor,
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
          </Box>

          <Box
            sx={{
              color: selectedColor,
              fontSize: "2rem",
              opacity: 0.8,
            }}
          >
            {icon}
          </Box>
        </Box>

        {trend ? (
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
        ) : null}
      </CardContent>
    </Card>
  );
}

export default MetricCardOptimized;
