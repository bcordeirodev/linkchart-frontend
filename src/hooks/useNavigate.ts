'use client';

import { useRouter } from 'next/navigation';

/**
 * Hook personalizado para navegação compatível com Next.js
 * Oferece interface similar ao React Router para facilitar migração
 *
 * @example
 * ```tsx
 * const navigate = useNavigate();
 *
 * // Navegar para uma rota
 * navigate('/dashboard');
 *
 * // Voltar
 * navigate(-1);
 *
 * // Avançar
 * navigate(1);
 * ```
 */
function useNavigate(): (url: string | number) => void {
	const router = useRouter();

	return (url) => {
		if (typeof url === 'string') {
			router.push(url);
		}

		if (url === -1) {
			router.back();
		}

		if (url === 1) {
			router.forward();
		}
	};
}

export default useNavigate;
