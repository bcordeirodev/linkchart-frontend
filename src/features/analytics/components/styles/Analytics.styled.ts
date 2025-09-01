import { Box, Container, Paper } from '@mui/material';

/**
 * 🎨 ANALYTICS ULTRA-SIMPLIFIED - LINK CHART
 * Apenas Box, Container e Paper padrão - SEM PROPS CUSTOMIZADAS
 * REDUZIDO DE 391 LINHAS PARA 30 LINHAS
 */

// ========================================
// 📦 CONTAINERS BÁSICOS
// ========================================

export const AnalyticsContainer = Container;
export const AnalyticsContent = Box;
export const TabPanelContainer = Box;

// ========================================
// 📊 ESTADOS BÁSICOS
// ========================================

export const LoadingContainer = Paper;
export const LoadingStateContainer = Paper;
export const ErrorContainer = Paper;
export const ErrorStateContainer = Paper;
export const EmptyContainer = Paper;
export const EmptyStateContainer = Paper;

// ========================================
// 🎯 OUTROS COMPONENTES BÁSICOS
// ========================================

export const TabsContainer = Paper;
export const SectionContainer = Box;
export const GridSection = Box;
export const FadeInBox = Box;
export const LoadingIcon = Box;
export const LoadingContent = Box;
export const StyledTabs = Box;
export const TabLabel = Box;

export default {
	AnalyticsContainer,
	AnalyticsContent,
	TabPanelContainer,
	LoadingContainer,
	LoadingStateContainer,
	ErrorContainer,
	ErrorStateContainer,
	EmptyContainer,
	EmptyStateContainer,
	TabsContainer,
	SectionContainer,
	GridSection,
	FadeInBox,
	LoadingIcon,
	LoadingContent,
	StyledTabs,
	TabLabel
};
