"use client";

import { Alert, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { SubdomainClaimForm } from "@/features/subdomains/components/SubdomainClaimForm";
import { SubdomainList } from "@/features/subdomains/components/SubdomainList";
import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import { AppIcon } from "@/shared/ui/icons";

/**
 * `/subdomains` — manage the authenticated user's custom subdomains (up to
 * `MAX_SUBDOMAINS_PER_USER`). Lists claimed addresses with copy/open/release
 * actions and a claim form for adding another, hidden once the limit is
 * reached.
 */
export default function SubdomainsPage() {
  const { t } = useTranslation("subdomains");
  const { subdomains, isLoading, limitReached, maxSubdomains } =
    useSubdomains();

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<Skeleton variant="rounded" height={400} />}
    >
      <ResponsiveContainer maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <PageSectionHeading
            icon={<AppIcon intent="subdomain" size={22} />}
            title={t("title")}
            description={
              isLoading
                ? t("subtitleLoading")
                : t("subtitle", {
                    count: subdomains.length,
                    max: maxSubdomains,
                  })
            }
            titleVariant="page"
          />

          <Typography variant="body2" color="text.secondary">
            {t("intro")}
          </Typography>

          <Divider />

          <Stack spacing={1.25}>
            <Typography variant="subtitle2" component="h2">
              {t("list.heading")}
            </Typography>
            <SubdomainList />
          </Stack>

          {!isLoading ? (
            limitReached ? (
              <Alert severity="info">{t("claim.limitReachedNotice")}</Alert>
            ) : (
              <Stack spacing={1.25}>
                <Divider />
                <Typography variant="subtitle2" component="h2">
                  {t("claim.heading")}
                </Typography>
                <SubdomainClaimForm />
              </Stack>
            )
          ) : null}
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
