"use client";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import AnalyticsTabSkeleton from "@/shared/ui/base/AnalyticsTabSkeleton";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { ResponsiveContainer } from "@/shared/ui/base/ResponsiveContainer";
import { AudienceChart } from "./AudienceChart";
import { AudienceExtraCharts } from "./AudienceExtraCharts";
import { AudienceInsights } from "./AudienceInsights";
import { AudienceMetrics } from "./AudienceMetrics";
import { BehaviorSection } from "./BehaviorSection";
import { QualitySection } from "./QualitySection";
import { SocialPlatformSection } from "./SocialPlatformSection";

import type { AudienceAnalysisProps } from "@/types/analytics";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>;

interface LegacyAudienceAnalysisProps {
  data?: unknown;
  linkId: string;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /** Currently-active audience sub-tab index (0–5). */
  subTabIndex?: number;
  /** Called when the user switches audience sub-tab. */
  onSubTabChange?: (v: number) => void;
}

/**
 * Componente de análise de audiência com dados de dispositivos, navegadores e sistemas operacionais
 */
export function AudienceAnalysis({
  data: legacyData,
  linkId,
  dateFrom,
  dateTo,
  excludeBots,
  subTabIndex,
  onSubTabChange,
}: LegacyAudienceAnalysisProps &
  Partial<Pick<AudienceAnalysisProps, "title">>) {
  const { t } = useTranslation("analytics");
  const shouldUseHook = !legacyData;

  const {
    data: hookData,
    stats,
    loading,
    error,
    refresh,
  } = useAudienceData({
    linkId,
    enableRealtime: shouldUseHook,
    refreshInterval: 60000,
    dateFrom,
    dateTo,
    excludeBots,
  });

  const audienceData = shouldUseHook ? hookData : legacyData;
  const deviceBreakdown =
    (audienceData as AnyData)?.audience?.device_breakdown ||
    (audienceData as AnyData)?.device_breakdown ||
    [];
  const totalClicks =
    (audienceData as AnyData)?.overview?.total_clicks ||
    stats?.totalClicks ||
    0;

  return (
    <Box>
      <AnalyticsStateManager
        loading={shouldUseHook ? loading : false}
        error={shouldUseHook && error ? error : null}
        hasData={!!deviceBreakdown?.length}
        skeleton={<AnalyticsTabSkeleton metricCards={6} />}
        onRetry={refresh}
        loadingMessage={t("audience.loading")}
        emptyMessage={t("audience.empty")}
        minHeight={300}
      >
        <ResponsiveContainer style={{ padding: 0 }}>
          {/* 1. Metric cards */}
          {shouldUseHook && stats ? (
            <Box sx={{ mb: 3 }}>
              <AudienceMetrics data={{ audience: audienceData, stats }} />
            </Box>
          ) : null}

          <Grid container spacing={2}>
            {/* 2. Main tabbed chart — protagonist */}
            <Grid item xs={12}>
              <EnhancedPaper variant="glass" animated>
                <AudienceChart
                  deviceBreakdown={deviceBreakdown}
                  browserBreakdown={
                    (audienceData as AnyData)?.browser_breakdown
                  }
                  osBreakdown={(audienceData as AnyData)?.os_breakdown}
                  totalClicks={totalClicks}
                  browsers={(audienceData as AnyData)?.browsers}
                  operatingSystems={
                    (audienceData as AnyData)?.operating_systems
                  }
                  devicePerformance={
                    (audienceData as AnyData)?.device_performance
                  }
                  languages={(audienceData as AnyData)?.languages}
                  renderingEngine={(() => {
                    const re = (audienceData as AnyData)?.rendering_engine;
                    return Array.isArray(re) ? re : re?.data;
                  })()}
                  activeTab={subTabIndex}
                  onTabChange={onSubTabChange}
                />
              </EnhancedPaper>
            </Grid>

            {/* 3. Behavior / navigation context */}
            {(audienceData as AnyData)?.navigation_context_breakdown && (
              <Grid item xs={12}>
                <BehaviorSection
                  navigationContext={
                    (audienceData as AnyData).navigation_context_breakdown
                  }
                />
              </Grid>
            )}

            {/* 4. Social platforms */}
            {(audienceData as AnyData)?.social_platform_breakdown &&
              (audienceData as AnyData)?.social_platform_breakdown?.length >
                0 && (
                <Grid item xs={12}>
                  <SocialPlatformSection
                    platforms={
                      (audienceData as AnyData).social_platform_breakdown
                    }
                  />
                </Grid>
              )}
          </Grid>

          {/* 5. Quality section */}
          {(audienceData as AnyData)?.quality_breakdown &&
            (audienceData as AnyData)?.quality_breakdown?.tiers !==
              undefined && (
              <Box sx={{ mt: 3 }}>
                <QualitySection
                  quality={(audienceData as AnyData).quality_breakdown}
                />
              </Box>
            )}

          {/* 6. Audience insights — secondary detail */}
          <Box sx={{ mt: 3 }}>
            <AudienceInsights
              deviceBreakdown={deviceBreakdown}
              browserBreakdown={(audienceData as AnyData)?.browser_breakdown}
              totalClicks={totalClicks}
              showAdvancedInsights={shouldUseHook}
            />
          </Box>

          {/* 7. Supplementary donut charts (Idioma / Plataforma / Tipo de Conexão / Fetch-Dest) */}
          <AudienceExtraCharts
            languageBreakdown={
              (audienceData as AnyData)?.language_breakdown ??
              (audienceData as AnyData)?.audience?.language_breakdown ??
              []
            }
            platformBreakdown={
              (audienceData as AnyData)?.platform_breakdown ??
              (audienceData as AnyData)?.audience?.platform_breakdown ??
              []
            }
            connectionBreakdown={
              (audienceData as AnyData)?.connection_type_breakdown ??
              (audienceData as AnyData)?.audience?.connection_type_breakdown ??
              []
            }
            fetchDestBreakdown={
              (audienceData as AnyData)?.fetch_dest_breakdown ??
              (audienceData as AnyData)?.audience?.fetch_dest_breakdown
            }
          />
        </ResponsiveContainer>
      </AnalyticsStateManager>
    </Box>
  );
}

export default AudienceAnalysis;
