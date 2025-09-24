/**
 * 🎨 CORES CENTRALIZADAS - LINK CHART
 * Todas as paletas de cores em um local centralizado
 */

export { default as fuseDark } from './fuseDark';
export { default as skyBlue } from './skyBlue';
export { default as chartColors, getChartColor, getGradientColors } from './chartColors';

// Cores de texto padronizadas
export const lightPaletteText = {
	primary: 'rgb(33, 33, 33)',
	secondary: 'rgb(95, 99, 104)',
	disabled: 'rgb(149, 156, 169)'
};

export const darkPaletteText = {
	primary: 'rgb(255, 255, 255)',
	secondary: 'rgb(179, 179, 179)',
	disabled: 'rgb(156, 163, 175)'
};

// Cores brand padronizadas - Atualizadas para consistência com gráficos
export const brandColors = {
	primary: {
		light: '#64B5F6',
		main: '#1976d2', // Azul principal dos gráficos
		dark: '#0D47A1',
		contrastText: '#FFFFFF'
	},
	secondary: {
		light: '#E8E9EA', // Cinza claro metálico
		main: '#9E9E9E', // Cinza metálico principal
		dark: '#616161', // Cinza metálico escuro
		contrastText: '#FFFFFF'
	},
	error: {
		light: '#E57373',
		main: '#d32f2f', // Vermelho dos gráficos
		dark: '#B71C1C',
		contrastText: '#FFFFFF'
	},
	success: {
		light: '#81C784',
		main: '#2e7d32', // Verde dos gráficos
		dark: '#1B5E20',
		contrastText: '#FFFFFF'
	},
	warning: {
		light: '#FFB74D',
		main: '#ff9800', // Laranja dos gráficos
		dark: '#F57C00',
		contrastText: '#000000'
	},
	info: {
		light: '#64B5F6',
		main: '#2196F3',
		dark: '#1976D2',
		contrastText: '#FFFFFF'
	}
};
