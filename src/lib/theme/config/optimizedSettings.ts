/**
 * Configurações otimizadas de tema
 */

import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import qs from 'qs';

import { fuseDark } from '../colors';

import { optimizedThemeOptions } from './muiComponents';

import type { FuseSettingsConfigType } from '../types/theme';
import type { ThemeOptions } from '@mui/material/styles/createTheme';

/**
 * Tema padrão otimizado da aplicação
 */
const optimizedDefaultTheme = {
	palette: {
		mode: 'light',
		text: {
			primary: 'rgb(17, 24, 39)',
			secondary: 'rgb(107, 114, 128)',
			disabled: 'rgb(149, 156, 169)'
		},
		common: {
			black: 'rgb(17, 24, 39)',
			white: 'rgb(255, 255, 255)'
		},
		primary: {
			light: '#bec1c5',
			main: '#252f3e',
			dark: '#0d121b',
			contrastDefaultColor: 'light'
		},
		secondary: {
			light: '#E8E9EA',
			main: '#9E9E9E',
			dark: '#616161'
		},
		background: {
			paper: '#FFFFFF',
			default: '#f6f7f9'
		},
		error: {
			light: '#ffcdd2',
			main: '#f44336',
			dark: '#b71c1c'
		}
	}
};

// ========================================
// ⚙️ CONFIGURAÇÕES OTIMIZADAS
// ========================================

/**
 * Configurações padrão otimizadas do Fuse
 */
export const optimizedSettings = {
	customScrollbars: true,
	direction: 'ltr' as const,
	layout: {},
	theme: {
		main: optimizedDefaultTheme,
		navbar: optimizedDefaultTheme,
		toolbar: optimizedDefaultTheme,
		footer: optimizedDefaultTheme
	}
};

/**
 * Função otimizada para obter configurações do query string
 */
export function getParsedQuerySettings(): FuseSettingsConfigType | object | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const parsedQueryString = qs.parse(window?.location?.search, { ignoreQueryPrefix: true });
	const { defaultSettings = {} } = parsedQueryString;

	if (typeof defaultSettings === 'string') {
		return JSON.parse(defaultSettings) as FuseSettingsConfigType;
	}

	return {};
}

// ========================================
// 🎨 TEMAS PADRÃO OTIMIZADOS
// ========================================

/**
 * Temas padrão otimizados da aplicação
 */
export const optimizedDefaultThemes = {
	default: {
		palette: {
			mode: 'light',
			primary: fuseDark,
			secondary: {
				light: '#E8E9EA',
				main: '#9E9E9E',
				dark: '#616161'
			},
			error: red
		},
		status: {
			danger: 'orange'
		}
	},
	defaultDark: {
		palette: {
			mode: 'dark',
			primary: fuseDark,
			secondary: {
				light: '#E8E9EA',
				main: '#9E9E9E',
				dark: '#616161'
			},
			error: red
		},
		status: {
			danger: 'orange'
		}
	}
};

/**
 * Função otimizada para estender tema com mixins
 */
export function extendThemeWithMixins(obj: ThemeOptions) {
	const theme = createTheme(obj);
	return {
		border: (width = 1) => ({
			borderWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderLeft: (width = 1) => ({
			borderLeftWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderRight: (width = 1) => ({
			borderRightWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderTop: (width = 1) => ({
			borderTopWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		}),
		borderBottom: (width = 1) => ({
			borderBottomWidth: width,
			borderStyle: 'solid',
			borderColor: theme.palette.divider
		})
	};
}

// ========================================
// 📤 EXPORTS PARA COMPATIBILIDADE
// ========================================

// Mantém compatibilidade com código existente
export const defaultSettings = optimizedSettings;
export const defaultThemeOptions = optimizedThemeOptions;
export { optimizedThemeOptions };
export const mustHaveThemeOptions = {
	typography: {
		fontSize: 13,
		body1: { fontSize: '0.8125rem' },
		body2: { fontSize: '0.8125rem' }
	}
};
export const defaultThemes = optimizedDefaultThemes;
