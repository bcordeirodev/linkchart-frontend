"use client";
import { Box, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { ResponsiveContainer } from "@/shared/ui/base/ResponsiveContainer";
import { AudienceChart } from "./AudienceChart";
import { AudienceMetrics } from "./AudienceMetrics";

import type { AudienceAnalysisProps } from "@/types/analytics";

/**
 * Loading skeleton that mirrors the Audience tab layout:
 * 6 metric cards → tabbed main chart (8 sub-tabs hold every audience
 * dataset, including quality, sources and the supplementary donuts).
 */
function AudienceSkeleton() {
  return (
    <Box>
      {/* 6 metric cards — 2 per row xs, 3 per row sm, 6 per row md */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(6, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            animation="wave"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>

      {/* Main tabbed chart — tall protagonist with tab indicators */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              animation="wave"
              width={82}
              height={30}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={520}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
}

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
        skeleton={<AudienceSkeleton />}
        onRetry={refresh}
        loadingMessage={t("audience.loading")}
        emptyMessage={t("audience.empty")}
        minHeight={300}
      >
        <ResponsiveContainer style={{ padding: 0 }}>
          {/* 1. Metric cards */}
          {shouldUseHook && stats ? (
            <Box sx={{ mb: 2 }}>
              <AudienceMetrics data={{ audience: audienceData, stats }} />
            </Box>
          ) : null}

          {/* 2. Main tabbed chart — every audience dataset lives in a sub-tab */}
          <AudienceChart
            deviceBreakdown={deviceBreakdown}
            browserBreakdown={(audienceData as AnyData)?.browser_breakdown}
            osBreakdown={(audienceData as AnyData)?.os_breakdown}
            totalClicks={totalClicks}
            browsers={(audienceData as AnyData)?.browsers}
            operatingSystems={(audienceData as AnyData)?.operating_systems}
            devicePerformance={(audienceData as AnyData)?.device_performance}
            languages={(audienceData as AnyData)?.languages}
            renderingEngine={(() => {
              const re = (audienceData as AnyData)?.rendering_engine;
              return Array.isArray(re) ? re : re?.data;
            })()}
            quality={
              (audienceData as AnyData)?.quality_breakdown?.tiers !== undefined
                ? (audienceData as AnyData).quality_breakdown
                : undefined
            }
            showAdvancedInsights={shouldUseHook}
            navigationContext={
              (audienceData as AnyData)?.navigation_context_breakdown
            }
            socialPlatforms={
              (audienceData as AnyData)?.social_platform_breakdown
            }
            languageBreakdown={
              (audienceData as AnyData)?.language_breakdown ??
              (audienceData as AnyData)?.audience?.language_breakdown
            }
            platformBreakdown={
              (audienceData as AnyData)?.platform_breakdown ??
              (audienceData as AnyData)?.audience?.platform_breakdown
            }
            connectionBreakdown={
              (audienceData as AnyData)?.connection_type_breakdown ??
              (audienceData as AnyData)?.audience?.connection_type_breakdown
            }
            fetchDestBreakdown={
              (audienceData as AnyData)?.fetch_dest_breakdown ??
              (audienceData as AnyData)?.audience?.fetch_dest_breakdown
            }
            activeTab={subTabIndex}
            onTabChange={onSubTabChange}
          />
        </ResponsiveContainer>
      </AnalyticsStateManager>
    </Box>
  );
}

export default AudienceAnalysis;
