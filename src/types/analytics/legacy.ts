/**
 * @fileoverview Tipos legados de Analytics para compatibilidade
 * @author Link Chart Team
 * @version 1.0.0
 * @deprecated Estes tipos são mantidos apenas para compatibilidade com código legado
 */

/**
 * Dados de cliques agrupados por dia
 * @deprecated Use DailyData from '@/types/analytics/temporal' instead
 * @example
 * ```typescript
 * // Legado
 * const clicks: ClicksByDay = { day: '2024-01-15', total: 150 };
 *
 * // Novo
 * const clicks: DailyData = {
 *   date: '2024-01-15',
 *   clicks: 150,
 *   day_of_week: 1,
 *   day_name: 'Monday'
 * };
 * ```
 */
export interface ClicksByDay extends Record<string, unknown> {
	/** Data no formato YYYY-MM-DD */
	day: string;
	/** Total de cliques no dia */
	total: number;
}

/**
 * Dados de cliques agrupados por país
 * @deprecated Use CountryData from '@/types/core/api' instead
 * @example
 * ```typescript
 * // Legado
 * const clicks: ClicksByCountry = { country: 'Brazil', total: 500 };
 *
 * // Novo
 * const clicks: CountryData = {
 *   country: 'Brazil',
 *   iso_code: 'BR',
 *   clicks: 500,
 *   percentage: 25.5,
 *   currency: 'BRL'
 * };
 * ```
 */
export interface ClicksByCountry extends Record<string, unknown> {
	/** Nome do país */
	country: string;
	/** Total de cliques do país */
	total: number;
}

/**
 * Dados de cliques agrupados por cidade
 * @deprecated Use CityData from '@/types/core/api' instead
 */
export interface ClicksByCity extends Record<string, unknown> {
	/** Nome da cidade */
	city: string;
	/** Total de cliques da cidade */
	total: number;
}

/**
 * Dados de cliques agrupados por dispositivo
 * @deprecated Use DeviceData from '@/types/core/api' instead
 * @example
 * ```typescript
 * // Legado
 * const clicks: ClicksByDevice = { device: 'Mobile', total: 300 };
 *
 * // Novo
 * const clicks: DeviceData = {
 *   device: 'Mobile',
 *   clicks: 300,
 *   percentage: 60.0
 * };
 * ```
 */
export interface ClicksByDevice extends Record<string, unknown> {
	/** Nome do dispositivo (Desktop, Mobile, Tablet) */
	device: string;
	/** Total de cliques do dispositivo */
	total: number;
}

/**
 * Dados de cliques agrupados por User Agent
 * @deprecated Use BrowserData from '@/types/analytics/audience' instead
 */
export interface ClicksByUserAgent extends Record<string, unknown> {
	/** String do User Agent */
	user_agent: string;
	/** Total de cliques deste User Agent */
	total: number;
}

/**
 * Dados de cliques agrupados por referrer
 * @deprecated Use ReferrerData from '@/types/analytics/audience' instead
 * @example
 * ```typescript
 * // Legado
 * const clicks: ClicksByReferer = { referer: 'google.com', total: 200 };
 *
 * // Novo
 * const clicks: ReferrerData = {
 *   referrer: 'google.com',
 *   clicks: 200,
 *   category: 'search',
 *   percentage: 40.0
 * };
 * ```
 */
export interface ClicksByReferer extends Record<string, unknown> {
	/** URL ou domínio do referrer */
	referer: string;
	/** Total de cliques deste referrer */
	total: number;
}

/**
 * Dados de cliques agrupados por campanha UTM
 * @deprecated Será substituído por UTMData em versão futura
 */
export interface ClicksByCampaign extends Record<string, unknown> {
	/** Nome da campanha UTM */
	utm_campaign: string;
	/** Total de cliques da campanha */
	total: number;
}

/**
 * Dados de cliques agrupados por link e dia
 * @deprecated Use estrutura normalizada com LinkStats e DailyData
 */
export interface ClicksGroupedByLinkAndDay extends Record<string, unknown> {
	/** ID do link */
	link_id: number;
	/** Data no formato YYYY-MM-DD */
	day: string;
	/** Total de cliques do link no dia */
	total: number;
}

/**
 * Dados de top links por performance
 * @deprecated Use LinkStats from '@/types/core/links' instead
 * @example
 * ```typescript
 * // Legado
 * const topLink: TopLink = {
 *   original_url: 'https://example.com',
 *   clicks_count: 1000
 * };
 *
 * // Novo
 * const linkStats: LinkStats = {
 *   link_id: '123',
 *   total_clicks: 1000,
 *   unique_clicks: 800,
 *   clicks_today: 50,
 *   clicks_this_week: 200,
 *   clicks_this_month: 600,
 *   last_click_at: '2024-01-15T10:30:00Z'
 * };
 * ```
 */
export interface TopLink extends Record<string, unknown> {
	/** URL original do link */
	original_url: string;
	/** Número total de cliques */
	clicks_count: number;
}

/**
 * Dados de links criados agrupados por dia
 * @deprecated Use estrutura normalizada com DailyData
 */
export interface LinksCreatedByDay extends Record<string, unknown> {
	/** Data no formato YYYY-MM-DD */
	day: string;
	/** Total de links criados no dia */
	total: number;
}

/**
 * Mapeamento de tipos legados para novos tipos
 * @deprecated Guia de migração - remover após migração completa
 */
export type LegacyTypeMigrationMap = {
	ClicksByDay: 'DailyData from @/types/analytics/temporal';
	ClicksByCountry: 'CountryData from @/types/core/api';
	ClicksByCity: 'CityData from @/types/core/api';
	ClicksByDevice: 'DeviceData from @/types/core/api';
	ClicksByUserAgent: 'BrowserData from @/types/analytics/audience';
	ClicksByReferer: 'ReferrerData from @/types/analytics/audience';
	TopLink: 'LinkStats from @/types/core/links';
};

/**
 * Utilitário para converter tipos legados
 * @deprecated Usar apenas durante período de migração
 */
export namespace LegacyConverters {
	/**
	 * Converte ClicksByDay para DailyData
	 */
	export function clicksByDayToDailyData(legacy: ClicksByDay): {
		date: string;
		clicks: number;
		day_of_week: number;
		day_name: string;
	} {
		const date = new Date(legacy.day);
		const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		return {
			date: legacy.day,
			clicks: legacy.total,
			day_of_week: date.getDay(),
			day_name: dayNames[date.getDay()]
		};
	}

	/**
	 * Converte ClicksByDevice para DeviceData
	 */
	export function clicksByDeviceToDeviceData(
		legacy: ClicksByDevice,
		totalClicks: number
	): {
		device: string;
		clicks: number;
		percentage: number;
	} {
		return {
			device: legacy.device,
			clicks: legacy.total,
			percentage: (legacy.total / totalClicks) * 100
		};
	}
}
