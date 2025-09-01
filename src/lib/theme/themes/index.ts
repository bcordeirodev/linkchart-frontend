/**
 * 🎨 TEMAS CENTRALIZADOS - LINK CHART
 * Exportação única de todos os temas da aplicação
 */

// Re-export da nova estrutura consolidada
export {
    allThemes,
    simplifiedThemes,
    extendedThemes,
    themesConfig
} from '../themes';

// Compatibilidade mantida através da nova estrutura consolidada

// Import para usar no default export
import { allThemes } from '../themes';
export default allThemes;
