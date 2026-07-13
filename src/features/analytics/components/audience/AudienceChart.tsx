"use client";
import { useState } from "react";
import { Box, Stack } from "@mui/material";
import {
  Languages as LanguagesIcon,
  Monitor,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { chartByType } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
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
  LanguageBreakdown,
  PlatformBreakdown,
  QualityBreakdown,
} from "@/types/analytics/audience";
import type {
  RetentionData,
  SessionDepthData,
} from "@/features/analytics/hooks/useInsightsData";

import { ConnectionTypeCard } from "./ConnectionTypeCard";
import { LanguageBreakdownCard } from "./LanguageBreakdownCard";
import { PlatformBreakdownCard } from "./PlatformBreakdownCard";
import { QualitySection } from "./QualitySection";
import { RetentionAnalysisChart } from "./RetentionAnalysisChart";
import { SessionDepthChart } from "./SessionDepthChart";

import { AudienceBrowsersTab } from "./tabs/AudienceBrowsersTab";
import { AudienceDevicesTab } from "./tabs/AudienceDevicesTab";
import { AudienceLanguagesTab } from "./tabs/AudienceLanguagesTab";
import { AudienceOSTab } from "./tabs/AudienceOSTab";
import { AudiencePerformanceTab } from "./tabs/AudiencePerformanceTab";
import { AudienceRenderingEngineTab } from "./tabs/AudienceRenderingEngineTab";

/** Two-across grid (single column on mobile) for the browser/system cards. */
const twoCardGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: 2,
} as const;

/** Three-across grid (single column on mobile) for the Client-Hints cards. */
const tripleCardGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
  gap: 2,
} as const;

/** Outlined, no-shadow card treatment shared by the "Detalhes técnicos" sub-tab. */
const outlinedCardSx = {
  borderRadius: `${radiusTokens.lg}px`,
} as const;

/** Row item sx used by the two Grid+list tabs inside "Detalhes técnicos". */
const itemRowSx = {
  borderRadius: `${radiusTokens.md}px`,
} as const;

/** Props for the AudienceChart component. */
interface AudienceChartProps {
  deviceBreakdown: DeviceData[];
  totalClicks: number;
  browsers?: BrowserData[];
  operatingSystems?: OSData[];
  devicePerformance?: DevicePerformanceData[];
  languages?: LanguageData[];
  renderingEngine?: Array<{
    engine: string;
    clicks: number;
    percentage: number;
  }>;
  /** Traffic-quality breakdown rendered in the "Qualidade e fidelidade" sub-tab. */
  quality?: QualityBreakdown;
  /** Browser language distribution — Client-Hints/Accept-Language data, rendered in "Detalhes técnicos". */
  languageBreakdown?: LanguageBreakdown;
  /** Client-Hints platform distribution, rendered in "Detalhes técnicos". */
  platformBreakdown?: PlatformBreakdown;
  /** ISP connection type distribution, rendered in "Detalhes técnicos". */
  connectionBreakdown?: ConnectionTypeBreakdown;
  /**
   * Visitor retention data from the `/insights` payload
   * (`analytics_data.retention`), rendered in "Qualidade e fidelidade".
   * Relocated here from the dissolved Insights tab.
   */
  retention?: RetentionData;
  /**
   * Session click-depth histogram from the `/insights` payload
   * (`analytics_data.session_depth`), rendered in "Qualidade e fidelidade".
   * Relocated here from the dissolved Insights tab.
   */
  sessionDepth?: SessionDepthData;
  /** Whether the `/insights` payload backing `retention`/`sessionDepth` is still loading. */
  insightsLoading?: boolean;
  /**
   * Index of the currently active sub-tab (0=Aparelhos, 1=Navegador e
   * sistema, 2=Idioma, 3=Qualidade, 4=Detalhes técnicos). When provided the
   * component is controlled — mirrors `TemporalChart`'s `activeTab` prop.
   */
  activeTab?: number;
  /** Called when the user switches to a different sub-tab. */
  onTabChange?: (v: number) => void;
}

/**
 * Renders the audience analytics as five sub-tabs — Aparelhos, Navegador e
 * sistema, Idioma, Qualidade, Detalhes técnicos — using the same shared
 * {@link AnalyticsSubTabs} control as `TemporalChart`.
 *
 * Every categorical distribution renders as exactly one horizontal-bar list
 * — value and percentage on the same row as the label — instead of the
 * previous pie/donut chart *plus* a ranked list showing the identical
 * numbers a second time. Browser, OS and language breakdowns are also
 * aggregated by family on the client (`aggregateFamily`) before rendering:
 * "Chrome 91.0"/"Chrome 90.0" collapse into one "Chrome" row, since a leaf
 * reader doesn't need the point-release dimension.
 *
 * "Detalhes técnicos" (response time, rendering engine, connection type,
 * Client-Hints platform/language) is a sub-tab like every other section
 * here rather than a collapsed accordion — the previous accordion wrapper
 * is unnecessary once the content already lives behind its own tab.
 *
 * The former "Origem" sub-tab (navigation context, social referers,
 * fetch-dest) is intentionally absent — it now lives exclusively in the
 * "Origem" top-level tab (`OriginAnalysis`); duplicating it here would
 * recreate the redundancy this redesign removes.
 *
 * No data fetching occurs here — all data flows in from the parent via props.
 */
