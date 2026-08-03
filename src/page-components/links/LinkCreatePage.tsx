"use client";

import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { CreateLinkForm } from "@/features/links";
import { LinkActionsBackLink } from "@/features/links/components/LinkActions/LinkActionsBackLink";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import { LinkFormSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

/**
 * `/links/create` page — page title + back link, followed by the create form.
 * No icon-chip beside the title ("instrumento técnico" redesign, 2026-08-03):
 * the heading hierarchy alone identifies the page, matching `/links` and
 * every other page-top heading in the cycle.
 */
function LinkCreatePage() {
  const { t } = useTranslation("links");

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<LinkFormSkeleton />}>
      <ResponsiveContainer variant="form" maxWidth="md">
        <Stack spacing={{ xs: 2, sm: 2.5 }} component="section">
          <Box className="reveal reveal-1">
            <PageSectionHeading
              title={t("form.createTitle")}
              description={t("form.createSubtitle")}
              titleVariant="page"
              action={<LinkActionsBackLink />}
            />
          </Box>
          <Box className="reveal reveal-2">
            <CreateLinkForm showBackButton />
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkCreatePage;
