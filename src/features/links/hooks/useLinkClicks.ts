'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { linkService } from '@/services';

import type { LinkClickItem, LinkClicksListParams, LinkClicksMeta } from '../types/click';

interface UseLinkClicksOptions {
	linkId: string;
	initialPage?: number;
	initialPerPage?: number;
}

interface UseLinkClicksReturn {
	items: LinkClickItem[];
	meta: LinkClicksMeta | null;
	loading: boolean;
	error: string | null;
	params: Required<Pick<LinkClicksListParams, 'page' | 'per_page' | 'search' | 'sort_by' | 'sort_dir'>>;
	setPage: (page: number) => void;
	setPerPage: (perPage: number) => void;
	setSearch: (search: string) => void;
	setSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
	refresh: () => Promise<void>;
}

const DEFAULT_PER_PAGE = 25;

export function useLinkClicks({
	linkId,
	initialPage = 1,
	initialPerPage = DEFAULT_PER_PAGE
}: UseLinkClicksOptions): UseLinkClicksReturn {
	const [items, setItems] = useState<LinkClickItem[]>([]);
	const [meta, setMeta] = useState<LinkClicksMeta | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [page, setPage] = useState(initialPage);
	const [perPage, setPerPage] = useState(initialPerPage);
	const [search, setSearchState] = useState('');
	const [sortBy, setSortBy] = useState('created_at');
	const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

	const reqIdRef = useRef(0);

	const fetchClicks = useCallback(async () => {
		if (!linkId) {
			return;
		}

		const reqId = ++reqIdRef.current;
		setLoading(true);
		setError(null);

		try {
			const response = await linkService.getClicksList(linkId, {
				page,
				per_page: perPage,
				search: search || undefined,
				sort_by: sortBy,
				sort_dir: sortDir
			});

			// Descarta resposta de request superada
			if (reqId !== reqIdRef.current) {
				return;
			}

			setItems(response.data || []);
			setMeta(response.meta || null);
		} catch (err) {
			if (reqId !== reqIdRef.current) {
				return;
			}

			const message = err instanceof Error ? err.message : 'Erro ao carregar cliques';
			setError(message);
			setItems([]);
			setMeta(null);
		} finally {
			if (reqId === reqIdRef.current) {
				setLoading(false);
			}
		}
	}, [linkId, page, perPage, search, sortBy, sortDir]);

	useEffect(() => {
		fetchClicks();
	}, [fetchClicks]);

	const setSearch = useCallback((next: string) => {
		setPage(1);
		setSearchState(next);
	}, []);

	const setSort = useCallback((nextSortBy: string, nextSortDir: 'asc' | 'desc') => {
		setSortBy(nextSortBy);
		setSortDir(nextSortDir);
	}, []);

	const handleSetPerPage = useCallback((next: number) => {
		setPage(1);
		setPerPage(next);
	}, []);

	return {
		items,
		meta,
		loading,
		error,
		params: { page, per_page: perPage, search, sort_by: sortBy, sort_dir: sortDir },
		setPage,
		setPerPage: handleSetPerPage,
		setSearch,
		setSort,
		refresh: fetchClicks
	};
}

export default useLinkClicks;
