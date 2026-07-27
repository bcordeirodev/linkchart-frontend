"use client";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { UserCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DangerZone } from "@/features/profile/components/DangerZone";
import { OAuthSecurityCard } from "@/features/profile/components/OAuthSecurityCard";
import { PasswordChangeForm } from "@/features/profile/components/PasswordChangeForm";
import { PreferencesCard } from "@/features/profile/components/PreferencesCard";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import {
  ProfileSection,
  ProfileSectionHeader,
} from "@/features/profile/components/ProfileSection";
import { ProfileSidebar } from "@/features/profile/components/ProfileSidebar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { LinkActionsBackLink } from "@/features/links/components/LinkActions/LinkActionsBackLink";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useMessage } from "@/lib/providers/MessageProvider";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import { ProfileSkeleton } from "@/shared/ui/feedback/skeletons";
import { AppIcon } from "@/shared/ui/icons";
import { useNavigate } from "@/shared/hooks";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";
import useUser from "../../lib/auth/useUser";

/**
 * Compact card linking to the standalone `/subdomains` module. Replaced the
 * profile's old inline subdomain settings section (removed) now that
 * subdomains support N per user and get their own management page — the
 * profile page only teases the feature and hands off navigation.
 */
function SubdomainLinkCard() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();

  return (
    <ProfileSection>
      <ProfileSectionHeader
        icon={<AppIcon intent="subdomain" size={18} />}
        title={t("subdomainCard.title")}
        description={t("subdomainCard.description")}
        action={
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/subdomains")}
            sx={{ minHeight: 36 }}
          >
            {t("subdomainCard.cta")}
          </Button>
        }
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontFamily: "monospace" }}
      >
        {t("subdomainCard.example")}
      </Typography>
    </ProfileSection>
  );
}

/**
 * Página de perfil do usuário refatorada
 * Componentizada para melhor organização
 *
 * @remarks
 * A entidade user vive no cache do TanStack Query (`useProfile`) — nada de
 * `useState` local. `ProfileForm` salva via `useUpdateProfile`, que escreve de
 * volta na mesma key, então esta página re-renderiza com o dado fresco sem
 * callback de sincronização manual.
 */
function ProfilePage() {
  const { showMessage } = useMessage();
  const { t } = useTranslation("profile");
  const { data: authUser } = useUser();
  const { user: auth0User, isLoading: auth0Loading } = useAuth0User();
  /** Contas Auth0 (Google/Facebook) não têm senha local — formulário de troca não se aplica. */
  const usesOAuthLogin = !auth0Loading && !!auth0User;
  // Só busca o perfil com sessão presente (paridade com o guard antigo).
  const profileQuery = useProfile({ enabled: !!authUser });
  const user = profileQuery.data ?? null;
  const isLoading = profileQuery.isLoading;
  const loadFailed = profileQuery.isError;

  // Toast de erro no carregamento (o QueryClient não tem onError global).
  useEffect(() => {
    if (loadFailed) {
      showMessage({
        message: t("loadError"),
        variant: "error",
      });
    }
  }, [loadFailed, showMessage, t]);

  if (isLoading) {
    return (
      <AuthGuardRedirect
        auth={["user", "admin"]}
        fallback={<ProfileSkeleton />}
      >
        <ProfileSkeleton />
      </AuthGuardRedirect>
    );
  }

  if (!user) {
    return (
      <AuthGuardRedirect
        auth={["user", "admin"]}
        fallback={<ProfileSkeleton />}
      >
        <Alert severity="error">{t("loadError")}</Alert>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<ProfileSkeleton />}>
      <ResponsiveContainer variant="page">
        <Stack
          spacing={{ xs: 2.5, sm: 3 }}
          component="section"
          sx={{ width: "100%" }}
        >
          <PageSectionHeading
            icon={<UserCircle {...ICON_MD} />}
            title={t("title")}
            description={t("subtitle")}
            titleVariant="page"
            action={<LinkActionsBackLink />}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 2fr) minmax(0, 1fr)",
              },
              gap: { xs: 2, sm: 3 },
              width: "100%",
              alignItems: "start",
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 0 }}>
              {process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" ? (
                <SubdomainLinkCard />
              ) : null}
              <ProfileForm user={user} photoURL={authUser?.photoURL} />
              {usesOAuthLogin ? <OAuthSecurityCard /> : <PasswordChangeForm />}
              <DangerZone
                usesOAuthLogin={usesOAuthLogin}
                userEmail={user.email}
              />
            </Stack>

            <Box sx={{ minWidth: 0 }}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <ProfileSidebar
                  user={user}
                  showResendVerification={!auth0Loading && !auth0User}
                />
                <PreferencesCard />
              </Stack>
            </Box>
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default ProfilePage;
