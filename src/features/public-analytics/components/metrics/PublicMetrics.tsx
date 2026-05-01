"use client";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { PublicAnalyticsData } from "../../types";

interface PublicMetricsProps {
  analyticsData: PublicAnalyticsData;
}

const cardBase = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  p: "20px",
} as const;

const labelSx = {
  fontSize: "0.6875rem",
  color: "rgba(255,255,255,0.3)",
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.8px",
  mb: 1.25,
};

const subSx = {
  fontSize: "0.6875rem",
  color: "rgba(255,255,255,0.2)",
  mt: 1,
};

export function PublicMetrics({ analyticsData }: PublicMetricsProps) {
  const { t } = useTranslation("public");
  const createdDate = analyticsData.created_at
    ? new Date(analyticsData.created_at)
    : null;
  const isValid = createdDate !== null && !isNaN(createdDate.getTime());
  const dateLabel = isValid ? createdDate.toLocaleDateString() : "-";
  const timeLabel = isValid
    ? createdDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 1fr 1fr 1fr" },
        gap: "12px",
      }}
    >
      <Box
        sx={{
          ...cardBase,
          borderColor: "rgba(99,102,241,0.2)",
          gridColumn: { xs: "span 2", md: "span 1" },
        }}
      >
        <Typography sx={labelSx}>
          {t("publicAnalytics.metrics.totalClicks")}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "2.25rem", md: "2.5rem" },
            fontWeight: 800,
            color: "#818cf8",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {analyticsData.total_clicks.toLocaleString()}
        </Typography>
        <Typography sx={subSx}>
          {t("publicAnalytics.metrics.sinceCreation")}
        </Typography>
      </Box>

      <Box sx={cardBase}>
        <Typography sx={labelSx}>
          {t("publicAnalytics.metrics.status")}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            background: analyticsData.is_active
              ? "rgba(16,185,129,0.08)"
              : "rgba(239,68,68,0.08)",
            border: "1px solid",
            borderColor: analyticsData.is_active
              ? "rgba(16,185,129,0.22)"
              : "rgba(239,68,68,0.22)",
            borderRadius: "5px",
            px: 1.25,
            py: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: analyticsData.is_active ? "#34d399" : "#f87171",
            }}
          >
            {analyticsData.is_active
              ? t("publicAnalytics.metrics.active")
              : t("publicAnalytics.metrics.inactive")}
          </Typography>
        </Box>
        <Typography sx={subSx}>
          {t("publicAnalytics.metrics.operational")}
        </Typography>
      </Box>

      <Box sx={cardBase}>
        <Typography sx={labelSx}>
          {t("publicAnalytics.metrics.createdAt")}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.65)",
            mt: 0.25,
          }}
        >
          {dateLabel}
        </Typography>
        {timeLabel ? <Typography sx={subSx}>{timeLabel}</Typography> : null}
      </Box>

      <Box sx={cardBase}>
        <Typography sx={labelSx}>
          {t("publicAnalytics.metrics.analyticsLabel")}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            background: analyticsData.has_analytics
              ? "rgba(99,102,241,0.08)"
              : "rgba(255,255,255,0.04)",
            border: "1px solid",
            borderColor: analyticsData.has_analytics
              ? "rgba(99,102,241,0.22)"
              : "rgba(255,255,255,0.1)",
            borderRadius: "5px",
            px: 1.25,
            py: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: analyticsData.has_analytics
                ? "#a5b4fc"
                : "rgba(255,255,255,0.3)",
            }}
          >
            {analyticsData.has_analytics
              ? t("publicAnalytics.metrics.available")
              : t("publicAnalytics.metrics.noData")}
          </Typography>
        </Box>
        <Typography sx={subSx}>
          {t("publicAnalytics.metrics.dataCollected")}
        </Typography>
      </Box>
    </Box>
  );
}
