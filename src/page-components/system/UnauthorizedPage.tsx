"use client";

import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme/designSystem";
import { Link } from "@/shared/components";
import { useNavigate } from "@/shared/hooks";

import useUser from "@/lib/auth/useUser";

/**
 * Full-viewport 401 (unauthorized) system page, rendered by `app/401/page.tsx`
 * whenever a request is denied — e.g. an expired session hitting a protected
 * route. Deliberately chromeless (no header/footer): unlike the public
 * marketing pages it does not use `PublicLayout`, since it must render
 * consistently regardless of auth state or where the visitor was redirected
 * from.
 *
 * The status code itself is the page's single `<h1>` and its one visual
 * "brand moment" — set in Space Grotesk (via `variant="h1"`, the same theme
 * variant every display heading uses) with tabular figures, the same
 * treatment the rest of the app gives large metric numbers. The CTA adapts
 * to `useUser()`: an authenticated visitor is already logged in and just
 * blocked from this one resource, so they get a single "back home" action;
 * an anonymous visitor gets both a primary sign-in CTA and a secondary way
 * back to the homepage, since either resolves the 401 for them.
 *
 * @returns The centered, chromeless 401 screen.
 */
function UnauthorizedPage() {
  const { t } = useTranslation("public");
  const { data: user } = useUser();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        minHeight: "100dvh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        <Typography
          component="p"
          className="reveal reveal-1"
          sx={{
            fontFamily: typographyScale.code.fontFamily,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {t("unauthorized.title")}
        </Typography>

        <Typography
          variant="h1"
          className="reveal reveal-2"
          sx={{
            mt: 1.5,
            fontSize: { xs: "2.25rem", md: "4.5rem" },
            // 700, not 800: `app/layout.tsx` loads Space Grotesk at
            // 400/500/700 only, so asking for 800 makes the browser
            // synthesise a faux-bold instead of rendering the real cut
            // (same gotcha documented on `getPublicDisplaySx`).
            fontWeight: 700,
            lineHeight: { xs: 1.25, md: 1 },
            letterSpacing: "-0.025em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          401
        </Typography>

        <Typography
          variant="body1"
          className="reveal reveal-3"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {t("unauthorized.description")}
        </Typography>

        <Box
          className="reveal reveal-4"
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {isAuthenticated ? (
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ minWidth: 120 }}
            >
              {t("unauthorized.homeButton")}
            </Button>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="contained" sx={{ minWidth: 120 }}>
                  {t("unauthorized.signInButton")}
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outlined">
                  {t("unauthorized.homeButton")}
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default UnauthorizedPage;
