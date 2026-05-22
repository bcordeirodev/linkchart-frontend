"use client";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, UserPlus } from "lucide-react";
import type { ReactNode } from "react";

import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { useNavigate } from "@/shared/hooks";

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

  const surface = alpha(theme.palette.text.primary, isDark ? 0.03 : 0.04);
  const surfaceBorder = alpha(theme.palette.divider, isDark ? 0.7 : 1);
  const titleColor = alpha(theme.palette.text.primary, isDark ? 0.92 : 0.95);
  const descColor = alpha(theme.palette.text.primary, isDark ? 0.65 : 0.72);
  const featureColor = alpha(theme.palette.text.primary, isDark ? 0.88 : 0.85);
  const innerBorder = alpha(theme.palette.divider, 0.5);
  const chipBg = alpha(theme.palette.text.primary, isDark ? 0.06 : 0.05);
  const chipBorder = alpha(theme.palette.divider, isDark ? 0.55 : 0.65);

  const iconNode = headerIcon ?? <UserPlus {...ICON_MD} aria-hidden />;

  return (
    <Box
      id={id}
      sx={{
        position: "relative",
        background: surface,
        border: `1px solid ${surfaceBorder}`,
        borderRadius: "12px",
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
          <Box
            sx={{
              mt: 0.125,
              width: 36,
              height: 36,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: theme.palette.primary.main,
              background: alpha(
                theme.palette.primary.main,
                isDark ? 0.14 : 0.1,
              ),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
            }}
          >
            {iconNode}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: titleColor,
                mb: 0.5,
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8125rem",
                color: descColor,
                lineHeight: 1.6,
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
                borderRadius: "8px",
                background: chipBg,
                border: `1px solid ${chipBorder}`,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
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
