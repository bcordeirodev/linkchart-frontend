/**
 * ✏️ USE EDIT LINK HOOK
 * Hook específico para edição de links com carregamento otimizado
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import { useLinks } from '../../hooks/useLinks';
import { linkFormSchema, defaultLinkFormValues } from '../../components/forms/LinkFormSchema';
import { EditLinkFormData, EditLinkState, EditLinkCallbacks } from '../types';
import { parseValidDate, formatDateForLaravel } from '../../utils/dateUtils';
import { LinkResponse } from '@/types';

interface UseEditLinkOptions {
    linkId: string;
    onSuccess?: (link: any) => void;
    redirectOnSuccess?: boolean;
}

interface UseEditLinkReturn extends EditLinkState, EditLinkCallbacks {
    validateForm: () => boolean;
    resetToOriginal: () => void;
    canSubmit: boolean;
}

/**
 * Hook especializado para edição de links
 * Gerencia carregamento, estado, validação e submissão
 */
export function useEditLink({
    linkId,
    onSuccess,
    redirectOnSuccess = false
}: UseEditLinkOptions): UseEditLinkReturn {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { getLink, updateLink } = useLinks();

    // ========================================
    // 📊 ESTADO DO FORMULÁRIO
    // ========================================

    const [formData, setFormData] = useState<EditLinkFormData>({
        ...defaultLinkFormValues
    } as EditLinkFormData);

    const [originalData, setOriginalData] = useState<LinkResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showUTM, setShowUTM] = useState(false);

    // ========================================
    // 📥 CARREGAMENTO DE DADOS
    // ========================================

    const loadLinkData = useCallback(async () => {
        if (!linkId) return;

        try {
            setFetchingData(true);
            const link = await getLink(linkId);

            // Converter dados da API para formato do formulário
            const convertedFormData: EditLinkFormData = {
                id: String(link.id),
                original_url: link.original_url,
                title: link.title || '',
                slug: link.slug || '',
                description: link.description || '',
                is_active: link.is_active,
                expires_at: parseValidDate(link.expires_at),
                starts_in: parseValidDate(link.starts_in),
                click_limit: undefined, // API pode não retornar
                // UTM params podem não existir na resposta da API
                utm_source: '',
                utm_medium: '',
                utm_campaign: '',
                utm_term: '',
                utm_content: ''
            };

            setFormData(convertedFormData);
            setOriginalData(link);

            // Mostrar seções avançadas se há dados
            if (link.expires_at || link.starts_in) {
                setShowAdvanced(true);
            }

        } catch (error: any) {
            dispatch(showMessage({
                variant: 'error',
                message: error.message || 'Erro ao carregar dados do link'
            }));
        } finally {
            setFetchingData(false);
        }
    }, [linkId, getLink, dispatch]);

    useEffect(() => {
        loadLinkData();
    }, [loadLinkData]);

    // ========================================
    // 🔄 HANDLERS
    // ========================================

    const onFieldChange = useCallback((field: keyof EditLinkFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpar erro do campo quando o usuário digita
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    }, [errors]);

    const onToggleAdvanced = useCallback((show: boolean) => {
        setShowAdvanced(show);
    }, []);

    const onToggleUTM = useCallback((show: boolean) => {
        setShowUTM(show);
    }, []);

    // ========================================
    // ✅ VALIDAÇÃO
    // ========================================

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        // Validação básica obrigatória
        if (!formData.original_url || !formData.original_url.trim()) {
            newErrors.original_url = 'URL é obrigatória';
        } else {
            // Validar formato da URL
            try {
                new URL(formData.original_url);
            } catch {
                newErrors.original_url = 'URL deve ter formato válido (ex: https://exemplo.com)';
            }
        }

        // Validar slug se fornecido
        if (formData.slug && formData.slug.trim()) {
            if (!/^[a-zA-Z0-9-_]+$/.test(formData.slug)) {
                newErrors.slug = 'Slug deve conter apenas letras, números, hífens e underscores';
            }
        }

        // Validar datas se fornecidas
        if (formData.starts_in) {
            const now = new Date();
            if (formData.starts_in < now) {
                newErrors.starts_in = 'Data de início deve ser no futuro';
            }
        }

        if (formData.expires_at) {
            const now = new Date();
            if (formData.expires_at <= now) {
                newErrors.expires_at = 'Data de expiração deve ser no futuro';
            }
        }

        if (formData.starts_in && formData.expires_at) {
            if (formData.starts_in >= formData.expires_at) {
                newErrors.starts_in = 'Data de início deve ser anterior à data de expiração';
            }
        }

        // Validar click_limit se fornecido
        if (formData.click_limit !== undefined && formData.click_limit !== null) {
            if (formData.click_limit < 1 || formData.click_limit > 1000000) {
                newErrors.click_limit = 'Limite deve estar entre 1 e 1.000.000';
            }
        }

        // Usar Zod como validação adicional
        try {
            linkFormSchema.parse(formData);
        } catch (error: any) {
            if (error.errors) {
                error.errors.forEach((err: any) => {
                    const field = err.path[0];
                    if (!newErrors[field]) { // Não sobrescrever erros customizados acima
                        newErrors[field] = err.message;
                    }
                });
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // ========================================
    // 📤 SUBMISSÃO
    // ========================================

    const onSubmit = useCallback(async () => {
        if (!validateForm()) {
            dispatch(showMessage({
                variant: 'error',
                message: 'Por favor, corrija os erros no formulário'
            }));
            return;
        }

        setLoading(true);
        try {
            // Preparar payload apenas com campos que foram alterados e são válidos
            const cleanData: any = {};

            // URL obrigatória - garantir que tem protocolo
            if (formData.original_url && formData.original_url.trim()) {
                let url = formData.original_url.trim();
                // Adicionar https:// se não tem protocolo
                if (!/^https?:\/\//i.test(url)) {
                    url = `https://${url}`;
                }
                cleanData.original_url = url;
            }

            // Campos opcionais - só incluir se não estão vazios
            if (formData.title && formData.title.trim()) {
                cleanData.title = formData.title.trim();
            }
            if (formData.slug && formData.slug.trim()) {
                cleanData.slug = formData.slug.trim();
            }
            if (formData.description !== undefined && formData.description !== null) {
                cleanData.description = formData.description.trim() || '';
            }

            // Boolean sempre incluir
            cleanData.is_active = Boolean(formData.is_active);

            // Datas - converter para formato aceito pelo back-end
            const formattedExpiresAt = formatDateForLaravel(formData.expires_at);
            if (formattedExpiresAt) {
                cleanData.expires_at = formattedExpiresAt;
            }

            const formattedStartsIn = formatDateForLaravel(formData.starts_in);
            if (formattedStartsIn) {
                cleanData.starts_in = formattedStartsIn;
            }

            // Click limit - só incluir se é um número válido
            if (formData.click_limit && Number.isInteger(formData.click_limit) && formData.click_limit > 0) {
                cleanData.click_limit = formData.click_limit;
            }

            // UTM params - só incluir se não estão vazios
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(field => {
                const value = formData[field as keyof typeof formData];
                if (value && typeof value === 'string' && value.trim()) {
                    cleanData[field] = value.trim();
                }
            });

            // Debug: Log do payload limpo
            console.log('🔍 Payload limpo sendo enviado:', cleanData);
            console.log('🔍 Dados originais:', originalData);

            const result = await updateLink(linkId, cleanData);

            dispatch(showMessage({
                variant: 'success',
                message: '✅ Link atualizado com sucesso!'
            }));

            onSuccess?.(result);

            if (redirectOnSuccess) {
                setTimeout(() => navigate('/link'), 1500);
            }

        } catch (error: any) {
            console.error('Erro ao atualizar link:', error);
            console.log('🔍 Error object:', error);
            console.log('🔍 Error message:', error.message);
            console.log('🔍 Error status:', error.status);
            console.log('🔍 Error data:', error.data);

            // Se é erro 422, tentar extrair erros específicos de validação
            if (error.status === 422 && error.data) {
                const errorData = error.data as any;

                // Se há erros específicos de campos, aplicá-los ao formulário
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const backendErrors: Record<string, string> = {};

                    Object.entries(errorData.errors).forEach(([field, messages]) => {
                        const messageArray = Array.isArray(messages) ? messages : [messages];
                        backendErrors[field] = messageArray.join(', ');
                    });

                    setErrors(backendErrors);

                    dispatch(showMessage({
                        variant: 'error',
                        message: 'Corrija os erros destacados nos campos'
                    }));
                } else {
                    dispatch(showMessage({
                        variant: 'error',
                        message: errorData.message || error.message || 'Erro de validação no servidor'
                    }));
                }
            } else {
                dispatch(showMessage({
                    variant: 'error',
                    message: error.message || 'Erro ao atualizar link'
                }));
            }
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, updateLink, linkId, onSuccess, redirectOnSuccess, navigate, dispatch]);

    // ========================================
    // 🔄 RESET
    // ========================================

    const onReset = useCallback(() => {
        if (originalData) {
            const resetFormData: EditLinkFormData = {
                id: String(originalData.id),
                original_url: originalData.original_url,
                title: originalData.title || '',
                slug: originalData.slug || '',
                description: originalData.description || '',
                is_active: originalData.is_active,
                expires_at: originalData.expires_at ? new Date(originalData.expires_at) : null,
                starts_in: originalData.starts_in ? new Date(originalData.starts_in) : null,
                click_limit: undefined,
                utm_source: '',
                utm_medium: '',
                utm_campaign: '',
                utm_term: '',
                utm_content: ''
            };

            setFormData(resetFormData);
            setErrors({});
        }
    }, [originalData]);

    const resetToOriginal = onReset;

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // ========================================
    // ✨ COMPUTED PROPERTIES
    // ========================================

    // Verifica se há mudanças em relação aos dados originais
    const hasChanges = originalData ? (
        formData.original_url !== originalData.original_url ||
        formData.title !== (originalData.title || '') ||
        formData.slug !== (originalData.slug || '') ||
        formData.description !== (originalData.description || '') ||
        formData.is_active !== originalData.is_active ||
        (formData.expires_at?.toISOString() || null) !== originalData.expires_at ||
        (formData.starts_in?.toISOString() || null) !== originalData.starts_in
    ) : false;

    const canSubmit = Boolean(formData.original_url && !loading && !fetchingData && hasChanges);

    return {
        // Estado
        formData,
        originalData,
        loading,
        fetchingData,
        errors,
        showAdvanced,
        showUTM,
        hasChanges,

        // Callbacks
        onFieldChange,
        onToggleAdvanced,
        onToggleUTM,
        onSubmit,
        onReset,
        onCancel,

        // Utilitários
        validateForm,
        resetToOriginal,
        canSubmit
    };
}

export default useEditLink;
