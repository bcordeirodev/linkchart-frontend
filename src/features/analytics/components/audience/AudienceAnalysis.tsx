"use client";
import { Users } from "lucide-react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { ResponsiveContainer } from "@/shared/ui/base/ResponsiveContainer";
import TabDescription from "@/shared/ui/base/TabDescription";
import { AudienceChart } from "./AudienceChart";
import { AudienceInsights } from "./AudienceInsights";
import { AudienceMetrics } from "./AudienceMetrics";
import { BehaviorSection } from "./BehaviorSection";
import { QualitySection } from "./QualitySection";

import type { AudienceAnalysisProps } from "@/types/analytics";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>;

interface LegacyAudienceAnalysisProps {
  data?: unknown;
  linkId: string;
}

/**
 * Componente de análise de audiência com dados de dispositivos, navegadores e sistemas operacionais
 */
export function AudienceAnalysis({
  data: legacyData,
  linkId,
  title,
}: LegacyAudienceAnalysisProps &
  Partial<Pick<AudienceAnalysisProps, "title">>) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("audience.title");
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
    includeDetails: true,
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
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Users {...ICON_LG} />}
          title={displayTitle}
          description={t("audience.description")}
          highlight={t("audience.deviceTypes", {
            count: deviceBreakdown?.length || 0,
          })}
          metadata={t("audience.linkSpecific")}
        />
      </Box>

      <AnalyticsStateManager
        loading={shouldUseHook ? loading : false}
        error={shouldUseHook && error ? error : null}
        hasData={!!deviceBreakdown?.length}
        onRetry={refresh}
        loadingMessage={t("audience.loading")}
        emptyMessage={t("audience.empty")}
        minHeight={300}
      >
        <ResponsiveContainer style={{ padding: 0 }}>
          {shouldUseHook && stats ? (
            <Box sx={{ mb: 3 }}>
              <AudienceMetrics
                data={{ audience: audienceData, stats }}
                showTitle
                title={t("audience.metrics.title")}
              />
            </Box>
          ) : null}

          {(audienceData as AnyData)?.quality_breakdown &&
            (audienceData as AnyData)?.quality_breakdown?.tiers !==
              undefined && (
              <Box sx={{ mb: 3 }}>
                <QualitySection
                  quality={(audienceData as AnyData).quality_breakdown}
                />
              </Box>
            )}

          <Grid container spacing={2}>
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
                  renderingEngine={(audienceData as AnyData)?.rendering_engine}
                />
              </EnhancedPaper>
            </Grid>

            {(audienceData as AnyData)?.navigation_context_breakdown &&
              (audienceData as AnyData)?.navigation_context_breakdown?.length >
                0 && (
                <Grid item xs={12}>
                  <BehaviorSection
                    navigationContext={
                      (audienceData as AnyData).navigation_context_breakdown
                    }
                  />
                </Grid>
              )}

            <Grid item xs={12}>
              <AudienceInsights
                deviceBreakdown={deviceBreakdown}
                browserBreakdown={(audienceData as AnyData)?.browser_breakdown}
                totalClicks={totalClicks}
                showAdvancedInsights={shouldUseHook}
              />
            </Grid>
          </Grid>
        </ResponsiveContainer>
      </AnalyticsStateManager>
    </Box>
  );
}

export default AudienceAnalysis;
