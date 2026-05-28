"use client";
import { Box, Chip, Tab, Tabs, Typography } from "@mui/material";
import { Globe, Monitor, Smartphone, Zap } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

import { chartByType } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type {
  BrowserData,
  DeviceData,
  DevicePerformanceData,
  LanguageData,
  OSData,
} from "@/types";

import { AudienceBrowsersTab } from "./tabs/AudienceBrowsersTab";
import { AudienceDevicesTab } from "./tabs/AudienceDevicesTab";
import { AudienceLanguagesTab } from "./tabs/AudienceLanguagesTab";
import { AudienceOSTab } from "./tabs/AudienceOSTab";
import { AudiencePerformanceTab } from "./tabs/AudiencePerformanceTab";
import { AudienceRenderingEngineTab } from "./tabs/AudienceRenderingEngineTab";

/** Props for the AudienceChart component. */
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
  /** Currently-active sub-tab index. When provided, the component is controlled. */
  activeTab?: number;
  /** Called when the user switches to a different sub-tab. */
  onTabChange?: (v: number) => void;
}

/**
 * Orchestrates the audience analytics tabs.
 *
 * Manages the active tab state and derives chart-ready data from props,
 * then delegates rendering to focused tab components. No data fetching
 * occurs here — all data flows in from the parent via props.
 */
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
  activeTab: activeTabProp,
  onTabChange,
}: AudienceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [localTab, setLocalTab] = useState(0);
  const activeTab = activeTabProp !== undefined ? activeTabProp : localTab;

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

  // Derive chart-ready data from raw props once, at the orchestrator level.
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

  /** @param _event — synthetic React event (unused) @param newValue — selected tab index */
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setLocalTab(newValue);
    onTabChange?.(newValue);
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

      {/* Dynamic description per active tab */}
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
        <AudienceDevicesTab
          deviceChartData={deviceChartData}
          deviceBreakdown={deviceBreakdown}
          totalClicks={totalClicks}
          isDark={isDark}
          cardSx={cardSx}
          itemRowSx={itemRowSx}
          deviceBarColor={deviceBarColor}
        />
      )}

      {/* Tab 1: Browsers */}
      {hasEnhancedData && activeTab === 1 && browsers ? (
        <AudienceBrowsersTab
          browserChartData={browserChartData}
          browsers={browsers}
          isDark={isDark}
          outlinedCardSx={outlinedCardSx}
          itemRowSx={itemRowSx}
        />
      ) : null}

      {/* Tab 2: Operating Systems */}
      {hasEnhancedData && activeTab === 2 && operatingSystems ? (
        <AudienceOSTab
          osChartData={osChartData}
          operatingSystems={operatingSystems}
          isDark={isDark}
          outlinedCardSx={outlinedCardSx}
          itemRowSx={itemRowSx}
        />
      ) : null}

      {/* Tab 3: Device Performance */}
      {hasEnhancedData && activeTab === 3 && devicePerformance ? (
        <AudiencePerformanceTab
          performanceChartData={performanceChartData}
          devicePerformance={devicePerformance}
          isDark={isDark}
          outlinedCardSx={outlinedCardSx}
          itemRowSx={itemRowSx}
          performanceBarColor={performanceBarColor}
        />
      ) : null}

      {/* Tab 4: Languages */}
      {hasEnhancedData && activeTab === 4 && languages ? (
        <AudienceLanguagesTab
          languageChartData={languageChartData}
          languages={languages}
          isDark={isDark}
          outlinedCardSx={outlinedCardSx}
          itemRowSx={itemRowSx}
        />
      ) : null}

      {/* Tab 5: Rendering Engine */}
      {hasEnhancedData && activeTab === 5 && renderingEngine ? (
        <AudienceRenderingEngineTab
          renderingEngineChartData={renderingEngineChartData}
          renderingEngine={renderingEngine}
          isDark={isDark}
          outlinedCardSx={outlinedCardSx}
          itemRowSx={itemRowSx}
        />
      ) : null}
    </Box>
  );
}
