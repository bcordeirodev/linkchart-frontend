import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api/client';
import { publicLinkService } from '@/services/publicLink.service';
import type { BasicAnalyticsData, BasicLinkData, BasicAnalyticsState, BasicAnalyticsActions } from '../types';

interface UseBasicAnalyticsProps {
	slug: string | undefined;
}

interface UseBasicAnalyticsReturn extends BasicAnalyticsState, BasicAnalyticsActions {
	debugInfo: string;
}

/**
 * 📊 HOOK PARA BASIC ANALYTICS
 *
 * Gerencia estado e ações para analytics básicos públicos
 * Segue padrões do projeto para hooks customizados
 */
export function useBasicAnalytics({ slug }: UseBasicAnalyticsProps): UseBasicAnalyticsReturn {
	const navigate = useNavigate();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [linkData, setLinkData] = useState<BasicLinkData | null>(null);
	const [analyticsData, setAnalyticsData] = useState<BasicAnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [debugInfo, setDebugInfo] = useState<string>('');

	useEffect(() => {
		if (!slug) {
			setError('Slug do link não fornecido');
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null); // Limpar erros anteriores

				// Pequeno delay para evitar problemas de transição
				await new Promise((resolve) => setTimeout(resolve, 100));

				// Buscar informações do link e analytics em paralelo
				const [linkResponse, analyticsResponse] = await Promise.all([
					api.get(`/api/public/link/${slug}`),
					api.get(`/api/public/analytics/${slug}`)
				]);

				const linkDataResult = (linkResponse as any).data;
				const analyticsDataResult = analyticsResponse as any;

				// Validação dos dados
				if (!linkDataResult || !linkDataResult.slug) {
					setError('Dados do link inválidos');
					return;
				}

				if (!analyticsDataResult) {
					setError('Dados de analytics inválidos');
					return;
				}

				// Aguardar um pouco antes de definir os dados para evitar problemas de renderização
				await new Promise((resolve) => setTimeout(resolve, 50));

				setLinkData(linkDataResult);
				setAnalyticsData(analyticsDataResult);
				setDebugInfo(
					`Dados carregados: Link ID ${linkDataResult.id}, Slug ${linkDataResult.slug}, Clicks ${analyticsDataResult.total_clicks}`
				);
			} catch (err: any) {
				console.error('Erro ao buscar dados:', err);
				setError(err.response?.data?.message || 'Erro ao carregar dados do link');
			} finally {
				// Pequeno delay antes de remover o loading para evitar flicker
				timeoutRef.current = setTimeout(() => {
					setLoading(false);
				}, 100);
			}
		};

		fetchData();

		// Cleanup do timeout ao desmontar
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [slug]);

	// Ações
	const handleCopyLink = async (): Promise<void> => {
		if (linkData?.short_url) {
			await publicLinkService.copyToClipboard(linkData.short_url);
		}
	};

	const handleCreateLink = (): void => {
		navigate('/shorter');
	};

	const handleVisitLink = (): void => {
		if (linkData?.original_url) {
			window.open(linkData.original_url, '_blank');
		}
	};

	return {
		linkData,
		analyticsData,
		loading,
		error,
		debugInfo,
		handleCopyLink,
		handleCreateLink,
		handleVisitLink
	};
}
