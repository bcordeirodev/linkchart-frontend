"use client";

import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { SubdomainClaimForm } from "@/features/subdomains/components/SubdomainClaimForm";
import { SubdomainList } from "@/features/subdomains/components/SubdomainList";
import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";
import {
  PageSectionHeading,
  ResponsiveContainer,
  SectionLabel,
} from "@/shared/ui/base";

/**
 * `/subdomains` — manage the authenticated user's custom subdomains (up to
 * `MAX_SUBDOMAINS_PER_USER`). Lists claimed addresses with copy/open/release
 * actions and a claim form for adding another, hidden once the limit is
 * reached.
 *
 * "Instrumento técnico" redesign (2026-08-03): the page title carries no
 * icon-chip (that pattern died with the redesign — the `<h1>` hierarchy
 * already identifies the page), and both sub-sections use the `/ LABEL`
 * {@link SectionLabel} in place of the old ad hoc `subtitle2` headings, each
 * with `headingLevel={2}` so the heading-list navigation a screen reader
 * builds still finds them. A single top-level `Stack` carries the only
 * gutter between sections; each section's own reveal class staggers the
 * page-load motion.
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
          <Box className="reveal reveal-1">
            <PageSectionHeading
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
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {t("intro")}
            </Typography>
          </Box>

          <Box className="reveal reveal-2">
            <Stack spacing={1.25}>
              <SectionLabel headingLevel={2}>{t("list.heading")}</SectionLabel>
              <SubdomainList />
            </Stack>
          </Box>

          {!isLoading ? (
            <Box className="reveal reveal-3">
              {limitReached ? (
                <Alert severity="info">{t("claim.limitReachedNotice")}</Alert>
              ) : (
                <Stack spacing={1.25}>
                  <SectionLabel headingLevel={2}>
                    {t("claim.heading")}
                  </SectionLabel>
                  <SubdomainClaimForm />
                </Stack>
              )}
            </Box>
          ) : null}
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
