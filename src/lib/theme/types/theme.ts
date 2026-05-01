/**
 * 📝 TIPOS DE TEMA CENTRALIZADOS - LINK CHART
 * Todos os tipos relacionados ao tema em um local
 */

import type { Palette } from "@mui/material/styles/createPalette";
import type { PartialDeep } from "type-fest";

// ========================================
// 🎨 TIPOS BÁSICOS DE TEMA
// ========================================

/**
 * Tipo para tema Fuse
 */
export interface FuseThemeType {
  palette: PartialDeep<Palette>;
}

/**
 * Tipo para coleção de temas Fuse
 */
export type FuseThemesType = Record<string, FuseThemeType>;

// ========================================
// 🎛️ TIPOS DE CONFIGURAÇÃO DE LAYOUT
// ========================================

/**
 * Propriedades padrão do layout do tema
 */
export interface ThemeLayoutDefaultsProps {
  mode: "container" | "boxed";
  containerWidth: number;
  navbar: {
    display: boolean;
    style: string;
    folded: boolean;
    position: string;
  };
  toolbar: {
    display: boolean;
    style: string;
  };
  footer: {
    display: boolean;
    style: string;
  };
  leftSidePanel: {
    display: boolean;
  };
  rightSidePanel: {
    display: boolean;
  };
}

/**
 * Configuração completa de configurações Fuse
 */
export interface FuseSettingsConfigType {
  layout: {
    style?: string;
    config?: PartialDeep<ThemeLayoutDefaultsProps>;
  };
  customScrollbars?: boolean;
  direction: "rtl" | "ltr";
  theme: {
    main: FuseThemeType;
    navbar: FuseThemeType;
    toolbar: FuseThemeType;
    footer: FuseThemeType;
  };
  defaultAuth?: string[];
  loginRedirectUrl: string;
}

// ========================================
// 📋 TIPOS DE FORMULÁRIO
// ========================================

/**
 * Tipo para opção de radio
 */
export interface RadioOptionType {
  name: string;
  value: string;
}

/**
 * Tipo base para campos de formulário
 */
export interface FormFieldBaseType {
  title: string;
}

/**
 * Tipo para campo de radio
 */
export type RadioFieldType = FormFieldBaseType & {
  type: "radio";
  options: RadioOptionType[];
};

/**
 * Tipo para campo numérico
 */
export type NumberFieldType = FormFieldBaseType & {
  type: "number";
  min?: number;
  max?: number;
};

/**
 * Tipo para campo switch
 */
export type SwitchFieldType = FormFieldBaseType & {
  type: "switch";
};

/**
 * Tipo para grupo de campos
 */
export type GroupFieldType = FormFieldBaseType & {
  type: "group";
  children: GroupFieldChildrenType;
};

/**
 * Tipo para filhos de grupo de campos
 */
export type GroupFieldChildrenType = Record<
  string,
  RadioFieldType | SwitchFieldType | NumberFieldType | GroupFieldType
>;

/**
 * Tipo para qualquer campo de formulário
 */
export type AnyFormFieldType =
  | RadioFieldType
  | SwitchFieldType
  | NumberFieldType
  | GroupFieldType;

/**
 * Tipo para configuração de formulário de tema
 */
export type ThemeFormConfigTypes = Record<string, AnyFormFieldType>;

// ========================================
// 🎨 TIPOS DE CORES
// ========================================

/**
 * Tipo para paleta de cores
 */
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  A100: string;
  A200: string;
  A400: string;
  A700: string;
  contrastDefaultColor: "light" | "dark";
}

/**
 * Tipo para cores de texto
 */
export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
}

/**
 * Tipo para cores brand
 */
export interface BrandColor {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}
