"use client";
import { Alert, Box, Chip, Typography } from "@mui/material";
import { Cpu, Globe, Languages, Monitor, Smartphone, Zap } from "lucide-react";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

import { chartByType } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { AnalyticsSubTabs } from "@/shared/ui/navigation";

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
  const _cardSx = {
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

  /** @param newValue — selected tab index */
  const handleTabChange = (newValue: number) => {
    setLocalTab(newValue);
    onTabChange?.(newValue);
  };

  const tabContent = (
    <>
      {/* Tab 0: Devices */}
      {(!hasEnhancedData || activeTab === 0) && (
        <AudienceDevicesTab
          deviceChartData={deviceChartData}
          deviceBreakdown={deviceBreakdown}
          totalClicks={totalClicks}
          isDark={isDark}
          itemRowSx={itemRowSx}
          outlinedCardSx={outlinedCardSx}
          deviceBarColor={deviceBarColor}
        />
      )}

      {/* Tab 1: Browsers */}
      {hasEnhancedData && activeTab === 1 ? (
        browsers?.length ? (
          <AudienceBrowsersTab
            browserChartData={browserChartData}
            browsers={browsers}
            isDark={isDark}
            outlinedCardSx={outlinedCardSx}
            itemRowSx={itemRowSx}
          />
        ) : (
          <Alert severity="info">
            <Typography variant="body2">{t("audience.noData")}</Typography>
          </Alert>
        )
      ) : null}

      {/* Tab 2: Operating Systems */}
      {hasEnhancedData && activeTab === 2 ? (
        operatingSystems?.length ? (
          <AudienceOSTab
            osChartData={osChartData}
            operatingSystems={operatingSystems}
            isDark={isDark}
            outlinedCardSx={outlinedCardSx}
            itemRowSx={itemRowSx}
          />
        ) : (
          <Alert severity="info">
            <Typography variant="body2">{t("audience.noData")}</Typography>
          </Alert>
        )
      ) : null}

      {/* Tab 3: Device Performance */}
      {hasEnhancedData && activeTab === 3 ? (
        devicePerformance?.length ? (
          <AudiencePerformanceTab
            performanceChartData={performanceChartData}
            devicePerformance={devicePerformance}
            isDark={isDark}
            outlinedCardSx={outlinedCardSx}
            itemRowSx={itemRowSx}
            performanceBarColor={performanceBarColor}
          />
        ) : (
          <Alert severity="info">
            <Typography variant="body2">{t("audience.noData")}</Typography>
          </Alert>
        )
      ) : null}

      {/* Tab 4: Languages */}
      {hasEnhancedData && activeTab === 4 ? (
        languages?.length ? (
          <AudienceLanguagesTab
            languageChartData={languageChartData}
            languages={languages}
            isDark={isDark}
            outlinedCardSx={outlinedCardSx}
            itemRowSx={itemRowSx}
          />
        ) : (
          <Alert severity="info">
            <Typography variant="body2">{t("audience.noData")}</Typography>
          </Alert>
        )
      ) : null}

      {/* Tab 5: Rendering Engine */}
      {hasEnhancedData && activeTab === 5 ? (
        renderingEngine?.length ? (
          <AudienceRenderingEngineTab
            renderingEngineChartData={renderingEngineChartData}
            renderingEngine={renderingEngine}
            isDark={isDark}
            outlinedCardSx={outlinedCardSx}
            itemRowSx={itemRowSx}
          />
        ) : (
          <Alert severity="info">
            <Typography variant="body2">{t("audience.noData")}</Typography>
          </Alert>
        )
      ) : null}
    </>
  );

  return (
    <Box>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          position: "relative",
          zIndex: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 600,
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
        <AnalyticsSubTabs
          value={activeTab}
          onChange={handleTabChange}
          tabs={[
            {
              label: t("audience.chart.tabs.devices"),
              icon: <Smartphone {...ICON_SM} />,
            },
            {
              label: t("audience.chart.tabs.browsers"),
              icon: <Globe {...ICON_SM} />,
            },
            {
              label: t("audience.chart.tabs.systems"),
              icon: <Monitor {...ICON_SM} />,
            },
            {
              label: t("audience.chart.tabs.performance"),
              icon: <Zap {...ICON_SM} />,
            },
            {
              label: t("audience.chart.tabs.languages"),
              icon: <Languages {...ICON_SM} />,
            },
            {
              label: t("audience.chart.tabs.renderingEngine"),
              icon: <Cpu {...ICON_SM} />,
            },
          ]}
        >
          {tabContent}
        </AnalyticsSubTabs>
      ) : (
        tabContent
      )}
    </Box>
  );
}
