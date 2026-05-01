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
          highlight={`${stats?.totalPoints || 0} localizações mapeadas`}
          metadata={
            enableRealtime
              ? "Tempo Real"
              : lastUpdate
                ? `Atualizado: ${lastUpdate.toLocaleTimeString()}`
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
        emptyMessage="Este link ainda não recebeu cliques com dados geográficos."
        minHeight={400}
      >
        <Box>
          <Box sx={{ mb: 3 }}>
            <HeatmapMetrics
              stats={stats}
              showTitle
              title="Métricas do Heatmap"
            />

            <Box sx={{ mt: 3 }}>
              <HeatmapStats
                data={heatmapData || []}
                stats={stats || undefined}
                showTitle
                title="Estatísticas Detalhadas"
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
              title="Mapa de Calor - Link Específico"
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
