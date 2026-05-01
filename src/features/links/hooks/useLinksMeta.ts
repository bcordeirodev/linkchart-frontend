'use client';
import { useEffect, useRef, useState } from 'react';
import { linkMetaService } from '@/services/link-meta.service';
import type { BatchMetaResponse } from '@/types';

/**
 * Fetches sparkline + trend + preview + health for a list of link IDs.
 * Re-fetches whenever the sorted set of IDs changes.
 */
export function useLinksMeta(ids: string[]) {
	const [meta, setMeta] = useState<BatchMetaResponse>({});
	const [loading, setLoading] = useState(false);

	const key = [...ids].sort().join(',');
	const prevKey = useRef('');

	useEffect(() => {
		if (!ids.length || key === prevKey.current) {
			return;
		}

		prevKey.current = key;
		setLoading(true);
		linkMetaService
			.batchMeta(ids)
			.then(setMeta)
			.finally(() => setLoading(false));
	}, [key]);

	return { meta, loading };
}
