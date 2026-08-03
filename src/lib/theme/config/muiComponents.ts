/**
 * 🎨 CONFIGURAÇÕES MUI OTIMIZADAS - LINK CHART
 * Configurações essenciais do Material-UI organizadas por categoria
 */

import type { Theme } from "@mui/material/styles/createTheme";
import {
  typographyScale,
  radiusTokens,
  motionTokens,
  zIndexTokens,
} from "../designSystem";

// ========================================
// 🎯 CONFIGURAÇÕES ESSENCIAIS
// ========================================

/**
 * Pilha de fontes usada nos headings de destaque (display, h1-h4). Recai em
 * Inter e nas fontes de sistema quando `--font-space-grotesk` não foi
 * injetada (ex.: ambiente de teste sem `next/font`).
 */
const displayFontFamily =
  "var(--font-space-grotesk), Inter, ui-sans-serif, system-ui, sans-serif";

/**
 * Configurações de tipografia otimizadas
 */
export const typography = {
  fontFamily: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"].join(","),
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  fontSize: 14,
  display: {
    ...typographyScale.display,
    fontFamily: displayFontFamily,
    fontWeight: 700,
  },
  h1: { ...typographyScale.h1, fontFamily: displayFontFamily, fontWeight: 700 },
  h2: { ...typographyScale.h2, fontFamily: displayFontFamily, fontWeight: 700 },
  h3: { ...typographyScale.h3, fontFamily: displayFontFamily },
  h4: { ...typographyScale.h4, fontFamily: displayFontFamily },
  h5: typographyScale.h5,
  h6: typographyScale.h6,
  body1: typographyScale.body,
  body2: typographyScale.bodySm,
  caption: typographyScale.caption,
  overline: typographyScale.caption,
  button: {
    fontSize: typographyScale.body.fontSize,
    fontWeight: 500,
    textTransform: "none",
  },
} as const;

/**
 * Breakpoints responsivos padronizados
 */
export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// ========================================
// 🧩 COMPONENTES MUI ESSENCIAIS
// ========================================

/**
 * Configurações de botões otimizadas
 */
const buttonComponents = {
  MuiButton: {
    defaultProps: {
      variant: "text" as const,
      color: "inherit" as const,
    },
    styleOverrides: {
      root: (_: { theme: Theme }) => ({
        textTransform: "none",
        borderRadius: radiusTokens.md,
        fontWeight: 600,
        transition: `all ${motionTokens.duration.slow} ${motionTokens.easing.default}`,
      }),
      sizeMedium: {
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        paddingLeft: 16,
        paddingRight: 16,
      },
      sizeSmall: {
        height: 32,
        minHeight: 32,
        maxHeight: 32,
        paddingLeft: 12,
        paddingRight: 12,
      },
      sizeLarge: {
        height: 40,
        minHeight: 40,
        maxHeight: 40,
        paddingLeft: 20,
        paddingRight: 20,
      },
      contained: {
        boxShadow: "none",
        "&:hover, &:focus": {
          boxShadow: "none",
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: (_: { theme: Theme }) => ({
        borderRadius: radiusTokens.md,
      }),
      sizeMedium: { width: 36, height: 36, maxHeight: 36 },
      sizeSmall: { width: 32, height: 32, maxHeight: 32 },
      sizeLarge: { width: 40, height: 40, maxHeight: 40 },
    },
  },
  MuiButtonGroup: {
    defaultProps: { color: "secondary" as const },
    styleOverrides: {
      root: (_: { theme: Theme }) => ({
        borderRadius: radiusTokens.md,
      }),
    },
  },
};

/**
 * Configurações de inputs otimizadas
 */
const inputComponents = {
  MuiTextField: {
    defaultProps: { color: "secondary" as const },
    styleOverrides: {
      root: {
        "& > .MuiFormHelperText-root": { marginLeft: 11 },
      },
    },
  },
  MuiInputLabel: {
    defaultProps: { color: "secondary" as const },
    styleOverrides: {
      shrink: { transform: "translate(11px, -7px) scale(0.8)" },
      root: {
        transform: "translate(11px, 8px) scale(1)",
        "&.Mui-focused": {},
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: (_: { theme: Theme }) => ({
        minHeight: 36,
        borderRadius: radiusTokens.md,
        lineHeight: 1,
      }),
      legend: { fontSize: "0.75em" },
      input: { padding: "5px 11px" },
      adornedStart: { paddingLeft: "11px!important" },
      // Altura fixa SÓ para input de linha única: um multiline (textarea da
      // bio, por ex.) precisa crescer com o conteúdo — sem a exceção, o
      // container fica em 32px, o textarea de 3 linhas vaza por cima da
      // borda e o placeholder "atravessa" o outline.
      sizeSmall: (_: { theme: Theme }) => ({
        height: 32,
        minHeight: 32,
        borderRadius: radiusTokens.md,
        "&.MuiInputBase-multiline": { height: "auto", lineHeight: 1.5 },
      }),
      sizeMedium: (_: { theme: Theme }) => ({
        height: 36,
        minHeight: 36,
        borderRadius: radiusTokens.md,
        "&.MuiInputBase-multiline": { height: "auto", lineHeight: 1.5 },
      }),
      sizeLarge: (_: { theme: Theme }) => ({
        height: 40,
        minHeight: 40,
        borderRadius: radiusTokens.md,
        "&.MuiInputBase-multiline": { height: "auto", lineHeight: 1.5 },
      }),
    },
  },
  MuiOutlinedInput: {
    defaultProps: { color: "secondary" as const },
    styleOverrides: {
      root: {},
      input: { padding: "5px 11px" },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        paddingLeft: `10px`,
        borderRadius: radiusTokens.md,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.04)",
        transition: `all ${motionTokens.duration.slow} ${motionTokens.easing.default}`,
        "&:hover:not(.Mui-disabled)": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
        },
        "&.Mui-focused": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
        },
        "&:after": {
          borderBottomColor: theme.palette.primary.main,
          borderBottomWidth: "2px",
        },
        "&:before": {
          display: "none",
        },
      }),
      input: (_: { theme: Theme }) => ({
        padding: "16px 20px 12px 20px",
        fontSize: "1rem",
        "&::placeholder": {
          paddingLeft: "4px",
          opacity: 0.7,
        },
      }),
      inputMultiline: {
        padding: "16px 20px 12px 20px",
      },
    },
  },
  MuiSelect: {
    defaultProps: { color: "secondary" as const },
    styleOverrides: { select: { minHeight: 0 } },
  },
};

