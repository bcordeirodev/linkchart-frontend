"use client";

import { Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { BioEditor } from "@/features/bio";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import { AppIcon } from "@/shared/ui/icons";

/**
 * `/bio` — editor for the authenticated user's link-in-bio page. Thin
 * layout wrapper (auth guard + page heading) around `BioEditor`
 * (`@/features/bio`), which owns the actual form/preview/items logic.
 *
 * Lives at `src/page-components/bio-editor/` (not `src/page-components/bio/`)
 * to avoid colliding with the public `/@{handle}` page component, owned by a
 * different part of the app.
 */
export default function BioEditorPage() {
  const { t } = useTranslation("bio");

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<Skeleton variant="rounded" height={400} />}
    >
      <ResponsiveContainer maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <PageSectionHeading
            icon={<AppIcon intent="profile" size={22} />}
            title={t("title")}
            description={t("subtitle")}
            titleVariant="page"
          />
          <BioEditor />
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
