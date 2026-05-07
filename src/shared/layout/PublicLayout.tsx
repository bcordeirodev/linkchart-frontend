"use client";
/**
 * Layout para páginas públicas (não autenticadas)
 */
import { Box, useTheme, Container, Button, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

import { useMainTheme } from "@/lib/theme";
import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { useAuth } from "@/lib/auth/AuthContext";
import { LanguageSelector } from "@/i18n/components/LanguageSelector";
import { AppLogo } from "@/shared/ui/base";
import { Footer } from "./components";

import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: "landing" | "shorter" | "simple";
  className?: string;
}

function ShorterHeaderActions() {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { isAuthenticated, isLoading } = useAuth();

  // Avoid flicker while auth state is being resolved
  if (isLoading) {
    return <LanguageSelector />;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <LanguageSelector />
      {isAuthenticated ? (
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate("/links")}
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {t("nav.myLinks")}
        </Button>
      ) : (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/sign-in")}
            sx={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            {t("nav.signIn")}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/sign-up")}
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {t("nav.signUp")}
          </Button>
        </>
      )}
    </Box>
  );
}

function PublicLayout({
  children,
  showHeader = false,
  showFooter = false,
  variant = "simple",
  className,
}: PublicLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const isDark = theme.palette.mode === "dark";
  useMainTheme();

  const layoutConfig = useMemo(() => {
    const configs = {
      landing: {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
        showPattern: true,
        containerMaxWidth: "xl" as const,
      },
      shorter: {
        background: theme.palette.background.default,
        showPattern: false,
        containerMaxWidth: "lg" as const,
      },
      simple: {
        background: theme.palette.background.default,
        showPattern: false,
        containerMaxWidth: "md" as const,
      },
    };
    return configs[variant];
  }, [variant, theme]);

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        padding: 0,
        background: layoutConfig.background,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: theme.transitions.create(["background-color", "color"], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      {layoutConfig.showPattern ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.light} 0%, transparent 50%),
						                 radial-gradient(circle at 75% 75%, ${theme.palette.secondary.light} 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {showHeader ? (
        <Box
          component="header"
          sx={{
            position: "relative",
            zIndex: 10,
            py: 2,
            backgroundColor: isDark
              ? darkNeutral.surface
              : lightNeutral.surface,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth={layoutConfig.containerMaxWidth}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AppLogo size={36} showText={false} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: "1.125rem",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.2,
                    }}
                  >
                    Link Charts
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("appTagline")}
                  </Typography>
                </Box>
              </Box>
              {variant === "shorter" && <ShorterHeaderActions />}
            </Box>
          </Container>
        </Box>
      ) : null}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: showHeader || showFooter ? "calc(100vh - 120px)" : "100vh",
        }}
      >
        {children}
      </Box>

      {showFooter ? <Footer /> : null}
    </Box>
  );
}

export default PublicLayout;
