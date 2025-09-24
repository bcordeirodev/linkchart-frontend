import { useCallback, useState } from 'react';

import { publicLinkService } from '@/services/publicLink.service';

import type { PublicLinkResponse } from '@/services/publicLink.service';

interface CreatePublicUrlData {
	original_url: string;
	title?: string;
	custom_slug?: string;
}

interface UsePublicURLShortenerReturn {
	shortened: PublicLinkResponse | null;
	loading: boolean;
	error: string | null;
	createPublicShortUrl: (data: CreatePublicUrlData) => Promise<PublicLinkResponse>;
	reset: () => void;
}

/**
 * Hook personalizado para encurtamento público de URLs
 * Usa o publicLinkService para criar links sem autenticação
 */
export function usePublicURLShortener(): UsePublicURLShortenerReturn {
	const [shortened, setShortened] = useState<PublicLinkResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createPublicShortUrl = useCallback(async (data: CreatePublicUrlData): Promise<PublicLinkResponse> => {
		setLoading(true);
		setError(null);

		try {
			// Formatar URL se necessário
			const formattedUrl = publicLinkService.formatUrl(data.original_url);

			// Validar URL
			if (!publicLinkService.validateUrl(formattedUrl)) {
				throw new Error('URL inválida');
			}

			// Criar link público usando o endpoint correto
			const result = await publicLinkService.createPublicLink({
				...data,
				original_url: formattedUrl
			});

			setShortened(result);
			return result;
		} catch (err: unknown) {
			const errorMessage = (err as Error).message || 'Erro ao encurtar a URL. Tente novamente.';
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	const reset = useCallback(() => {
		setShortened(null);
		setError(null);
	}, []);

	return {
		shortened,
		loading,
		error,
		createPublicShortUrl,
		reset
	};
}

export default usePublicURLShortener;
