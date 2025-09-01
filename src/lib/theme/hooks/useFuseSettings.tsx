/**
 * 🎣 USE FUSE SETTINGS HOOK - LINK CHART
 * Hook de compatibilidade para acessar configurações de layout
 *
 * @description
 * Este hook mantém compatibilidade com o código existente que usa
 * useFuseSettings, redirecionando para o novo sistema de layout.
 *
 * @deprecated Use useLayoutSettings from @/shared/layout/core instead
 * @since 2.0.0
 */

import { useLayoutSettings } from '@/shared/layout/core';

/**
 * Hook de compatibilidade para configurações Fuse
 * @returns Configurações de layout
 * @deprecated Use useLayoutSettings instead
 */
const useFuseSettings = () => {
	return useLayoutSettings();
};

export default useFuseSettings;
