/**
 * 🌑 SHADOW UTILITIES - LINK CHART
 * Utilitários para sombras consistentes baseadas no tema
 *
 * @description
 * Funções para gerar sombras padronizadas com diferentes
 * intensidades e efeitos especiais.
 *
 * @since 2.0.0
 */

import { alpha } from '@mui/material/styles';

import type { ColorVariant } from './colorUtils';
import type { Theme } from '@mui/material/styles';

/**
 * Níveis de intensidade de sombra
 */
export type ShadowIntensity = 'subtle' | 'soft' | 'medium' | 'strong' | 'dramatic';

/**
 * Tipos de sombra especiais
 */
export type ShadowType = 'default' | 'colored' | 'inset' | 'glow' | 'neumorphism';

/**
 * Configuração para sombras
 */
export interface ShadowConfig {
	intensity?: ShadowIntensity;
	type?: ShadowType;
	color?: string;
	variant?: ColorVariant;
}

/**
 * Obtém sombra baseada na intensidade
 */
export const getShadowByIntensity = (theme: Theme, intensity: ShadowIntensity = 'medium'): string => {
	const shadowMap: Record<ShadowIntensity, number> = {
		subtle: 1,
		soft: 2,
		medium: 4,
		strong: 8,
		dramatic: 16
	};

	const shadowIndex = Math.min(shadowMap[intensity], theme.shadows.length - 1);
	return theme.shadows[shadowIndex];
};

/**
 * Cria sombra colorida baseada em um variant
 */
export const createColoredShadow = (
	theme: Theme,
	variant: ColorVariant,
	intensity: ShadowIntensity = 'medium'
): string => {
	const color = theme.palette[variant].main;
	const isDark = theme.palette.mode === 'dark';

	const intensityConfig = {
		subtle: { opacity: 0.1, blur: 8, spread: 0, y: 2 },
		soft: { opacity: 0.15, blur: 12, spread: 0, y: 4 },
		medium: { opacity: 0.2, blur: 16, spread: 0, y: 6 },
		strong: { opacity: 0.25, blur: 24, spread: 0, y: 8 },
		dramatic: { opacity: 0.3, blur: 32, spread: 0, y: 12 }
	};

	const config = intensityConfig[intensity];
	const shadowColor = alpha(color, isDark ? config.opacity * 1.5 : config.opacity);

	return `0 ${config.y}px ${config.blur}px ${config.spread}px ${shadowColor}`;
};

/**
 * Cria efeito de glow
 */
export const createGlowEffect = (
	theme: Theme,
	variant: ColorVariant,
	intensity: ShadowIntensity = 'medium'
): string => {
	const color = theme.palette[variant].main;

	const intensityConfig = {
		subtle: { opacity: 0.2, blur: 8 },
		soft: { opacity: 0.3, blur: 12 },
		medium: { opacity: 0.4, blur: 16 },
		strong: { opacity: 0.5, blur: 24 },
		dramatic: { opacity: 0.6, blur: 32 }
	};

	const config = intensityConfig[intensity];
	const glowColor = alpha(color, config.opacity);

	return `0 0 ${config.blur}px ${glowColor}, 0 0 ${config.blur * 2}px ${alpha(color, config.opacity * 0.5)}`;
};

/**
 * Cria sombra interna (inset)
 */
export const createInsetShadow = (theme: Theme, intensity: ShadowIntensity = 'medium'): string => {
	const isDark = theme.palette.mode === 'dark';
	const shadowColor = isDark ? alpha('#000000', 0.3) : alpha('#000000', 0.1);

	const intensityConfig = {
		subtle: { blur: 4, spread: 0 },
		soft: { blur: 8, spread: 0 },
		medium: { blur: 12, spread: 0 },
		strong: { blur: 16, spread: 0 },
		dramatic: { blur: 24, spread: 0 }
	};

	const config = intensityConfig[intensity];

	return `inset 0 2px ${config.blur}px ${config.spread}px ${shadowColor}`;
};

/**
 * Cria efeito neumorphism
 */
