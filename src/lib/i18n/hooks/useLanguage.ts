'use client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'en' | 'pt-BR';

export interface UseLanguageReturn {
	currentLanguage: SupportedLanguage;
	switchLanguage: (lang: SupportedLanguage) => void;
	isEnglish: boolean;
	isPortuguese: boolean;
}

export function useLanguage(): UseLanguageReturn {
	const { i18n } = useTranslation();
	const currentLanguage = (i18n.language as SupportedLanguage) ?? 'en';

	const switchLanguage = useCallback(
		(lang: SupportedLanguage) => {
			void i18n.changeLanguage(lang);
		},
		[i18n]
	);

	return {
		currentLanguage,
		switchLanguage,
		isEnglish: currentLanguage === 'en',
		isPortuguese: currentLanguage === 'pt-BR'
	};
}
