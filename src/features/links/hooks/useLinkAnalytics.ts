import { linkService } from '@/services';
import { LinkResponse } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { LinkAnalyticsData } from '../types/analytics';

interface UseLinkAnalyticsReturn {
	data: LinkAnalyticsData | null; // Tipos específicos para analytics
	linkInfo: LinkResponse | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * 🔄 Hook otimizado para analytics de link individual REFATORADO
 * 
 * @description
 * Agora usa hooks individuais por tab ao invés do useEnhancedAnalytics.
 * Cada componente de analytics do link usa seu próprio hook específico.
 * 
 * @architecture
 * - Não depende mais do endpoint comprehensive
 * - Busca apenas dados básicos do link
 * - Componentes individuais usam hooks específicos (useTemporalData, useGeographicData, etc.)
 */
export function useLinkAnalyticsOptimized(linkId: string): UseLinkAnalyticsReturn {
	const [linkInfo, setLinkInfo] = useState<LinkResponse | null>(null);
	const [linkError, setLinkError] = useState<string | null>(null);
	const [linkLoading, setLinkLoading] = useState(true);

	// Dados básicos do analytics - apenas para compatibilidade
	// Os dados detalhados são carregados pelos hooks individuais de cada tab
	const [analyticsData, setAnalyticsData] = useState<any>(null);
	const [analyticsLoading, setAnalyticsLoading] = useState(false);
	const [analyticsError, setAnalyticsError] = useState<string | null>(null);

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
		await fetchLinkInfo();
		// Analytics são refetchados individualmente por cada hook de tab
	}, [fetchLinkInfo]);

	useEffect(() => {
		fetchLinkInfo();
	}, [fetchLinkInfo]);

	// Criar dados básicos para compatibilidade
	useEffect(() => {
		if (linkInfo) {
			setAnalyticsData({
				has_data: true,
				link_info: linkInfo,
				// Dados detalhados são carregados pelos hooks individuais
				overview: null,
				geographic: null,
				temporal: null,
				audience: null,
				insights: null
			});
		}
	}, [linkInfo]);

	return {
		data: analyticsData as LinkAnalyticsData | null,
		linkInfo,
		loading: linkLoading, // Apenas loading do link
		error: linkError, // Apenas erro do link
		refetch
	};
}

export default useLinkAnalyticsOptimized;
