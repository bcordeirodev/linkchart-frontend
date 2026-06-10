"use client";
import { Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

interface CountryDistributionChartProps {
  countries: {
    country: string;
    clicks: number;
    currency?: string;
  }[];
}

export function CountryDistributionChart({
  countries,
}: CountryDistributionChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const chartData = countries.slice(0, 8).map((c) => ({
    name: c.country,
    value: c.clicks,
    currency: c.currency || "USD",
  }));

  if (chartData.length === 0) return null;

  return (
    <Card
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
        transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&:hover": {
          boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Globe size={16} strokeWidth={1.5} />
          {t("geographic.insights.countryDistribution")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("geographic.insights.pieSubtitle")}
        </Typography>
        <ApexChartWrapper
          type="pie"
          size="standard"
          {...formatPieChart(chartData, "name", "value", isDark)}
        />
      </CardContent>
    </Card>
  );
}
