import { useLocation } from 'react-router-dom';

/**
 * Hook personalizado para obter pathname atual
 * Wrapper do React Router useLocation para consistência
 *
 * @example
 * ```tsx
 * const pathname = usePathname();
 * const isActive = pathname === '/dashboard';
 * ```
 */
function usePathname() {
	const location = useLocation();
	return location.pathname;
}

export default usePathname;
