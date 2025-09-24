import { API_CONFIG } from '../lib/api/endpoints';

import { BaseService } from './base.service';

import type { LinkCreateRequest, LinkResponse, LinkUpdateRequest } from '@/types';

// Extend types to match Record<string, unknown>
interface LinkCreateRequestExtended extends LinkCreateRequest, Record<string, unknown> {}
interface LinkUpdateRequestExtended extends LinkUpdateRequest, Record<string, unknown> {}

/**
 * Serviço para gerenciamento de links
 *
 * Herda do BaseService para:
 * - Tratamento de erro padronizado
 * - Logging centralizado
 * - Type safety
 * - Fallbacks automáticos
 */

// Tipos centralizados importados de @/types

/**
 * Classe de serviço para links usando BaseService
 */
export default class LinkService extends BaseService {
	constructor() {
		super('LinkService');
	}

	/**
	 * Cria um novo link encurtado
	 */
	async save(body: LinkCreateRequestExtended): Promise<LinkResponse> {
		this.validateRequired(body, ['original_url']);

		return this.post<LinkResponse>(API_CONFIG.ENDPOINTS.CREATE_LINK, body, {
			context: 'create_link'
		});
	}

	/**
	 * Atualiza um link existente
	 */
	async update(id: string, body: LinkUpdateRequestExtended): Promise<LinkResponse> {
		this.validateId(id, 'Link ID');

		return this.put<LinkResponse>(API_CONFIG.ENDPOINTS.UPDATE_LINK(id), body, {
			context: 'update_link'
		});
	}

	/**
	 * Busca todos os links do usuário
	 */
	async all(): Promise<LinkResponse[]> {
		const fallbackData: LinkResponse[] = [
			{
				id: '1',
				user_id: '1',
				title: 'Link Principal',
				slug: 'principal',
				original_url: 'https://escolaplanejamento.sit.spgg.rs.gov.br/',
				short_url: `${API_CONFIG.BASE_URL}/api/r/principal`,
				clicks: 23463,
				is_active: true,
				created_at: '2025-08-18T19:56:20.000000Z',
				updated_at: '2025-08-18T19:56:20.000000Z',
				expires_at: null,
				starts_in: null
			},
			{
				id: `2`,
				user_id: `1`,
				title: 'Link Secundário',
				slug: 'secundario',
				original_url: 'https://example.com',
				short_url: `${API_CONFIG.BASE_URL}/api/r/secundario`,
				clicks: 1234,
				is_active: true,
				created_at: '2025-08-19T10:30:00.000000Z',
				updated_at: '2025-08-19T10:30:00.000000Z',
				expires_at: null,
				starts_in: null
			}
		];

		return this.get<LinkResponse[]>(API_CONFIG.ENDPOINTS.LINKS, {
			fallback: fallbackData,
			context: 'get_all_links'
		});
	}

	/**
	 * Busca um link específico por ID
	 */
	async findOne(id: string): Promise<{ data: LinkResponse }> {
		this.validateId(id, 'Link ID');

		const fallbackData = {
			data: {
				id,
				user_id: '1',
				title: 'Link de Exemplo',
				slug: `exemplo-${id}`,
				original_url: 'https://example.com',
				short_url: `http://localhost:3000/r/exemplo-${id}`,
				shorted_url: `http://localhost:3000/r/exemplo-${id}`,
				clicks: 23463,
				is_active: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				expires_at: null,
				starts_in: null
			}
		};

		return this.get<{ data: LinkResponse }>(API_CONFIG.ENDPOINTS.LINK(id), {
			fallback: fallbackData,
			context: 'get_link_by_id'
		});
	}

	/**
	 * Remove um link
	 */
	async remove(id: string): Promise<{ message: string }> {
		this.validateId(id, 'Link ID');

		return this.delete<{ message: string }>(API_CONFIG.ENDPOINTS.DELETE_LINK(id), {
			fallback: { message: 'Link removido com sucesso' },
			context: 'delete_link'
		});
	}

	/**
	 * Busca analytics de um link
	 */
	async getAnalytics(slug: string): Promise<unknown> {
		this.validateId(slug, 'Link slug');

		return this.get<unknown>(API_CONFIG.ENDPOINTS.LINK_ANALYTICS(slug), {
			fallback: {},
			context: 'get_link_analytics'
		});
	}

	/**
	 * Cria uma URL encurtada (legacy)
	 */
	async createShortUrl(data: { original_url: string; [key: string]: unknown }): Promise<{ data: unknown }> {
		this.validateRequired(data, ['original_url']);

		// Normalizar URL - adicionar https:// se não tiver protocolo
		let url = data.original_url.trim();

		if (!/^https?:\/\//i.test(url)) {
			url = `https://${url}`;
		}

		return this.post<{ data: unknown }>(
			'gerar-url',
			{
				...data,
				original_url: url
			},
			{
				context: 'create_short_url'
			}
		);
	}
}

// Instância singleton do serviço
const linkService = new LinkService();

// Exports das funções para compatibilidade com código existente
export const save = linkService.save.bind(linkService);
export const update = linkService.update.bind(linkService);
export const all = linkService.all.bind(linkService);
export const findOne = linkService.findOne.bind(linkService);
export const remove = linkService.remove.bind(linkService);
export const getAnalytics = linkService.getAnalytics.bind(linkService);

// Export da instância do serviço
export { linkService };