/**
 * Configurações de superfícies (Paper, Card, Dialog, Box)
 */
const surfaceComponents = {
  MuiPaper: {
    styleOverrides: {
      // Elevação por hairline, não por sombra ou fundo mais claro: borda 1px
      // de baixo contraste (`divider`) é o único sinal de profundidade.
      root: ({ theme }: { theme: Theme }) => ({
        backgroundImage: "none",
        borderRadius: radiusTokens.lg,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      // Mesmo princípio de hairline do MuiPaper acima — Card não deve
      // depender de `elevation`/shadow para parecer "elevado".
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: radiusTokens.lg,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
        transition: `all ${motionTokens.duration.slow} ${motionTokens.easing.default}`,
      }),
    },
  },
  MuiBox: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        // Background padrão para Box quando usado como container de métricas
        "&.metric-container, &.tab-description-container": {
          backgroundColor: theme.palette.background.paper,
          borderRadius: radiusTokens.lg,
        },
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: (_: { theme: Theme }) => ({
        borderRadius: radiusTokens.lg,
      }),
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: (_: { theme: Theme }) => ({
        borderRadius: radiusTokens.md,
      }),
    },
  },
};

/**
 * Configurações de navegação e controles
 */
const navigationComponents = {
  MuiTab: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        textTransform: "none",
        transition: `all ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&.Mui-selected": {
          color: theme.palette.primary.main,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(91, 141, 239, 0.10)"
              : "rgba(44, 90, 160, 0.06)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(91, 141, 239, 0.14)"
                : "rgba(44, 90, 160, 0.08)",
          },
        },
      }),
    },
  },
  MuiAppBar: {
    defaultProps: { enableColorOnDark: true },
    styleOverrides: { root: { backgroundImage: "none" } },
  },
};

/**
 * Configurações de controles de formulário
 */
const formControlComponents = {
  MuiSlider: { defaultProps: { color: "secondary" as const } },
  MuiCheckbox: { defaultProps: { color: "secondary" as const } },
  MuiRadio: { defaultProps: { color: "secondary" as const } },
  MuiSwitch: { defaultProps: { color: "secondary" as const } },
};

/**
 * Configurações de utilitários
 */
const utilityComponents = {
  MuiSvgIcon: {
    styleOverrides: {
      sizeSmall: { width: 16, height: 16 },
      sizeMedium: { width: 20, height: 20 },
      sizeLarge: { width: 24, height: 24 },
    },
  },
  MuiAvatar: {
    styleOverrides: { root: { width: 36, height: 36 } },
  },
  MuiDrawer: {
    styleOverrides: { paper: {} },
  },
  MuiFormHelperText: {
    styleOverrides: { root: {} },
  },
  MuiInputAdornment: {
    styleOverrides: { root: { marginRight: 0 } },
  },
  MuiTypography: {
    styleOverrides: {
      h1: { fontWeight: 700, lineHeight: 1.2 },
      h2: { fontWeight: 700, lineHeight: 1.3 },
      h3: { fontWeight: 600, lineHeight: 1.3 },
      h4: { fontWeight: 600, lineHeight: 1.4 },
      h5: { fontWeight: 600, lineHeight: 1.4 },
      h6: { fontWeight: 600, lineHeight: 1.4 },
    },
    variants: [
      {
        props: { color: "text.secondary" },
        style: { color: "text.secondary" },
      },
    ],
  },
};

/**
 * Configurações de alta prioridade (z-index)
 */
const highPriorityComponents = {
  MuiPickersPopper: {
    styleOverrides: { root: { zIndex: zIndexTokens.popover } },
  },
  MuiAutocomplete: {
    styleOverrides: { popper: { zIndex: zIndexTokens.popover } },
  },
};

// ========================================
// 📦 EXPORT CONSOLIDADO
// ========================================

/**
 * Todas as configurações MUI consolidadas
 */
export const muiComponents = {
  ...buttonComponents,
  ...inputComponents,
  ...surfaceComponents,
  ...navigationComponents,
  ...formControlComponents,
  ...utilityComponents,
  ...highPriorityComponents,
};

/**
 * Configurações completas do tema MUI otimizadas
 */
export const optimizedThemeOptions = {
  typography,
  breakpoints,
  components: muiComponents,
} as const;
