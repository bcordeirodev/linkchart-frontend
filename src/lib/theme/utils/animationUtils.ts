/**
 * 🎭 ANIMATION UTILITIES - LINK CHART
 * Utilitários para animações consistentes baseadas no tema
 * 
 * @description
 * Funções para criar animações padronizadas usando as
 * configurações de transição do Material-UI.
 * 
 * @since 2.0.0
 */

import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';

/**
 * Tipos de animação disponíveis
 */
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'pulse';

/**
 * Direções para animações de slide
 */
export type SlideDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Durações de animação
 */
export type AnimationDuration = 'shortest' | 'shorter' | 'short' | 'standard' | 'complex';

/**
 * Configuração para animações
 */
export interface AnimationConfig {
    duration?: AnimationDuration;
    delay?: number;
    easing?: string;
    direction?: SlideDirection;
}

/**
 * Cria transições baseadas no tema
 */
export const createTransition = (
    theme: Theme,
    properties: string | string[],
    config: AnimationConfig = {}
): string => {
    const {
        duration = 'standard',
        delay = 0,
        easing
    } = config;

    const props = Array.isArray(properties) ? properties : [properties];
    const durationValue = theme.transitions.duration[duration];
    const easingValue = easing || theme.transitions.easing.easeInOut;

    return theme.transitions.create(props, {
        duration: durationValue,
        delay,
        easing: easingValue
    });
};

/**
 * Cria animação de fade
 */
export const createFadeAnimation = (
    theme: Theme,
    config: AnimationConfig = {}
): SxProps => {
    return {
        transition: createTransition(theme, 'opacity', config),
        '&:hover': {
            opacity: 0.8
        }
    };
};

/**
 * Cria animação de slide
 */
export const createSlideAnimation = (
    theme: Theme,
    direction: SlideDirection = 'up',
    config: AnimationConfig = {}
): SxProps => {
    const transforms = {
        up: 'translateY(-4px)',
        down: 'translateY(4px)',
        left: 'translateX(-4px)',
        right: 'translateX(4px)'
    };

    return {
        transition: createTransition(theme, 'transform', config),
        '&:hover': {
            transform: transforms[direction]
        }
    };
};

/**
 * Cria animação de scale
 */
export const createScaleAnimation = (
    theme: Theme,
    scale: number = 1.05,
    config: AnimationConfig = {}
): SxProps => {
    return {
        transition: createTransition(theme, 'transform', config),
        '&:hover': {
            transform: `scale(${scale})`
        }
    };
};

/**
 * Cria animação de rotação
 */
export const createRotateAnimation = (
    theme: Theme,
    degrees: number = 5,
    config: AnimationConfig = {}
): SxProps => {
    return {
        transition: createTransition(theme, 'transform', config),
        '&:hover': {
            transform: `rotate(${degrees}deg)`
        }
    };
};

/**
 * Cria efeito de pulse
 */
export const createPulseAnimation = (): SxProps => {
    return {
        '@keyframes pulse': {
            '0%': {
                transform: 'scale(1)',
                opacity: 1
            },
            '50%': {
                transform: 'scale(1.05)',
                opacity: 0.8
            },
            '100%': {
                transform: 'scale(1)',
                opacity: 1
            }
        },
        '&:hover': {
            animation: 'pulse 1s ease-in-out infinite'
        }
    };
};

/**
 * Cria efeito de bounce
 */
export const createBounceAnimation = (): SxProps => {
    return {
        '@keyframes bounce': {
            '0%, 20%, 53%, 80%, 100%': {
                transform: 'translate3d(0,0,0)'
            },
            '40%, 43%': {
                transform: 'translate3d(0, -8px, 0)'
            },
            '70%': {
                transform: 'translate3d(0, -4px, 0)'
            },
            '90%': {
                transform: 'translate3d(0, -2px, 0)'
            }
        },
        '&:hover': {
            animation: 'bounce 1s ease-in-out'
        }
    };
};

/**
 * Animações pré-definidas para componentes comuns
 */
export const createPresetAnimations = (theme: Theme) => {
    return {
        // Animações para cards
        cardHover: {
            ...createSlideAnimation(theme, 'up', { duration: 'shorter' }),
            ...createFadeAnimation(theme, { duration: 'shorter' })
        },

        // Animações para botões
        buttonHover: createScaleAnimation(theme, 1.02, { duration: 'shortest' }),
        buttonPress: {
            transition: createTransition(theme, 'transform', { duration: 'shortest' }),
            '&:active': {
                transform: 'scale(0.98)'
            }
        },

        // Animações para ícones
        iconSpin: {
            '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
            },
            '&:hover': {
                animation: 'spin 1s linear infinite'
            }
        },

        // Animações para loading
        loading: {
            '@keyframes fadeInOut': {
                '0%, 100%': { opacity: 0.3 },
                '50%': { opacity: 1 }
            },
            animation: 'fadeInOut 1.5s ease-in-out infinite'
        },

        // Animações para entrada
        fadeIn: {
            '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
            },
            animation: 'fadeIn 0.5s ease-out'
        },

        slideInLeft: {
            '@keyframes slideInLeft': {
                '0%': { opacity: 0, transform: 'translateX(-30px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
            },
            animation: 'slideInLeft 0.5s ease-out'
        },

        // Animações para foco
        focusRing: {
            transition: createTransition(theme, 'box-shadow', { duration: 'shorter' }),
            '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 3px ${theme.palette.primary.main}40`
            }
        }
    };
};

/**
 * Cria animações de estado para componentes
 */
export const createStateAnimations = (theme: Theme) => {
    return {
        // Estados padrão
        idle: {
            transition: createTransition(theme, ['transform', 'opacity', 'box-shadow'])
        },

        // Estado hover
        hover: {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
        },

        // Estado ativo
        active: {
            transform: 'translateY(0px)',
            boxShadow: theme.shadows[2]
        },

        // Estado desabilitado
        disabled: {
            opacity: 0.5,
            transform: 'none',
            boxShadow: 'none'
        },

        // Estado de foco
        focus: {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme.palette.primary.main}40`
        }
    };
};

/**
 * Utilitário para animações responsivas
 */
export const createResponsiveAnimation = (
    theme: Theme,
    mobileAnimation: SxProps,
    desktopAnimation?: SxProps
): SxProps => {
    return {
        ...mobileAnimation,
        [theme.breakpoints.up('md')]: {
            ...desktopAnimation
        }
    };
};
