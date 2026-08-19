"use client";

import { Alert, Box } from "@mui/material";
import { memo, useMemo, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { LinkAnalyticsTabsOptimized } from "@/features/links/components/analytics/LinkAnalyticsTabs";
import { LinkActions } from "@/features/links/components/LinkActions";
import { useLinkAnalyticsOptimized } from "@/features/links/hooks/useLinkAnalytics";
import { ResponsiveContainer } from "@/shared/ui/base";

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
    }),
    [id],
  );

  // Early return para casos de erro
  if (!id) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]}>
        <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
          <Alert severity="error">{t("dashboard.missingId")}</Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]}>
      {/* Mesmo teto de largura da lista (/links) — as duas telas de análise
          compartilham o mesmo canvas; edit/qr continuam em `md` de propósito
          (são formulários). */}
      <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
        <Box className="reveal reveal-1">
          <LinkActions
            linkId={id}
            currentView="analytics"
            slug={linkInfo?.slug}
            shortUrl={linkInfo?.short_url}
            title={linkInfo?.title}
            createdAt={linkInfo?.created_at}
          />
        </Box>

        <Box className="reveal reveal-2">
          <Suspense>
            <LinkAnalyticsTabsOptimized {...tabsProps} />
          </Suspense>
        </Box>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default memo(LinkAnalyticsPage);
