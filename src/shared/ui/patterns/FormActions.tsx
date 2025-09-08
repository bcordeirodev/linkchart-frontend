/**
 * 📋 FORM ACTIONS - STANDARDIZED PATTERNS
 * Componente padronizado para ações de formulário
 */

import { Stack, Button, CircularProgress } from '@mui/material';
import { AppIcon } from '@/lib/icons';

// ========================================
// 🎯 INTERFACES
// ========================================

interface FormActionsProps {
    /** Modo do formulário */
    mode: 'create' | 'edit';
    /** Se está carregando */
    loading?: boolean;
    /** Se pode submeter */
    canSubmit?: boolean;
    /** Se há mudanças (para modo edit) */
    hasChanges?: boolean;
    /** Handler de submit */
    onSubmit: () => void;
    /** Handler de cancelar */
    onCancel: () => void;
    /** Handler de reset (opcional) */
    onReset?: () => void;
    /** Texto customizado do botão principal */
    submitText?: string;
    /** Texto customizado do botão cancelar */
    cancelText?: string;
    /** Layout das ações */
    layout?: 'end' | 'between' | 'center';
}

// ========================================
// 🧩 FORM ACTIONS COMPONENT
// ========================================

/**
 * Ações padronizadas para formulários
 * Adapta automaticamente baseado no modo (create/edit)
 */
export function FormActions({
    mode,
    loading = false,
    canSubmit = true,
    hasChanges = false,
    onSubmit,
    onCancel,
    onReset,
    submitText,
    cancelText,
    layout = 'between'
}: FormActionsProps) {
    const layoutProps = {
        end: { justifyContent: 'flex-end' },
        between: { justifyContent: 'space-between' },
        center: { justifyContent: 'center' }
    };

    return (
        <Stack
            direction="row"
            spacing={2}
            {...layoutProps[layout]}
            sx={{ width: '100%' }}
        >
            {/* Botão Cancelar */}
            {layout === 'between' && (
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    startIcon={<AppIcon intent="cancel" />}
                    sx={{ textTransform: 'none' }}
                >
                    {cancelText || 'Cancelar'}
                </Button>
            )}

            {/* Ações do lado direito */}
            <Stack direction="row" spacing={2}>
                {/* Botão Reset (apenas para edit com mudanças) */}
                {mode === 'edit' && hasChanges && onReset && (
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={onReset}
                        disabled={loading}
                        startIcon={<AppIcon intent="reset" />}
                        sx={{ textTransform: 'none' }}
                    >
                        Resetar
                    </Button>
                )}

                {/* Botão Cancelar (para layout end/center) */}
                {layout !== 'between' && (
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                        startIcon={<AppIcon intent="cancel" />}
                        sx={{ textTransform: 'none' }}
                    >
                        {cancelText || 'Cancelar'}
                    </Button>
                )}

                {/* Botão Principal */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    disabled={!canSubmit || loading}
                    startIcon={
                        loading ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <AppIcon intent={mode === 'create' ? 'create' : 'save'} />
                        )
                    }
                    sx={{
                        textTransform: 'none',
                        ...(mode === 'create' && {
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                            }
                        })
                    }}
                >
                    {submitText || (
                        loading
                            ? (mode === 'create' ? 'Criando...' : 'Salvando...')
                            : (mode === 'create' ? 'Criar' : 'Salvar Alterações')
                    )}
                </Button>
            </Stack>
        </Stack>
    );
}

// ========================================
// 🎯 SPECIALIZED FORM ACTIONS
// ========================================

/**
 * Ações para formulário de criação
 */
export function CreateFormActions({
    loading,
    canSubmit,
    onSubmit,
    onCancel,
    onReset
}: Omit<FormActionsProps, 'mode' | 'hasChanges'>) {
    return (
        <FormActions
            mode="create"
            loading={loading}
            canSubmit={canSubmit}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onReset={onReset}
        />
    );
}

/**
 * Ações para formulário de edição
 */
export function EditFormActions({
    loading,
    canSubmit,
    hasChanges,
    onSubmit,
    onCancel,
    onReset
}: Omit<FormActionsProps, 'mode'>) {
    return (
        <FormActions
            mode="edit"
            loading={loading}
            canSubmit={canSubmit}
            hasChanges={hasChanges}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onReset={onReset}
        />
    );
}

export default FormActions;
