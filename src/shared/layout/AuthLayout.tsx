"use client";
import { Box, Typography, alpha, Paper } from "@mui/material";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";

import { AppIcon } from "@/shared/ui/icons";
import { useResponsive } from "@/lib/theme";
import { Link } from "@/shared/components";
import { ResponsiveContainer } from "@/shared/ui/base";
import {
  elevationTokens,
  elevationLightTokens,
} from "@/lib/theme/designSystem";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  variant?: "signin" | "signup" | "forgot" | "reset" | "verify";
  showSideSection?: boolean;
  footerLinks?: {
    text: string;
    linkText: string;
    href: string;
  }[];
  className?: string;
}

function AuthLayout({
  children,
  title,
  subtitle,
  variant = "signin",
  showSideSection = true,
  footerLinks = [],
  className,
}: AuthLayoutProps) {
  const { isMobile } = useResponsive();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const variantConfig = useMemo(() => {
    const configs = {
      signin: {
        sideTitle: "Bem-vindo de volta!",
        sideSubtitle:
          "Acesse sua conta e continue gerenciando seus links de forma inteligente.",
      },
      signup: {
        sideTitle: "Junte-se a nós!",
        sideSubtitle:
          "Crie sua conta e comece a encurtar e gerenciar seus links hoje mesmo.",
      },
      forgot: {
        sideTitle: "Recuperar Senha",
        sideSubtitle:
          "Não se preocupe, vamos ajudá-lo a recuperar o acesso à sua conta.",
      },
      reset: {
        sideTitle: "Nova Senha",
        sideSubtitle: "Defina uma nova senha segura para sua conta.",
      },
      verify: {
        sideTitle: "Verificação de Email",
        sideSubtitle: "Estamos verificando seu email para ativar sua conta.",
      },
    };
    return configs[variant];
  }, [variant]);

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        background: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      {/* Seção do Formulário */}
      <ResponsiveContainer
        variant="form"
        maxWidth="sm"
        sx={{
          flex: { xs: 1, md: showSideSection ? "0 0 45%" : 1 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse at top left, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: { xs: 3, sm: 4, md: 5 },
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            position: "relative",
            overflow: "hidden",
            boxShadow: elevation.lg,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.5)} 50%, transparent 100%)`,
            },
          }}
        >
          {/* Logo e Brand */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: theme.palette.primary.main,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <AppIcon intent="link" size={24} />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Link Charts
              </Typography>
            </Box>

            {title ? (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  lineHeight: 1.3,
                }}
              >
                {title}
              </Typography>
            ) : null}

            {subtitle ? (
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "1rem",
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {/* Formulário */}
          <Box>
            {children}

            {footerLinks.length > 0 && (
              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  textAlign: "center",
                }}
              >
                {footerLinks.map((link) => (
                  <Typography
                    key={link.href}
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {link.text}{" "}
                    <Link
                      to={link.href}
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: theme.palette.primary.dark,
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {link.linkText}
                    </Link>
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </ResponsiveContainer>

      {/* Seção Lateral (apenas desktop) */}
      {showSideSection && !isMobile ? (
        <Box
          sx={{
            flex: { xs: 0, md: "0 0 55%" },
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            p: 6,
            position: "relative",
            background: theme.palette.background.paper,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at center, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ textAlign: "center", zIndex: 10, maxWidth: 600 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4rem", lg: "4.5rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                mb: 3,
                color: theme.palette.text.primary,
              }}
            >
              {variantConfig.sideTitle}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                mb: 6,
                fontWeight: 400,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              {variantConfig.sideSubtitle}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

export default AuthLayout;