export const createNeumorphismShadow = (theme: Theme, intensity: ShadowIntensity = 'medium'): string => {
	const isDark = theme.palette.mode === 'dark';

	const lightShadow = isDark ? alpha('#ffffff', 0.1) : alpha('#ffffff', 0.8);

	const darkShadow = isDark ? alpha('#000000', 0.3) : alpha('#000000', 0.15);

	const intensityConfig = {
		subtle: { distance: 4, blur: 8 },
		soft: { distance: 6, blur: 12 },
		medium: { distance: 8, blur: 16 },
		strong: { distance: 12, blur: 24 },
		dramatic: { distance: 16, blur: 32 }
	};

	const config = intensityConfig[intensity];

	return `
        ${config.distance}px ${config.distance}px ${config.blur}px ${darkShadow},
        -${config.distance}px -${config.distance}px ${config.blur}px ${lightShadow}
    `;
};

/**
 * Cria sombras baseadas na configuração
 */
export const createShadow = (theme: Theme, config: ShadowConfig = {}): string => {
	const { intensity = 'medium', type = 'default', color, variant = 'primary' } = config;

	switch (type) {
		case 'colored':
			return createColoredShadow(theme, variant, intensity);
		case 'glow':
			return createGlowEffect(theme, variant, intensity);
		case 'inset':
			return createInsetShadow(theme, intensity);
		case 'neumorphism':
			return createNeumorphismShadow(theme, intensity);
		case 'default':
		default:
			return getShadowByIntensity(theme, intensity);
	}
};

/**
 * Sombras pré-definidas para componentes comuns
 */
export const createPresetShadows = (theme: Theme) => {
	return {
		// Sombras para cards
		card: getShadowByIntensity(theme, 'soft'),
		cardHover: getShadowByIntensity(theme, 'medium'),
		cardActive: getShadowByIntensity(theme, 'subtle'),

		// Sombras para botões
		button: getShadowByIntensity(theme, 'subtle'),
		buttonHover: getShadowByIntensity(theme, 'soft'),
		buttonActive: createInsetShadow(theme, 'subtle'),

		// Sombras para modais
		modal: getShadowByIntensity(theme, 'dramatic'),
		dialog: getShadowByIntensity(theme, 'strong'),
		popover: getShadowByIntensity(theme, 'medium'),

		// Sombras para navegação
		navbar: getShadowByIntensity(theme, 'soft'),
		sidebar: getShadowByIntensity(theme, 'medium'),

		// Sombras especiais
		primaryGlow: createGlowEffect(theme, 'primary', 'soft'),
		successGlow: createGlowEffect(theme, 'success', 'soft'),
		errorGlow: createGlowEffect(theme, 'error', 'soft'),
		warningGlow: createGlowEffect(theme, 'warning', 'soft'),

		// Sombras para estados
		focus: createColoredShadow(theme, 'primary', 'soft'),
		error: createColoredShadow(theme, 'error', 'soft'),
		success: createColoredShadow(theme, 'success', 'soft')
	};
};

/**
 * Cria sombras para diferentes estados de um componente
 */
export const createStateShadows = (theme: Theme, variant: ColorVariant = 'primary') => {
	return {
		default: getShadowByIntensity(theme, 'soft'),
		hover: createColoredShadow(theme, variant, 'medium'),
		active: createInsetShadow(theme, 'subtle'),
		focus: createColoredShadow(theme, variant, 'soft'),
		disabled: 'none'
	};
};

/**
 * Utilitário para aplicar sombras responsivas
 */
export const createResponsiveShadow = (
	theme: Theme,
	mobile: ShadowIntensity,
	tablet?: ShadowIntensity,
	desktop?: ShadowIntensity
) => {
	const mobileShadow = getShadowByIntensity(theme, mobile);
	const tabletShadow = tablet ? getShadowByIntensity(theme, tablet) : mobileShadow;
	const desktopShadow = desktop ? getShadowByIntensity(theme, desktop) : tabletShadow;

	return {
		boxShadow: mobileShadow,
		[theme.breakpoints.up('sm')]: {
			boxShadow: tabletShadow
		},
		[theme.breakpoints.up('md')]: {
			boxShadow: desktopShadow
		}
	};
};
