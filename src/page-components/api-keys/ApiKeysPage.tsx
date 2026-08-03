"use client";

import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ApiKeyCreateForm } from "@/features/api-keys/components/ApiKeyCreateForm";
import { ApiKeyList } from "@/features/api-keys/components/ApiKeyList";
import { ApiKeyQuotaMeter } from "@/features/api-keys/components/ApiKeyQuotaMeter";
import { ApiKeyUsageGuide } from "@/features/api-keys/components/ApiKeyUsageGuide";
import { useApiKeys } from "@/features/api-keys/hooks/useApiKeys";
import { getApiKeyCardSx } from "@/features/api-keys/utils/cardSurface";
import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import {
  PageSectionHeading,
  ResponsiveContainer,
  SectionLabel,
} from "@/shared/ui/base";

/**
 * `/api-keys` — manage the authenticated user's API keys (up to
 * `MAX_API_KEYS_PER_USER`). Lists existing keys with revoke actions, a create
 * form that reveals the full token exactly once, and a didactic usage section
 * with copy-pasteable `curl` examples against the public `/api/v1` API. The
 * create form hides once the limit is reached.
 *
 * "Instrumento técnico" redesign (2026-08-03): stacked full-width sections
 * (no two-column layout), each its own `reveal` stagger step — `<h1>` + intro
 * → {@link ApiKeyQuotaMeter} + `/ Suas chaves` list → `/ Criar nova chave`
 * form card → usage guide. `ApiKeyQuotaMeter` mirrors `/subdomains`'
 * `SubdomainQuotaMeter`: the old "N de M chaves em uso" caption becomes a
 * compact metric anchor instead of plain text, since the list+create portion
 * of this page is otherwise as sparse as `/subdomains`. Zero behavior change:
 * create/revoke flows, the one-time token reveal and the `limitReached` gate
 * are untouched — only composition and typography moved.
 */
export default function ApiKeysPage() {
  const theme = useTheme();
  const { t } = useTranslation("apiKeys");
  const { apiKeys, isLoading, limitReached, maxKeys } = useApiKeys();

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
              <ApiKeyQuotaMeter
                count={apiKeys.length}
                max={maxKeys}
                loading={isLoading}
              />
              <Stack spacing={1.25}>
                <SectionLabel headingLevel={2}>
                  {t("list.heading")}
                </SectionLabel>
                <ApiKeyList />
              </Stack>
            </Stack>
          </Box>

          <Box className="reveal reveal-3">
            {isLoading ? (
              <Skeleton variant="rounded" height={220} />
            ) : limitReached ? (
              <Alert severity="info">
                {t("create.limitReachedNotice", { max: maxKeys })}
              </Alert>
            ) : (
              <Stack spacing={1.25}>
                <SectionLabel headingLevel={2}>
                  {t("create.heading")}
                </SectionLabel>
                <EnhancedPaper
                  variant="outlined"
                  animated={false}
                  sx={{
                    ...getApiKeyCardSx(theme),
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <ApiKeyCreateForm />
                </EnhancedPaper>
              </Stack>
            )}
          </Box>

          <Box className="reveal reveal-4">
            <ApiKeyUsageGuide />
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
