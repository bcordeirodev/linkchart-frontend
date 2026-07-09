"use client";
import { Box, Button, Collapse } from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Cpu,
  Globe,
  Languages,
  Monitor,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { chartByType } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import { AnalyticsSubTabs } from "@/shared/ui/navigation";

import type {
  BrowserData,
  DeviceData,
  DevicePerformanceData,
  LanguageData,
  OSData,
} from "@/types";
import type {
  ConnectionTypeBreakdown,
  FetchDestBreakdown,
  LanguageBreakdown,
  NavigationContextBreakdown,
  NavigationContextEntry,
  PlatformBreakdown,
  QualityBreakdown,
} from "@/types/analytics/audience";

import { AudienceInsights } from "./AudienceInsights";
import { BehaviorSection } from "./BehaviorSection";
import { ConnectionTypeCard } from "./ConnectionTypeCard";
import { FetchDestChart } from "./FetchDestChart";
import { LanguageBreakdownCard } from "./LanguageBreakdownCard";
import { PlatformBreakdownCard } from "./PlatformBreakdownCard";
import { QualitySection } from "./QualitySection";
import { SocialPlatformSection } from "./SocialPlatformSection";

import { AudienceBrowsersTab } from "./tabs/AudienceBrowsersTab";
import { AudienceDevicesTab } from "./tabs/AudienceDevicesTab";
import { AudienceLanguagesTab } from "./tabs/AudienceLanguagesTab";
import { AudienceOSTab } from "./tabs/AudienceOSTab";
import { AudiencePerformanceTab } from "./tabs/AudiencePerformanceTab";
import { AudienceRenderingEngineTab } from "./tabs/AudienceRenderingEngineTab";

