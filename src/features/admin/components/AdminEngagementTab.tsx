"use client";
/**
 * Tab Engajamento do painel `/admin` — ativação, retorno na 1ª semana,
 * WAU/MAU (com o disclaimer de início da coleta de logins, omitido quando o
 * backend nunca registrou nenhum) e a distribuição de links por usuário em
 * barras horizontais, no idioma visual "instrumento técnico"
 * (`OverviewMetricRow` + `ChartCard`, sem donut/ícone-chip).
 */

import { Alert, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { DistributionBars } from "@/features/admin/components/DistributionBars";
import { useAdminEngagement } from "@/features/admin/hooks/useAdmin";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { OverviewMetricRow } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { AdminRange } from "@/features/admin/types";

interface AdminEngagementTabProps {
  /** Janela ativa (afeta o coorte de retorno). */
  range: AdminRange;
}

/**
 * Tab Engajamento: ativação, retorno na 1ª semana, WAU/MAU (com o
 * disclaimer de início da coleta de logins) e a distribuição de links por
 * usuário em barras horizontais.
 *
 * @param props.range Janela ativa (7d/30d/90d) — afeta o coorte de retorno.
 * @returns Conteúdo da tab, gated por `AnalyticsStateManager`.
 */
export function AdminEngagementTab({ range }: AdminEngagementTabProps) {
  const { t } = useTranslation("admin");
  const query = useAdminEngagement(range);
  const data = query.data;

  return (
    <AnalyticsStateManager
      loading={query.isLoading}
      error={query.error ? t("errors.loadFailed") : null}
      hasData={Boolean(data)}
      onRetry={() => query.refetch()}
    >
      {data ? (
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <OverviewMetricRow
            size="md"
            metrics={[
              {
                label: t("engagement.activation"),
                value:
                  data.activation_pct === null
                    ? "—"
                    : `${data.activation_pct.toLocaleString("pt-BR")}%`,
                caption: t("engagement.activationCaption"),
              },
              {
                label: t("engagement.week1Return"),
                value:
                  data.week1_return_pct === null
                    ? "—"
                    : `${data.week1_return_pct.toLocaleString("pt-BR")}%`,
                caption: t("engagement.week1ReturnCaption"),
              },
              {
                label: t("engagement.wau"),
                value: data.wau.toLocaleString("pt-BR"),
              },
              {
                label: t("engagement.mau"),
                value: data.mau.toLocaleString("pt-BR"),
              },
            ]}
          />

          {data.login_tracking_since ? (
            <Alert severity="info" variant="outlined">
              {t("engagement.loginTrackingSince", {
                date: new Date(data.login_tracking_since).toLocaleDateString(
                  "pt-BR",
                ),
              })}
            </Alert>
          ) : null}

          <ChartCard
            title={t("engagement.distributionTitle")}
            subtitle={t("engagement.distributionSubtitle")}
          >
            <DistributionBars
              rows={data.links_distribution.map((d) => ({
                label: d.bucket,
                value: d.users,
              }))}
              unit={t("engagement.bucketUsers")}
            />
          </ChartCard>
        </Stack>
      ) : null}
    </AnalyticsStateManager>
  );
}

export default AdminEngagementTab;
