"use client";
import { Map } from "lucide-react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useHeatmapData } from "@/features/analytics/hooks/useHeatmapData";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import TabDescription from "@/shared/ui/base/TabDescription";

import { HeatmapMetrics } from "./HeatmapMetrics";
import { HeatmapStats } from "./HeatmapStats";
import { RealTimeHeatmapChart } from "./RealTimeHeatmapChart";

interface HeatmapAnalysisProps {
  linkId: string;
  title?: string;
  enableRealtime?: boolean;
  minClicks?: number;
}

/**
 * Componente de análise de heatmap com visualização geográfica interativa
 */
export function HeatmapAnalysis({
  linkId,
  title,
  enableRealtime = true,
  minClicks = 1,
}: HeatmapAnalysisProps) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("heatmap.title");
  const {
    stats,
    data: heatmapData,
    loading,
    error,
    refresh,
    lastUpdate,
  } = useHeatmapData({
    linkId,
    enableRealtime,
    refreshInterval: 30000,
    minClicks,
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Map {...ICON_LG} />}
          title={displayTitle}
          description={t("heatmap.description")}
          highlight={t("heatmap.locationsCount", { count: stats?.totalPoints || 0 })}
          metadata={
            enableRealtime
              ? t("heatmap.realtime")
              : lastUpdate
                ? `${t("heatmap.updated")} ${lastUpdate.toLocaleTimeString()}`
                : undefined
          }
        />
      </Box>

      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!heatmapData?.length}
        onRetry={refresh}
        loadingMessage={t("heatmap.loading")}
        emptyMessage={t("heatmap.empty")}
        minHeight={400}
      >
        <Box>
          <Box sx={{ mb: 3 }}>
            <HeatmapMetrics
              stats={stats}
              showTitle
              title={t("heatmap.metrics.title")}
            />

            <Box sx={{ mt: 3 }}>
              <HeatmapStats
                data={heatmapData || []}
                stats={stats || undefined}
                showTitle
                title={t("heatmap.stats.title")}
              />
            </Box>
          </Box>

          <Box>
            <RealTimeHeatmapChart
              data={heatmapData || []}
              stats={stats}
              loading={loading}
              error={error}
              onRefresh={refresh}
              height={700}
              title={t("heatmap.chart.title")}
              showControls
              showStats={false}
            />
          </Box>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default HeatmapAnalysis;
