/**
 * 🔍 DATA VALIDATION - Utilitários de Validação de Dados
 *
 * @description
 * Funções utilitárias para validar disponibilidade e qualidade de dados
 * de analytics, evitando duplicação de lógica nos componentes.
 */

import type { AnalyticsData } from '@/types';

/**
 * Verifica disponibilidade de dados temporais
 */
export function hasTemporalData(data: Partial<AnalyticsData> | null): boolean {
	if (!data?.temporal) {
		return false;
	}

	const hasHourlyData =
		data.temporal.clicks_by_hour?.length > 0 && data.temporal.clicks_by_hour.some((h) => h.clicks > 0);

	const hasDayData =
		data.temporal.clicks_by_day_of_week?.length > 0 &&
		data.temporal.clicks_by_day_of_week.some((d) => d.clicks > 0);

	return hasHourlyData || hasDayData;
}

/**
 * Verifica disponibilidade de dados geográficos
 */
export function hasGeographicData(data: Partial<AnalyticsData> | null): boolean {
	if (!data?.geographic) {
		return false;
	}

	const hasCountryData =
		data.geographic.top_countries?.length > 0 && data.geographic.top_countries.some((c) => c.clicks > 0);

	const hasCityData = data.geographic.top_cities?.length > 0 && data.geographic.top_cities.some((c) => c.clicks > 0);

	return hasCountryData || hasCityData;
}

/**
 * Verifica disponibilidade de dados de dispositivos
 */
export function hasDeviceData(data: Partial<AnalyticsData> | null): boolean {
	if (!data?.audience?.device_breakdown) {
		return false;
	}

	return data.audience.device_breakdown.length > 0 && data.audience.device_breakdown.some((d) => d.clicks > 0);
}

/**
 * Verifica disponibilidade geral de dados
 */
export interface DataAvailability {
	hasTemporalData: boolean;
	hasGeographicData: boolean;
	hasDeviceData: boolean;
	hasAnyData: boolean;
}

export function checkDataAvailability(data: Partial<AnalyticsData> | null): DataAvailability {
	const temporal = hasTemporalData(data);
	const geographic = hasGeographicData(data);
	const device = hasDeviceData(data);

	return {
		hasTemporalData: temporal,
		hasGeographicData: geographic,
		hasDeviceData: device,
		hasAnyData: temporal || geographic || device
	};
}

/**
 * Verifica se os dados têm qualidade suficiente para exibição
 */
export function validateDataQuality(data: Partial<AnalyticsData> | null): {
	isValid: boolean;
	quality: 'excellent' | 'good' | 'fair' | 'poor';
	warnings: string[];
} {
	const warnings: string[] = [];

	if (!data) {
		return { isValid: false, quality: 'poor', warnings: ['Nenhum dado disponível'] };
	}

	const availability = checkDataAvailability(data);

	if (!availability.hasAnyData) {
		warnings.push('Nenhum dado disponível para exibição');
		return { isValid: false, quality: 'poor', warnings };
	}

	const totalClicks = data.overview?.total_clicks || 0;

	let quality: 'excellent' | 'good' | 'fair' | 'poor';

	if (totalClicks > 100) {
		quality = 'excellent';
	} else if (totalClicks > 10) {
		quality = 'good';
	} else if (totalClicks > 0) {
		quality = 'fair';
		warnings.push('Poucos dados para análise detalhada');
	} else {
		quality = 'poor';
		warnings.push('Dados insuficientes');
	}

	return { isValid: availability.hasAnyData, quality, warnings };
}
