"use client";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

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
  ctaHref = "/sign-up",
  onCtaClick,
  id,
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
  const descColor = alpha(theme.palette.text.primary, isDark ? 0.6 : 0.68);
  const featureColor = alpha(theme.palette.text.primary, isDark ? 0.6 : 0.68);
  const innerBorder = alpha(theme.palette.divider, 0.5);

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
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: titleColor,
              mb: 0.5,
              letterSpacing: "-0.01em",
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
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 3,
            py: 1.25,
            borderRadius: "10px",
            boxShadow: `0 2px 14px ${alpha(theme.palette.primary.main, 0.28)}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition:
              "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease",
            "&:hover": {
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
            gap: { xs: 1, sm: 1.5 },
            borderTop: `1px solid ${innerBorder}`,
            pt: 1.75,
          }}
        >
          {features.map((feature) => (
            <Typography
              key={feature}
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: featureColor,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&::before": {
                  content: '"✓"',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                },
              }}
            >
              {feature}
            </Typography>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default SignUpCtaCard;
