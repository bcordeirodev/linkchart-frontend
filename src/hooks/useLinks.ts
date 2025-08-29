'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { linkService } from '@/services';

/**
 * Hook personalizado para gerenciar links
 *
 * Segue os princípios SOLID:
 * - SRP: Responsável apenas pela lógica de links
 * - DRY: Centraliza a lógica de gerenciamento de links
 */
export function useLinks() {
	const [links, setLinks] = useState<ILinkResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useAppDispatch();

	/**
	 * Carrega todos os links do usuário
	 */
	const loadLinks = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await linkService.all();
			setLinks(response);
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
		}
	}, [dispatch]);

	/**
	 * Cria um novo link
	 */
	const createLink = useCallback(
		async (data: ILinkCreate) => {
			setLoading(true);
			setError(null);

			try {
				const response = await linkService.save(data);
				// Recarregar a lista de links após criar um novo
				await loadLinks();
				dispatch(
					showMessage({
						message: response.message || 'Link criado com sucesso!',
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
		async (id: string, data: ILinkUpdate) => {
			setLoading(true);
			setError(null);

			try {
				const updatedLink = await linkService.update(id, data);
				setLinks((prev) => prev.map((link) => (link.id === parseInt(id) ? updatedLink : link)));
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
		async (id: number) => {
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
