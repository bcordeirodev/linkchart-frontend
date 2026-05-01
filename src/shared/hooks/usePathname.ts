'use client';
import { usePathname as useNextPathname } from 'next/navigation';

/**
 * Hook para obter o pathname atual
 * Compatível com Next.js App Router
 */
export default function usePathname(): string {
	return useNextPathname();
}
