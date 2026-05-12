"use client";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/shared/layout";
import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import authRoles from "@/lib/auth/authRoles";

/**
 * Sign-in page — delegates authentication to Auth0 Universal Login.
 *
 * "Continue with Google" connects google-oauth2 directly.
 * "Sign In" opens Auth0 Universal Login (supports email/password and any
 * other configured social connection).
 */
function SignInPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthGuardRedirect auth={authRoles.onlyGuest}>
      <AuthLayout
        title={t("signIn.title")}
        subtitle={t("signIn.subtitle")}
        variant="signin"
      >
        <Stack spacing={2}>
          <Button
            component="a"
            href="/auth/login?connection=google-oauth2"
            variant="contained"
            size="large"
            fullWidth
          >
            {t("signIn.googleButton")}
          </Button>

          <Button
            component="a"
            href="/auth/login"
            variant="outlined"
            size="large"
            fullWidth
          >
            {t("signIn.submitButton")}
          </Button>
        </Stack>
      </AuthLayout>
    </AuthGuardRedirect>
  );
}

export default SignInPage;
