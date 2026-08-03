"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { BioEditor } from "@/features/bio";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";

/**
 * `/bio` — editor for the authenticated user's link-in-bio page. Thin
 * layout wrapper (auth guard + page heading) around `BioEditor`
 * (`@/features/bio`), which owns the actual form/preview/items logic.
 *
 * Lives at `src/page-components/bio-editor/` (not `src/page-components/bio/`)
 * to avoid colliding with the public `/@{handle}` page component, owned by a
 * different part of the app.
 *
 * No `icon` on the page heading (redesign "instrumento técnico" — decorative
 * icon-chips beside titles were dropped app-wide, `/links` and `/reports`
 * lead the same way). The reveal stagger for this screen starts here
 * (`reveal-1` on the heading) and continues inside `BioEditor` itself
 * (`reveal-2`.. on its own top-level blocks) — `BioEditor` is effectively
 * this screen's whole content area, the same role `LinksQuickCreate`/
 * `LinksBrowseSection` play for `/links`.
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
          <Box className="reveal reveal-1">
            <PageSectionHeading
              title={t("title")}
              description={t("subtitle")}
              titleVariant="page"
            />
          </Box>
          <BioEditor />
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
