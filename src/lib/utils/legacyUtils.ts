/**
 * 🔄 LEGACY UTILS - LINK CHART
 * Utilitários legados do FuseUtils para compatibilidade
 *
 * @description
 * Mantém compatibilidade com código existente que usa FuseUtils,
 * mas redireciona para os novos utilitários modulares.
 *
 * @deprecated Use os utilitários específicos em vez de FuseUtils
 * @since 2.0.0
 */

import _ from 'lodash';
import * as colors from '@mui/material/colors';
import { LayoutSettingsConfigType } from '@/shared/layout/core';
import { User } from '@/features/profile/types/user';
import { DeepPartial } from 'react-hook-form';
import { PartialDeep } from 'type-fest';

// Re-export types for compatibility
export type FuseRouteItemType = {
	path?: string;
	element?: React.ReactNode;
	auth?: string[] | [] | null;
	settings?: DeepPartial<LayoutSettingsConfigType>;
	children?: FuseRouteItemType[];
};

export type FuseRoutesType = FuseRouteItemType[];

export type FuseRouteConfigType = {
	routes: FuseRoutesType;
	settings?: PartialDeep<LayoutSettingsConfigType>;
	auth?: string[] | [];
};

export type FuseRouteConfigsType = FuseRouteConfigType[] | [];

type TreeNode = {
	id: string;
	children?: TreeNode[];
};

type hueTypes =
	| '50'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900'
	| 'A100'
	| 'A200'
	| 'A400'
	| 'A700';

type Color = {
	50?: string;
	100?: string;
	200?: string;
	300?: string;
	400?: string;
	500?: string;
	600?: string;
	700?: string;
	800?: string;
	900?: string;
	A100?: string;
	A200?: string;
	A400?: string;
	A700?: string;
	[key: string]: string | undefined;
};

/**
 * Classe de utilitários legados (compatibilidade)
 * @deprecated Use os utilitários específicos
 */
class FuseUtils {
	static filterArrayByString<T>(mainArr: T[], searchText: string): T[] {
		if (!searchText || searchText?.length === 0 || !searchText) {
			return mainArr;
		}

		searchText = searchText?.toLowerCase();
		const filtered = mainArr.filter((itemObj) => this.searchInObj(itemObj, searchText));

		if (filtered.length === mainArr.length) {
			return mainArr;
		}

		return filtered;
	}

	static filterArrayByString2<T>(mainArr: T[], searchText: string): T[] {
		if (typeof searchText !== 'string' || searchText === '') {
			return mainArr;
		}

		searchText = searchText?.toLowerCase();
		return mainArr.filter((itemObj: unknown) => this.searchInObj(itemObj, searchText));
	}

	static searchInObj(itemObj: unknown, searchText: string) {
		if (!isRecord(itemObj)) {
			return false;
		}

		const propArray = Object.keys(itemObj);

		function isRecord(value: unknown): value is Record<string, unknown> {
			return Boolean(value && typeof value === 'object' && !Array.isArray(value) && typeof value !== 'function');
		}

		for (const prop of propArray) {
			const value = itemObj[prop];

			if (typeof value === 'string') {
				if (this.searchInString(value, searchText)) {
					return true;
				}
			} else if (Array.isArray(value)) {
				if (this.searchInArray(value, searchText)) {
					return true;
				}
			}

			if (typeof value === 'object') {
				if (this.searchInObj(value, searchText)) {
					return true;
				}
			}
		}
		return false;
	}

	static searchInArray(arr: unknown[], searchText: string) {
		arr.forEach((value) => {
			if (typeof value === 'string') {
				if (this.searchInString(value, searchText)) {
					return true;
				}
			}

			if (value && typeof value === 'object') {
				if (this.searchInObj(value, searchText)) {
					return true;
				}
			}

			return false;
		});
		return false;
	}

	static searchInString(value: string, searchText: string) {
		return value.toLowerCase().includes(searchText);
	}

	static generateGUID(): string {
		function S4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return S4() + S4();
	}

	static toggleInArray(item: unknown, array: unknown[]) {
		if (array.indexOf(item) === -1) {
			array.push(item);
		} else {
			array.splice(array.indexOf(item), 1);
		}
	}

