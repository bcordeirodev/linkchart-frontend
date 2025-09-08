/**
 * @fileoverview Tipos base da API compartilhados
 * @author Link Chart Team
 * @version 1.0.0
 */

import type { ID, ISODateString, Percentage, Priority, Trend } from './common';

/**
 * Dados básicos de cliques por dispositivo
 */
export interface DeviceData {
    /** Nome do dispositivo (Desktop, Mobile, Tablet, etc.) */
    device: string;
    /** Número total de cliques */
    clicks: number;
    /** Percentual em relação ao total (opcional) */
    percentage?: Percentage;
}

/**
 * Dados básicos de cliques por país
 */
export interface CountryData extends Record<string, unknown> {
    /** Nome do país */
    country: string;
    /** Código ISO do país */
    iso_code: string;
    /** Número total de cliques */
    clicks: number;
    /** Percentual em relação ao total */
    percentage?: Percentage;
    /** Moeda do país */
    currency?: string;
}

/**
 * Dados básicos de cliques por estado/região
 */
export interface StateData extends Record<string, unknown> {
    /** País do estado */
    country: string;
    /** Código do estado */
    state: string;
    /** Nome completo do estado */
    state_name: string;
    /** Número total de cliques */
    clicks: number;
    /** Percentual em relação ao total */
    percentage?: Percentage;
}

/**
 * Dados básicos de cliques por cidade
 */
export interface CityData extends Record<string, unknown> {
    /** Nome da cidade */
    city: string;
    /** Estado da cidade */
    state: string;
    /** País da cidade */
    country: string;
    /** Número total de cliques */
    clicks: number;
    /** Percentual em relação ao total */
    percentage?: Percentage;
}

/**
 * Dados de cliques por hora
 */
export interface HourlyData extends Record<string, unknown> {
    /** Hora (0-23) */
    hour: number;
    /** Label da hora (ex: "14:00") */
    label: string;
    /** Número de cliques nesta hora */
    clicks: number;
}

/**
 * Dados de cliques por dia da semana
 */
export interface DayOfWeekData extends Record<string, unknown> {
    /** Dia da semana (0-6, onde 0 = domingo) */
    day: number;
    /** Nome do dia da semana */
    day_name: string;
    /** Número de cliques neste dia */
    clicks: number;
}

/**
 * Insight de negócio automatizado
 */
export interface BusinessInsight {
    /** Tipo do insight */
    type: string;
    /** Título do insight */
    title: string;
    /** Descrição detalhada */
    description: string;
    /** Valor associado (se aplicável) */
    value?: string | number;
    /** Tendência dos dados */
    trend?: Trend;
    /** Prioridade do insight */
    priority: Priority;
}

/**
 * Ponto no mapa de calor
 */
export interface HeatmapPoint {
    /** Latitude */
    lat: number;
    /** Longitude */
    lng: number;
    /** Intensidade/valor do ponto */
    value?: number;
    /** Nome da cidade */
    city: string;
    /** Nome do país */
    country: string;
    /** Número de cliques nesta localização */
    clicks: number;
    /** Código ISO do país (opcional) */
    iso_code?: string;
    /** Moeda local (opcional) */
    currency?: string;
    /** Nome do estado/província (opcional) */
    state_name?: string;
    /** Continente (opcional) */
    continent?: string;
    /** Fuso horário (opcional) */
    timezone?: string;
    /** Timestamp do último clique (opcional) */
    last_click?: string;
}

/**
 * Informações básicas de um link
 */
export interface LinkInfo {
    /** ID único do link */
    id: ID;
    /** Título do link */
    title?: string;
    /** URL original */
    original_url: string;
    /** URL encurtada */
    short_url: string;
    /** Slug personalizado */
    slug?: string;
    /** Data de criação */
    created_at: ISODateString;
    /** Data de expiração (opcional) */
    expires_at?: ISODateString;
    /** Status ativo/inativo */
    is_active: boolean;
}

/**
 * Métricas básicas de overview
 */
export interface OverviewMetrics {
    /** Total de cliques */
    total_clicks: number;
    /** Visitantes únicos */
    unique_visitors: number;
    /** Países alcançados */
    countries_reached: number;
    /** Média de cliques por dia */
    avg_daily_clicks: number;
    /** Taxa de conversão (opcional) */
    conversion_rate?: Percentage;
    /** Taxa de rejeição (opcional) */
    bounce_rate?: Percentage;
}
