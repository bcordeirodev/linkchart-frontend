'use client';

import { usePathname as useNextPathname } from 'next/navigation';

/**
 * Hook personalizado para obter pathname atual
 * Wrapper do Next.js usePathname para consistência
 *
 * @example
 * ```tsx
 * const pathname = usePathname();
 * const isActive = pathname === '/dashboard';
 * ```
 */
function usePathname() {
	return useNextPathname();
}

export default usePathname;
