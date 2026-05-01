/**
 * Exports centralizados das paletas do design system.
 */

// Paletas canônicas
export { darkPalette, darkNeutral, darkPrimary } from "./dark";
export { lightPalette, lightNeutral, lightPrimary } from "./light";
export { semanticDark, semanticLight } from "./semantic";
export type { SemanticShade, SemanticPalette } from "./semantic";

// Chart
export {
  chartPalette,
  chartByType,
  getChartColor,
  getGradientColors,
  chartColors,
} from "./chart";
