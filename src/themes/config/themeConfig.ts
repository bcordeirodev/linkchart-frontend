/**
 * Configuração centralizada de temas para Link Charts
 * Define paletas de cores, breakpoints e configurações padrão
 */

import { FuseThemesType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * Paletas de cores principais
 */
export const colorPalettes = {
	primary: {
		light: '#64b5f6',
		main: '#1976d2',
		dark: '#1565c0'
	},
	secondary: {
		light: '#f06292',
		main: '#dc004e',
		dark: '#c51162'
	},
	success: {
		light: '#81c784',
		main: '#4caf50',
		dark: '#388e3c'
	},
	warning: {
		light: '#ffb74d',
		main: '#ff9800',
		dark: '#f57c00'
	},
	error: {
		light: '#e57373',
		main: '#f44336',
		dark: '#d32f2f'
	},
	info: {
		light: '#64b5f6',
		main: '#2196f3',
		dark: '#1976d2'
	}
};

/**
 * Configurações de tema claro
 */
export const lightThemeConfig = {
	palette: {
		mode: 'light' as const,
		primary: colorPalettes.primary,
		secondary: colorPalettes.secondary,
		background: {
			default: '#f5f5f5',
			paper: '#ffffff'
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.6)'
		}
	}
};

/**
 * Configurações de tema escuro
 */
export const darkThemeConfig = {
	palette: {
		mode: 'dark' as const,
		primary: colorPalettes.primary,
		secondary: colorPalettes.secondary,
		background: {
			default: '#121212',
			paper: '#1e1e1e'
		},
		text: {
			primary: '#ffffff',
			secondary: 'rgba(255, 255, 255, 0.7)'
		}
	}
};

/**
 * Temas disponíveis para Link Charts
 */
export const linkChartsThemes: FuseThemesType = {
	default: lightThemeConfig,
	'default-dark': darkThemeConfig,
	blue: {
		...lightThemeConfig,
		palette: {
			...lightThemeConfig.palette,
			primary: { main: '#2196f3', light: '#64b5f6', dark: '#1976d2' }
		}
	},
	green: {
		...lightThemeConfig,
		palette: {
			...lightThemeConfig.palette,
			primary: { main: '#4caf50', light: '#81c784', dark: '#388e3c' }
		}
	},
	purple: {
		...lightThemeConfig,
		palette: {
			...lightThemeConfig.palette,
			primary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' }
		}
	}
};

/**
 * Breakpoints responsivos personalizados
 */
export const customBreakpoints = {
	xs: 0,
	sm: 600,
	md: 960,
	lg: 1280,
	xl: 1920
};

/**
 * Configurações de layout padrão
 */
export const defaultLayoutConfig = {
	mode: 'container',
	containerWidth: 1200,
	navbar: {
		display: true,
		style: 'style-1',
		folded: false,
		position: 'left'
	},
	toolbar: {
		display: true,
		style: 'fixed'
	},
	footer: {
		display: true,
		style: 'fixed'
	}
};

export default {
	colorPalettes,
	lightThemeConfig,
	darkThemeConfig,
	linkChartsThemes,
	customBreakpoints,
	defaultLayoutConfig
};
