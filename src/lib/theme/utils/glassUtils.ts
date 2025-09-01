/**
 * 🔮 GLASSMORPHISM UTILITIES - LINK CHART
 * Utilitários para criar efeitos de glassmorphism consistentes
 * 
 * @description
 * Funções para gerar estilos de glassmorphism padronizados,
 * com diferentes intensidades e configurações.
 * 
 * @since 2.0.0
 */

import { Theme, alpha } from '@mui/material/styles';
import { SxProps } from '@mui/material';

/**
 * Intensidades de glassmorphism disponíveis
 */
export type GlassIntensity = 'subtle' | 'medium' | 'strong' | 'intense';

/**
 * Configuração para glassmorphism
 */
export interface GlassConfig {
    intensity?: GlassIntensity;
    tint?: string;
    border?: boolean;
    shadow?: boolean;
    blur?: number;
}

/**
 * Cria estilos de glassmorphism
 */
export const createGlassEffect = (
    theme: Theme,
    config: GlassConfig = {}
): SxProps => {
    const {
        intensity = 'medium',
        tint,
        border = true,
        shadow = true,
        blur
    } = config;

    const isDark = theme.palette.mode === 'dark';

    // Configurações por intensidade
    const intensityConfig = {
        subtle: {
            backgroundOpacity: isDark ? 0.1 : 0.05,
            backdropBlur: 8,
            borderOpacity: 0.1,
            shadowOpacity: isDark ? 0.2 : 0.1
        },
        medium: {
            backgroundOpacity: isDark ? 0.2 : 0.1,
            backdropBlur: 12,
            borderOpacity: 0.2,
            shadowOpacity: isDark ? 0.3 : 0.15
        },
        strong: {
            backgroundOpacity: isDark ? 0.3 : 0.2,
            backdropBlur: 16,
            borderOpacity: 0.3,
            shadowOpacity: isDark ? 0.4 : 0.2
        },
        intense: {
            backgroundOpacity: isDark ? 0.4 : 0.3,
            backdropBlur: 20,
            borderOpacity: 0.4,
            shadowOpacity: isDark ? 0.5 : 0.3
        }
    };

    const config_values = intensityConfig[intensity];

    // Background base
    const baseColor = tint || (isDark ? '#ffffff' : '#ffffff');
    const background = alpha(baseColor, config_values.backgroundOpacity);

    // Estilos base
    const glassStyles: SxProps = {
        background,
        backdropFilter: `blur(${blur || config_values.backdropBlur}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blur || config_values.backdropBlur}px) saturate(180%)`,
    };

    // Adiciona borda se habilitada
    if (border) {
        glassStyles.border = `1px solid ${alpha(
            isDark ? '#ffffff' : '#000000',
            config_values.borderOpacity
        )}`;
    }

    // Adiciona sombra se habilitada
    if (shadow) {
        glassStyles.boxShadow = isDark
            ? `0 8px 32px ${alpha('#000000', config_values.shadowOpacity)}`
            : `0 8px 32px ${alpha('#000000', config_values.shadowOpacity)}`;
    }

    return glassStyles;
};

/**
 * Cria efeito de glassmorphism para cards
 */
export const createGlassCard = (
    theme: Theme,
    variant: 'primary' | 'secondary' | 'neutral' = 'neutral'
): SxProps => {
    const isDark = theme.palette.mode === 'dark';

    const variantConfig = {
        primary: {
            tint: theme.palette.primary.main,
            intensity: 'medium' as GlassIntensity
        },
        secondary: {
            tint: theme.palette.secondary.main,
            intensity: 'medium' as GlassIntensity
        },
        neutral: {
            tint: undefined,
            intensity: 'medium' as GlassIntensity
        }
    };

    const config = variantConfig[variant];

    return {
        ...createGlassEffect(theme, config),
        borderRadius: 3,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short
        }),
        '&:hover': {
            ...createGlassEffect(theme, {
                ...config,
                intensity: 'strong'
            }) as any,
            transform: 'translateY(-2px)'
        }
    };
};

/**
 * Cria efeito de glassmorphism para navbar/header
 */
export const createGlassNavbar = (theme: Theme): SxProps => {
    return {
        ...createGlassEffect(theme, {
            intensity: 'medium',
            blur: 20
        }),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.standard
        })
    };
};

/**
 * Cria efeito de glassmorphism para modais/overlays
 */
export const createGlassModal = (theme: Theme): SxProps => {
    return {
        ...createGlassEffect(theme, {
            intensity: 'strong',
            blur: 24
        }),
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        boxShadow: theme.shadows[24]
    };
};

/**
 * Cria efeito de glassmorphism para botões
 */
export const createGlassButton = (
    theme: Theme,
    variant: 'primary' | 'secondary' = 'primary'
): SxProps => {
    const color = theme.palette[variant].main;

    return {
        ...createGlassEffect(theme, {
            intensity: 'subtle',
            tint: color
        }),
        borderRadius: 2,
        border: `1px solid ${alpha(color, 0.3)}`,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short
        }),
        '&:hover': {
            ...createGlassEffect(theme, {
                intensity: 'medium',
                tint: color
            }) as any,
            borderColor: alpha(color, 0.5),
            transform: 'translateY(-1px)'
        },
        '&:active': {
            transform: 'translateY(0px)'
        }
    };
};

/**
 * Utilitário para aplicar glassmorphism em componentes existentes
 */
export const applyGlassEffect = (
    existingSx: SxProps,
    theme: Theme,
    config: GlassConfig = {}
): SxProps => {
    const glassStyles = createGlassEffect(theme, config);

    return {
        ...existingSx,
        ...glassStyles
    } as SxProps;
};
