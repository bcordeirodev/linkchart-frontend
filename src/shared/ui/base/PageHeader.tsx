"use client";
/**
 * 📋 PAGE HEADER - COMPONENTE UNIFICADO
 * Header padronizado para todas as páginas da aplicação
 */

import { Box, Typography, Breadcrumbs, Link, useTheme } from "@mui/material";

import { createPresetAnimations, responsiveSpacing } from "@/lib/theme";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  /** Subtítulo ou descrição */
  subtitle?: string;
  /** Ícone do header */
  icon?: ReactNode;
  /** Breadcrumbs de navegação */
  breadcrumbs?: BreadcrumbItem[];
  /** Ações do header (botões, etc.) */
  actions?: ReactNode;
  /** Variante visual */
  variant?: "default" | "analytics" | "dashboard" | "profile";
  /** Mostrar elemento decorativo de fundo */
  showDecorative?: boolean;
  /** Compacto para mobile */
  compact?: boolean;
}

/**
 * Header unificado que consolida todos os padrões de header da aplicação
 */
export function PageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  actions,
  variant = "default",
  showDecorative = true,
  compact = false,
}: PageHeaderProps) {
  const theme = useTheme();
  const animations = createPresetAnimations(theme);

  // Configuração por variante (cor única, sem gradient)
  const variantConfig = {
    default: { accent: theme.palette.primary.main },
    analytics: { accent: theme.palette.warning.main },
    dashboard: { accent: theme.palette.primary.main },
    profile: { accent: theme.palette.secondary.main },
  };

  const config = variantConfig[variant];
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${theme.palette.divider}`,
        ...responsiveSpacing.section,
        minHeight: compact
          ? { xs: 80, sm: 100, md: 120 }
          : { xs: 120, sm: 140, md: 160 },
        mb: { xs: 2, sm: 3, md: 4 },
        ...animations.fadeIn,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Acento sutil no topo (substitui a bolha decorativa) */}
      {showDecorative ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: config.accent,
          }}
        />
      ) : null}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumbs
          sx={{
            mb: 2,
            "& .MuiBreadcrumbs-separator": {
              color: "text.secondary",
            },
          }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              href={crumb.href}
              color={crumb.current ? "primary" : "text.secondary"}
              sx={{
                textDecoration: crumb.current ? "none" : "underline",
                fontWeight: crumb.current ? 600 : 400,
                fontSize: "0.875rem",
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      ) : null}

      {/* Conteúdo principal */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        {/* Lado esquerdo - Título e ícone */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Ícone */}
          {icon ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                borderRadius: `${radiusTokens.md}px`,
                backgroundColor: config.accent,
                color: theme.palette.primary.contrastText,
                boxShadow: isDark
                  ? elevationTokens.xs
                  : elevationLightTokens.xs,
                flexShrink: 0,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              {icon}
            </Box>
          ) : null}

          {/* Textos */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant={compact ? "h5" : "h4"}
              component="h1"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                mb: subtitle ? 0.5 : 0,
                fontSize: {
                  xs: compact ? "1.25rem" : "1.5rem",
                  sm: compact ? "1.5rem" : "1.75rem",
                  md: compact ? "1.75rem" : "2rem",
                },
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>

            {subtitle ? (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.4,
                  // Limitar linhas em mobile
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 2, sm: 3 },
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Box>

        {/* Lado direito - Ações */}
        {actions ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: "center" },
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            {actions}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default PageHeader;
