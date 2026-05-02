"use client";

import { Alert } from "@mui/material";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LinkAnalyticsTabsOptimized } from "@/features/links/components/analytics/LinkAnalyticsTabs";
import { LinkActions } from "@/features/links/components/LinkActions";
import { useLinkAnalyticsOptimized } from "@/features/links/hooks/useLinkAnalytics";
import { AppIcon } from "@/shared/ui/icons";
import { ResponsiveContainer } from "@/shared/ui/base";
import { PageHeader } from "@/shared/ui/base/PageHeader";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

/**
 * 📊 Página de Analytics Individual de Link - REFATORADA
 * Segue padrões arquiteturais: < 100 linhas, reutiliza componentes base
 * Estrutura: Header → Actions → Metrics → Tabs (seguindo template obrigatório)
 */
interface Props {
  id: string;
}

function LinkAnalyticsPage({ id }: Props) {
  const { t } = useTranslation("analytics");
  const { linkInfo } = useLinkAnalyticsOptimized(id || "");

  // Memoizar props das tabs para evitar re-renders desnecessários
  const tabsProps = useMemo(
    () => ({
      linkId: id!,
      showHeader: false, // Header será mostrado pela página
    }),
    [id],
  );

  // Early return para casos de erro
  if (!id) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]}>
        <ResponsiveContainer variant="page">
          <Alert severity="error">ID do link não fornecido na URL</Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]}>
      <ResponsiveContainer variant="page">
          <LinkActions
            linkId={id}
            shortUrl={linkInfo?.short_url}
            currentPage="analytics"
          />

          <PageHeader
            title={linkInfo?.title || t("dashboard.title")}
            subtitle={`Análise detalhada do desempenho do link ${linkInfo?.short_url || id}`}
            icon={<AppIcon intent="analytics" size={32} />}
            variant="analytics"
          />

          <LinkAnalyticsTabsOptimized {...tabsProps} />
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default memo(LinkAnalyticsPage);
