"use client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Users,
  Smartphone,
  Globe,
  Monitor,
  Zap,
  BarChart3,
  Trophy,
} from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import { chartByType } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type {
  DeviceData,
  BrowserData,
  OSData,
  DevicePerformanceData,
  LanguageData,
} from "@/types";

interface AudienceChartProps {
  deviceBreakdown: DeviceData[];
  browserBreakdown?: unknown[];
  osBreakdown?: unknown[];
  totalClicks: number;
  height?: number;
  showPieChart?: boolean;
  showBarChart?: boolean;
  browsers?: BrowserData[];
  operatingSystems?: OSData[];
  devicePerformance?: DevicePerformanceData[];
  languages?: LanguageData[];
  renderingEngine?: Array<{
    engine: string;
    clicks: number;
    percentage: number;
  }>;
}

export function AudienceChart({
  deviceBreakdown,
  browserBreakdown: _browserBreakdown,
  osBreakdown: _osBreakdown,
  totalClicks,
  height: _height = 400,
  showPieChart: _showPieChart = true,
  showBarChart: _showBarChart = true,
  browsers,
  operatingSystems,
  devicePerformance,
  languages,
  renderingEngine,
}: AudienceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState(0);

  const elevation = isDark ? elevationTokens : elevationLightTokens;
  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: elevation.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
  } as const;
  const outlinedCardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
  } as const;
  const itemRowSx = {
    bgcolor: theme.palette.background.paper,
    borderRadius: `${radiusTokens.md}px`,
    border: `1px solid ${theme.palette.divider}`,
  } as const;
  const devicesPalette = chartByType.devices;
  const deviceBarColor = devicesPalette.mobile;
  const performanceBarColor = devicesPalette.tablet;

  const totalDevices = deviceBreakdown.reduce(
    (sum, device) => sum + device.clicks,
    0,
  );
  const primaryDevice =
    deviceBreakdown.length > 0
      ? deviceBreakdown.reduce(
          (max, device) => (device.clicks > max.clicks ? device : max),
          deviceBreakdown[0],
        )
      : { device: "--", clicks: 0 };

  const deviceChartData = deviceBreakdown.map((device) => ({
    name: device.device,
    value: device.clicks,
    percentage: ((device.clicks / totalClicks) * 100).toFixed(1),
  }));

  const browserChartData =
    browsers?.map((browser) => ({
      name: `${browser.browser} ${browser.version || ""}`.trim(),
      value: browser.clicks,
      percentage: browser.percentage || 0,
    })) || [];

  const osChartData =
    operatingSystems?.map((os) => ({
      name: `${os.os} ${os.version || ""}`.trim(),
      value: os.clicks,
      percentage: os.percentage || 0,
    })) || [];

  const performanceChartData =
    devicePerformance?.map((perf) => ({
      name: perf.device,
      value: perf.avg_response_time,
      clicks: perf.total_clicks,
    })) || [];

  const languageChartData =
    languages?.map((lang) => ({
      name: lang.language,
      value: lang.clicks,
      percentage: lang.percentage,
    })) || [];

  const renderingEngineChartData =
    renderingEngine?.map((r) => ({
      name: r.engine,
      value: r.clicks,
      percentage: r.percentage,
    })) ?? [];

  const hasEnhancedData =
    browsers?.length ||
    operatingSystems?.length ||
    devicePerformance?.length ||
    languages?.length ||
    renderingEngine?.length;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${radiusTokens.lg}px`,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          position: "relative",
          zIndex: 1,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Users {...ICON_MD} /> {t("audience.chart.title")}
        <Chip
          label={t("audience.chart.clicksChip", { n: totalClicks })}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Typography>

      {hasEnhancedData ? (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Smartphone {...ICON_MD} /> {t("audience.chart.tabs.devices")}
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Globe {...ICON_MD} /> {t("audience.chart.tabs.browsers")}
                </Box>
              }
              disabled={!browsers?.length}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Monitor {...ICON_MD} /> {t("audience.chart.tabs.systems")}
                </Box>
              }
              disabled={!operatingSystems?.length}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Zap {...ICON_MD} /> {t("audience.chart.tabs.performance")}
                </Box>
              }
              disabled={!devicePerformance?.length}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Globe {...ICON_MD} /> {t("audience.chart.tabs.languages")}
                </Box>
              }
              disabled={!languages?.length}
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Monitor {...ICON_MD} />{" "}
                  {t("audience.chart.tabs.renderingEngine")}
                </Box>
              }
              disabled={!renderingEngine?.length}
            />
          </Tabs>
        </Box>
      ) : null}

      {/* Descrição dinâmica por sub-tab */}
      {hasEnhancedData && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {
            [
              t("audience.chart.tabDescriptions.devices"),
              t("audience.chart.tabDescriptions.browsers"),
              t("audience.chart.tabDescriptions.systems"),
              t("audience.chart.tabDescriptions.performance"),
              t("audience.chart.tabDescriptions.languages"),
              t("audience.chart.tabDescriptions.renderingEngine"),
            ][activeTab]
          }
        </Typography>
      )}

      {/* Tab 0: Devices */}
      {(!hasEnhancedData || activeTab === 0) && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="primary"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {totalDevices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("audience.chart.stats.detected")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="secondary"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {primaryDevice?.device || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("audience.chart.stats.primary")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="info"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {deviceBreakdown.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("audience.chart.stats.types")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="success"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {primaryDevice
                      ? ((primaryDevice.clicks / totalClicks) * 100).toFixed(1)
                      : "0"}
                    %
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("audience.chart.stats.dominance")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Smartphone {...ICON_MD} />{" "}
                    {t("audience.chart.deviceDistribution")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {t("audience.chart.deviceDistributionDesc")}
                  </Typography>
                  <ApexChartWrapper
                    type="pie"
                    size="standard"
                    {...formatPieChart(
                      deviceChartData,
                      "name",
                      "value",
                      isDark,
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Trophy {...ICON_MD} /> {t("audience.chart.deviceRanking")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {t("audience.chart.deviceRankingDesc")}
                  </Typography>
                  <ApexChartWrapper
                    type="bar"
                    size="standard"
                    {...formatBarChart(
                      deviceChartData,
                      "name",
                      "value",
                      deviceBarColor,
                      true,
                      isDark,
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ ...cardSx, mt: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  position: "relative",
                  zIndex: 1,
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BarChart3 {...ICON_MD} /> {t("audience.chart.deviceDetails")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t("audience.chart.deviceDetailsDesc")}
              </Typography>

              <Stack spacing={2}>
                {deviceBreakdown.map((device, index) => (
                  <Box
                    key={device.device}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      ...itemRowSx,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={index + 1}
                        color={index === 0 ? "primary" : "default"}
                        size="small"
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {device.device}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {((device.clicks / totalClicks) * 100).toFixed(1)}%{" "}
                          {t("audience.chart.ofTotal")}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {device.clicks}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("audience.chart.clicks")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tab 1: Browsers */}
      {hasEnhancedData && activeTab === 1 && browsers ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={outlinedCardSx}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Globe size={16} strokeWidth={1.5} />
                  {t("audience.chart.browserMarketShare")}
                </Typography>
                <ApexChartWrapper
                  type="pie"
                  {...formatPieChart(browserChartData, "name", "value", isDark)}
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("audience.chart.topBrowsers")}
                </Typography>
                <Stack spacing={2}>
                  {browsers.slice(0, 5).map((browser) => (
                    <Box
                      key={`${browser.browser}-${browser.version}`}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        ...itemRowSx,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {browser.browser}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {browser.version}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {browser.clicks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {browser.percentage?.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Tab 2: Operating Systems */}
      {hasEnhancedData && activeTab === 2 && operatingSystems ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={outlinedCardSx}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Monitor {...ICON_MD} /> {t("audience.chart.osDistribution")}
                </Typography>
                <ApexChartWrapper
                  type="donut"
                  {...formatPieChart(osChartData, "name", "value", isDark)}
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("audience.chart.topOS")}
                </Typography>
                <Stack spacing={2}>
                  {operatingSystems.slice(0, 5).map((os) => (
                    <Box
                      key={`${os.os}-${os.version}`}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        ...itemRowSx,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">{os.os}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {os.version}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {os.clicks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {os.percentage?.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Tab 3: Device Performance */}
      {hasEnhancedData && activeTab === 3 && devicePerformance ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={0} sx={outlinedCardSx}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Zap {...ICON_MD} /> {t("audience.chart.devicePerformance")}
                </Typography>
                <ApexChartWrapper
                  type="bar"
                  {...formatBarChart(
                    performanceChartData,
                    "name",
                    "value",
                    performanceBarColor,
                    false,
                    isDark,
                  )}
                  size="standard"
                />

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t("audience.chart.performanceDetails")}
                  </Typography>
                  <Stack spacing={1}>
                    {devicePerformance.map((perf) => (
                      <Box
                        key={perf.device}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          p: 1,
                          ...itemRowSx,
                        }}
                      >
                        <Typography variant="body2">{perf.device}</Typography>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="caption">
                            {t("audience.chart.performanceAvg")}{" "}
                            {perf.avg_response_time}ms |{" "}
                            {t("audience.chart.performanceMin")}{" "}
                            {perf.min_response_time}ms |{" "}
                            {t("audience.chart.performanceMax")}{" "}
                            {perf.max_response_time}ms
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Tab 4: Languages */}
      {hasEnhancedData && activeTab === 4 && languages ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={outlinedCardSx}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Globe {...ICON_MD} />{" "}
                  {t("audience.chart.languageDistribution")}
                </Typography>
                <ApexChartWrapper
                  type="pie"
                  {...formatPieChart(
                    languageChartData,
                    "name",
                    "value",
                    isDark,
                  )}
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("audience.chart.topLanguages")}
                </Typography>
                <Stack spacing={2}>
                  {languages.slice(0, 5).map((language) => (
                    <Box
                      key={language.language}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        ...itemRowSx,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {language.language}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {language.clicks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {language.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Tab 5: Rendering Engine */}
      {hasEnhancedData && activeTab === 5 && renderingEngine ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={outlinedCardSx}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Monitor {...ICON_MD} />{" "}
                  {t("audience.chart.renderingEngineDistribution")}
                </Typography>
                <ApexChartWrapper
                  type="donut"
                  {...formatPieChart(
                    renderingEngineChartData,
                    "name",
                    "value",
                    isDark,
                  )}
                  size="standard"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("audience.chart.topEngines")}
                </Typography>
                <Stack spacing={2}>
                  {renderingEngine.slice(0, 5).map((engine) => (
                    <Box
                      key={engine.engine}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        ...itemRowSx,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {engine.engine}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {engine.clicks}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {engine.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
}
