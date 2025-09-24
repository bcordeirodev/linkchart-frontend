/**
 * Utilitários de cores para gráficos
 */

import { chartColors } from '../colors/chartColors';

import { createComponentColorSet } from './colorUtils';

import type { Theme } from '@mui/material/styles';

export function getStandardChartColors(theme: Theme) {
	return {
		primary: createComponentColorSet(theme, 'primary'),
		secondary: createComponentColorSet(theme, 'secondary'),
		success: createComponentColorSet(theme, 'success'),
		warning: createComponentColorSet(theme, 'warning'),
		error: createComponentColorSet(theme, 'error'),
		info: createComponentColorSet(theme, 'info')
	};
}

export function getChartColorsByType(type: 'temporal'): {
	hourly: string;
	daily: string;
	weekly: string;
};
export function getChartColorsByType(type: 'geographic'): {
	countries: string;
	states: string;
	cities: string;
};
export function getChartColorsByType(type: 'audience'): {
	primary: string;
	secondary: string;
	accent: string;
};
export function getChartColorsByType(type: 'device'): {
	mobile: string;
	desktop: string;
	tablet: string;
};
export function getChartColorsByType(type: 'temporal' | 'geographic' | 'audience' | 'device') {
	const colorMap = {
		temporal: {
			hourly: chartColors.temporal.hourly,
			daily: chartColors.temporal.daily,
			weekly: chartColors.temporal.weekly
		},
		geographic: {
			countries: chartColors.geographic.countries,
			states: chartColors.geographic.states,
			cities: chartColors.geographic.cities
		},
		audience: {
			primary: chartColors.primary,
			secondary: chartColors.secondary,
			accent: chartColors.warning
		},
		device: {
			mobile: chartColors.devices.mobile,
			desktop: chartColors.devices.desktop,
			tablet: chartColors.devices.tablet
		}
	};

	return colorMap[type];
}

/**
 * Função simplificada para obter cor por contexto
 */
export function getContextColor(context: string): string {
	const contextMap: Record<string, string> = {
		// Temporal
		hour: chartColors.temporal.hourly,
		day: chartColors.temporal.daily,
		week: chartColors.temporal.weekly,

		// Geographic
		country: chartColors.geographic.countries,
		state: chartColors.geographic.states,
		city: chartColors.geographic.cities,

		// Devices
		mobile: chartColors.devices.mobile,
		desktop: chartColors.devices.desktop,
		tablet: chartColors.devices.tablet,

		// Default
		default: chartColors.primary
	};

	return contextMap[context.toLowerCase()] || chartColors.primary;
}

/**
 * Função para gerar paleta de cores para gráficos múltiplos
 */
export function getMultiSeriesColors(count: number): string[] {
	const colors: string[] = [];
	for (let i = 0; i < count; i++) {
		colors.push(chartColors.extended[i % chartColors.extended.length]);
	}
	return colors;
}

export default {
	getStandardChartColors,
	getChartColorsByType,
	getContextColor,
	getMultiSeriesColors
};
