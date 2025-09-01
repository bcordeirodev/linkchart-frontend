import { LayoutSettingsConfigType } from '@/shared/layout/core';
import i18n from './i18n/i18n';

/**
 * The settingsConfig object is a configuration object for the Fuse application's settings.
 */
const settingsConfig: LayoutSettingsConfigType = {
	/**
	 * The layout object defines the layout style and configuration for the application.
	 */
	layout: {
		/**
		 * The style property defines the layout style for the application.
		 */
		style: 'layout1', // layout1 layout2 layout3
		/**
		 * The config property defines the layout configuration for the application.
		 * Check out default layout configs at src/components/theme-layouts for example src/components/theme-layouts/layout1/Layout1Config.js
		 */
		config: {
			navbar: {
				display: true,
				folded: false,
				position: 'left',
				style: 'style-2'
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
	 * The customScrollbars property defines whether or not to use custom scrollbars in the application.
	 */
	customScrollbars: false,

	/**
	 * The direction property defines the text direction for the application.
	 */
	direction: i18n.dir(i18n.options.lng) || 'ltr', // rtl, ltr
	/**
	 * The theme object defines the color theme for the application.
	 */
	theme: {
		main: 'defaultDark',
		navbar: 'defaultDark',
		toolbar: 'defaultDark',
		footer: 'defaultDark'
	},

	/**
	 * The defaultAuth property defines the default authorization roles for the application.
	 * To make the whole app auth protected by default set defaultAuth:['admin','staff','user']
	 * To make the whole app accessible without authorization by default set defaultAuth: null
	 * The individual route configs which have auth option won't be overridden.
	 */
	defaultAuth: ['admin'],

	/**
	 * The loginRedirectUrl property defines the default redirect URL for the logged-in user.
	 */
	loginRedirectUrl: '/link'
};

export default settingsConfig;