export function AudienceChart({
  deviceBreakdown,
  totalClicks,
  browsers,
  operatingSystems,
  devicePerformance,
  languages,
  renderingEngine,
  quality,
  languageBreakdown,
  platformBreakdown,
  connectionBreakdown,
  retention,
  sessionDepth,
  insightsLoading = false,
  activeTab: activeTabProp,
  onTabChange,
}: AudienceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const [localTab, setLocalTab] = useState(0);
  const activeTab = activeTabProp !== undefined ? activeTabProp : localTab;

  const devicesPalette = chartByType.devices;
  const performanceBarColor = devicesPalette.tablet;

  // Derive chart-ready data for the two tabs that still keep their own
  // bar/donut layout inside "Detalhes técnicos" — everything else computes
  // its chart data internally now.
  const performanceChartData =
    devicePerformance?.map((perf) => ({
      name: perf.device,
      value: perf.avg_response_time,
      clicks: perf.total_clicks,
    })) || [];

  const renderingEngineChartData =
    renderingEngine?.map((r) => ({
      name: r.engine,
      value: r.clicks,
      percentage: r.percentage,
    })) ?? [];

  // Sub-tab-level guards — a sub-tab is disabled when none of its datasets
  // has data.
  const hasBrowserSystem =
    (browsers?.length ?? 0) > 0 || (operatingSystems?.length ?? 0) > 0;
  const hasLanguages = (languages?.length ?? 0) > 0;
  const hasQualitySection = !!quality || !!retention || !!sessionDepth;
  const hasTechnicalDetails =
    (devicePerformance?.length ?? 0) > 0 ||
    (renderingEngine?.length ?? 0) > 0 ||
    !!connectionBreakdown ||
    !!platformBreakdown ||
    !!languageBreakdown;

  /** @param newValue — selected tab index */
  const handleTabChange = (newValue: number) => {
    setLocalTab(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <AnalyticsSubTabs
        value={activeTab}
        onChange={handleTabChange}
        ariaLabel={t("tabs.audience")}
        tabs={[
          {
            label: t("audience.sections.devices"),
            icon: <Smartphone {...ICON_SM} />,
          },
          {
            label: t("audience.subtabs.browserSystem"),
            icon: <Monitor {...ICON_SM} />,
            disabled: !hasBrowserSystem,
          },
          {
            label: t("audience.subtabs.language"),
            icon: <LanguagesIcon {...ICON_SM} />,
            disabled: !hasLanguages,
          },
          {
            label: t("audience.sections.qualityAndLoyalty"),
            icon: <ShieldCheck {...ICON_SM} />,
            disabled: !hasQualitySection,
          },
          {
            label: t("audience.sections.technicalDetails"),
            icon: <Wrench {...ICON_SM} />,
            disabled: !hasTechnicalDetails,
          },
        ]}
      >
        {/* Sub-tab 0: Aparelhos — single horizontal-bar breakdown, value + % */}
        {activeTab === 0 && (
          <AudienceDevicesTab
            deviceBreakdown={deviceBreakdown}
            totalClicks={totalClicks}
          />
        )}

        {/* Sub-tab 1: Navegador e sistema — two compact cards, each a
            family-aggregated horizontal-bar list; side by side on desktop,
            stacked on mobile. */}
        {activeTab === 1 && hasBrowserSystem && (
          <Box sx={twoCardGridSx}>
            {browsers?.length ? (
              <AudienceBrowsersTab browsers={browsers} />
            ) : null}
            {operatingSystems?.length ? (
              <AudienceOSTab operatingSystems={operatingSystems} />
            ) : null}
          </Box>
        )}

        {/* Sub-tab 2: Idioma */}
        {activeTab === 2 && hasLanguages && (
          <AudienceLanguagesTab languages={languages!} />
        )}

        {/* Sub-tab 3: Qualidade e fidelidade — quality tier bars, bot/
            fingerprint stat cards, retention, session depth */}
        {activeTab === 3 && hasQualitySection && (
          <Stack spacing={2}>
            {quality ? (
              <QualitySection quality={quality} showTitle={false} />
            ) : null}

            {retention ? (
              <RetentionAnalysisChart
                data={retention}
                loading={insightsLoading}
              />
            ) : null}

            {sessionDepth ? (
              <SessionDepthChart
                data={sessionDepth}
                loading={insightsLoading}
              />
            ) : null}
          </Stack>
        )}

        {/* Sub-tab 4: Detalhes técnicos — engineering-only data. No longer
            an accordion: once it lives behind its own sub-tab, the extra
            collapse/expand affordance is redundant. */}
        {activeTab === 4 && hasTechnicalDetails && (
          <Stack spacing={3}>
            {devicePerformance?.length ? (
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
            )}

            {renderingEngine?.length ? (
              <AudienceRenderingEngineTab
                renderingEngineChartData={renderingEngineChartData}
                renderingEngine={renderingEngine}
                isDark={isDark}
                outlinedCardSx={outlinedCardSx}
                itemRowSx={itemRowSx}
              />
            ) : (
              <AnalyticsEmptyState title={t("audience.noData")} />
            )}

            {connectionBreakdown || platformBreakdown || languageBreakdown ? (
              <Box sx={tripleCardGridSx}>
                {connectionBreakdown ? (
                  <ConnectionTypeCard breakdown={connectionBreakdown} />
                ) : null}
                {platformBreakdown ? (
                  <PlatformBreakdownCard breakdown={platformBreakdown} />
                ) : null}
                {languageBreakdown ? (
                  <LanguageBreakdownCard breakdown={languageBreakdown} />
                ) : null}
              </Box>
            ) : null}
          </Stack>
        )}
      </AnalyticsSubTabs>
    </Box>
  );
}

export default AudienceChart;
