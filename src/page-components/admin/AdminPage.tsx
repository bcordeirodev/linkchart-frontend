"use client";
/**
 * /admin — painel read-only do dono do produto: crescimento (signups,
 * links, cliques), lista de usuários, engajamento e saúde operacional.
 * Todos os números excluem dados demo. O backend é a autoridade do gate
 * (403 para não-admin); o AuthGuardRedirect com authRoles.admin só decide
 * cedo no cliente para não piscar conteúdo.
 */

import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AdminGrowthTab } from "@/features/admin/components/AdminGrowthTab";
import {
  AdminTabs,
  type AdminTab,
} from "@/features/admin/components/AdminTabs";
import { AdminUsersTab } from "@/features/admin/components/AdminUsersTab";
import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import authRoles from "@/lib/auth/authRoles";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";

import type { AdminRange } from "@/features/admin/types";

/**
 * Página do painel admin: header, barra de tabs/período e o conteúdo da
 * tab ativa (componentes das tasks seguintes).
 */
export default function AdminPage() {
  const { t } = useTranslation("admin");
  const [tab, setTab] = useState<AdminTab>("growth");
  const [range, setRange] = useState<AdminRange>("30d");

  return (
    <AuthGuardRedirect auth={authRoles.admin}>
      <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <Box className="reveal">
            <PageSectionHeading
              title={t("page.title")}
              description={t("page.subtitle")}
              titleVariant="page"
            />
          </Box>

          <Box className="reveal reveal-2">
            <AdminTabs
              tab={tab}
              onTabChange={setTab}
              range={range}
              onRangeChange={setRange}
              showRange={tab === "growth" || tab === "engagement"}
            />
          </Box>

          <Box className="reveal reveal-3">
            {/* Conteúdo por tab — preenchido nas Tasks 14–17:
                growth → <AdminGrowthTab range={range} /> (Task 14, pronto)
                users → <AdminUsersTab /> (Task 15, pronto)
                engagement → <AdminEngagementTab range={range} />
                health → <AdminHealthTab /> */}
            {tab === "growth" ? <AdminGrowthTab range={range} /> : null}
            {tab === "users" ? <AdminUsersTab /> : null}
            {tab === "engagement" ? <Box /> : null}
            {tab === "health" ? <Box /> : null}
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
