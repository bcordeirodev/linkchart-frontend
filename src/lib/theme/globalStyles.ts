/**
 * 🎨 ESTILOS GLOBAIS OTIMIZADOS - LINK CHART
 * Estilos globais aplicados dinamicamente
 */

// ========================================
// 🎯 FUNÇÃO PARA APLICAR ESTILOS GLOBAIS
// ========================================

/**
 * Aplica estilos globais padronizados na aplicação
 */
export const applyGlobalStyles = () => {
	// Remove estilos existentes
	const existing = document.getElementById('global-theme-styles');

	if (existing) existing.remove();

	// Aplica estilos globais padronizados
	const style = document.createElement('style');
	style.id = 'global-theme-styles';
	style.textContent = `		
		/* ========================================
		   🎯 ESTILOS ESPECÍFICOS NÃO COBERTOS POR OVERRIDES
		   ======================================== */
		/* Smooth scrolling global */
		html {
			scroll-behavior: smooth;
		}
		
		/* Focus outline padronizado para acessibilidade */
		:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
			border-radius: 8px;
		}
	`;

	document.head.appendChild(style);
};

export default applyGlobalStyles;
