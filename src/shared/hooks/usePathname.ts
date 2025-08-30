import { useLocation } from 'react-router-dom';

/**
 * Hook para obter o pathname atual
 * Compatível com React.js usePathname
 */
export default function usePathname(): string {
    const location = useLocation();
    return location.pathname;
}
