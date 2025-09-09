/**
 * 🌈 GRADIENT UTILITIES - LINK CHART
 * Utilitários para criar gradientes consistentes
 *
 * @description
 * Funções para gerar gradientes padronizados com diferentes
 * estilos, direções e intensidades.
 *
 * @since 2.0.0
 */

import { Theme, alpha } from '@mui/material/styles';
import { ColorVariant } from './colorUtils';

/**
 * Tipos de gradiente disponíveis
 */
export type GradientType = 'linear' | 'radial' | 'conic';

/**
 * Direções para gradientes lineares
 */
export type GradientDirection =
	| 'to-right'
	| 'to-left'
	| 'to-top'
	| 'to-bottom'
	| 'to-top-right'
	| 'to-bottom-right'
	| 'to-bottom-left'
	| 'to-top-left';

/**
 * Configuração para gradientes
 */
export interface GradientConfig {
	type?: GradientType;
	direction?: GradientDirection;
	colors?: string[];
	stops?: number[];
	opacity?: number;
	variant?: ColorVariant;
}

/**
 * Mapeia direções para valores CSS
 */
const directionMap: Record<GradientDirection, string> = {
	'to-right': '90deg',
	'to-left': '270deg',
	'to-top': '0deg',
	'to-bottom': '180deg',
	'to-top-right': '45deg',
	'to-bottom-right': '135deg',
	'to-bottom-left': '225deg',
	'to-top-left': '315deg'
};

/**
 * Cria um gradiente linear
 */
export const createLinearGradient = (
	colors: string[],
	direction: GradientDirection = 'to-bottom-right',
	stops?: number[]
): string => {
	const angle = directionMap[direction];

	let colorStops = colors;

	if (stops && stops.length === colors.length) {
		colorStops = colors.map((color, index) => `${color} ${stops[index]}%`);
	}

	return `linear-gradient(${angle}, ${colorStops.join(', ')})`;
};

/**
 * Cria um gradiente radial
 */
export const createRadialGradient = (colors: string[], position = 'center', shape = 'ellipse'): string => {
	return `radial-gradient(${shape} at ${position}, ${colors.join(', ')})`;
};

/**
 * Cria um gradiente cônico
 */
export const createConicGradient = (colors: string[], angle = 0, position = 'center'): string => {
	return `conic-gradient(from ${angle}deg at ${position}, ${colors.join(', ')})`;
};

/**
 * Cria gradientes baseados no tema
 */
export const createThemeGradient = (theme: Theme, config: GradientConfig): string => {
	const {
		type = 'linear',
		direction = 'to-bottom-right',
		variant = 'primary',
		opacity = 1,
		colors: customColors,
		stops
	} = config;

	// Se cores customizadas não foram fornecidas, usa as do tema
	let colors = customColors;

	if (!colors) {
		const paletteColor = theme.palette[variant];
		colors = [paletteColor.light, paletteColor.main, paletteColor.dark];
	}

	// Aplica opacidade se especificada
	if (opacity < 1) {
		colors = colors.map((color) => alpha(color, opacity));
	}

	// Cria o gradiente baseado no tipo
	switch (type) {
		case 'radial':
			return createRadialGradient(colors);
		case 'conic':
			return createConicGradient(colors);
		case 'linear':
		default:
			return createLinearGradient(colors, direction, stops);
	}
};

/**
 * Gradientes pré-definidos para uso comum
 */
export const createPresetGradients = (theme: Theme) => {
	return {
		// Gradientes principais
		primarySubtle: createThemeGradient(theme, {
			variant: 'primary',
			opacity: 0.1,
			direction: 'to-bottom-right'
		}),
		primaryMedium: createThemeGradient(theme, {
			variant: 'primary',
			opacity: 0.3,
			direction: 'to-bottom-right'
		}),
		primaryStrong: createThemeGradient(theme, {
			variant: 'primary',
			direction: 'to-bottom-right'
		}),

		// Gradientes secundários
		secondarySubtle: createThemeGradient(theme, {
			variant: 'secondary',
			opacity: 0.1,
			direction: 'to-bottom-right'
		}),
		secondaryMedium: createThemeGradient(theme, {
			variant: 'secondary',
			opacity: 0.3,
			direction: 'to-bottom-right'
		}),

		// Gradientes de sucesso
		successGlow: createThemeGradient(theme, {
			variant: 'success',
			opacity: 0.2,
			type: 'radial'
		}),

		// Gradientes de erro
		errorGlow: createThemeGradient(theme, {
			variant: 'error',
			opacity: 0.2,
			type: 'radial'
		}),

		// Gradientes neutros
		paperGlow: createLinearGradient(
			[alpha(theme.palette.background.paper, 0.8), alpha(theme.palette.background.paper, 0.4)],
			'to-bottom-right'
		),

		// Gradientes de texto
		textGradient: createThemeGradient(theme, {
			variant: 'primary',
			direction: 'to-right'
		}),

		// Gradientes para overlays
		overlay: createLinearGradient([alpha('#000000', 0.6), alpha('#000000', 0.3), 'transparent'], 'to-top'),

		// Gradientes animados (para uso com keyframes)
		rainbow: createLinearGradient(
			['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
			'to-right'
		),

		// Gradientes para glassmorphism
		glassOverlay: createLinearGradient(
			[alpha(theme.palette.background.paper, 0.1), alpha(theme.palette.background.paper, 0.05)],
			'to-bottom-right'
		)
	};
};

/**
 * Cria gradientes para estados de componente
 */
export const createStateGradients = (theme: Theme, variant: ColorVariant) => {
	const baseColors = [theme.palette[variant].light, theme.palette[variant].main, theme.palette[variant].dark];

	return {
		default: createLinearGradient(baseColors, 'to-bottom-right'),
		hover: createLinearGradient(
			baseColors.map((color) => alpha(color, 0.8)),
			'to-bottom-right'
		),
		active: createLinearGradient(
			baseColors.map((color) => alpha(color, 0.9)),
			'to-bottom-right'
		),
		disabled: createLinearGradient(
			baseColors.map((color) => alpha(color, 0.3)),
			'to-bottom-right'
		)
	};
};

/**
 * Utilitário para criar gradientes de texto
 */
export const createTextGradient = (theme: Theme, variant: ColorVariant = 'primary'): Record<string, any> => {
	const gradient = createThemeGradient(theme, {
		variant,
		direction: 'to-right'
	});

	return {
		background: gradient,
		backgroundClip: 'text',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		// Fallback para navegadores sem suporte
		'@supports not (background-clip: text)': {
			color: theme.palette[variant].main,
			WebkitTextFillColor: 'unset'
		}
	};
};
