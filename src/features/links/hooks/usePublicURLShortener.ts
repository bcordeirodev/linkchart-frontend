"use client";
import { useCallback, useState } from "react";

import { publicLinkService } from "@/services/link-public.service";

import type { PublicLinkResponse } from "@/services/link-public.service";

interface CreatePublicUrlData {
  original_url: string;
  title?: string;
  custom_slug?: string;
}

interface UsePublicURLShortenerReturn {
  shortened: PublicLinkResponse | null;
  loading: boolean;
  error: string | null;
  createPublicShortUrl: (
    data: CreatePublicUrlData,
  ) => Promise<PublicLinkResponse>;
  reset: () => void;
}

/**
 * Public (unauthenticated) URL shortener used by the `/shorter` page.
 *
 * @returns `{ shortened, loading, error, createPublicShortUrl, reset }`
 *
 * @remarks
 * Endpoint: `POST /api/public/links` (via `publicLinkService.createPublicLink()`).
 * Rate-limited backend-side at 10/min per IP (see `routes/api.php` group `public-shorten`).
 * URL is normalised via `publicLinkService.formatUrl` (prepends `https://` when missing) and validated locally before the request.
 */
export function usePublicURLShortener(): UsePublicURLShortenerReturn {
  const [shortened, setShortened] = useState<PublicLinkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPublicShortUrl = useCallback(
    async (data: CreatePublicUrlData): Promise<PublicLinkResponse> => {
      setLoading(true);
      setError(null);

      try {
        // Formatar URL se necessário
        const formattedUrl = publicLinkService.formatUrl(data.original_url);

        // Validar URL
        if (!publicLinkService.validateUrl(formattedUrl)) {
          throw new Error("URL inválida");
        }

        // Criar link público usando o endpoint correto
        const result = await publicLinkService.createPublicLink({
          ...data,
          original_url: formattedUrl,
        });

        setShortened(result);
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao encurtar a URL. Tente novamente.";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setShortened(null);
    setError(null);
  }, []);

  return {
    shortened,
    loading,
    error,
    createPublicShortUrl,
    reset,
  };
}

export default usePublicURLShortener;
