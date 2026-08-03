"use client";

import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { SubdomainClaimForm } from "@/features/subdomains/components/SubdomainClaimForm";
import { SubdomainList } from "@/features/subdomains/components/SubdomainList";
import { SubdomainQuotaMeter } from "@/features/subdomains/components/SubdomainQuotaMeter";
import { useSubdomains } from "@/features/subdomains/hooks/useSubdomains";
import { getSubdomainCardSx } from "@/features/subdomains/utils/cardSurface";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
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
 * "Instrumento técnico" redesign (2026-08-03), recomposed after the first
 * gate pass read as anemic (grammar applied "by subtraction" — thin rows and
 * a floating form left-packed against the page's near-black background,
 * width unused). This version gives the page a spatial thesis instead of a
 * single narrow column:
 *
 * - The page title + intro stay full-width above everything (unchanged
 *   content, no `maxWidth="md"` cap anymore — the container now uses its
 *   default 1440px cap, so the two-column body below actually has width to
 *   compose with).
 * - A `7fr/5fr` CSS grid below that (stacks to one column under `lg`):
 *   left = the addresses (quota anchor + list), right = the create-address
 *   card. Each column keeps its own `reveal` stagger step.
 * - The old "2 de 3 endereços em uso" caption — previously a plain subtitle
 *   under the `<h1>` — is now {@link SubdomainQuotaMeter}, a compact metric
 *   anchoring the top of the addresses column instead of a sentence anyone
 *   could miss.
 * - The claim form gained a level-1 translucent card (same
 *   {@link getSubdomainCardSx} formula as each address row) — "interactive
 *   content legitimately gets a card" per the gate's ruling, reversing the
 *   first pass's "boxless is also valid" call for this specific section.
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
      <ResponsiveContainer sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Box className="reveal reveal-1">
            <PageSectionHeading title={t("title")} titleVariant="page" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, maxWidth: 680 }}
            >
              {t("intro")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" },
              gap: { xs: 3, lg: 4 },
              alignItems: "start",
            }}
          >
            {/* Left column — quota anchor + the address list. */}
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

            {/* Right column — the create-address card, or the limit notice. */}
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
                      ...getSubdomainCardSx(theme),
                      p: { xs: 2.5, sm: 3 },
                    }}
                  >
                    <SubdomainClaimForm />
                  </EnhancedPaper>
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
