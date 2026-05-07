"use client";
import { Lightbulb, Target, BarChart3, TrendingUp, Wrench } from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { DeviceData } from "@/types";

interface DataSaverStats {
  clicks: number;
  total: number;
  percentage: number;
}

interface AudienceInsightsProps {
  deviceBreakdown: DeviceData[];
  browserBreakdown?: unknown[];
  totalClicks: number;
  showAdvancedInsights?: boolean;
  dataSaver?: DataSaverStats;
}

export function AudienceInsights({
  deviceBreakdown,
  browserBreakdown: _browserBreakdown,
  totalClicks,
  showAdvancedInsights: _showAdvancedInsights = true,
  dataSaver,
}: AudienceInsightsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const primaryDevice =
    deviceBreakdown.length > 0
      ? deviceBreakdown.reduce(
          (max, device) => (device.clicks > max.clicks ? device : max),
          deviceBreakdown[0],
        )
      : { device: "--", clicks: 0 };

  const mobileDevices = deviceBreakdown.filter(
    (device) =>
      device.device.toLowerCase().includes("mobile") ||
      device.device.toLowerCase().includes("android") ||
      device.device.toLowerCase().includes("iphone"),
  );

  const desktopDevices = deviceBreakdown.filter(
    (device) =>
      device.device.toLowerCase().includes("desktop") ||
      device.device.toLowerCase().includes("windows") ||
      device.device.toLowerCase().includes("mac"),
  );

  const mobilePercentage =
    (mobileDevices.reduce((sum, device) => sum + device.clicks, 0) /
      totalClicks) *
    100;
  const desktopPercentage =
    (desktopDevices.reduce((sum, device) => sum + device.clicks, 0) /
      totalClicks) *
    100;

  const isMobileDominant = mobilePercentage > desktopPercentage;
  const isDesktopDominant = desktopPercentage > mobilePercentage;
  const isBalanced = Math.abs(mobilePercentage - desktopPercentage) < 10;

  return (
    <Card
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        boxShadow: elevation.xs,
        transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Lightbulb size={16} strokeWidth={1.5} />
          {t("audience.insights.title")}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Target size={16} strokeWidth={1.5} />
              {t("audience.insights.primaryDevice")}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip
                label={primaryDevice?.device || "N/A"}
                color="primary"
                variant="filled"
              />
              <Chip
                label={`${(((primaryDevice?.clicks || 0) / totalClicks) * 100).toFixed(1)}%`}
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <BarChart3 size={16} strokeWidth={1.5} />
              {t("audience.insights.mobileVsDesktop")}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={`Mobile: ${mobilePercentage.toFixed(1)}%`}
                color={isMobileDominant ? "primary" : "default"}
                variant={isMobileDominant ? "filled" : "outlined"}
              />
              <Chip
                label={`Desktop: ${desktopPercentage.toFixed(1)}%`}
                color={isDesktopDominant ? "primary" : "default"}
                variant={isDesktopDominant ? "filled" : "outlined"}
              />
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        <Box sx={{ mb: 1, mt: 1 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUp size={16} strokeWidth={1.5} />
            {t("audience.insights.strategicRecs")}
          </Typography>
          <Stack spacing={1}>
            {isMobileDominant ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>{t("audience.insights.mobileDominantLabel")}</strong>{" "}
                {t("audience.insights.mobileDominantText", {
                  percent: mobilePercentage.toFixed(1),
                })}
              </Typography>
            ) : null}
            {isDesktopDominant ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>{t("audience.insights.desktopDominantLabel")}</strong>{" "}
                {t("audience.insights.desktopDominantText", {
                  percent: desktopPercentage.toFixed(1),
                })}
              </Typography>
            ) : null}
            {isBalanced ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>{t("audience.insights.balancedLabel")}</strong>{" "}
                {t("audience.insights.balancedText")}
              </Typography>
            ) : null}
            {primaryDevice ? (
              <Typography variant="body2" color="text.secondary">
                • <strong>{primaryDevice.device}</strong>{" "}
                {t("audience.insights.primaryDeviceRec")}
              </Typography>
            ) : null}
            {deviceBreakdown.length > 3 && (
              <Typography variant="body2" color="text.secondary">
                •{" "}
                {t("audience.insights.crossPlatform", {
                  count: deviceBreakdown.length,
                })}
              </Typography>
            )}
          </Stack>
        </Box>

        {dataSaver && dataSaver.percentage > 0 ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Wrench size={16} strokeWidth={1.5} />
                Conexão Limitada
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={`${dataSaver.percentage}% em conexão limitada`}
                  color="warning"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${dataSaver.clicks} de ${dataSaver.total} cliques`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Box>
          </>
        ) : null}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 1, mt: 1 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Wrench size={16} strokeWidth={1.5} />
            {t("audience.insights.technicalDetails")}
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              •{" "}
              <strong>
                {t("audience.insights.totalDevices", {
                  count: deviceBreakdown.length,
                })}
              </strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •{" "}
              <strong>
                {t("audience.insights.mostPopularDevice", {
                  device: primaryDevice?.device,
                  clicks: primaryDevice?.clicks,
                })}
              </strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •{" "}
              <strong>
                {t("audience.insights.platformDiversity", {
                  level:
                    deviceBreakdown.length > 2
                      ? t("audience.insights.diversityHigh")
                      : t("audience.insights.diversityLow"),
                })}
              </strong>
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
