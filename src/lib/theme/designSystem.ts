/**
 * 🎨 DESIGN SYSTEM CENTRALIZADO - LINK CHART
 * Sistema de tokens de design unificado para toda a aplicação
 *
 * @description
 * Este arquivo centraliza todos os tokens de design da aplicação,
 * garantindo consistência visual e facilitando manutenção.
 *
 * @features
 * - ✅ Spacing system padronizado
 * - ✅ Border radius consistente
 * - ✅ Color system baseado no tema
 * - ✅ Layout dimensions responsivas
 * - ✅ Animation system unificado
 * - ✅ Typography scale consistente
 *
 * @since 2.0.0
 */

import { useTheme, alpha } from '@mui/material/styles';

import { createSpacingUtils, createComponentColorSet, createPresetShadows, createPresetAnimations } from './utils';

import type { SxProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

// ========================================
// 📐 SPACING SYSTEM
// ========================================

/**
 * Sistema de espaçamento padronizado
 * Baseado no theme.spacing() para consistência
 */
export const spacingTokens = {
	xs: 0.5, // 4px
	sm: 1, // 8px
	md: 1.5, // 12px - PADRÃO
	lg: 2, // 16px
	xl: 2.5, // 20px
	xxl: 3, // 24px
	xxxl: 4, // 32px
	xxxxl: 5, // 40px
	xxxxxl: 6 // 48px
} as const;

/**
 * Espaçamentos específicos para layouts
 */
export const layoutSpacing = {
	// Container padrão - OTIMIZADO MOBILE-FIRST
	container: {
		xs: spacingTokens.md, // 12px (era 16px) - Reduzido para mobile
		sm: spacingTokens.lg, // 16px (era 24px)
		md: spacingTokens.xxl // 24px (era 32px)
	},

	// Seção padrão - REDUZIDO significativamente
	section: {
		xs: spacingTokens.lg, // 16px (era 32px) - 50% redução mobile
		sm: spacingTokens.xxl, // 24px (era 40px)
		md: spacingTokens.xxxl // 32px (era 48px)
	},

	// Card interno - OTIMIZADO
	card: {
		xs: spacingTokens.md, // 12px (era 16px)
		sm: spacingTokens.lg, // 16px
		md: spacingTokens.xxl // 24px (novo breakpoint)
	},

	// Form spacing - NOVO para formulários
	form: {
		xs: spacingTokens.lg, // 16px
		sm: spacingTokens.xl, // 20px
		md: spacingTokens.xxl // 24px
	},

	// Page spacing - NOVO para páginas
	page: {
		xs: spacingTokens.md, // 12px - Compacto em mobile
		sm: spacingTokens.lg, // 16px
		md: spacingTokens.xxl // 24px
	},

	// Grid spacing - REDUZIDO
	grid: {
		xs: spacingTokens.md, // 12px (era 16px)
		sm: spacingTokens.lg, // 16px (era 24px)
		md: spacingTokens.xxl // 24px (novo)
	}
} as const;

// ========================================
// 🔲 BORDER RADIUS SYSTEM
// ========================================

/**
 * Sistema de border radius padronizado
 * PADRÃO: 12px (theme.spacing(1.5))
 */
export const borderRadiusTokens = {
	none: 0,
	sm: 0.5, // 4px
	md: 1, // 8px
	lg: 1.5, // 12px - PADRÃO UNIVERSAL
	xl: 2, // 16px
	xxl: 3, // 24px
	full: '50%'
} as const;

// ========================================
// 🎨 COLOR VARIANTS
// ========================================

/**
 * Variantes de cores disponíveis
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Intensidades de cores
 */
export type ColorIntensity = 'subtle' | 'medium' | 'strong';

// ========================================
// 🎭 ANIMATION SYSTEM
// ========================================

/**
 * Durações de animação padronizadas
 */
export const animationDurations = {
	fast: 150, // ms
	normal: 250, // ms - PADRÃO
	slow: 400, // ms
	slower: 600 // ms
} as const;

/**
 * Easings padronizados
 */
export const animationEasings = {
	standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
	decelerate: 'cubic-bezier(0.0, 0, 0.2, 1)',
	accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
	sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
} as const;

// ========================================
// 📏 LAYOUT DIMENSIONS
// ========================================

/**
 * Dimensões de layout padronizadas
 */
export const layoutDimensions = {
	navbar: {
		height: 64,
		width: 280,
		collapsedWidth: 64
	},
	toolbar: {
		height: 56
	},
	footer: {
		height: 64
	},
	sidebar: {
		width: 320,
		collapsedWidth: 80
	}
} as const;

// ========================================
// 🎯 DESIGN TOKENS PRINCIPAIS
// ========================================

/**
 * Função principal para criar design tokens
 * Retorna todos os tokens baseados no tema atual
 */
export const createDesignTokens = (theme: Theme) => {
	return {
		// ========================================
		// 📐 SPACING
		// ========================================
		spacing: {
			// Valores básicos diretos
			xs: theme.spacing(spacingTokens.xs), // 4px
			sm: theme.spacing(spacingTokens.sm), // 8px
			md: theme.spacing(spacingTokens.md), // 12px
			lg: theme.spacing(spacingTokens.lg), // 16px
			xl: theme.spacing(spacingTokens.xl), // 20px
			xxl: theme.spacing(spacingTokens.xxl), // 24px
			xxxl: theme.spacing(spacingTokens.xxxl), // 32px
			xxxxl: theme.spacing(spacingTokens.xxxxl), // 40px
			xxxxxl: theme.spacing(spacingTokens.xxxxxl), // 48px

			// Layout específicos
			layout: {
				container: {
					xs: theme.spacing(layoutSpacing.container.xs),
					sm: theme.spacing(layoutSpacing.container.sm),
					md: theme.spacing(layoutSpacing.container.md)
				},
				section: {
					xs: theme.spacing(layoutSpacing.section.xs),
					sm: theme.spacing(layoutSpacing.section.sm),
					md: theme.spacing(layoutSpacing.section.md)
				},
				card: {
					xs: theme.spacing(layoutSpacing.card.xs),
					sm: theme.spacing(layoutSpacing.card.sm)
				}
			},

			// Utilitários prontos
			utils: createSpacingUtils(theme)
		},

		// ========================================
		// 🔲 BORDER RADIUS
		// ========================================
		borderRadius: {
			...Object.fromEntries(
				Object.entries(borderRadiusTokens).map(([key, value]) => [
					key,
					typeof value === 'number' ? theme.spacing(value) : value
				])
			)
		},

		// ========================================
		// 🎨 COLORS
		// ========================================
		colors: {
			primary: createComponentColorSet(theme, 'primary'),
			secondary: createComponentColorSet(theme, 'secondary'),
			success: createComponentColorSet(theme, 'success'),
			warning: createComponentColorSet(theme, 'warning'),
			error: createComponentColorSet(theme, 'error'),
			info: createComponentColorSet(theme, 'info'),

			// Cores de sistema
			text: theme.palette.text,
			background: theme.palette.background,
			divider: theme.palette.divider,
			action: theme.palette.action
		},

		// ========================================
		// 🌫️ SHADOWS
		// ========================================
		shadows: createPresetShadows(theme),

		// ========================================
		// 🎭 ANIMATIONS
		// ========================================
		animations: {
			durations: {
				fast: theme.transitions.duration.shortest,
				normal: theme.transitions.duration.short,
				slow: theme.transitions.duration.standard,
				slower: theme.transitions.duration.complex
			},
			easings: {
				standard: theme.transitions.easing.easeInOut,
				decelerate: theme.transitions.easing.easeOut,
				accelerate: theme.transitions.easing.easeIn,
				sharp: theme.transitions.easing.sharp
			},
			presets: createPresetAnimations(theme)
		},

		// ========================================
		// 📝 TYPOGRAPHY
		// ========================================
		typography: {
			...theme.typography,
			// Scale responsiva padrão
			responsive: {
				h1: { xs: '2rem', sm: '2.5rem', md: '3rem' },
				h2: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
				h3: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
				h4: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
				h5: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
				h6: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
				body1: { xs: '0.875rem', sm: '1rem' },
				body2: { xs: '0.75rem', sm: '0.875rem' }
			}
		},

		// ========================================
		// 📏 LAYOUT
		// ========================================
		layout: {
			dimensions: layoutDimensions,

			// Breakpoints responsivos
			breakpoints: theme.breakpoints,

			// Z-index layers
			zIndex: {
				navbar: 1100,
				drawer: 1200,
				modal: 1300,
				snackbar: 1400,
				tooltip: 1500
			}
		}
	};
};

// ========================================
// 🎯 DESIGN TOKENS HOOK
// ========================================

/**
 * Hook principal para acessar design tokens
 * Fornece acesso unificado a todos os tokens de design
 */
export const useDesignTokens = () => {
	const theme = useTheme();
	return createDesignTokens(theme);
};

// ========================================
// 🧩 COMPONENT HELPERS
// ========================================

/**
 * Helper para aplicar espaçamento padronizado
 */
export const applySpacing = (
	theme: Theme,
	type: 'padding' | 'margin',
	size: keyof typeof spacingTokens,
	direction?: 'x' | 'y' | 'top' | 'right' | 'bottom' | 'left'
): SxProps => {
	const value = theme.spacing(spacingTokens[size]);
	const prop = type === 'padding' ? 'p' : 'm';

	if (!direction) {
		return { [prop]: value };
	}

	const directionMap = {
		x: `${prop}x`,
		y: `${prop}y`,
		top: `${prop}t`,
		right: `${prop}r`,
		bottom: `${prop}b`,
		left: `${prop}l`
	};

	return { [directionMap[direction]]: value };
};

/**
 * Helper para aplicar border radius padronizado
 */
export const applyBorderRadius = (theme: Theme, size: keyof typeof borderRadiusTokens = 'lg'): SxProps => {
	const value = borderRadiusTokens[size];
	return {
		borderRadius: typeof value === 'number' ? theme.spacing(value) : value
	};
};

/**
 * Helper para criar variações de cor
 */
export const createColorVariation = (theme: Theme, variant: ColorVariant, intensity: ColorIntensity = 'medium') => {
	const baseColor = theme.palette[variant].main;

	const intensityMap = {
		subtle: 0.04,
		medium: 0.08,
		strong: 0.12
	};

	return {
		background: alpha(baseColor, intensityMap[intensity]),
		border: alpha(baseColor, intensityMap[intensity] * 3),
		text: baseColor
	};
};

// ========================================
// 📐 RESPONSIVE SPACING UTILITIES
// ========================================

/**
 * Cria espaçamento responsivo baseado nos tokens otimizados
 */
export const createResponsiveSpacing = (spacingType: keyof typeof layoutSpacing) => {
	const spacing = layoutSpacing[spacingType];
	return {
		xs: spacing.xs,
		sm: spacing.sm,
		md: spacing.md
	};
};

/**
 * Utilitários de espaçamento pré-configurados
 */
export const responsiveSpacing = {
	// Padding responsivo
	container: { p: createResponsiveSpacing('container') },
	section: { p: createResponsiveSpacing('section') },
	card: { p: createResponsiveSpacing('card') },
	form: { p: createResponsiveSpacing('form') },
	page: { p: createResponsiveSpacing('page') },

	// Gap responsivo para grids/flex
	grid: { gap: createResponsiveSpacing('grid') },

	// Margin bottom para seções
	sectionBottom: { mb: createResponsiveSpacing('section') },
	cardBottom: { mb: createResponsiveSpacing('card') }
};

/**
 * Helper para criar espaçamento customizado responsivo
 */
export const createCustomSpacing = (xs: number, sm?: number, md?: number) => ({
	xs: spacingTokens.xs * xs,
	sm: spacingTokens.sm * (sm || xs),
	md: spacingTokens.md * (md || sm || xs)
});

// ========================================
// 📤 EXPORTS
// ========================================

export default createDesignTokens;
