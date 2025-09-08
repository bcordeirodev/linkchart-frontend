import { AnalyticsContainer } from './AnalyticsContainer';
import { AnalyticsProps } from '@/types/analytics';

/**
 * 🎨 ANALYTICS - WRAPPER OTIMIZADO
 * 
 * @description
 * Componente wrapper que delega toda a funcionalidade para o AnalyticsContainer.
 * Mantém compatibilidade com o código existente enquanto usa a nova arquitetura.
 * 
 * @deprecated Prefer using AnalyticsContainer directly for new implementations
 * @compatibility Mantido para compatibilidade com código existente
 */
export function Analytics(props: AnalyticsProps) {
	return <AnalyticsContainer {...props} />;
}

export default Analytics;
