/**
 * 🎣 HOOKS DE TEMA CENTRALIZADOS - LINK CHART
 * Exportação única dos hooks essenciais de tema
 */

// Hook de tema principal
export { useMainTheme } from "./fuseThemeHooks";

// Hook responsivo
export { useResponsive } from "./useResponsive";

// Hook de altura responsiva para charts
export { useChartHeight, type ChartSize } from "./useChartHeight";

// Re-export de hooks compartilhados
export { default as useThemeMediaQuery } from "@/shared/hooks/useThemeMediaQuery";
