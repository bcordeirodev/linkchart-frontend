"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import {
  ChevronDown,
  Monitor,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { chartByType } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import { SectionDivider } from "@/shared/ui/SectionDivider";

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

/** Three-across grid (single column on mobile) for the browser/system/language cards. */
const tripleCardGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
  gap: 2,
} as const;

/** Outlined, no-shadow card treatment shared by the accordion wrapper. */
const outlinedCardSx = {
  borderRadius: `${radiusTokens.lg}px`,
} as const;

/** Row item sx used by the two Grid+list tabs kept inside the accordion. */
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
  /** Traffic-quality breakdown rendered in the "Qualidade e fidelidade" section. */
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
}

/**
 * Renders the audience analytics as three stacked, scrollable sections —
 * Aparelhos, Navegador · Sistema · Idioma, Qualidade e fidelidade — followed
 * by a "Detalhes técnicos" accordion (collapsed by default) holding the
 * engineering-only datasets (response time, rendering engine, connection
 * type, Client-Hints platform/language).
 *
 * Every categorical distribution in the visible sections renders as exactly
 * one horizontal-bar list — value and percentage on the same row as the
 * label — instead of the previous pie/donut chart *plus* a ranked list
 * showing the identical numbers a second time. Browser, OS and language
 * breakdowns are also aggregated by family on the client (`aggregateFamily`)
 * before rendering: "Chrome 91.0"/"Chrome 90.0" collapse into one "Chrome"
 * row, since a leaf reader doesn't need the point-release dimension.
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
}: AudienceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const devicesPalette = chartByType.devices;
  const performanceBarColor = devicesPalette.tablet;

  // Derive chart-ready data for the two tabs that still keep their own
  // bar/donut layout inside the "Detalhes técnicos" accordion — everything
  // else computes its chart data internally now.
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

  // Section-level guards — a group only renders when at least one of its
  // datasets has data, so an all-empty group doesn't leave a bare heading.
  const hasBrowserSystemLanguageSection =
    (browsers?.length ?? 0) > 0 ||
    (operatingSystems?.length ?? 0) > 0 ||
    (languages?.length ?? 0) > 0;
  const hasQualitySection = !!quality || !!retention || !!sessionDepth;
  const hasTechnicalDetails =
    (devicePerformance?.length ?? 0) > 0 ||
    (renderingEngine?.length ?? 0) > 0 ||
    !!connectionBreakdown ||
    !!platformBreakdown ||
    !!languageBreakdown;

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      {/* 1. Aparelhos — single horizontal-bar breakdown, value + % */}
      <Box>
        <SectionDivider
          title={t("audience.sections.devices")}
          icon={<Smartphone {...ICON_MD} />}
        />
        <AudienceDevicesTab
          deviceBreakdown={deviceBreakdown}
          totalClicks={totalClicks}
        />
      </Box>

      {/* 2. Navegador · Sistema · Idioma — three compact cards, each a
          family-aggregated horizontal-bar list; side by side on desktop,
          stacked on mobile. */}
      {hasBrowserSystemLanguageSection ? (
        <Box>
          <SectionDivider
            title={t("audience.sections.browserSystemLanguage")}
            icon={<Monitor {...ICON_MD} />}
          />
          <Box sx={tripleCardGridSx}>
            {browsers?.length ? (
              <AudienceBrowsersTab browsers={browsers} />
            ) : null}
            {operatingSystems?.length ? (
              <AudienceOSTab operatingSystems={operatingSystems} />
            ) : null}
            {languages?.length ? (
              <AudienceLanguagesTab languages={languages} />
            ) : null}
          </Box>
        </Box>
      ) : null}

      {/* 3. Qualidade e fidelidade — quality tier bars, bot/fingerprint
          stat cards, retention, session depth */}
      {hasQualitySection ? (
        <Box>
          <SectionDivider
            title={t("audience.sections.qualityAndLoyalty")}
            icon={<ShieldCheck {...ICON_MD} />}
          />
          {quality ? (
            <QualitySection quality={quality} showTitle={false} />
          ) : null}

          {retention ? (
            <Box sx={{ mt: 2 }}>
              <RetentionAnalysisChart
                data={retention}
                loading={insightsLoading}
              />
            </Box>
          ) : null}

          {sessionDepth ? (
            <Box sx={{ mt: 2 }}>
              <SessionDepthChart
                data={sessionDepth}
                loading={insightsLoading}
              />
            </Box>
          ) : null}
        </Box>
      ) : null}

      {/* Detalhes técnicos — engineering-only data, collapsed by default and
          visually secondary. Not deleted: Fase 3 relocates this content
          behind the "Advanced" mode toggle and expects to find it here. */}
      {hasTechnicalDetails ? (
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            ...outlinedCardSx,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
            "&:before": { display: "none" },
            "&.Mui-expanded": { margin: 0 },
          }}
        >
          <AccordionSummary expandIcon={<ChevronDown size={18} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Wrench
                size={16}
                strokeWidth={1.5}
                color={theme.palette.text.secondary}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  {t("audience.sections.technicalDetails")}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {t("audience.sections.technicalDetailsDesc")}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>
      ) : null}
    </Stack>
  );
}
