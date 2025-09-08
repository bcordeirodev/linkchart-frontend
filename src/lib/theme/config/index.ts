/**
 * ⚙️ CONFIGURAÇÕES CENTRALIZADAS - LINK CHART
 * Exportação única de todas as configurações de tema
 */

// Configurações otimizadas (recomendado)
export {
	optimizedSettings,
	getParsedQuerySettings,
	optimizedThemeOptions,
	mustHaveThemeOptions,
	optimizedDefaultThemes,
	extendThemeWithMixins
} from './optimizedSettings';

// Configurações MUI organizadas
export { muiComponents, typography, breakpoints } from './muiComponents';


// Compatibilidade com código existente (re-exports das versões otimizadas)
export {
	optimizedSettings as defaultSettings,
	optimizedThemeOptions as defaultThemeOptions,
	optimizedDefaultThemes as defaultThemes
} from './optimizedSettings';
