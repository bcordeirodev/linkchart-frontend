import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { publicLinkService } from '@/services/link-public.service';

import type { PublicLinkResponse } from '@/services/link-public.service';

export function useShorter() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [result, setResult] = useState<PublicLinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(
    (res: PublicLinkResponse) => {
      if (!res?.slug) {
        setError('Erro: Link criado mas sem slug válido');
        return;
      }
      setResult(res);
      setIsRedirecting(true);

      setTimeout(() => {
        try {
          navigate(publicLinkService.getPublicAnalyticsUrl(res.slug), {
            replace: true,
            state: { fromShorter: true, newLink: true, linkData: res }
          });
        } catch (err) {
          console.error('Erro ao redirecionar:', err);
          setError('Erro ao redirecionar para analytics');
          setIsRedirecting(false);
        }
      }, 3000);
    },
    [navigate]
  );

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsRedirecting(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleReset = useCallback(() => {
    setIsRedirecting(false);
    setResult(null);
    setError(null);
  }, []);

  const handleSignUp = useCallback(() => navigate('/sign-up'), [navigate]);
  const handleLogin = useCallback(() => navigate('/sign-in'), [navigate]);

  return {
    isRedirecting,
    result,
    error,
    handleSuccess,
    handleError,
    clearError,
    handleReset,
    handleSignUp,
    handleLogin
  };
}
