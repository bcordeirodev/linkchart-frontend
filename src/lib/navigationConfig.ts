import i18n from './i18n/i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * Configuração de navegação simplificada
 * Itens principais do sistema unificado
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'analytics-component',
		title: 'Analytics',
		type: 'item',
		url: '/analytics',
		icon: 'heroicons-outline:chart-bar'
	},
	{
		id: 'links-component',
		title: 'Gerenciar Links',
		type: 'item',
		url: '/link',
		icon: 'heroicons-outline:link'
	},
	{
		id: 'profile-component',
		title: 'Perfil',
		type: 'item',
		url: '/profile',
		icon: 'heroicons-outline:user-circle'
	}
];

export default navigationConfig;
