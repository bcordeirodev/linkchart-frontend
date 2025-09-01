/**
 * 🎨 CONFIGURAÇÃO DE TEMAS - LINK CHART
 * Re-export otimizado da configuração centralizada de temas
 *
 * @description
 * Este arquivo fornece acesso simplificado às configurações de tema
 * da aplicação Link Chart. Utiliza a estrutura centralizada do diretório
 * `/lib/theme` para garantir consistência e performance.
 *
 * @example
 * ```typescript
 * import themesConfig, { lightPaletteText, darkPaletteText } from '@/lib/themesConfig';
 *
 * // Acessar tema padrão
 * const defaultTheme = themesConfig.default;
 *
 * // Acessar cores de texto
 * const textColors = lightPaletteText;
 * ```
 *
 * @see {@link ./theme/index.ts} - Estrutura completa de temas
 * @since 1.0.0
 */

// Re-exports da estrutura centralizada otimizada
import { themesConfig, lightPaletteText, darkPaletteText } from './theme';

/**
 * Cores de texto para tema claro
 * @public
 */
export { lightPaletteText };

/**
 * Cores de texto para tema escuro
 * @public
 */
export { darkPaletteText };

/**
 * Configuração principal de todos os temas
 * @public
 * @default themesConfig
 */
export default themesConfig;
