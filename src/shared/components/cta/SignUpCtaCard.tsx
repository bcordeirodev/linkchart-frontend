"use client";
import {
  Box,
  Button,
  Link as MuiLink,
  Typography,
  useTheme,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { Check } from "lucide-react";
import NextLink from "next/link";
import type { ReactNode } from "react";

import { isAuth0HandlerRoute } from "@/lib/auth/authNavigation";
import { radiusTokens } from "@/lib/theme";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockIconShellSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { useNavigate } from "@/shared/hooks";
import { getCardSurfaceSx } from "@/shared/ui/base";

interface SignUpCtaCardProps {
  /** Bloco principal (ex: "Crie sua conta gratuita") */
  title: string;
  /** Linha descritiva curta abaixo do título */
  description: string;
  /** Lista de features traduzidas que aparecem como chips abaixo */
  features: string[];
  /** Texto do botão principal */
  ctaLabel: string;
  /** Rota de destino do botão. Default: `/auth/login?screen_hint=signup` (Auth0 Universal Login, tela de cadastro). */
  ctaHref?: string;
  /** Handler customizado; quando definido, ignora `ctaHref` */
  onCtaClick?: () => void;
  /** Identificador para anchor links (ex: `?utm_source=...#signup`) */
  id?: string;
  /**
   * Ícone opcional ao lado do título, dentro do shell padrão.
   *
   * Sem default desde 2026-08-04: as CTAs públicas de `/` e `/shorter` (e a
   * de `/public-analytics`) abrem com o título sozinho — o ícone-chip ao lado
   * de título é o padrão banido pela linguagem "instrumento técnico". As
   * páginas de ferramentas (`/tools/*`) ainda passam um ícone próprio e
   * continuam renderizando exatamente como antes; quando forem realinhadas,
   * esta prop sai junto.
   */
  headerIcon?: ReactNode;
  /**
   * Optional sx overrides merged onto the outer container Box.
   * Allows call sites to swap the surface style (e.g. focal glow) without
   * forking the component.
   */
  sx?: SxProps<Theme>;
  /**
   * Optional quiet second door for people the primary CTA doesn't address —
   * on `/public-analytics`, someone who already has an account and arrived
   * from the weekly digest, for whom "create a free account" is the wrong
   * destination. Rendered as a text link under the button, never as a second
   * button: the card keeps exactly one primary action.
   *
   * Opt-in, so `/shorter` and `/tools/*` render byte-identically to before.
   * Both fields are required together — one without the other is ignored.
   */
  secondaryLabel?: string;
  /** Destination for {@link secondaryLabel}. */
  secondaryHref?: string;
}

/**
 * Card unificado de chamada para "Criar conta grátis".
 *
 * Usado em /shorter (após o formulário) e em /public-analytics (final da
 * página). Visual canônico das CTAs públicas, realinhado à linguagem
 * "instrumento técnico" em 2026-08-04:
 *
 * - **Sem ícone-chip ao lado do título** — o padrão banido em toda a app. O
 *   título agora abre o card sozinho, num variant de display de verdade
 *   (`variant="h3"`; só `component` deixaria o heading na tipografia de corpo).
 * - **Superfície translúcida + hairline** sobre o fundo quase-preto, no lugar
 *   do inset com hairline em gradiente no topo (`::before`) e do brilho radial
 *   secundário no canto (`::after`).
 * - **CTA sólido `contained`** em vez do gradiente `primary → primary.dark`
 *   com glow e `translateY` no hover.
 * - **Lista de checks em duas colunas** no lugar da nuvem de 8 pílulas
 *   contornadas: o check é o marcador da lista, não a moldura de cada item.
 *   As oito strings continuam byte-idênticas — só a roupa mudou.
 */
export function SignUpCtaCard({
  title,
  description,
  features,
  ctaLabel,
  ctaHref = "/auth/login?screen_hint=signup",
  onCtaClick,
  id,
  headerIcon,
  sx,
  secondaryLabel,
  secondaryHref,
}: SignUpCtaCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    // Rotas do SDK Auth0 são route handlers (302) — navegação de documento
    // completo evita o par de GETs que o router.push gera nelas.
    if (isAuth0HandlerRoute(ctaHref)) {
      window.location.assign(ctaHref);
      return;
    }
    navigate(ctaHref);
  };

  const featureColor = isDark
    ? alpha(theme.palette.common.white, 0.86)
    : alpha(theme.palette.text.primary, 0.82);
  const descriptionColor = isDark
    ? alpha(theme.palette.common.white, 0.74)
    : alpha(theme.palette.text.primary, 0.68);
  const innerBorder = publicHairline(theme, "inset");

  return (
    <Box
      id={id}
      sx={[
        {
          position: "relative",
          borderRadius: `${radiusTokens.lg}px`,
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.3 : 0.28)}`,
          ...getCardSurfaceSx(theme),
          p: { xs: "20px", md: "22px 26px" },
          overflow: "hidden",
          boxShadow: "none",
        },
        ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
      ]}
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
          {/* Only rendered when a caller explicitly asks for it — see the
              `headerIcon` prop docs. */}
          {headerIcon ? (
            <Box
              sx={{
                ...getPublicBlockIconShellSx(theme),
                color: alpha(theme.palette.common.white, isDark ? 0.96 : 0.94),
              }}
            >
              {headerIcon}
            </Box>
          ) : null}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: "1.0625rem", sm: "1.125rem" },
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 0.75,
            flexShrink: 0,
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{
              fontWeight: 600,
              fontSize: "0.8125rem",
              px: 3,
              py: 1.25,
              borderRadius: `${radiusTokens.md}px`,
              whiteSpace: "nowrap",
            }}
          >
            {ctaLabel}
          </Button>
          {secondaryLabel && secondaryHref ? (
            <MuiLink
              component={NextLink}
              href={secondaryHref}
              sx={{
                fontSize: "0.75rem",
                color: descriptionColor,
                textAlign: "center",
                textDecorationColor: alpha(theme.palette.text.primary, 0.3),
              }}
            >
              {secondaryLabel}
            </MuiLink>
          ) : null}
        </Box>
      </Box>

      {features.length > 0 ? (
        // Two columns of checked lines, not a cloud of bordered pills: the
        // check glyph is the list marker, so eight short facts read as one
        // scannable inventory instead of eight competing objects. One column
        // on phones, where two would leave every item on two lines anyway.
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            columnGap: { sm: 3 },
            rowGap: 0.875,
            borderTop: `1px solid ${innerBorder}`,
            pt: 1.75,
          }}
        >
          {features.map((feature) => (
            <Box
              component="li"
              key={feature}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.875,
                minWidth: 0,
              }}
            >
              <Check
                {...ICON_SM}
                strokeWidth={2.5}
                aria-hidden
                style={{
                  color: theme.palette.primary.main,
                  flexShrink: 0,
                  // Optically centres the glyph on the first text line.
                  marginTop: 2,
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: featureColor,
                  lineHeight: 1.45,
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
