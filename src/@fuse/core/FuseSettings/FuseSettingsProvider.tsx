'use client';

import settingsConfig from '@/configs/settingsConfig';
import { themeLayouts, themeLayoutConfigs } from '@/themes';
import useUser from '@auth/useUser';
import { FuseSettingsConfigType, FuseThemesType } from '@fuse/core/FuseSettings/FuseSettings';
import { defaultSettings, getParsedQuerySettings } from '@fuse/default-settings/FuseDefaultSettings';
import _ from 'lodash';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';
import FuseSettingsContext from './FuseSettingsContext';

// Get initial settings
const getInitialSettings = (): FuseSettingsConfigType => {
	const defaultLayoutStyle = settingsConfig.layout?.style || 'layout1';
	const layout = {
		style: defaultLayoutStyle,
		config: themeLayoutConfigs[defaultLayoutStyle as keyof typeof themeLayoutConfigs]?.defaults
	};
	return _.merge({}, defaultSettings, { layout }, settingsConfig, getParsedQuerySettings());
};

const initialSettings = getInitialSettings();

const generateSettings = (
	_defaultSettings: FuseSettingsConfigType,
	_newSettings: PartialDeep<FuseSettingsConfigType>
) => {
	const layoutStyle = _newSettings?.layout?.style;

	if (!layoutStyle) return _defaultSettings;

	return _.merge(
		{},
		_defaultSettings,
		{ layout: { config: themeLayoutConfigs[layoutStyle as keyof typeof themeLayoutConfigs]?.defaults } },
		_newSettings
	);
};

// FuseSettingsProvider component
export function FuseSettingsProvider({ children }: { children: ReactNode }) {
	const { data: user, isGuest } = useUser();

	const userSettings = useMemo(() => user?.settings || {}, [user]);

	const calculateSettings = useCallback(() => {
		const defaultSettings = _.merge({}, initialSettings);
		return isGuest ? defaultSettings : _.merge({}, defaultSettings, userSettings);
	}, [isGuest, userSettings]);

	const [data, setData] = useState<FuseSettingsConfigType>(calculateSettings());

	// Sync data with userSettings when isGuest or userSettings change
	useEffect(() => {
		const newSettings = calculateSettings();

		// Only update if settings are different
		if (!_.isEqual(data, newSettings)) {
			setData(newSettings);
		}
	}, [calculateSettings]);

	const setSettings = (newSettings: Partial<FuseSettingsConfigType>) => {
		const _settings = generateSettings(data, newSettings);

		if (!_.isEqual(_settings, data)) {
			setData(_.merge({}, _settings));
		}

		return _settings;
	};

	const changeTheme = useCallback(
		(newTheme: FuseThemesType) => {
			const { navbar, footer, toolbar, main } = newTheme;

			const newSettings: FuseSettingsConfigType = {
				...data,
				theme: {
					main,
					navbar,
					toolbar,
					footer
				}
			};

			setSettings(newSettings);
		},
		[data, setSettings]
	);

	const contextValue = useMemo(
		() => ({
			data,
			setSettings,
			changeTheme
		}),
		[data, setSettings, changeTheme]
	);

	return <FuseSettingsContext.Provider value={contextValue}>{children}</FuseSettingsContext.Provider>;
}

export default FuseSettingsProvider;
