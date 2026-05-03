"use client";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { Link } from "@/shared/components";
import { AuthLayout } from "@/shared/layout";

/**
 * The sign out page.
 */
function SignOutPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout variant="signin" showSideSection={false}>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: "-0.025em",
        }}
      >
        {t("signOut.signingOut")}
      </Typography>

      <Typography sx={{ mt: 3, fontWeight: 500, textAlign: "center" }} color="text.secondary">
        <span>{t("signOut.redirecting")}</span>
        <Link
          to="/sign-in"
          sx={{
            color: "primary.main",
            ml: 0.5,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          sign in
        </Link>
      </Typography>
    </AuthLayout>
  );
}

export default SignOutPage;
