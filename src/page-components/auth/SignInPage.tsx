"use client";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/shared/layout";
import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import authRoles from "@/lib/auth/authRoles";
import { radiusTokens } from "@/lib/theme";

/** Google "G" logo in official brand colors. */
function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * Sign-in page — delegates authentication to Auth0 Universal Login.
 *
 * Social buttons pass `connection=<id>` to bypass the Universal Login
 * screen for direct OAuth flows. "Sign in" opens the Universal Login
 * page and supports all configured connections (email/password, etc.).
 *
 * Rendered through `AuthLayout`'s single centered door card — no dashboard
 * chrome (no `PageSectionHeading`/`SectionLabel`) since this is the
 * unauthenticated front door, not an in-app page. `color="primary"` on the
 * "Continuar com e-mail" button is deliberate: the global `MuiButton`
 * default is `color="inherit"` (renders a neutral gray), and this is the
 * page's one strong-blue CTA, same rule the nav's "Novo link" button
 * follows.
 */
function SignInPage() {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const [socialError, setSocialError] = useState<string | null>(null);

  useEffect(() => {
    const errorKey = localStorage.getItem("social_login_error");
    if (errorKey) {
      localStorage.removeItem("social_login_error");
      setSocialError(errorKey);
    }
  }, []);
  const isDark = theme.palette.mode === "dark";

  // Google's own button spec calls for a light, neutral surface even inside
  // a dark app shell (recognizability trumps the app's own palette here) —
  // a translucent white veil in dark mode, solid white in light mode. Radius
  // and height come from the global `MuiButton`/`sizeLarge` overrides, same
  // as every other button in the app; only the brand-specific colors are
  // set here.
  const socialBg = isDark ? "rgba(255,255,255,0.08)" : "#fff";
  const socialBorder = isDark
    ? alpha(theme.palette.divider, 0.5)
    : "rgba(0,0,0,0.12)";
  const socialText = isDark ? theme.palette.text.primary : "rgba(0,0,0,0.87)";
  const socialHoverBg = isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.03)";
  const socialHoverBorder = isDark
    ? alpha(theme.palette.divider, 0.8)
    : "rgba(0,0,0,0.2)";

  const socialSx = {
    backgroundColor: socialBg,
    borderColor: socialBorder,
    color: socialText,
    "&:hover": {
      backgroundColor: socialHoverBg,
      borderColor: socialHoverBorder,
    },
  } as const;

  return (
    <AuthGuardRedirect auth={authRoles.onlyGuest}>
      <AuthLayout title={t("signIn.title")} subtitle={t("signIn.subtitle")}>
        <Stack spacing={2.5}>
          {socialError === "facebook_no_email" && (
            <Alert
              severity="error"
              onClose={() => setSocialError(null)}
              sx={{ borderRadius: `${radiusTokens.md}px` }}
            >
              {t("signIn.errors.facebookNoEmail")}
            </Alert>
          )}

          {/* Google OAuth button */}
          <Button
            component="a"
            href="/auth/login?connection=google-oauth2&returnTo=/sign-in"
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<GoogleLogo size={20} />}
            sx={socialSx}
          >
            {t("signIn.googleButton")}
          </Button>

          {/* Divider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {t("signIn.orDivider")}
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Universal Login (email/password + any other connection) */}
          <Button
            component="a"
            href="/auth/login?returnTo=/sign-in"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            {t("signIn.emailButton")}
          </Button>
        </Stack>
      </AuthLayout>
    </AuthGuardRedirect>
  );
}

export default SignInPage;
