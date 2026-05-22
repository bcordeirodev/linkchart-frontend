"use client";

import { Link2 } from "lucide-react";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { CreateLinkForm } from "@/features/links";
import { LinkActionsBackLink } from "@/features/links/components/LinkActions/LinkActionsBackLink";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import { LinkFormSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

function LinkCreatePage() {
  const { t } = useTranslation("links");

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<LinkFormSkeleton />}>
      <ResponsiveContainer variant="form" maxWidth="md">
        <Stack spacing={{ xs: 2, sm: 2.5 }} component="section">
          <PageSectionHeading
            icon={<Link2 {...ICON_MD} />}
            title={t("form.createTitle")}
            description={t("form.createSubtitle")}
            titleVariant="page"
            action={<LinkActionsBackLink />}
          />
          <CreateLinkForm showBackButton />
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkCreatePage;
