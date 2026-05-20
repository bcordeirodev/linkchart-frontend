"use client";
import { Alert, Grid, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { PasswordChangeForm } from "@/features/profile/components/PasswordChangeForm";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileSidebar } from "@/features/profile/components/ProfileSidebar";
import { SubdomainSettings } from "@/features/profile/components/SubdomainSettings";
import { AppIcon } from "@/shared/ui/icons";
import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { profileService } from "@/services";
import { ResponsiveContainer } from "@/shared/ui/base";
import { PageHeader } from "@/shared/ui/base/PageHeader";
import { ProfileSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";
import useUser from "../../lib/auth/useUser";

import type { UserProfile } from "@/services";

/**
 * Página de perfil do usuário refatorada
 * Componentizada para melhor organização
 */
function ProfilePage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("profile");
  const { data: authUser } = useUser();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função estável para carregar dados do perfil
  const loadUserProfile = useCallback(async () => {
    if (authUser && !user) {
      try {
        const response = await profileService.getCurrentUser();
        setUser(response.user);
      } catch (_error) {
        dispatch(
          showMessage({
            message: t("form.saveFailed"),
            variant: "error",
          }),
        );
      } finally {
        setIsLoading(false);
      }
    } else if (!authUser) {
      setIsLoading(false);
    }
  }, [authUser, user, dispatch, t]);

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
        <Alert severity="error">
          Erro ao carregar dados do usuário. Tente fazer login novamente.
        </Alert>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<ProfileSkeleton />}>
      <ResponsiveContainer variant="page" maxWidth="xl">
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          icon={<AppIcon intent="profile" size={32} />}
          variant="profile"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Perfil", current: true },
          ]}
        />

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <ProfileForm
                user={user}
                onUserUpdate={handleUserUpdate}
                photoURL={authUser?.photoURL}
              />
              {process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" && (
                <SubdomainSettings />
              )}
              <PasswordChangeForm />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <ProfileSidebar user={user} />
          </Grid>
        </Grid>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default ProfilePage;
