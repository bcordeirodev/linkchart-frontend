/**
 * 🎣 HOOKS DE TEMA CENTRALIZADOS - LINK CHART
 * Hooks essenciais de tema simplificados
 */

import { FuseThemeType } from '../types/theme';
import { createTheme, Theme } from '@mui/material/styles';
import _ from 'lodash';
import { defaultThemeOptions, extendThemeWithMixins, mustHaveThemeOptions } from '../config/optimizedSettings';
import { ThemeOptions } from '@mui/material/styles/createTheme';
import { useLayoutSettings } from '@/shared/layout/core';
import { allThemes } from '../themes';

type Direction = 'ltr' | 'rtl';

// ========================================
// 🔧 RESOLUÇÃO DE TEMAS
// ========================================

/**
 * Resolve uma string de tema para o objeto FuseThemeType correspondente
 */
const resolveTheme = (themeKey: string | FuseThemeType): FuseThemeType => {
	if (typeof themeKey === 'object') {
		return themeKey;
	}

	const theme = allThemes[themeKey as keyof typeof allThemes];

	if (!theme) {
		console.warn(`Tema '${themeKey}' não encontrado, usando tema padrão`);
		return allThemes.default;
	}

	return theme;
};

// ========================================
// 🎨 GERAÇÃO DE TEMA MUI
// ========================================

/**
 * Função para gerar tema MUI a partir do tema Fuse
 */
const generateMuiTheme = (theme: FuseThemeType, direction: Direction): Theme => {
	const mergedTheme = _.merge({}, defaultThemeOptions, theme, mustHaveThemeOptions) as ThemeOptions;
	const themeOptions = {
		...mergedTheme,
		mixins: extendThemeWithMixins(mergedTheme),
		direction
	} as ThemeOptions;
	return createTheme(themeOptions);
};

// ========================================
// 🎣 HOOKS DE TEMA ESSENCIAIS
// ========================================

/**
 * Hook para tema principal - ÚNICO HOOK USADO NA APLICAÇÃO
 */
export const useMainTheme = (): Theme => {
	const { data: current } = useLayoutSettings();
	const resolvedTheme = resolveTheme(current.theme.main);
	return generateMuiTheme(resolvedTheme, current.direction);
};