	static handleize(text: string) {
		return text
			.toString()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/\W+/g, '')
			.replace(/--+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');
	}

	static setRoutes(
		config: FuseRouteConfigType,
		defaultAuth: LayoutSettingsConfigType['defaultAuth'] = undefined
	): FuseRouteItemType[] {
		let routes: FuseRouteItemType[] = [];

		if (config?.routes) {
			routes = [...config.routes];
		}

		const applyAuth = (route: FuseRouteItemType, parentAuth: string[] | null) => {
			const auth = route.auth || route.auth === null ? route.auth : parentAuth;
			const settings = _.merge({}, config.settings, route.settings);

			const newRoute = {
				...route,
				settings,
				auth
			};

			if (route.children) {
				newRoute.children = route.children.map((childRoute) => applyAuth(childRoute, auth));
			}

			return newRoute;
		};

		routes = routes.map((route) => {
			const auth = config.auth || config.auth === null ? config.auth : defaultAuth || null;
			return applyAuth(route, auth);
		}) as FuseRouteItemType[];

		return [...routes];
	}

	static generateRoutesFromConfigs(
		configs: FuseRouteConfigsType,
		defaultAuth: LayoutSettingsConfigType['defaultAuth']
	) {
		let allRoutes: FuseRouteItemType[] = [];
		configs.forEach((config: FuseRouteConfigType) => {
			allRoutes = [...allRoutes, ...this.setRoutes(config, defaultAuth)];
		});
		return allRoutes;
	}

	static findById(tree: TreeNode[], idToFind: string): TreeNode | undefined {
		const node = _.find(tree, { id: idToFind });

		if (node) {
			return node;
		}

		let foundNode: TreeNode | undefined;

		_.some(tree, (item) => {
			if (item.children) {
				foundNode = this.findById(item.children, idToFind);
				return foundNode;
			}

			return false;
		});

		return foundNode;
	}

	static randomMatColor(hue: hueTypes = '400') {
		const mainColors = [
			'red',
			'pink',
			'purple',
			'deepPurple',
			'indigo',
			'blue',
			'lightBlue',
			'cyan',
			'teal',
			'green',
			'lightGreen',
			'lime',
			'yellow',
			'amber',
			'orange',
			'deepOrange'
		];

		const randomColor = mainColors[Math.floor(Math.random() * mainColors.length)];
		return (colors as Record<string, Color>)[randomColor][hue];
	}

	static difference(object: Record<string, unknown>, base: Record<string, unknown>): Record<string, unknown> {
		function changes(_object: Record<string, unknown>, _base: Record<string, unknown>): Record<string, unknown> {
			return _.transform(
				_object,
				(result: Record<string, unknown>, value: unknown, key: string) => {
					if (!_.isEqual(value, _base[key])) {
						result[key] =
							_.isObject(value) && _.isObject(_base[key])
								? changes(value as Record<string, unknown>, _base[key] as Record<string, unknown>)
								: value;
					}
				},
				{}
			);
		}

		return changes(object, base);
	}

	static hasPermission(authArr: string[] | string | null | undefined, userRole: User['role']): boolean {
		if (authArr === null || authArr === undefined) {
			return true;
		}

		if (Array.isArray(authArr) && authArr?.length === 0) {
			return !userRole || userRole.length === 0;
		}

		if (userRole && Array.isArray(authArr) && Array.isArray(userRole)) {
			return authArr.some((r: string) => userRole.indexOf(r) >= 0);
		}

		if (typeof userRole === 'string' && Array.isArray(authArr)) {
			return authArr?.includes?.(userRole);
		}

		return false;
	}

	static filterRecursive(data: [] | null, predicate: (arg0: unknown) => boolean) {
		return !data
			? null
			: data.reduce((list: unknown[], entry: { children?: [] }) => {
					let clone: unknown = null;

					if (predicate(entry)) {
						clone = { ...entry };
					}

					if (entry.children != null) {
						const children = this.filterRecursive(entry.children, predicate);

						if (children && children?.length > 0) {
							clone = { ...entry, children };
						}
					}

					if (clone) {
						list.push(clone);
					}

					return list;
				}, []);
	}
}

export default FuseUtils;
