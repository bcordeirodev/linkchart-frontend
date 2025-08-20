/**
 * Configuração simplificada de temas para Link Charts
 * Remove complexidade desnecessária do FuseSettings
 */

/**
 * Configuração de layout simplificada
 * Remove todas as opções desnecessárias mantendo apenas o essencial
 */
export const simpleLayoutConfig = {
	// Layout sempre fixo como 'container'
	mode: 'container',
	containerWidth: 1200,

	// Navbar sempre visível no desktop
	navbar: {
		display: true,
		position: 'left' // Sempre à esquerda
	},

	// Toolbar sempre visível
	toolbar: {
		display: true
	},

	// Footer sempre visível
	footer: {
		display: true
	}
};

/**
 * Configurações de tema simplificadas
 * Remove opções complexas mantendo apenas claro/escuro
 */
export const simpleThemeOptions = {
	light: {
		id: 'light',
		name: 'Tema Claro',
		palette: {
			mode: 'light' as const,
			primary: { main: '#1976d2' },
			secondary: { main: '#dc004e' },
			background: {
				default: '#f5f5f5',
				paper: '#ffffff'
			}
		}
	},
	dark: {
		id: 'dark',
		name: 'Tema Escuro',
		palette: {
			mode: 'dark' as const,
			primary: { main: '#90caf9' },
			secondary: { main: '#f48fb1' },
			background: {
				default: '#121212',
				paper: '#1e1e1e'
			}
		}
	}
};

/**
 * Configuração padrão simplificada
 */
export const defaultSimpleConfig = {
	layout: simpleLayoutConfig,
	theme: simpleThemeOptions.light,
	direction: 'ltr' as const,
	customScrollbars: false
};

export default {
	simpleLayoutConfig,
	simpleThemeOptions,
	defaultSimpleConfig
};