/** Half-width grid (full width on mobile) for supplementary cards in a tab. */
const supplementaryCardGridSx = {
  mt: 2,
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 2,
} as const;

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
  /** Traffic-quality breakdown rendered in the Quality sub-tab. */
  quality?: QualityBreakdown;
  /** Whether the device insights block shows the advanced sections. */
  showAdvancedInsights?: boolean;
  /** Navigation context data rendered in the Sources sub-tab. */
  navigationContext?: NavigationContextBreakdown | NavigationContextEntry[];
  /** Referer-identified social platform clicks for the Sources sub-tab. */
  socialPlatforms?: Array<{
    platform: string;
    clicks: number;
    percentage: number;
  }>;
  /** Browser language distribution rendered in the Languages sub-tab. */
  languageBreakdown?: LanguageBreakdown;
  /** Client-Hints platform distribution rendered in the Systems sub-tab. */
  platformBreakdown?: PlatformBreakdown;
  /** ISP connection type distribution rendered in the Quality sub-tab. */
  connectionBreakdown?: ConnectionTypeBreakdown;
  /** Sec-Fetch-Dest technical breakdown for the Sources sub-tab. */
  fetchDestBreakdown?: FetchDestBreakdown;
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
  quality,
  showAdvancedInsights = true,
  navigationContext,
  socialPlatforms,
  languageBreakdown,
  platformBreakdown,
  connectionBreakdown,
  fetchDestBreakdown,
  activeTab: activeTabProp,
  onTabChange,
}: AudienceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [localTab, setLocalTab] = useState(0);
  const [showFetchDest, setShowFetchDest] = useState(false);
  const activeTab = activeTabProp !== undefined ? activeTabProp : localTab;

  const hasSocialPlatforms = (socialPlatforms?.length ?? 0) > 0;
  const hasSources =
    !!navigationContext || hasSocialPlatforms || !!fetchDestBreakdown;

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
      {/* Tab 0: Devices — distribution charts + device-centric insights */}
      {(!hasEnhancedData || activeTab === 0) && (
        <>
          <AudienceDevicesTab
            deviceChartData={deviceChartData}
            deviceBreakdown={deviceBreakdown}
            totalClicks={totalClicks}
            isDark={isDark}
            itemRowSx={itemRowSx}
            outlinedCardSx={outlinedCardSx}
            deviceBarColor={deviceBarColor}
          />
          <Box sx={{ mt: 2 }}>
            <AudienceInsights
              deviceBreakdown={deviceBreakdown}
              browserBreakdown={_browserBreakdown}
              totalClicks={totalClicks}
              showAdvancedInsights={showAdvancedInsights}
            />
          </Box>
        </>
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
          <AnalyticsEmptyState title={t("audience.noData")} />
        )
      ) : null}

      {/* Tab 2: Operating Systems — UA-derived list + Client-Hints platform donut */}
      {hasEnhancedData && activeTab === 2 ? (
        <>
          {operatingSystems?.length ? (
            <AudienceOSTab
              osChartData={osChartData}
              operatingSystems={operatingSystems}
              isDark={isDark}
              outlinedCardSx={outlinedCardSx}
              itemRowSx={itemRowSx}
            />
          ) : (
            <AnalyticsEmptyState title={t("audience.noData")} />
          )}
          {platformBreakdown ? (
            <Box sx={supplementaryCardGridSx}>
              <PlatformBreakdownCard breakdown={platformBreakdown} />
            </Box>
          ) : null}
        </>
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
          <AnalyticsEmptyState title={t("audience.noData")} />
        )
      ) : null}

      {/* Tab 4: Languages — UA-derived list + Accept-Language donut */}
      {hasEnhancedData && activeTab === 4 ? (
        <>
          {languages?.length ? (
            <AudienceLanguagesTab
              languageChartData={languageChartData}
              languages={languages}
              isDark={isDark}
              outlinedCardSx={outlinedCardSx}
              itemRowSx={itemRowSx}
            />
          ) : (
            <AnalyticsEmptyState title={t("audience.noData")} />
          )}
          {languageBreakdown ? (
            <Box sx={supplementaryCardGridSx}>
              <LanguageBreakdownCard breakdown={languageBreakdown} />
            </Box>
          ) : null}
        </>
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
          <AnalyticsEmptyState title={t("audience.noData")} />
        )
      ) : null}

      {/* Tab 6: Traffic Quality — 2×2: tier/connection donuts + bot/fingerprint */}
      {hasEnhancedData && activeTab === 6 ? (
        quality || connectionBreakdown ? (
          <>
            {quality ? (
              <QualitySection
                quality={quality}
                connectionBreakdown={connectionBreakdown}
                showTitle={false}
              />
            ) : connectionBreakdown ? (
              <Box sx={supplementaryCardGridSx}>
                <ConnectionTypeCard breakdown={connectionBreakdown} />
              </Box>
            ) : null}
          </>
        ) : (
          <AnalyticsEmptyState title={t("audience.noData")} />
        )
      ) : null}

      {/* Tab 7: Sources — navigation context, social referers and fetch-dest */}
      {hasEnhancedData && activeTab === 7 ? (
        hasSources ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md:
                    navigationContext && hasSocialPlatforms ? "1fr 1fr" : "1fr",
                },
                gap: 2,
              }}
            >
              {navigationContext ? (
                <BehaviorSection
                  navigationContext={navigationContext}
                  showTitle={false}
                />
              ) : null}
              {hasSocialPlatforms ? (
                <SocialPlatformSection
                  platforms={socialPlatforms!}
                  showTitle={false}
                />
              ) : null}
            </Box>

            {/* Fetch-dest breakdown — collapsible technical detail */}
            {fetchDestBreakdown ? (
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="text"
                  endIcon={
                    showFetchDest ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )
                  }
                  onClick={() => setShowFetchDest((v) => !v)}
                  sx={{ px: 0, minWidth: 0, mb: 1 }}
                >
                  {showFetchDest
                    ? t("audience.extraCharts.hideTechnical")
                    : t("audience.extraCharts.showTechnical")}
                </Button>
                <Collapse in={showFetchDest}>
                  <FetchDestChart fetchDestBreakdown={fetchDestBreakdown} />
                </Collapse>
              </Box>
            ) : null}
          </>
        ) : (
          <AnalyticsEmptyState title={t("audience.noData")} />
        )
      ) : null}

      {/* Legacy fallback (no sub-tabs): sections render stacked below devices */}
      {!hasEnhancedData ? (
        <>
          {quality ? (
            <Box sx={{ mt: 2 }}>
              <QualitySection quality={quality} />
            </Box>
          ) : null}
          {navigationContext ? (
            <Box sx={{ mt: 2 }}>
              <BehaviorSection navigationContext={navigationContext} />
            </Box>
          ) : null}
          {hasSocialPlatforms ? (
            <Box sx={{ mt: 2 }}>
              <SocialPlatformSection platforms={socialPlatforms!} />
            </Box>
          ) : null}
        </>
      ) : null}
    </>
  );

  return (
    <Box>
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
            {
              label: t("audience.chart.tabs.quality"),
              icon: <ShieldCheck {...ICON_SM} />,
              disabled: !quality && !connectionBreakdown,
            },
            {
              label: t("audience.chart.tabs.sources"),
              icon: <Compass {...ICON_SM} />,
              disabled: !hasSources,
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
