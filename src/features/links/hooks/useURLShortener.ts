import { useCallback, useState } from 'react';

import { linkService } from '@/services';

interface IShortUrl {
	slug: string;
	short_url: string;
	original_url: string;
	expires_at: string | null;
}

interface CreateUrlData {
	original_url: string;
	isActive?: boolean;
	[key: string]: unknown;
}

interface UseURLShortenerReturn {
	shorted: IShortUrl | null;
	loading: boolean;
	error: string | null;
	createShortUrl: (data: CreateUrlData) => Promise<IShortUrl>;
	reset: () => void;
}

/**
 * Hook personalizado para encurtamento de URLs
 * Gerencia estado de carregamento, erro e resultado
 */
export function useURLShortener(): UseURLShortenerReturn {
	const [shorted, setShorted] = useState<IShortUrl | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createShortUrl = useCallback(async (data: CreateUrlData): Promise<IShortUrl> => {
		setLoading(true);
		setError(null);

		try {
			// Usar o service centralizado que já normaliza a URL
			const response = await linkService.createShortUrl(data);
			const shortUrl = response.data as IShortUrl;
			setShorted(shortUrl);
			return shortUrl;
		} catch (_err) {
			const errorMessage = 'Erro ao encurtar a URL. Tente novamente.';
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	const reset = useCallback(() => {
		setShorted(null);
		setError(null);
	}, []);

	return {
		shorted,
		loading,
		error,
		createShortUrl,
		reset
	};
}

export default useURLShortener;
