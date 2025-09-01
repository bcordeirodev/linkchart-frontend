import { useState, useEffect, useCallback } from 'react';
import { useEnhancedAnalytics } from '@/features/analytics/hooks/useEnhancedAnalytics';
import { linkService } from '../../../lib/services';
import { LinkResponse } from '@/types';
import { LinkAnalyticsData } from '../types/analytics';

interface UseLinkAnalyticsReturn {
	data: LinkAnalyticsData | null; // Tipos específicos para analytics
	linkInfo: LinkResponse | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * 🔄 Hook otimizado para analytics de link individual
 * REUTILIZA useEnhancedAnalytics + busca dados específicos do link
 * Segue padrões arquiteturais: DRY, reutilização de 80%+ do código
 */
export function useLinkAnalyticsOptimized(linkId: string): UseLinkAnalyticsReturn {
	const [linkInfo, setLinkInfo] = useState<LinkResponse | null>(null);
	const [linkError, setLinkError] = useState<string | null>(null);
	const [linkLoading, setLinkLoading] = useState(true);

	// Reutiliza TODA a lógica do useEnhancedAnalytics
	const {
		data: analyticsData,
		loading: analyticsLoading,
		error: analyticsError,
		refetch: refetchAnalytics
	} = useEnhancedAnalytics(linkId);

	// Busca dados específicos do link
	const fetchLinkInfo = useCallback(async () => {
		try {
			setLinkLoading(true);
			setLinkError(null);

			const linkResponse = await linkService.findOne(linkId);
			setLinkInfo(linkResponse.data);
		} catch (err) {
			setLinkError('Erro ao carregar informações do link');
			console.error('Erro ao buscar link:', err);
		} finally {
			setLinkLoading(false);
		}
	}, [linkId]);

	const refetch = useCallback(async () => {
		await Promise.all([fetchLinkInfo(), refetchAnalytics()]);
	}, [fetchLinkInfo, refetchAnalytics]);

	useEffect(() => {
		fetchLinkInfo();
	}, [fetchLinkInfo]);

	// Combina estados de loading e error
	const combinedLoading = linkLoading || analyticsLoading;
	const combinedError = linkError || analyticsError;

	return {
		data: analyticsData as LinkAnalyticsData | null,
		linkInfo,
		loading: combinedLoading,
		error: combinedError,
		refetch
	};
}

export default useLinkAnalyticsOptimized;
