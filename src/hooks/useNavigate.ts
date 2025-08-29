import { useNavigate as useReactRouterNavigate } from 'react-router-dom';

/**
 * Hook personalizado para navegação compatível com React Router
 * Interface unificada para navegação
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
	const navigate = useReactRouterNavigate();

	return (url) => {
		if (typeof url === 'string') {
			navigate(url);
		}

		if (url === -1) {
			navigate(-1);
		}

		if (url === 1) {
			navigate(1);
		}
	};
}

export default useNavigate;
