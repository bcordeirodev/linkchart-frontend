/**
 * ✏️ EDIT LINK FORM
 * Formulário especializado para edição de links
 */


import {
    Typography,
    Stack,
    Button,
    Alert,
    Chip
} from '@mui/material';

import { LinkFormFieldsSimple } from '../../components/forms/LinkFormFieldsSimple';
import { useEditLink } from '../hooks/useEditLink';
import { EditLinkFormProps } from '../types';
import { EditFormActions } from '@/shared/ui/patterns';
import { AppIcon } from '@/lib/icons';
import {
    FormPaper,
    FormHeader,
    FormFieldsContainer,
    FormActionsContainer,
    StatePaper
} from '../../components/styles/FormSections.styled';

/**
 * Formulário de edição de links otimizado
 * Detecta mudanças e oferece reset para valores originais
 */
export function EditLinkForm({
    linkId,
    onSuccess,
    showBackButton = false
}: EditLinkFormProps) {
    const {
        formData,
        originalData,
        loading,
        fetchingData,
        errors,
        showAdvanced,
        showUTM,
        hasChanges,
        onFieldChange,
        onToggleAdvanced,
        onToggleUTM,
        onSubmit,
        onReset,
        onCancel,
        canSubmit
    } = useEditLink({
        linkId,
        onSuccess,
        redirectOnSuccess: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    if (fetchingData) {
        return (
            <StatePaper elevation={2}>
                <Alert severity="info" icon={<AppIcon intent="loading" size={20} />}>
                    <Typography variant="body1">
                        Carregando dados do link...
                    </Typography>
                </Alert>
            </StatePaper>
        );
    }

    if (!originalData) {
        return (
            <StatePaper elevation={2}>
                <Alert
                    severity="error"
                    action={
                        <Button size="small" onClick={onCancel}>
                            Voltar
                        </Button>
                    }
                >
                    <Typography variant="h6" component="div">
                        Link não encontrado
                    </Typography>
                    <Typography variant="body2">
                        O link solicitado não foi encontrado ou você não tem permissão para editá-lo.
                    </Typography>
                </Alert>
            </StatePaper>
        );
    }

    return (
        <FormPaper elevation={2}>
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <FormHeader>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <div>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                ✏️ Editar Link
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Modifique as configurações do seu link
                            </Typography>
                        </div>

                        {hasChanges && (
                            <Chip
                                label="Alterações pendentes"
                                color="warning"
                                size="small"
                                icon={<AppIcon intent="loading" size={16} />}
                            />
                        )}
                    </Stack>
                </FormHeader>

                {/* Form Fields */}
                <FormFieldsContainer>
                    <LinkFormFieldsSimple
                        formData={formData}
                        errors={errors}
                        onChange={onFieldChange}
                        showAdvanced={showAdvanced}
                        onToggleAdvanced={onToggleAdvanced}
                        showUTM={showUTM}
                        onToggleUTM={onToggleUTM}
                        isEdit={true}
                    />
                </FormFieldsContainer>

                {/* Actions */}
                <FormActionsContainer>
                    <EditFormActions
                        loading={loading}
                        canSubmit={canSubmit}
                        hasChanges={hasChanges}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        onReset={onReset}
                    />
                </FormActionsContainer>
            </form>
        </FormPaper>
    );
}

export default EditLinkForm;
