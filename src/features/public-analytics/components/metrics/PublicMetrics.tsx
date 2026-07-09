"use client";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MousePointerClick, Activity, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getPublicMetricCardSx } from "@/lib/theme/publicPageStyles";
import { formatCount } from "@/lib/utils/formatNumber";
import { useCountUp } from "@/shared/hooks/useCountUp";

import type { PublicAnalyticsData } from "../../types";

interface PublicMetricsProps {
  analyticsData: PublicAnalyticsData;
}

export function PublicMetrics({ analyticsData }: PublicMetricsProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";

  const animatedClicks = useCountUp(analyticsData.total_clicks);

  if (analyticsData.total_clicks < 1) {
    return null;
  }

  const cardBase = getPublicMetricCardSx(theme);
  const cardAccent = getPublicMetricCardSx(theme, true);

  const labelColor = alpha(theme.palette.text.primary, isDark ? 0.5 : 0.6);
  const subColor = alpha(theme.palette.text.primary, isDark ? 0.4 : 0.5);
  const dateColor = alpha(theme.palette.text.primary, isDark ? 0.78 : 0.85);

  const labelSx = {
    fontSize: "0.6875rem",
    color: labelColor,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  };

  const subSx = {
    fontSize: "0.6875rem",
    color: subColor,
    mt: 1,
  };

  const createdDate = analyticsData.created_at
    ? new Date(analyticsData.created_at)
    : null;
  const isValid = createdDate !== null && !isNaN(createdDate.getTime());
  const dateLabel = isValid
    ? createdDate.toLocaleDateString(i18n.language)
    : "-";
  const timeLabel = isValid
    ? createdDate.toLocaleTimeString(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const isActive = analyticsData.is_active;
  const statusTone = isActive
    ? theme.palette.success.main
    : theme.palette.error.main;
  const statusBg = isActive
    ? alpha(theme.palette.success.main, isDark ? 0.14 : 0.1)
    : alpha(theme.palette.error.main, isDark ? 0.14 : 0.1);
  const statusBorder = isActive
    ? alpha(theme.palette.success.main, isDark ? 0.38 : 0.3)
    : alpha(theme.palette.error.main, isDark ? 0.38 : 0.3);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 1fr 1fr" },
        gap: { xs: "10px", md: "12px" },
      }}
    >
      <Box
        sx={{
          ...cardAccent,
          gridColumn: { xs: "span 2", md: "span 1" },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}
        >
          <MousePointerClick
            size={12}
            strokeWidth={1.75}
            color={alpha(theme.palette.primary.main, 0.65)}
          />
          <Typography sx={labelSx}>
            {t("publicAnalytics.metrics.totalClicks")}
          </Typography>
        </Box>
        <Typography
          component="p"
          aria-hidden="true"
          sx={{
            fontSize: { xs: "2.75rem", md: "3.25rem" },
            fontWeight: 800,
            color: alpha(theme.palette.primary.main, isDark ? 0.95 : 0.9),
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}
        >
          {formatCount(animatedClicks, i18n.language)}
        </Typography>
        <Box
          component="span"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
          }}
        >
          {formatCount(analyticsData.total_clicks, i18n.language)}
        </Box>
        <Typography sx={subSx}>
          {t("publicAnalytics.metrics.sinceCreation")}
        </Typography>
      </Box>

      <Box sx={cardBase}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}
        >
          <Activity
            size={12}
            strokeWidth={1.75}
            color={
              isActive
                ? alpha(theme.palette.success.main, 0.65)
                : alpha(theme.palette.error.main, 0.65)
            }
          />
          <Typography sx={labelSx}>
            {t("publicAnalytics.metrics.status")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            background: statusBg,
            border: `1px solid ${statusBorder}`,
            borderRadius: "999px",
            px: 1.25,
            py: 0.4,
            mt: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: statusTone,
              letterSpacing: "0.01em",
            }}
          >
            {isActive
              ? t("publicAnalytics.metrics.active")
              : t("publicAnalytics.metrics.inactive")}
          </Typography>
        </Box>
        <Typography sx={subSx}>
          {t("publicAnalytics.metrics.operational")}
        </Typography>
      </Box>

      <Box sx={cardBase}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}
        >
          <CalendarDays
            size={12}
            strokeWidth={1.75}
            color={alpha(theme.palette.text.primary, 0.4)}
          />
          <Typography sx={labelSx}>
            {t("publicAnalytics.metrics.createdAt")}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: dateColor,
            mt: 0.25,
            letterSpacing: "-0.01em",
          }}
        >
          {dateLabel}
        </Typography>
        {timeLabel ? <Typography sx={subSx}>{timeLabel}</Typography> : null}
      </Box>
    </Box>
  );
}
