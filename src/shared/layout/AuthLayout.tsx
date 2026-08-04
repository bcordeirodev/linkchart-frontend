"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { AppLogo, getCardSurfaceSx } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  /** Door heading, rendered as the page's single `<h1>`. */
  title?: string;
  /** Short line under the heading explaining how to continue. */
  subtitle?: string;
  /** Quiet one-line value prop rendered below the door card, once `promoSubtitle` is also set. */
  promoTitle?: string;
  /** Short supporting sentence under `promoTitle`. Both render as one small, muted block — not a second card. */
  promoSubtitle?: string;
  className?: string;
}

/**
 * Centered single-door shell for `/sign-in` — the app's only unauthenticated
 * entry point. Logo, heading, subtitle and the door's CTAs (`children`) sit
 * inside one hairline-bordered card floating on the app's near-black page
 * background; an optional quiet promo line (`promoTitle`/`promoSubtitle`)
 * sits below the card, outside it — there is no side marketing panel.
 *
 * Historically this component drove a 45/55 split with a promotional side
 * panel plus a `variant` prop (`signin`/`signup`/`forgot`/`reset`/`verify`)
 * selecting one of five headline pairs. Every one of those other variants
 * was dead: `/sign-in` is the only route under `app/(auth)/` — the app
 * fully delegates sign-up, password reset and email verification to
 * Auth0's hosted Universal Login (see `SignInPage`'s doc comment) and never
 * built its own screens for them. Removed alongside `showSideSection`/
 * `footerLinks` (same reason: exactly one caller, and it never passed
 * `footerLinks`) in favor of a single centered card — the more deliberate
 * read for a front door that should feel like "quiet confidence", not a
 * two-pane marketing split.
 *
 * A first gate round agreed the side panel had to go but asked to keep its
 * promotional copy ("Seus links, com dados de verdade." / "Your links, with
 * real data.") — the same text `sideTitle`/`sideSubtitle` used to carry,
 * reused verbatim rather than rewritten, now surfaced through `promoTitle`/
 * `promoSubtitle` as a small centered block *below* the card instead of
 * beside it: it must read as quiet supporting copy, not compete with the
 * door for attention.
 */
function AuthLayout({
  children,
  title,
  subtitle,
  promoTitle,
  promoSubtitle,
  className,
}: AuthLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        p: { xs: 2, sm: 3 },
        background: theme.palette.background.default,
      }}
    >
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{
          ...getCardSurfaceSx(theme),
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

      {promoTitle && promoSubtitle ? (
        <Box
          className="reveal reveal-3"
          sx={{ width: "100%", maxWidth: 440, textAlign: "center" }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {promoTitle}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            {promoSubtitle}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

export default AuthLayout;
