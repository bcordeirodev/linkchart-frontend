/**
 * 🎯 LINKS HEADER ACTIONS
 * Componente de ações para header Links mantendo todas as funcionalidades
 */

import { Button } from '@mui/material';
import { AppIcon } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';

interface LinksHeaderActionsProps {
    onCreateNew?: () => void;
}

/**
 * Componente de ações do header Links
 * Mantém toda a funcionalidade do LinksHeader original
 */
export function LinksHeaderActions({ onCreateNew }: LinksHeaderActionsProps) {
    const navigate = useNavigate();

    const handleCreateNew = () => {
        if (onCreateNew) {
            onCreateNew();
        } else {
            navigate('/link/create');
        }
    };

    return (
        <Button
            variant="contained"
            size="large"
            startIcon={
                <AppIcon
                    intent="create"
                    size={20}
                />
            }
            onClick={handleCreateNew}
            sx={{ textTransform: 'none' }}
        >
            Criar novo link
        </Button>
    );
}

export default LinksHeaderActions;
