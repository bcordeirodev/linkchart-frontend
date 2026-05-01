/**
 * 📦 RESPONSIVE CONTAINER - COMPONENTE BASE UNIFICADO
 * Container responsivo que unifica todos os padrões de espaçamento da aplicação
 */

import { Container, Box } from "@mui/material";

import { responsiveSpacing } from "@/lib/theme";

import type { ContainerProps } from "@mui/material";
import type { ReactNode } from "react";

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
 * Container responsivo unificado que aplica espaçamentos consistentes
 * baseados no design system otimizado para mobile-first
 *
 * @features
 * - Estilos sx têm prioridade total sobre estilos padrão
 * - Detecta automaticamente se sx contém propriedades de spacing
 * - Suporta sx={{ p: 0 }} para remover padding completamente
 * - Compatível com todas as propriedades de spacing do MUI
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

  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        ...baseStyles,
        // Estilos customizados têm prioridade total
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}

/**
 * Versão simplificada para uso interno de páginas
 */
export function PageContainer({
  children,
  ...props
}: Omit<ResponsiveContainerProps, "variant">) {
  return (
    <ResponsiveContainer variant="page" {...props}>
      {children}
    </ResponsiveContainer>
  );
}

/**
 * Container para seções dentro de páginas
 */
export function SectionContainer({
  children,
  ...props
}: Omit<ResponsiveContainerProps, "variant">) {
  return (
    <ResponsiveContainer variant="section" withMarginBottom {...props}>
      <Box sx={{ width: "100%" }}>{children}</Box>
    </ResponsiveContainer>
  );
}

/**
 * Container para formulários
 */
export function FormContainer({
  children,
  ...props
}: Omit<ResponsiveContainerProps, "variant">) {
  return (
    <ResponsiveContainer variant="form" maxWidth="md" {...props}>
      {children}
    </ResponsiveContainer>
  );
}

export default ResponsiveContainer;
