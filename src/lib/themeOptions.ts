/**
 * 🎨 OPÇÕES DE TEMA ORGANIZADAS - LINK CHART
 * Configurações pré-definidas de temas para diferentes seções da aplicação
 *
 * @description
 * Este arquivo define as combinações de temas para diferentes seções da interface:
 * - main: Área principal da aplicação
 * - navbar: Barra de navegação superior
 * - toolbar: Barra de ferramentas
 * - footer: Rodapé da aplicação
 *
 * @example
 * ```typescript
 * import themeOptions from '@/lib/themeOptions';
 *
 * // Obter opções de tema
 * const availableThemes = themeOptions;
 *
 * // Aplicar tema específico
 * const skyBlueTheme = themeOptions.find(t => t.id === 'Sky Blue');
 * ```
 *
 * @see {@link ./theme/themes.ts} - Definições completas dos temas
 * @since 1.0.0
 */

import { themesConfig } from './theme';

/**
 * Tipo para opções de tema
 * @interface ThemeOption
 */
export interface ThemeOption {
	/** Identificador único do tema */
	id: string;
	/** Configurações de tema por seção */
	section: {
		/** Tema da área principal */
		main: typeof themesConfig.default;
		/** Tema da navbar */
		navbar: typeof themesConfig.default;
		/** Tema da toolbar */
		toolbar: typeof themesConfig.default;
		/** Tema do footer */
		footer: typeof themesConfig.default;
	};
}

/**
 * Opções de tema pré-configuradas
 * @constant {ThemeOption[]}
 */
const themeOptions: ThemeOption[] = [
	{
		id: 'Default',
		section: {
			main: themesConfig.default,
			navbar: themesConfig.defaultDark,
			toolbar: themesConfig.default,
			footer: themesConfig.defaultDark
		}
	},
	{
		id: 'Default Dark',
		section: {
			main: themesConfig.defaultDark,
			navbar: themesConfig.defaultDark,
			toolbar: themesConfig.defaultDark,
			footer: themesConfig.defaultDark
		}
	},
	{
		id: 'Sky Blue',
		section: {
			main: themesConfig.skyBlue,
			navbar: themesConfig.skyBlueDark,
			toolbar: themesConfig.skyBlue,
			footer: themesConfig.skyBlueDark
		}
	},
	{
		id: 'Sky Blue Dark',
		section: {
			main: themesConfig.skyBlueDark,
			navbar: themesConfig.skyBlueDark,
			toolbar: themesConfig.skyBlueDark,
			footer: themesConfig.skyBlueDark
		}
	}
];

/**
 * Lista de IDs de temas disponíveis
 * @constant {string[]}
 */
export const availableThemeIds = themeOptions.map((option) => option.id);

/**
 * Obtém opção de tema por ID
 * @param {string} themeId - ID do tema
 * @returns {ThemeOption | undefined} Opção de tema encontrada
 */
export const getThemeOption = (themeId: string): ThemeOption | undefined => {
	return themeOptions.find((option) => option.id === themeId);
};

/**
 * Verifica se um tema é escuro
 * @param {string} themeId - ID do tema
 * @returns {boolean} True se o tema for escuro
 */
export const isDarkTheme = (themeId: string): boolean => {
	return themeId.toLowerCase().includes('dark');
};

export default themeOptions;
