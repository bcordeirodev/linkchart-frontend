/**
 * 📐 SPACING UTILITIES - LINK CHART
 * Utilitários para espaçamento consistente baseado no tema
 *
 * @description
 * Funções para gerar valores de espaçamento padronizados,
 * baseados no sistema de spacing do Material-UI.
 *
 * @since 2.0.0
 */

import type { SxProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";

/**
 * Tipos de espaçamento disponíveis
 */
export type SpacingSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * Direções para espaçamento
 */
export type SpacingDirection =
  | "all"
  | "x"
  | "y"
  | "top"
  | "right"
  | "bottom"
  | "left";

/**
 * Mapeia tamanhos para valores numéricos do tema
 */
const spacingSizeMap: Record<SpacingSize, number> = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 6,
};

/**
 * Obtém valor de spacing baseado no tema
 */
export const getSpacing = (
  theme: Theme,
  size: SpacingSize | number,
): string | number => {
  if (typeof size === "number") {
    return theme.spacing(size);
  }

  return theme.spacing(spacingSizeMap[size]);
};

/**
 * Cria valores de padding
 */
export const createPadding = (
  theme: Theme,
  size: SpacingSize | number,
  direction: SpacingDirection = "all",
): SxProps => {
  const value = getSpacing(theme, size);

  switch (direction) {
    case "x":
      return { px: value };
    case "y":
      return { py: value };
    case "top":
      return { pt: value };
    case "right":
      return { pr: value };
    case "bottom":
      return { pb: value };
    case "left":
      return { pl: value };
    case "all":
    default:
      return { p: value };
  }
};

/**
 * Cria valores de margin
 */
export const createMargin = (
  theme: Theme,
  size: SpacingSize | number,
  direction: SpacingDirection = "all",
): SxProps => {
  const value = getSpacing(theme, size);

  switch (direction) {
    case "x":
      return { mx: value };
    case "y":
      return { my: value };
    case "top":
      return { mt: value };
    case "right":
      return { mr: value };
    case "bottom":
      return { mb: value };
    case "left":
      return { ml: value };
    case "all":
    default:
      return { m: value };
  }
};

/**
 * Cria gap para flexbox/grid
 */
export const createGap = (
  theme: Theme,
  size: SpacingSize | number,
): SxProps => {
  return { gap: getSpacing(theme, size) };
};

/**
 * Utilitários de espaçamento pré-definidos
 */
export const createSpacingUtils = (theme: Theme) => {
  return {
    // Padding utilities
    padding: {
      xs: createPadding(theme, "xs"),
      sm: createPadding(theme, "sm"),
      md: createPadding(theme, "md"),
      lg: createPadding(theme, "lg"),
      xl: createPadding(theme, "xl"),
      xxl: createPadding(theme, "xxl"),
    },

    // Margin utilities
    margin: {
      xs: createMargin(theme, "xs"),
      sm: createMargin(theme, "sm"),
      md: createMargin(theme, "md"),
      lg: createMargin(theme, "lg"),
      xl: createMargin(theme, "xl"),
      xxl: createMargin(theme, "xxl"),
    },

    // Gap utilities
    gap: {
      xs: createGap(theme, "xs"),
      sm: createGap(theme, "sm"),
      md: createGap(theme, "md"),
      lg: createGap(theme, "lg"),
      xl: createGap(theme, "xl"),
      xxl: createGap(theme, "xxl"),
    },

    // Espaçamentos específicos para componentes
    card: createPadding(theme, "lg"),
    cardCompact: createPadding(theme, "md"),
    section: createPadding(theme, "xl"),
    page: createPadding(theme, "xxl"),

    // Espaçamentos responsivos
    responsive: {
      mobile: createPadding(theme, "sm"),
      tablet: createPadding(theme, "md"),
      desktop: createPadding(theme, "lg"),
    },
  };
};

/**
 * Cria espaçamento responsivo
 */
export const createResponsiveSpacing = (
  theme: Theme,
  mobile: SpacingSize | number,
  tablet?: SpacingSize | number,
  desktop?: SpacingSize | number,
): SxProps => {
  const mobileValue = getSpacing(theme, mobile);
  const tabletValue = tablet ? getSpacing(theme, tablet) : mobileValue;
  const desktopValue = desktop ? getSpacing(theme, desktop) : tabletValue;

  return {
    p: mobileValue,
    [theme.breakpoints.up("sm")]: {
      p: tabletValue,
    },
    [theme.breakpoints.up("md")]: {
      p: desktopValue,
    },
  };
};

/**
 * Utilitário para espaçamento entre elementos
 */
export const createStackSpacing = (
  theme: Theme,
  size: SpacingSize | number,
  direction: "horizontal" | "vertical" = "vertical",
): SxProps => {
  const value = getSpacing(theme, size);

  return {
    display: "flex",
    flexDirection: direction === "vertical" ? "column" : "row",
    gap: value,
  };
};

/**
 * Cria espaçamento para grids
 */
export const createGridSpacing = (
  theme: Theme,
  spacing: SpacingSize | number = "md",
): SxProps => {
  return {
    spacing: getSpacing(theme, spacing),
  };
};

/**
 * Utilitários de espaçamento para layout
 */
export const createLayoutSpacing = (_theme: Theme) => {
  return {
    // Container padrão
    container: {
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3 },
    },

    // Seção padrão
    section: {
      py: { xs: 4, sm: 6, md: 8 },
      px: { xs: 2, sm: 3, md: 4 },
    },

    // Header/Footer
    header: {
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 1, sm: 1.5 },
    },

    // Card interno
    cardContent: {
      p: { xs: 2, sm: 3 },
    },

    // Modal/Dialog
    modal: {
      p: { xs: 2, sm: 3, md: 4 },
    },
  };
};
