'use client';
import useFuseSettings from '@fuse/core/FuseSettings/hooks/useFuseSettings';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import i18n from './i18n';
import I18nContext, { I18nContextType, LanguageType } from './I18nContext';

type I18nProviderProps = {
	children: React.ReactNode;
};

const languages: LanguageType[] = [
	{ id: 'en', title: 'English', flag: 'US' },
	{ id: 'tr', title: 'Turkish', flag: 'TR' },
	{ id: 'ar', title: 'Arabic', flag: 'SA' }
];

export function I18nProvider(props: I18nProviderProps) {
	const { children } = props;
	const { data: settings, setSettings } = useFuseSettings();
	const settingsThemeDirection = useMemo(() => settings.direction, [settings]);
	const [languageId, setLanguageId] = useState(i18n.options.lng);

	const changeLanguage = async (languageId: string) => {
		setLanguageId(languageId);
		await i18n.changeLanguage(languageId);
	};

	useEffect(() => {
		if (languageId !== i18n.options.lng) {
			i18n.changeLanguage(languageId);
		}

		const langDirection = i18n.dir(languageId);

		if (settingsThemeDirection !== langDirection) {
			setSettings({ direction: langDirection });
		}
	}, [languageId, setSettings, settingsThemeDirection]);

	const contextValue = useMemo(
		() => ({
			language: _.find(languages, { id: languageId }),
			languageId,
			langDirection: i18n.dir(languageId),
			languages,
			changeLanguage
		}),
		[languageId]
	);

	return <I18nContext.Provider value={contextValue as I18nContextType}>{children}</I18nContext.Provider>;
}
