"use client";
/**
 * Layout para páginas públicas (não autenticadas)
 */
import {
  Box,
  useTheme,
  Container,
  Button,
  Link,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
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

type PublicChrome = "full" | "minimal";

interface PublicLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: "landing" | "shorter" | "simple";
  /**
   * Estilo de header/footer.
   * - "full": header sólido com logo+tagline e footer completo (default).
   * - "minimal": utility bar flutuante (logo + idioma + auth) e footer enxuto de 1 linha.
   *   Indicado para páginas focadas em uma única ação (shorter, public-analytics).
   */
  chrome?: PublicChrome;
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
            onClick={() => navigate("/auth/login")}
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

function MinimalUtilityBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation("common");
  const { isAuthenticated, isLoading } = useAuth();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="header"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        pointerEvents: "none",
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 1.75, md: 2.25 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        component="a"
        href="/"
        aria-label="Link Charts"
        sx={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          textDecoration: "none",
          color: theme.palette.text.primary,
          opacity: 0.85,
          transition: "opacity 160ms ease",
          "&:hover": { opacity: 1 },
        }}
      >
        <AppLogo size={26} showText={false} />
        <Typography
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: theme.palette.text.primary,
          }}
        >
          Link Charts
        </Typography>
      </Box>

      <Box
        sx={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.75, sm: 1 },
        }}
      >
        <LanguageSelector compact />

        {!isLoading && isAuthenticated ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/links")}
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              boxShadow: "none",
              "&:hover": { boxShadow: "none", opacity: 0.9 },
            }}
          >
            {t("nav.myLinks")}
          </Button>
        ) : null}

        {!isLoading && !isAuthenticated ? (
          <>
            <Link
              component="button"
              onClick={() => navigate("/sign-in")}
              underline="none"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.78),
                px: 1,
                py: 0.5,
                borderRadius: "6px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "color 160ms ease",
                "&:hover": { color: theme.palette.text.primary },
              }}
            >
              {t("nav.signIn")}
            </Link>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/auth/login")}
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                px: 1.75,
                py: 0.5,
                boxShadow: "none",
                "&:hover": { boxShadow: "none", opacity: 0.9 },
              }}
            >
              {t("nav.signUp")}
            </Button>
          </>
        ) : null}
      </Box>
    </Box>
  );
}

function PublicLayout({
  children,
  showHeader = false,
  showFooter = false,
  variant = "simple",
  chrome = "full",
  className,
}: PublicLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const isDark = theme.palette.mode === "dark";
  useMainTheme();
  const isMinimal = chrome === "minimal";
  const renderHeader = isMinimal ? false : showHeader;
  const renderFooter = isMinimal ? false : showFooter;

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

      {isMinimal ? <MinimalUtilityBar /> : null}

      {renderHeader ? (
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
          minHeight:
            renderHeader || renderFooter ? "calc(100vh - 120px)" : "100vh",
        }}
      >
        {children}
      </Box>

      {renderFooter || isMinimal ? <Footer /> : null}
    </Box>
  );
}

export default PublicLayout;
