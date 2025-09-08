import { LayoutSettingsConfigType } from '@/shared/layout/core';
import i18n from './i18n/i18n';

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
	direction: i18n.dir(i18n.options.lng) || 'ltr',

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