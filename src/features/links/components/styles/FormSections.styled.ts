/**
 * 🎨 FORM SECTIONS STYLED COMPONENTS
 * Componentes estilizados para seções de formulário usando tema
 */

import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Stack } from '@mui/material';

// ========================================
// 📋 FORM CONTAINERS
// ========================================

/**
 * Container principal para formulários
 * Usa spacing e borderRadius do tema
 */
export const FormPaper = styled(Paper)(({ theme }) => ({
    overflow: 'hidden',
    borderRadius: theme.spacing(2), // Usa borderRadius do tema
}));

/**
 * Header de formulário com padding e border padronizados
 */
export const FormHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

/**
 * Container de campos com padding padronizado
 */
export const FormFieldsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

/**
 * Container de ações com padding e border padronizados
 */
export const FormActionsContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    paddingTop: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
}));

/**
 * Paper para estado de sucesso
 */
export const SuccessPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: theme.spacing(2),
}));

/**
 * Paper para estados de loading/error
 */
export const StatePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
}));

// ========================================
// 🎨 HERO SECTIONS
// ========================================

/**
 * Container principal do hero
 */
export const HeroContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    textAlign: 'center',
}));

/**
 * Container do ícone + título
 */
export const HeroIconTitleContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));

/**
 * Box do ícone hero
 */
export const HeroIconBox = styled(Box)(({ theme }) => ({
    width: 56,
    height: 56,
    borderRadius: theme.spacing(1.5), // Usa borderRadius padrão
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    boxShadow: theme.shadows[4], // Usa shadow do tema
}));

/**
 * Container de features
 */
export const HeroFeaturesContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
}));

/**
 * Item de feature individual
 */
export const HeroFeatureItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

// ========================================
// 📊 SECTION CONTAINERS
// ========================================

/**
 * Container para seções avançadas (configurações avançadas, UTM)
 */
export const AdvancedSectionContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5), // Usa borderRadius padrão
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.02)'
        : 'rgba(0, 0, 0, 0.02)',
}));

/**
 * Container interno das seções colapsáveis
 */
export const CollapsibleSectionContent = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));

/**
 * Typography para descrições de seções
 */
export const SectionDescription = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: theme.palette.text.secondary,
}));

// ========================================
// 🎛️ BUTTON CONTAINERS
// ========================================

/**
 * Container para botões de toggle (seções avançadas)
 */
export const ToggleButtonContainer = styled(Box)(({ theme }) => ({
    marginBottom: 0,
    width: '100%',
    '&.expanded': {
        marginBottom: theme.spacing(2),
    }
}));

/**
 * Stack para ações de formulário
 */
export const FormActionsStack = styled(Stack)(({ theme }) => ({
    '&.MuiStack-root': {
        flexDirection: 'row',
        gap: theme.spacing(2),
        justifyContent: 'flex-end',
    }
}));

/**
 * Stack para ações com botão de cancelar
 */
export const FormActionsWithCancelStack = styled(Stack)(({ theme }) => ({
    '&.MuiStack-root': {
        flexDirection: 'row',
        gap: theme.spacing(2),
        justifyContent: 'space-between',
    }
}));
