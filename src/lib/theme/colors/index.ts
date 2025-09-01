/**
 * 🎨 CORES CENTRALIZADAS - LINK CHART
 * Todas as paletas de cores em um local centralizado
 */

export { default as fuseDark } from './fuseDark';
export { default as skyBlue } from './skyBlue';

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

// Cores brand padronizadas
export const brandColors = {
    primary: {
        light: '#64B5F6',
        main: '#0A74DA',
        dark: '#0D47A1',
        contrastText: '#FFFFFF'
    },
    secondary: {
        light: '#81D4FA',
        main: '#00A4EF',
        dark: '#0288D1',
        contrastText: '#FFFFFF'
    },
    error: {
        light: '#E57373',
        main: '#F44336',
        dark: '#D32F2F',
        contrastText: '#FFFFFF'
    },
    success: {
        light: '#81C784',
        main: '#4CAF50',
        dark: '#388E3C',
        contrastText: '#FFFFFF'
    },
    warning: {
        light: '#FFB74D',
        main: '#FF9800',
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
