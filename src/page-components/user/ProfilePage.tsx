"use client";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";
import { Alert, Box, Stack } from "@mui/material";
import { UserCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { OAuthSecurityCard } from "@/features/profile/components/OAuthSecurityCard";
import { PasswordChangeForm } from "@/features/profile/components/PasswordChangeForm";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileSidebar } from "@/features/profile/components/ProfileSidebar";
import { SubdomainSettings } from "@/features/profile/components/SubdomainSettings";
import { LinkActionsBackLink } from "@/features/links/components/LinkActions/LinkActionsBackLink";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useMessage } from "@/lib/providers/MessageProvider";
import { profileService } from "@/services";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import { ProfileSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";
import useUser from "../../lib/auth/useUser";

import type { UserProfile } from "@/services";

/**
 * Página de perfil do usuário refatorada
 * Componentizada para melhor organização
 */
function ProfilePage() {
  const { showMessage } = useMessage();
  const { t } = useTranslation("profile");
  const { data: authUser } = useUser();
  const { user: auth0User, isLoading: auth0Loading } = useAuth0User();
  /** Contas Auth0 (Google/Facebook) não têm senha local — formulário de troca não se aplica. */
  const usesOAuthLogin = !auth0Loading && !!auth0User;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função estável para carregar dados do perfil
  const loadUserProfile = useCallback(async () => {
    if (authUser && !user) {
      try {
        const response = await profileService.getCurrentUser();
        setUser(response.user);
      } catch (_error) {
        showMessage({
          message: t("loadError"),
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (!authUser) {
      setIsLoading(false);
    }
  }, [authUser, user, showMessage, t]);

  // Carregar dados do perfil
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Handler para atualização do usuário
  const handleUserUpdate = useCallback((updatedUser: UserProfile) => {
    setUser(updatedUser);
  }, []);

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
                <SubdomainSettings />
              ) : null}
              <ProfileForm
                user={user}
                onUserUpdate={handleUserUpdate}
                photoURL={authUser?.photoURL}
              />
              {usesOAuthLogin ? <OAuthSecurityCard /> : <PasswordChangeForm />}
            </Stack>

            <Box sx={{ minWidth: 0 }}>
              <ProfileSidebar
                user={user}
                showResendVerification={!auth0Loading && !auth0User}
              />
            </Box>
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default ProfilePage;
