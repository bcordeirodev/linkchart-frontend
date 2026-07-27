/**
 * 📦 RESPONSIVE CONTAINER - COMPONENTE BASE UNIFICADO
 * Container responsivo que unifica todos os padrões de espaçamento da aplicação
 */

import { Container } from "@mui/material";

import { responsiveSpacing } from "@/lib/theme";

import type { ContainerProps } from "@mui/material";
import type { ReactNode } from "react";

/**
 * Largura máxima do conteúdo das páginas (em px).
 *
 * O breakpoint `xl` do tema é 1920px, então `maxWidth="xl"` deixava o conteúdo
 * encostar nas bordas em monitores 1080p. Capamos o default em 1440px para
 * criar gutters laterais e manter o comprimento de linha legível — padrão de
 * mercado em dashboards (Stripe, Linear, Vercel). Páginas que passam um
 * `maxWidth` explícito (ex.: formulários com `maxWidth="md"`) não são afetadas.
 */
export const CONTENT_MAX_WIDTH = 1440;

interface ResponsiveContainerProps extends Omit<ContainerProps, "children"> {
  children: ReactNode;
  /** Tipo de espaçamento baseado no contexto */
  variant?: "page" | "section" | "card" | "form";
  /** Espaçamento customizado se necessário */
  spacing?: "xs" | "sm" | "md" | "lg";
  /** Aplicar padding interno */
  withPadding?: boolean;
  /** Aplicar margin bottom */
  withMarginBottom?: boolean;
}

/**
 * MUI `<Container>` wrapper that applies `responsiveSpacing[variant]` (page/section/card/form) and a `maxWidth="xl"` default.
 *
 * The `sx` prop has full priority — if it contains any padding key (`p`, `px`, etc.) or any margin key (when `withMarginBottom`), the default spacing is suppressed for that axis. `spacing` overrides the variant preset with a literal xs/sm/md ramp.
 */
export function ResponsiveContainer({
  children,
  variant = "page",
  spacing,
  withPadding = true,
  withMarginBottom = false,
  maxWidth = "xl",
  sx,
  ...props
}: ResponsiveContainerProps) {
  // Usar espaçamento do design system baseado na variante
  const containerSpacing = responsiveSpacing[variant];

  // Espaçamento customizado se fornecido
  const customSpacing = spacing
    ? {
        xs:
          spacing === "xs"
            ? 1
            : spacing === "sm"
              ? 1.5
              : spacing === "md"
                ? 2
                : 3,
        sm:
          spacing === "xs"
            ? 1.5
            : spacing === "sm"
              ? 2
              : spacing === "md"
                ? 2.5
                : 3.5,
        md:
          spacing === "xs"
            ? 2
            : spacing === "sm"
              ? 2.5
              : spacing === "md"
                ? 3
                : 4,
      }
    : null;

  // Verificar se sx contém propriedades de padding (verificação segura)
  const hasPaddingInSx =
    sx &&
    typeof sx === "object" &&
    !Array.isArray(sx) &&
    ("p" in sx ||
      "padding" in sx ||
      "px" in sx ||
      "paddingX" in sx ||
      "py" in sx ||
      "paddingY" in sx ||
      "pt" in sx ||
      "paddingTop" in sx ||
      "pr" in sx ||
      "paddingRight" in sx ||
      "pb" in sx ||
      "paddingBottom" in sx ||
      "pl" in sx ||
      "paddingLeft" in sx);

  // Verificar se sx contém propriedades de margin bottom (verificação segura)
  const hasMarginBottomInSx =
    sx &&
    typeof sx === "object" &&
    !Array.isArray(sx) &&
    ("mb" in sx ||
      "marginBottom" in sx ||
      "m" in sx ||
      "margin" in sx ||
      "my" in sx ||
      "marginY" in sx);

  // Construir estilos base
  const baseStyles = {
    p: 0, // Reset padrão
    // Aplicar padding se solicitado e não sobrescrito por sx
    ...(withPadding &&
      !hasPaddingInSx &&
      (customSpacing ? { p: customSpacing } : containerSpacing)),
    // Aplicar margin bottom se solicitado e não sobrescrito por sx
    ...(withMarginBottom &&
      !hasMarginBottomInSx && { mb: customSpacing || containerSpacing.p }),
  };

  // Quando o caller não especifica largura (default "xl" = 1920px no tema),
  // capamos o conteúdo em CONTENT_MAX_WIDTH para criar gutters laterais.
  // Qualquer maxWidth explícito (md, lg, false…) passa intacto.
  const useContentCap = maxWidth === "xl";

  return (
    <Container
      maxWidth={useContentCap ? false : maxWidth}
      sx={{
        ...baseStyles,
        ...(useContentCap && { maxWidth: CONTENT_MAX_WIDTH, mx: "auto" }),
        // Estilos customizados têm prioridade total
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}

export default ResponsiveContainer;
