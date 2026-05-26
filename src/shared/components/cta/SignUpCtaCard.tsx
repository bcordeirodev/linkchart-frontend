"use client";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, UserPlus } from "lucide-react";
import type { ReactNode } from "react";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockIconShellSx,
  getPublicBlockTitleSx,
  getPublicFormShellSx,
  getPublicInsetSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { useNavigate } from "@/shared/hooks";
import { PublicBlockIcon } from "@/shared/ui/base";

interface SignUpCtaCardProps {
  /** Bloco principal (ex: "Crie sua conta gratuita") */
  title: string;
  /** Linha descritiva curta abaixo do título */
  description: string;
  /** Lista de features traduzidas que aparecem como chips abaixo */
  features: string[];
  /** Texto do botão principal */
  ctaLabel: string;
  /** Rota de destino do botão. Default: `/sign-up` */
  ctaHref?: string;
  /** Handler customizado; quando definido, ignora `ctaHref` */
  onCtaClick?: () => void;
  /** Identificador para anchor links (ex: `?utm_source=...#signup`) */
  id?: string;
  /** Ícone ao lado do título. Default: UserPlus */
  headerIcon?: ReactNode;
}

/**
 * Card unificado de chamada para "Criar conta grátis".
 *
 * Usado em /shorter (após o formulário) e em /public-analytics (final da página).
 * Visual canônico das CTAs públicas: surface theme-aware com accent gradient
 * sutil no topo, CTA com gradient `primary → secondary` e features como chips
 * com check em primary.
 *
 * Não substitui o `BenefitBadges` em estado de sucesso (fileira de chips após
 * encurtar) — aquele é um componente diferente, mais estreito.
 */
export function SignUpCtaCard({
  title,
  description,
  features,
  ctaLabel,
  ctaHref = "/auth/login",
  onCtaClick,
  id,
  headerIcon,
}: SignUpCtaCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    navigate(ctaHref);
  };

  const featureColor = isDark
    ? alpha(theme.palette.common.white, 0.9)
    : alpha(theme.palette.text.primary, 0.85);
  const titleColor = isDark
    ? alpha(theme.palette.common.white, 0.95)
    : alpha(theme.palette.text.primary, 0.95);
  const descriptionColor = isDark
    ? alpha(theme.palette.common.white, 0.74)
    : alpha(theme.palette.text.primary, 0.68);
  const iconColor = isDark
    ? alpha(theme.palette.common.white, 0.95)
    : theme.palette.primary.main;
  const innerBorder = publicHairline(theme, "inset");
  const chipInset = getPublicInsetSx(theme);
  const iconShellOverride = isDark
    ? {
        color: iconColor,
        bgcolor: alpha(theme.palette.common.white, 0.08),
        borderColor: alpha(theme.palette.common.white, 0.24),
      }
    : undefined;

  const iconNode = headerIcon ? (
    <Box
      sx={{
        ...getPublicBlockIconShellSx(theme),
        ...(iconShellOverride ?? {}),
      }}
    >
      {headerIcon}
    </Box>
  ) : (
    <PublicBlockIcon icon={UserPlus} sx={iconShellOverride} />
  );

  return (
    <Box
      id={id}
      sx={{
        position: "relative",
        ...getPublicFormShellSx(theme),
        p: { xs: "20px", md: "22px 26px" },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.6)} 50%, transparent 100%)`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 3 },
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
            flex: 1,
            minWidth: 0,
          }}
        >
          {iconNode}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                ...getPublicBlockTitleSx(theme),
                color: titleColor,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                ...getPublicBlockDescriptionSx(theme),
                color: descriptionColor,
                maxWidth: 520,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: alpha(theme.palette.common.white, isDark ? 0.88 : 0.94),
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 3,
            py: 1.25,
            borderRadius: "10px",
            boxShadow: `0 2px 14px ${alpha(theme.palette.primary.main, 0.28)}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
            alignSelf: { xs: "stretch", sm: "center" },
            transition:
              "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease, color 180ms ease",
            "&:hover": {
              color: alpha(theme.palette.common.white, isDark ? 0.94 : 0.98),
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.42)}`,
              opacity: 0.92,
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
          }}
        >
          {ctaLabel}
        </Button>
      </Box>

      {features.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 0.75, sm: 1 },
            borderTop: `1px solid ${innerBorder}`,
            pt: 1.75,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.625,
                px: 1.25,
                py: 0.625,
                ...chipInset,
                boxShadow: "none",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: iconColor,
                  flexShrink: 0,
                }}
              >
                <Check {...ICON_SM} strokeWidth={2.5} aria-hidden />
              </Box>
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  color: featureColor,
                  lineHeight: 1.3,
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default SignUpCtaCard;
