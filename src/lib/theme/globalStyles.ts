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
		/* Botões padronizados */
		.MuiButton-root {
			border-radius: 12px !important;
			text-transform: none !important;
			font-weight: 600 !important;
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
		}
		
		.MuiButton-root:hover {
			transform: translateY(-1px) !important;
		}
		
		.MuiButton-contained {
			background: linear-gradient(135deg, #0A74DA 0%, #0D47A1 100%) !important;
			box-shadow: none !important;
		}
		
		.MuiButton-contained:hover {
			background: linear-gradient(135deg, #0D47A1 0%, #002171 100%) !important;
			box-shadow: 0 6px 16px rgba(10, 116, 218, 0.3) !important;
		}
		
		/* Inputs padronizados */
		.MuiTextField-root .MuiOutlinedInput-root {
			border-radius: 12px !important;
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
		}
		
		.MuiTextField-root .MuiOutlinedInput-root:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline {
			border-color: #0A74DA !important;
		}
		
		.MuiTextField-root .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
			border-color: #0A74DA !important;
			border-width: 2px !important;
		}
		
		.MuiTextField-root .MuiOutlinedInput-root.Mui-focused {
			box-shadow: 0 0 0 2px rgba(10, 116, 218, 0.2) !important;
		}
		
		/* Cards padronizados */
		.MuiPaper-root {
			border-radius: 16px !important;
		}
		
		.MuiCard-root {
			border-radius: 16px !important;
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
		}
		
		.MuiCard-root:hover {
			transform: translateY(-2px) !important;
		}
		
		/* Typography padronizada */
		.MuiTypography-h1 { font-weight: 700 !important; line-height: 1.2 !important; }
		.MuiTypography-h2 { font-weight: 700 !important; line-height: 1.3 !important; }
		.MuiTypography-h3 { font-weight: 600 !important; line-height: 1.3 !important; }
		.MuiTypography-h4 { font-weight: 600 !important; line-height: 1.4 !important; }
		.MuiTypography-h5 { font-weight: 600 !important; line-height: 1.4 !important; }
		.MuiTypography-h6 { font-weight: 600 !important; line-height: 1.4 !important; }
	`;

    document.head.appendChild(style);
};

export default applyGlobalStyles;
