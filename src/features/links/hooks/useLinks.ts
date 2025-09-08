import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import { linkService } from '@/services';
import { LinkCreateRequest, LinkResponse, LinkUpdateRequest } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

// Extend types to match Record<string, unknown>
interface LinkCreateRequestExtended extends LinkCreateRequest, Record<string, unknown> {}
interface LinkUpdateRequestExtended extends LinkUpdateRequest, Record<string, unknown> {}

// Cache simples para evitar chamadas duplicadas
let linksCache: LinkResponse[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5000; // 5 segundos

/**
 * Hook personalizado para gerenciar links
 *
 * Segue os princípios SOLID:
 * - SRP: Responsável apenas pela lógica de links
 * - DRY: Centraliza a lógica de gerenciamento de links
 */
export function useLinks() {
	const [links, setLinks] = useState<LinkResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const loadingRef = useRef(false);

	/**
	 * Carrega todos os links do usuário com cache
	 */
	const loadLinks = useCallback(
		async (forceRefresh = false) => {
			// Evita chamadas duplicadas
			if (loadingRef.current) return;

			// Verifica cache
			const now = Date.now();

			if (!forceRefresh && linksCache && now - cacheTimestamp < CACHE_DURATION) {
				setLinks(linksCache);
				return;
			}

			loadingRef.current = true;
			setLoading(true);
			setError(null);

			try {
				const response = await linkService.all();
				setLinks(response);

				// Atualiza cache
				linksCache = response;
				cacheTimestamp = now;
			} catch (_err) {
				const errorMessage = 'Erro ao carregar links';
				setError(errorMessage);
				dispatch(
					showMessage({
						message: errorMessage,
						variant: 'error'
					})
				);
			} finally {
				setLoading(false);
				loadingRef.current = false;
			}
		},
		[dispatch]
	);

	/**
	 * Cria um novo link
	 */
	const createLink = useCallback(
		async (data: LinkCreateRequestExtended) => {
			setLoading(true);
			setError(null);

			try {
				const response = await linkService.save(data);
				// Invalidar cache e recarregar a lista de links após criar um novo
				linksCache = null;
				await loadLinks(true);
				dispatch(
					showMessage({
						message: 'Link criado com sucesso!',
						variant: 'success'
					})
				);
				return response;
			} catch (err) {
				const errorMessage = 'Erro ao criar link';
				setError(errorMessage);
				dispatch(
					showMessage({
						message: errorMessage,
						variant: 'error'
					})
				);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[dispatch, loadLinks]
	);

	/**
	 * Atualiza um link existente
	 */
	const updateLink = useCallback(
		async (id: string, data: LinkUpdateRequestExtended) => {
			setLoading(true);
			setError(null);

			try {
				const updatedLink = await linkService.update(id, data);
				setLinks((prev) => prev.map((link) => (link.id === id ? updatedLink : link)));
				dispatch(
					showMessage({
						message: 'Link atualizado com sucesso!',
						variant: 'success'
					})
				);
				return updatedLink;
			} catch (err) {
				const errorMessage = 'Erro ao atualizar link';
				setError(errorMessage);
				dispatch(
					showMessage({
						message: errorMessage,
						variant: 'error'
					})
				);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

	/**
	 * Remove um link
	 */
	const deleteLink = useCallback(
		async (id: string) => {
			setLoading(true);
			setError(null);

			try {
				await linkService.remove(id);
				setLinks((prev) => prev.filter((link) => link.id !== id));
				dispatch(
					showMessage({
						message: 'Link removido com sucesso!',
						variant: 'success'
					})
				);
			} catch (err) {
				const errorMessage = 'Erro ao remover link';
				setError(errorMessage);
				dispatch(
					showMessage({
						message: errorMessage,
						variant: 'error'
					})
				);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

	/**
	 * Busca um link específico
	 */
	const getLink = useCallback(
		async (id: string) => {
			setLoading(true);
			setError(null);

			try {
				const link = await linkService.findOne(id);
				return link.data;
			} catch (err) {
				const errorMessage = 'Erro ao buscar link';
				setError(errorMessage);
				dispatch(
					showMessage({
						message: errorMessage,
						variant: 'error'
					})
				);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

	// Carrega os links na inicialização
	useEffect(() => {
		loadLinks();
	}, [loadLinks]);

	return {
		links,
		loading,
		error,
		loadLinks,
		createLink,
		updateLink,
		deleteLink,
		getLink
	};
}
