import type { LayoutSettingsConfigType } from '@/shared/layout/core';

/**
 * Configurações simplificadas da aplicação Link Chart
 */
const settingsConfig: LayoutSettingsConfigType = {
	/**
	 * Configuração de layout - apenas layout1
	 */
	layout: {
		style: 'layout1',
		config: {
			navbar: {
				display: true,
				folded: false,
				position: 'left'
			},
			toolbar: {
				display: true,
				style: 'static'
			},
			footer: {
				display: true,
				style: 'static'
			}
		}
	},

	/**
	 * Direção do texto
	 */
	direction: 'ltr',

	/**
	 * Configuração de tema
	 */
	theme: {
		main: 'defaultDark',
		navbar: 'defaultDark',
		toolbar: 'defaultDark',
		footer: 'defaultDark'
	},

	/**
	 * Autorização padrão
	 */
	defaultAuth: ['admin'],

	/**
	 * URL de redirecionamento após login
	 */
	loginRedirectUrl: '/link'
};

export default settingsConfig;
