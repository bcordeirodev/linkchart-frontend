/**
 * 🎯 CREATE LINK FORM
 * Formulário especializado para criação de links
 */


import { Typography } from '@mui/material';
import { LinkFormFieldsSimple } from '../../components/forms/LinkFormFieldsSimple';
import { useCreateLink } from '../hooks/useCreateLink';
import { CreateLinkFormProps } from '../types';
import { CreateFormActions } from '@/shared/ui/patterns';
import {
    FormPaper,
    FormHeader,
    FormFieldsContainer,
    FormActionsContainer,
    SuccessPaper
} from '../../components/styles/FormSections.styled';

/**
 * Formulário de criação de links otimizado
 * Usa hook especializado e validação Zod
 */
export function CreateLinkForm({
    onSuccess,
    showBackButton = false
}: CreateLinkFormProps) {
    const {
        formData,
        loading,
        errors,
        showAdvanced,
        showUTM,
        step,
        onFieldChange,
        onToggleAdvanced,
        onToggleUTM,
        onSubmit,
        onReset,
        canSubmit
    } = useCreateLink({
        onSuccess,
        redirectOnSuccess: true,
        autoSlugGeneration: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    if (step === 'success') {
        return (
            <SuccessPaper elevation={2}>
                <Typography variant="h5" color="success.main" gutterBottom>
                    ✅ Link criado com sucesso!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Redirecionando para a lista de links...
                </Typography>
            </SuccessPaper>
        );
    }

    return (
        <FormPaper elevation={2}>
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <FormHeader>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        🔗 Criar Novo Link
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Transforme URLs longas em links curtos e rastreáveis
                    </Typography>
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
                        isEdit={false}
                    />
                </FormFieldsContainer>

                {/* Actions */}
                <FormActionsContainer>
                    <CreateFormActions
                        loading={loading}
                        canSubmit={canSubmit}
                        onSubmit={onSubmit}
                        onCancel={() => window.history.back()}
                        onReset={onReset}
                    />
                </FormActionsContainer>
            </form>
        </FormPaper>
    );
}

export default CreateLinkForm;
