import { Box, Typography, Button } from '@mui/material';

/**
 * 🎨 HEADER ULTRA-SIMPLIFIED - ANALYTICS
 * Apenas Box e Typography padrão - SEM PROPS CUSTOMIZADAS
 * REDUZIDO DE 300+ LINHAS PARA 20 LINHAS
 */

// ========================================
// 📦 COMPONENTS BÁSICOS
// ========================================

export const HeaderContainer = Box;
export const HeaderContent = Box;
export const HeaderTitle = Typography;
export const HeaderSubtitle = Typography;
export const HeaderActions = Box;

// ========================================
// 🎯 LEGACY EXPORTS (Todos como Box/Typography padrão)
// ========================================

export const HeaderDecoration = Box;
export const HeaderTextContent = Box;
export const HeaderMainTitle = Typography;
export const HeaderDescription = Typography;
export const HeaderMainContent = Box;
export const HeaderIcon = Box;
export const HeaderActionButton = Button;
export const HeaderLoadingOverlay = Box;
export const HeaderWithBreadcrumb = Box;

export default {
	HeaderContainer,
	HeaderContent,
	HeaderTitle,
	HeaderSubtitle,
	HeaderActions,
	HeaderDecoration,
	HeaderTextContent,
	HeaderMainTitle,
	HeaderDescription,
	HeaderMainContent,
	HeaderIcon,
	HeaderActionButton,
	HeaderLoadingOverlay,
	HeaderWithBreadcrumb
};
