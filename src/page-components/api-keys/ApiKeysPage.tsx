"use client";

import { Alert, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ApiKeyCreateForm } from "@/features/api-keys/components/ApiKeyCreateForm";
import { ApiKeyList } from "@/features/api-keys/components/ApiKeyList";
import { ApiKeyUsageGuide } from "@/features/api-keys/components/ApiKeyUsageGuide";
import { useApiKeys } from "@/features/api-keys/hooks/useApiKeys";
import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";

/**
 * `/api-keys` — manage the authenticated user's API keys (up to
 * `MAX_API_KEYS_PER_USER`). Lists existing keys with revoke actions, a create
 * form that reveals the full token exactly once, and a didactic usage section
 * with copy-pasteable `curl` examples against the public `/api/v1` API. The
 * create form hides once the limit is reached.
 */
export default function ApiKeysPage() {
  const { t } = useTranslation("apiKeys");
  const { apiKeys, isLoading, limitReached, maxKeys } = useApiKeys();

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<Skeleton variant="rounded" height={400} />}
    >
      <ResponsiveContainer maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }}>
          <PageSectionHeading
            icon={<KeyRound size={22} strokeWidth={1.5} />}
            title={t("title")}
            description={
              isLoading
                ? t("subtitleLoading")
                : t("subtitle", { count: apiKeys.length, max: maxKeys })
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
            <ApiKeyList />
          </Stack>

          {!isLoading ? (
            limitReached ? (
              <Alert severity="info">
                {t("create.limitReachedNotice", { max: maxKeys })}
              </Alert>
            ) : (
              <Stack spacing={1.25}>
                <Divider />
                <Typography variant="subtitle2" component="h2">
                  {t("create.heading")}
                </Typography>
                <ApiKeyCreateForm />
              </Stack>
            )
          ) : null}

          <Divider />

          <ApiKeyUsageGuide />
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
