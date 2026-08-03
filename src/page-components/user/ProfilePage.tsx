"use client";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { DangerZone } from "@/features/profile/components/DangerZone";
import { OAuthSecurityCard } from "@/features/profile/components/OAuthSecurityCard";
import { PasswordChangeForm } from "@/features/profile/components/PasswordChangeForm";
import { PreferencesCard } from "@/features/profile/components/PreferencesCard";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileSection } from "@/features/profile/components/ProfileSection";
import {
  ProfileAccountStatus,
  ProfileActivity,
} from "@/features/profile/components/ProfileSidebar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { LinkActionsBackLink } from "@/features/links/components/LinkActions/LinkActionsBackLink";
import { useMessage } from "@/lib/providers/MessageProvider";
import { typographyScale } from "@/lib/theme";
import {
  PageSectionHeading,
  ResponsiveContainer,
  SectionLabel,
} from "@/shared/ui/base";
import { ProfileSkeleton } from "@/shared/ui/feedback/skeletons";
import { useNavigate } from "@/shared/hooks";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";
import useUser from "../../lib/auth/useUser";

/**
 * Compact card linking to the standalone `/subdomains` module. Replaced the
 * profile's old inline subdomain settings section (removed) now that
 * subdomains support N per user and get their own management page — the
 * profile page only teases the feature and hands off navigation.
 *
 * "Instrumento técnico" (2026-08-03): dropped the `AppIcon` next to the
 * title (now a plain `SectionLabel`); the example address migrated from a
 * hardcoded `"monospace"` literal to `typographyScale.code.fontFamily`.
 *
 * Review fix (same day): the CTA originally lived in `SectionLabel`'s
 * `action` slot, but `t("subdomainCard.title")` ("Endereços
 * personalizados", ~24 chars) plus a 2-word button in that `nowrap` row
 * risked the same overflow class the resend-verification button was fixed
 * for on this same page — at ~360-375px viewport width the two could
 * collide since neither the label nor the action can shrink. Fixed by
 * moving the CTA into the card body instead (below the description),
 * mirroring the resend fix, rather than loosening the shared
 * `SectionLabel` (which `/links`, `/bio`, `/subdomains` and `/api-keys`
 * also rely on for their own action slots — safer to keep that primitive
 * untouched than to risk a regression there).
 */
function SubdomainLinkCard() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("subdomainCard.title")}</SectionLabel>
      <ProfileSection>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t("subdomainCard.description")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: typographyScale.code.fontFamily, mb: 2 }}
        >
          {t("subdomainCard.example")}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/subdomains")}
          sx={{ minHeight: 36 }}
        >
          {t("subdomainCard.cta")}
        </Button>
      </ProfileSection>
    </Stack>
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
 *
 * "Instrumento técnico" (2026-08-03), round 2: main + side composition at
 * `lg`+ (stacks to a single column below `lg`) — round 1's single-column
 * stacked flow (the pattern that worked for `/subdomains` and `/api-keys`)
 * was rejected at the visual gate: "o design horizontal não se encaixou
 * bem e parece que a página ficou pobre em informação". Unlike
 * `/subdomains` (one homogeneous list + one action — genuinely thin, a
 * single column is the honest shape) `/profile` is a mix of independent
 * groups — a form, a security card, preferences, account metadata, usage
 * metrics, a danger zone — with a natural primary/secondary split, so
 * flattening it lost the density the original two-column layout earned.
 * LEFT (`7fr`, the primary settings flow): Informações pessoais →
 * Segurança (OAuth ou senha) → Preferências → Zona de perigo (sempre por
 * último, acento vermelho mantido). RIGHT (`5fr`, secondary/informational):
 * Status da conta → Atividade (now the page's density anchor — big
 * Space Grotesk numbers via `OverviewMetricRow`, not prose) → endereço
 * personalizado (teaser, se habilitado). `reveal` steps are numbered by
 * grid *row* rather than linear reading order, so both columns' first
 * cards fade in together, then both seconds, etc. — `reveal-1` (title) →
 * `reveal-2` (Informações pessoais | Status da conta) → `reveal-3`
 * (Segurança | Atividade) → `reveal-4` (Preferências | endereço
 * personalizado) → `reveal-5` (Zona de perigo, sem par na direita).
 * Container widened back from `maxWidth="md"` to the page-default cap
 * (1440px via `ResponsiveContainer`'s own `CONTENT_MAX_WIDTH`) — a 900px
 * column was fine for one settings form, not for two side by side. Zero
 * mudança de comportamento: estados de loading/erro,
 * fluxos de salvar/senha/OAuth/exclusão de conta intocados — só
 * composição e tipografia mudaram.
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

  const showSubdomainTeaser =
    process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true";

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<ProfileSkeleton />}>
      <ResponsiveContainer variant="page">
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Box className="reveal reveal-1">
            <PageSectionHeading
              title={t("title")}
              description={t("subtitle")}
              titleVariant="page"
              action={<LinkActionsBackLink />}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 7fr) minmax(0, 5fr)",
              },
              gap: { xs: 3, sm: 4 },
              alignItems: "start",
            }}
          >
            <Stack spacing={{ xs: 3, sm: 4 }} sx={{ minWidth: 0 }}>
              <Box className="reveal reveal-2">
                <ProfileForm user={user} photoURL={authUser?.photoURL} />
              </Box>
              <Box className="reveal reveal-3">
                {usesOAuthLogin ? (
                  <OAuthSecurityCard />
                ) : (
                  <PasswordChangeForm />
                )}
              </Box>
              <Box className="reveal reveal-4">
                <PreferencesCard />
              </Box>
              <Box className="reveal reveal-5">
                <DangerZone
                  usesOAuthLogin={usesOAuthLogin}
                  userEmail={user.email}
                />
              </Box>
            </Stack>

            <Stack spacing={{ xs: 3, sm: 4 }} sx={{ minWidth: 0 }}>
              <Box className="reveal reveal-2">
                <ProfileAccountStatus
                  user={user}
                  showResendVerification={!auth0Loading && !auth0User}
                />
              </Box>
              <Box className="reveal reveal-3">
                <ProfileActivity />
              </Box>
              {showSubdomainTeaser ? (
                <Box className="reveal reveal-4">
                  <SubdomainLinkCard />
                </Box>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default ProfilePage;
