/**
 * @fileoverview Tipos relacionados aos links encurtados
 * @author Link Chart Team
 * @version 1.0.0
 */

import type { ID, ISODateString } from './common';

/**
 * Dados para criação de um novo link
 */
export interface LinkCreateRequest {
	/** URL original a ser encurtada */
	original_url: string;
	/** Título do link (opcional) */
	title?: string;
	/** Slug personalizado (opcional) */
	custom_slug?: string;
	/** Descrição do link (opcional) */
	description?: string;
	/** Data de expiração (opcional) */
	expires_at?: ISODateString;
	/** Data de início (opcional) */
	starts_in?: ISODateString;
	/** Limite de cliques (opcional) */
	click_limit?: number | null;
	/** Tags para categorização (opcional) */
	tags?: string[];
	/** Link ativo por padrão */
	is_active?: boolean;
	/** UTM Source (opcional) */
	utm_source?: string;
	/** UTM Medium (opcional) */
	utm_medium?: string;
	/** UTM Campaign (opcional) */
	utm_campaign?: string;
	/** UTM Term (opcional) */
	utm_term?: string;
	/** UTM Content (opcional) */
	utm_content?: string;
}

/**
 * Dados para atualização de um link existente
 */
export interface LinkUpdateRequest {
	/** URL original */
	original_url?: string;
	/** Título do link */
	title?: string;
	/** Slug personalizado */
	custom_slug?: string;
	/** Descrição do link */
	description?: string;
	/** Data de expiração */
	expires_at?: ISODateString;
	/** Data de início */
	starts_in?: ISODateString;
	/** Limite de cliques */
	click_limit?: number | null;
	/** Tags para categorização */
	tags?: string[];
	/** Status ativo/inativo */
	is_active?: boolean;
	/** UTM Source */
	utm_source?: string;
	/** UTM Medium */
	utm_medium?: string;
	/** UTM Campaign */
	utm_campaign?: string;
	/** UTM Term */
	utm_term?: string;
	/** UTM Content */
	utm_content?: string;
}

/**
 * Resposta completa de um link da API
 */
export interface LinkResponse {
	/** ID único do link (compatível com string e number) */
	id: ID;
	/** ID do usuário proprietário */
	user_id: ID;
	/** Slug único do link */
	slug: string;
	/** Título do link */
	title?: string;
	/** Descrição do link */
	description?: string;
	/** URL original */
	original_url: string;
	/** URL encurtada completa */
	short_url: string;
	/** Slug personalizado (se houver) */
	custom_slug?: string;
	/** Número total de cliques */
	clicks: number;
	/** Status ativo/inativo */
	is_active: boolean;
	/** Data de criação */
	created_at: ISODateString;
	/** Data da última atualização */
	updated_at: ISODateString;
	/** Data de expiração (opcional) */
	expires_at?: ISODateString | null;
	/** Data de início (opcional) */
	starts_in?: ISODateString | null;
	/** Tags associadas */
	tags?: string[];
	/** Último clique registrado */
	last_click_at?: ISODateString;
	/** Limite de cliques (opcional) */
	click_limit?: number | null;
	/** UTM Source (opcional) */
	utm_source?: string | null;
	/** UTM Medium (opcional) */
	utm_medium?: string | null;
	/** UTM Campaign (opcional) */
	utm_campaign?: string | null;
	/** UTM Term (opcional) */
	utm_term?: string | null;
	/** UTM Content (opcional) */
	utm_content?: string | null;
}

/**
 * Estatísticas básicas de um link
 */
export interface LinkStats {
	/** ID do link */
	link_id: ID;
	/** Total de cliques */
	total_clicks: number;
	/** Cliques únicos */
	unique_clicks: number;
	/** Cliques hoje */
	clicks_today: number;
	/** Cliques esta semana */
	clicks_this_week: number;
	/** Cliques este mês */
	clicks_this_month: number;
	/** Último clique */
	last_click_at?: ISODateString;
}

/**
 * Filtros para listagem de links
 */
export interface LinkFilters {
	/** Filtrar por status */
	is_active?: boolean;
	/** Filtrar por período de criação */
	created_after?: ISODateString;
	/** Filtrar por período de criação */
	created_before?: ISODateString;
	/** Filtrar por tags */
	tags?: string[];
	/** Busca por texto */
	search?: string;
	/** Ordenação */
	sort_by?: 'created_at' | 'clicks' | 'title' | 'last_click_at';
	/** Direção da ordenação */
	sort_direction?: 'asc' | 'desc';
}

/**
 * Resposta paginada de links
 */
export interface LinksListResponse {
	/** Lista de links */
	data: LinkResponse[];
	/** Metadados de paginação */
	meta: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
		from: number;
		to: number;
	};
	/** Links de navegação */
	links: {
		first: string;
		last: string;
		prev?: string;
		next?: string;
	};
}
