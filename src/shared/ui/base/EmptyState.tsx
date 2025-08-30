import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

// Styled Components
import {
    EmptyStateContainer,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateDescription,
    EmptyStateActions,
    EmptyStateActionButton
} from './styles/UI.styled';



interface EmptyStateProps {
    icon?: string;
    title?: string;
    description?: string;
    height?: number | string;
    showActions?: boolean;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'charts' | 'data' | 'general';
}

/**
 * 🎨 EMPTY STATE COMPONENT
 * Componente elegante para estados vazios com diferentes variantes
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    height = 300,
    showActions = false,
    primaryAction,
    secondaryAction,
    variant = 'general'
}) => {
    // Configurações por variante
    const getVariantConfig = () => {
        switch (variant) {
            case 'charts':
                return {
                    icon: icon || '📊',
                    title: title || 'Gráficos em Preparação',
                    description: description || 'Os gráficos aparecerão quando houver dados suficientes para análise. Compartilhe seus links para começar a coletar dados!'
                };
            case 'data':
                return {
                    icon: icon || '📈',
                    title: title || 'Sem Dados Disponíveis',
                    description: description || 'Ainda não há dados para exibir. Comece criando e compartilhando seus links encurtados.'
                };
            default:
                return {
                    icon: icon || '📋',
                    title: title || 'Nenhum Item Encontrado',
                    description: description || 'Não há itens para exibir no momento.'
                };
        }
    };

    const config = getVariantConfig();

    return (
        <EmptyStateContainer
            elevation={0}
            variant={variant as never}
            customHeight={height}
        >
            <EmptyStateIcon>
                {config.icon}
            </EmptyStateIcon>

            <EmptyStateTitle variant="h6">
                {config.title}
            </EmptyStateTitle>

            <EmptyStateDescription variant="body2">
                {config.description}
            </EmptyStateDescription>

            {showActions && (primaryAction || secondaryAction) && (
                <EmptyStateActions>
                    {primaryAction && (
                        <EmptyStateActionButton
                            buttonVariant="primary"
                            onClick={primaryAction.onClick}
                            size="medium"
                        >
                            {primaryAction.label}
                        </EmptyStateActionButton>
                    )}
                    {secondaryAction && (
                        <EmptyStateActionButton
                            buttonVariant="secondary"
                            onClick={secondaryAction.onClick}
                            size="medium"
                        >
                            {secondaryAction.label}
                        </EmptyStateActionButton>
                    )}
                </EmptyStateActions>
            )}
        </EmptyStateContainer>
    );
};

export default EmptyState;
