/**
 * 🎨 COLOR UTILITIES - LINK CHART
 * Utilitários centralizados para trabalhar com cores do tema
 * 
 * @description
 * Funções utilitárias para obter cores do tema de forma consistente,
 * com suporte a variantes, opacidade e estados (hover, active, etc.)
 * 
 * @since 2.0.0
 */

import { Theme, alpha } from '@mui/material/styles';

/**
 * Variantes de cores disponíveis
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Tons de cores disponíveis
 */
export type ColorShade = 'light' | 'main' | 'dark' | 'contrastText';

/**
 * Interface para configuração de cores
 */
export interface ColorConfig {
    variant: ColorVariant;
    shade?: ColorShade;
    opacity?: number;
    hover?: boolean;
}

/**
 * Obtém uma cor do tema com configurações avançadas
 */
export const getThemeColor = (
    theme: Theme,
    config: ColorConfig | ColorVariant
): string => {
    // Se for apenas uma string, usa configuração padrão
    if (typeof config === 'string') {
        return theme.palette[config].main;
    }

    const { variant, shade = 'main', opacity, hover } = config;
    let color = theme.palette[variant][shade];

    // Aplica opacidade se especificada
    if (opacity !== undefined) {
        color = alpha(color, opacity);
    }

    // Aplica efeito hover se especificado
    if (hover) {
        color = alpha(color, 0.8);
    }

    return color;
};

/**
 * Gera um mapa completo de cores para um variant
 */
export const getColorVariantMap = (theme: Theme, variant: ColorVariant) => {
    const palette = theme.palette[variant];

    return {
        light: palette.light,
        main: palette.main,
        dark: palette.dark,
        contrastText: palette.contrastText,
        // Variações com opacidade comuns
        alpha10: alpha(palette.main, 0.1),
        alpha20: alpha(palette.main, 0.2),
        alpha30: alpha(palette.main, 0.3),
        alpha40: alpha(palette.main, 0.4),
        alpha50: alpha(palette.main, 0.5),
        // Estados comuns
        hover: alpha(palette.main, 0.8),
        active: alpha(palette.main, 0.9),
        disabled: alpha(palette.main, 0.4)
    };
};

/**
 * Gera cores para diferentes estados de um componente
 */
export const getStateColors = (theme: Theme, variant: ColorVariant) => {
    const colors = getColorVariantMap(theme, variant);

    return {
        default: colors.main,
        hover: colors.hover,
        active: colors.active,
        disabled: colors.disabled,
        focus: colors.alpha20
    };
};

/**
 * Obtém cores de background baseadas no modo do tema
 */
export const getBackgroundColors = (theme: Theme) => {
    const isDark = theme.palette.mode === 'dark';

    return {
        primary: theme.palette.background.paper,
        secondary: theme.palette.background.default,
        elevated: isDark
            ? alpha(theme.palette.background.paper, 0.8)
            : theme.palette.background.paper,
        glass: isDark
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha('#ffffff', 0.9),
        overlay: isDark
            ? alpha('#000000', 0.7)
            : alpha('#000000', 0.5)
    };
};

/**
 * Obtém cores de texto baseadas no modo do tema
 */
export const getTextColors = (theme: Theme) => {
    return {
        primary: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
        disabled: theme.palette.text.disabled,
        hint: alpha(theme.palette.text.primary, 0.6),
        contrast: theme.palette.getContrastText(theme.palette.background.paper)
    };
};

/**
 * Gera cores para bordas baseadas no tema
 */
export const getBorderColors = (theme: Theme, variant?: ColorVariant) => {
    const base = {
        default: theme.palette.divider,
        light: alpha(theme.palette.divider, 0.5),
        strong: alpha(theme.palette.text.primary, 0.2)
    };

    if (variant) {
        const variantColor = theme.palette[variant].main;
        return {
            ...base,
            accent: alpha(variantColor, 0.3),
            accentHover: alpha(variantColor, 0.5)
        };
    }

    return base;
};

/**
 * Utilitário para criar gradientes consistentes
 */
export const createGradient = (
    theme: Theme,
    variant: ColorVariant,
    direction: 'horizontal' | 'vertical' | 'diagonal' = 'diagonal',
    opacity?: number
) => {
    const colors = getColorVariantMap(theme, variant);
    const startColor = opacity ? alpha(colors.light, opacity) : colors.light;
    const endColor = opacity ? alpha(colors.main, opacity) : colors.main;

    const directions = {
        horizontal: '90deg',
        vertical: '180deg',
        diagonal: '135deg'
    };

    return `linear-gradient(${directions[direction]}, ${startColor} 0%, ${endColor} 100%)`;
};

/**
 * Cria um conjunto completo de cores para um componente
 */
export const createComponentColorSet = (theme: Theme, variant: ColorVariant) => {
    const variantColors = getColorVariantMap(theme, variant);
    const backgroundColors = getBackgroundColors(theme);
    const textColors = getTextColors(theme);
    const borderColors = getBorderColors(theme, variant);

    return {
        // Cores principais do variant
        ...variantColors,
        // Backgrounds
        background: backgroundColors,
        // Textos
        text: textColors,
        // Bordas
        border: borderColors,
        // Gradientes prontos
        gradients: {
            primary: createGradient(theme, variant, 'diagonal'),
            subtle: createGradient(theme, variant, 'diagonal', 0.1),
            strong: createGradient(theme, variant, 'vertical')
        }
    };
};
