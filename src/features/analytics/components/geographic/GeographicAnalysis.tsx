"use client";
import { useState } from "react";
import { Globe } from "lucide-react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import TabDescription from "@/shared/ui/base/TabDescription";

import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { GeographicChart } from "./GeographicChart";
import { GeographicChoropleth } from "./GeographicChoropleth";
import { GeographicInsights } from "./GeographicInsights";
import { GeographicMetrics } from "./GeographicMetrics";

interface GeographicAnalysisProps {
  linkId: string;
  title?: string;
  enableRealtime?: boolean;
  minClicks?: number;
}

export function GeographicAnalysis({
  linkId,
  title,
  enableRealtime = false,
  minClicks = 1,
}: GeographicAnalysisProps) {
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("geographic.title");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { data, stats, loading, error, refresh, isRealtime } =
    useGeographicData({
      linkId,
      enableRealtime,
      minClicks,
      refreshInterval: 30000,
    });

  return (
    <Box>
      {/* Cabeçalho do módulo */}
      <Box sx={{ mb: 3 }}>
        <TabDescription
          icon={<Globe {...ICON_LG} />}
          title={displayTitle}
          description={t("geographic.description")}
          highlight={t("geographic.countriesReached", {
            count: stats?.totalCountries || 0,
          })}
          metadata={isRealtime ? t("dashboard.realtime") : undefined}
        />
      </Box>

      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        onRetry={refresh}
        loadingMessage={t("geographic.loading")}
        emptyMessage={t("geographic.empty")}
        minHeight={300}
      >
        <Box>
          {/* 5 metric cards */}
          <Box sx={{ mb: 3 }}>
            <GeographicMetrics
              data={data}
              stats={stats}
              showTitle
              title={t("geographic.metrics.title")}
            />
          </Box>

          {/* Mapa coroplético — hero, largura total */}
          <GeographicChoropleth
            countries={data?.top_countries || []}
            selectedCountry={selectedCountry}
            onCountrySelect={setSelectedCountry}
          />

          {/* Continentes (left 5/12) + Países ranking (right 7/12) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <ContinentBreakdown continents={data?.continents || []} />
            </Grid>
            <Grid item xs={12} md={7}>
              <GeographicChart
                countries={data?.top_countries || []}
                states={data?.top_states || []}
                cities={[]}
                totalClicks={stats?.totalClicks || 0}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                hideStates
              />
            </Grid>
          </Grid>

          {/* Estados (com drill-down) + Cidades — largura total */}
          <Box sx={{ mb: 3 }}>
            <GeographicChart
              countries={data?.top_countries || []}
              states={data?.top_states || []}
              cities={data?.top_cities || []}
              totalClicks={stats?.totalClicks || 0}
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              hideCountries
            />
          </Box>

          {/* Insights */}
          <GeographicInsights
            data={data?.heatmap_data || []}
            countries={data?.top_countries || []}
            states={data?.top_states || []}
            cities={data?.top_cities || []}
          />
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default GeographicAnalysis;
