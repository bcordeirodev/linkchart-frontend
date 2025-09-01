import { Box, Grid, Typography, Button } from '@mui/material';

/**
 * 📊 CHARTS ULTRA-SIMPLIFIED - ANALYTICS
 * Apenas componentes MUI padrão - SEM PROPS CUSTOMIZADAS
 * REDUZIDO DE 340+ LINHAS PARA 25 LINHAS
 */

// ========================================
// 📦 COMPONENTS BÁSICOS
// ========================================

export const ChartsContainer = Grid;
export const ChartSection = Box;
export const ChartTitle = Typography;
export const MainChartsWrapper = Box;
export const DeviceCountryWrapper = Box;

// ========================================
// 🎯 LEGACY EXPORTS (Todos como componentes padrão)
// ========================================

export const ChartsHeader = Box;
export const ChartsActions = Box;
export const ChartWrapper = Box;
export const ChartCard = Box;
export const ChartContent = Box;
export const ChartFooter = Box;
export const AdvancedChartsWrapper = Box;
export const ChartsLoadingContainer = Box;
export const ChartsLoadingIcon = Box;
export const ChartsLoadingText = Box;
export const EmptyStateContainer = Box;
export const DemoControlsContainer = Box;
export const BackButton = Button;
export const ChartCardWrapper = Box;
export const ChartContentArea = Box;
export const ResponsiveChartsGrid = Grid;

export default {
	ChartsContainer,
	ChartSection,
	ChartTitle,
	MainChartsWrapper,
	DeviceCountryWrapper,
	ChartsHeader,
	ChartsActions,
	ChartWrapper,
	ChartCard,
	ChartContent,
	ChartFooter,
	AdvancedChartsWrapper,
	ChartsLoadingContainer,
	ChartsLoadingIcon,
	ChartsLoadingText,
	EmptyStateContainer,
	DemoControlsContainer,
	BackButton,
	ChartCardWrapper,
	ChartContentArea,
	ResponsiveChartsGrid
};
