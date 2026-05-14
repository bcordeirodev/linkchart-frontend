"use client";

import { Tabs, Tab, Box, useTheme } from "@mui/material";
import { useState } from "react";
import {
  LayoutDashboard,
  Globe,
  Clock,
  Users,
  Lightbulb,
  MousePointer2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { ICON_SM, ICON_LG } from "@/lib/theme/iconDefaults";

import { AudienceAnalysis } from "@/features/analytics/components/audience/AudienceAnalysis";
import { GeographicAnalysis } from "@/features/analytics/components/geographic/GeographicAnalysis";
import { InsightsAnalysis } from "@/features/analytics/components/insights/InsightsAnalysis";
import { TemporalAnalysis } from "@/features/analytics/components/temporal";
import TabDescription from "@/shared/ui/base/TabDescription";
import { TabPanel } from "@/shared/ui/base/TabPanel";

import { LinkDashboard } from "@/features/analytics/components/dashboard/LinkDashboard";

import { ClicksTable } from "./ClicksTable";

import type { LinkAnalyticsData } from "../../types/analytics";

// Importar componentes especializados que usam hooks próprios

interface LinkAnalyticsTabsOptimizedProps {
  data?: LinkAnalyticsData | null;
  linkId: string;
  loading?: boolean;
  showHeader?: boolean;
}

/**
 * 📋 Tabs otimizadas para analytics de link individual
 *
 * @description
 * Versão otimizada que usa componentes com hooks próprios,
 * seguindo o mesmo padrão do analytics global.
 *
 * @features
 * - Cada tab usa seu próprio hook específico
 * - Componentes reutilizáveis do módulo analytics
 * - Estrutura limpa e consistente
 * - Menos de 150 linhas
 */
export function LinkAnalyticsTabsOptimized({
  data,
  linkId,
  loading: _loading = false,
  showHeader = true,
}: LinkAnalyticsTabsOptimizedProps) {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const { t } = useTranslation("links");
  const { t: tAnalytics } = useTranslation("analytics");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Configuração padronizada de tabs
  const tabLabels = [
    { label: t("analytics.tabs.overview"), Icon: LayoutDashboard },
    { label: t("analytics.tabs.temporal"), Icon: Clock },
    { label: t("analytics.tabs.geographic"), Icon: Globe },
    { label: t("analytics.tabs.audience"), Icon: Users },
    { label: t("analytics.tabs.insights"), Icon: Lightbulb },
    { label: t("analytics.clicksTable.title"), Icon: MousePointer2 },
  ];

  return (
    <Box>
      {/* Tabs Navigation */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
              "&.Mui-selected": {
                backgroundColor: theme.palette.action.selected,
                borderRadius: `${radiusTokens.md}px`,
              },
            },
          }}
        >
          {tabLabels.map(({ label, Icon }, index) => (
            <Tab
              key={index}
              label={label}
              icon={<Icon {...ICON_SM} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels - LAZY LOADING: Apenas a tab ativa é renderizada */}

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        {showHeader ? (
          <Box sx={{ mb: 2 }}>
            <TabDescription
              icon={<LayoutDashboard {...ICON_LG} />}
              title={tAnalytics("dashboard.title")}
              description={tAnalytics("dashboard.description")}
              highlight={`${data?.overview?.total_clicks || 0} ${tAnalytics("dashboard.totalClicksLabel")}`}
            />
          </Box>
        ) : null}
        {/* Renderizar apenas se a tab está ativa */}
        {tabValue === 0 && (
          <LinkDashboard
            linkId={linkId}
            showTitle={false}
            enableRealtime={false}
            showTimeframeSelector
            compact={false}
          />
        )}
      </TabPanel>

      {/* Temporal Tab */}
      <TabPanel value={tabValue} index={1}>
        {/* Renderizar apenas se a tab está ativa */}
        {tabValue === 1 && (
          <TemporalAnalysis linkId={linkId} enableRealtime={false} />
        )}
      </TabPanel>

      {/* Geografia Tab */}
      <TabPanel value={tabValue} index={2}>
        {/* Renderizar apenas se a tab está ativa */}
        {tabValue === 2 && (
          <GeographicAnalysis
            linkId={linkId}
            enableRealtime={false}
            minClicks={1}
          />
        )}
      </TabPanel>

      {/* Audiência Tab */}
      <TabPanel value={tabValue} index={3}>
        {/* Renderizar apenas se a tab está ativa */}
        {tabValue === 3 && <AudienceAnalysis linkId={linkId} />}
      </TabPanel>

      {/* Insights Tab */}
      <TabPanel value={tabValue} index={4}>
        {/* Renderizar apenas se a tab está ativa */}
        {tabValue === 4 && (
          <InsightsAnalysis
            linkId={linkId}
            enableRealtime={false}
            maxInsights={10}
          />
        )}
      </TabPanel>

      {/* Cliques Tab */}
      <TabPanel value={tabValue} index={5}>
        {/* Renderizar apenas se a tab está ativa */}
        {tabValue === 5 && <ClicksTable linkId={linkId} />}
      </TabPanel>
    </Box>
  );
}

export default LinkAnalyticsTabsOptimized;
