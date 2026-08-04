"use client";

import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { SubdomainClaimForm } from "@/features/subdomains/components/SubdomainClaimForm";
import { SubdomainList } from "@/features/subdomains/components/SubdomainList";
import { SubdomainQuotaMeter } from "@/features/subdomains/components/SubdomainQuotaMeter";
import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import {
  getCardSurfaceSx,
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
 * "Instrumento técnico" redesign (2026-08-03), round 3. Round 2 tried a
 * `7fr/5fr` side-by-side grid (addresses left, create form right) to fix
 * round 1's "anemic" gate verdict — Bruno's follow-up asked for the
 * horizontal stacked presentation back (each section full-width, one below
 * the other), so the grid is gone, but every other round-2 improvement
 * stays: {@link SubdomainQuotaMeter} as the quota anchor, the 72px address
 * rows with hover + 1rem mono, the create form as a level-1 translucent
 * card, the richer empty state, and the airier spacing. The page now reads
 * top to bottom as: `<h1>` + intro → quota meter → `/ Seus endereços` +
 * list → `/ Criar novo endereço` + form card — each block full-width and
 * its own `reveal` stagger step.
 *
 * Container width went back to `maxWidth="md"` (900px, the pre-redesign
 * value): a stacked composition of address rows and a single-column form
 * reads as a comfortable measure at 900px, not as under-used width the way
 * a wide dashboard does — the extra room only mattered for the round-2
 * grid's two side-by-side columns, which no longer exist.
 *
 * Both sub-sections still use the `/ LABEL` {@link SectionLabel} in place of
 * the old ad hoc `subtitle2` headings, each with `headingLevel={2}` so the
 * heading-list navigation a screen reader builds still finds them. Zero
 * behavior change: claim/release flows, the `limitReached` gate and the
 * quota itself are untouched — only composition and typography moved.
 */
export default function SubdomainsPage() {
  const theme = useTheme();
  const { t } = useTranslation("subdomains");
  const { subdomains, isLoading, limitReached, maxSubdomains } =
    useSubdomains();

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<Skeleton variant="rounded" height={400} />}
    >
      <ResponsiveContainer maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Box className="reveal reveal-1">
            <PageSectionHeading title={t("title")} titleVariant="page" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {t("intro")}
            </Typography>
          </Box>

          <Box className="reveal reveal-2">
            <Stack spacing={2.5}>
              <SubdomainQuotaMeter
                count={subdomains.length}
                max={maxSubdomains}
                loading={isLoading}
              />
              <Stack spacing={1.25}>
                <SectionLabel headingLevel={2}>
                  {t("list.heading")}
                </SectionLabel>
                <SubdomainList />
              </Stack>
            </Stack>
          </Box>

          <Box className="reveal reveal-3">
            {isLoading ? (
              <Skeleton variant="rounded" height={320} />
            ) : limitReached ? (
              <Alert severity="info">{t("claim.limitReachedNotice")}</Alert>
            ) : (
              <Stack spacing={1.25}>
                <SectionLabel headingLevel={2}>
                  {t("claim.heading")}
                </SectionLabel>
                <EnhancedPaper
                  variant="outlined"
                  animated={false}
                  sx={{
                    ...getCardSurfaceSx(theme),
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <SubdomainClaimForm />
                </EnhancedPaper>
              </Stack>
            )}
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
