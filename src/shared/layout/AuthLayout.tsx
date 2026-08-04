"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { AppLogo } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { getAuthCardSx } from "./utils/cardSurface";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  /** Door heading, rendered as the page's single `<h1>`. */
  title?: string;
  /** Short line under the heading explaining how to continue. */
  subtitle?: string;
  className?: string;
}

/**
 * Centered single-door shell for `/sign-in` — the app's only unauthenticated
 * entry point. Logo, heading, subtitle and the door's CTAs (`children`) sit
 * inside one hairline-bordered card floating on the app's near-black page
 * background; there is no side marketing panel.
 *
 * Historically this component also drove a 45/55 split with a promotional
 * side panel plus a `variant` prop (`signin`/`signup`/`forgot`/`reset`/
 * `verify`) selecting one of five headline pairs. Every one of those other
 * variants was dead: `/sign-in` is the only route under `app/(auth)/` — the
 * app fully delegates sign-up, password reset and email verification to
 * Auth0's hosted Universal Login (see `SignInPage`'s doc comment) and never
 * built its own screens for them. Removed alongside the `showSideSection`/
 * `sideTitle`/`sideSubtitle`/`footerLinks` props (same reason: exactly one
 * caller, and it never passed `footerLinks`). A single centered card is also
 * the more deliberate read for a front door that should feel like "quiet
 * confidence", not a two-pane marketing split.
 */
function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        background: theme.palette.background.default,
      }}
    >
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{
          ...getAuthCardSx(theme),
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box className="reveal reveal-1" sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", mb: 3 }}>
            <AppLogo
              size={40}
              textSx={{
                fontSize: "1.25rem",
                color: theme.palette.text.primary,
              }}
            />
          </Box>

          {title ? (
            <Typography
              variant="h2"
              component="h1"
              sx={{ color: theme.palette.text.primary, mb: 1 }}
            >
              {title}
            </Typography>
          ) : null}

          {subtitle ? (
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        <Box className="reveal reveal-2">{children}</Box>
      </EnhancedPaper>
    </Box>
  );
}

export default AuthLayout;
