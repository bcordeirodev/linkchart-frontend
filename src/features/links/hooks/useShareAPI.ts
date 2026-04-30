import { useCallback } from 'react';

import { useClipboard } from '@/shared/hooks';

interface ShareData {
	title?: string;
	text?: string;
	url: string;
}

interface UseShareAPIReturn {
	canShare: boolean;
	share: (data: ShareData) => Promise<void>;
	shareOrCopy: (data: ShareData) => Promise<void>;
}

/**
 * Hook personalizado para Web Share API
 * Fallback para clipboard quando Share API não está disponível
 */
export function useShareAPI(): UseShareAPIReturn {
	const { copy } = useClipboard();

	const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

	const share = useCallback(
		async (data: ShareData) => {
			if (!canShare) {
				throw new Error('Web Share API não está disponível');
			}

			try {
				await navigator.share(data);
			} catch (error) {
				// Usuário cancelou o compartilhamento ou erro
				if (error instanceof Error && error.name !== 'AbortError') {
					throw error;
				}
			}
		},
		[canShare]
	);

	const shareOrCopy = useCallback(
		async (data: ShareData) => {
			if (canShare) {
				try {
					await share(data);
				} catch (_error) {
					// Fallback para clipboard se share falhar
					await copy(data.url);
				}
			} else {
				// Usar clipboard diretamente
				await copy(data.url);
			}
		},
		[canShare, share, copy]
	);

	return {
		canShare,
		share,
		shareOrCopy
	};
}

export default useShareAPI;
