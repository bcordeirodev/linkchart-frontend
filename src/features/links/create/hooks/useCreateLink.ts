/**
 * 🎯 USE CREATE LINK HOOK
 * Hook específico para criação de links com estado otimizado
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import { useLinks } from '../../hooks/useLinks';
import { linkFormSchema, defaultLinkFormValues } from '../../components/forms/LinkFormSchema';
import { CreateLinkFormData, CreateLinkState, CreateLinkCallbacks } from '../types';
import { formatDateForLaravel } from '../../utils/dateUtils';

interface UseCreateLinkOptions {
    onSuccess?: (link: any) => void;
    redirectOnSuccess?: boolean;
    autoSlugGeneration?: boolean;
}

interface UseCreateLinkReturn extends CreateLinkState, CreateLinkCallbacks {
    validateForm: () => boolean;
    resetForm: () => void;
    canSubmit: boolean;
}

/**
 * Hook especializado para criação de links
 * Gerencia estado, validação e submissão de forma otimizada
 */
export function useCreateLink({
    onSuccess,
    redirectOnSuccess = true,
    autoSlugGeneration = true
}: UseCreateLinkOptions = {}): UseCreateLinkReturn {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { createLink } = useLinks();

    // ========================================
    // 📊 ESTADO DO FORMULÁRIO
    // ========================================

    const [formData, setFormData] = useState<CreateLinkFormData>({
        ...defaultLinkFormValues,
        is_active: true // Por padrão, links criados são ativos
    } as CreateLinkFormData);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showUTM, setShowUTM] = useState(false);
    const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');

    // ========================================
    // 🔄 HANDLERS
    // ========================================

    const onFieldChange = useCallback((field: keyof CreateLinkFormData, value: any) => {
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

        // Auto-geração de slug se habilitado
        if (field === 'title' && autoSlugGeneration && value && !formData.slug) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);

            setFormData(prev => ({
                ...prev,
                slug
            }));
        }
    }, [errors, autoSlugGeneration, formData.slug]);

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
        try {
            linkFormSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error: any) {
            const newErrors: Record<string, string> = {};

            if (error.errors) {
                error.errors.forEach((err: any) => {
                    const field = err.path[0];
                    newErrors[field] = err.message;
                });
            }

            setErrors(newErrors);
            return false;
        }
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
            // Preparar payload limpo para criação
            const cleanData: any = {};

            // URL obrigatória - garantir que tem protocolo
            if (formData.original_url && formData.original_url.trim()) {
                let url = formData.original_url.trim();
                if (!/^https?:\/\//i.test(url)) {
                    url = `https://${url}`;
                }
                cleanData.original_url = url;
            }

            // Campos opcionais
            if (formData.title && formData.title.trim()) {
                cleanData.title = formData.title.trim();
            }
            if (formData.slug && formData.slug.trim()) {
                cleanData.slug = formData.slug.trim();
            }
            if (formData.description && formData.description.trim()) {
                cleanData.description = formData.description.trim();
            }

            // Boolean
            cleanData.is_active = Boolean(formData.is_active);

            // Datas - formato compatível com Laravel
            const formattedExpiresAt = formatDateForLaravel(formData.expires_at);
            if (formattedExpiresAt) {
                cleanData.expires_at = formattedExpiresAt;
            }

            const formattedStartsIn = formatDateForLaravel(formData.starts_in);
            if (formattedStartsIn) {
                cleanData.starts_in = formattedStartsIn;
            }

            // Click limit
            if (formData.click_limit && Number.isInteger(formData.click_limit) && formData.click_limit > 0) {
                cleanData.click_limit = formData.click_limit;
            }

            // UTM params
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(field => {
                const value = formData[field as keyof typeof formData];
                if (value && typeof value === 'string' && value.trim()) {
                    cleanData[field] = value.trim();
                }
            });

            console.log('🔍 Payload CREATE sendo enviado:', cleanData);

            const result = await createLink(cleanData);

            setStep('success');

            dispatch(showMessage({
                variant: 'success',
                message: '🎉 Link criado com sucesso!'
            }));

            onSuccess?.(result);

            if (redirectOnSuccess) {
                // Pequeno delay para mostrar a mensagem de sucesso
                setTimeout(() => navigate('/link'), 1500);
            }

        } catch (error: any) {
            console.error('Erro ao criar link:', error);
            dispatch(showMessage({
                variant: 'error',
                message: error.message || 'Erro ao criar link'
            }));
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, createLink, onSuccess, redirectOnSuccess, navigate, dispatch]);

    // ========================================
    // 🔄 RESET
    // ========================================

    const onReset = useCallback(() => {
        setFormData({
            ...defaultLinkFormValues,
            is_active: true
        } as CreateLinkFormData);
        setErrors({});
        setShowAdvanced(false);
        setShowUTM(false);
        setStep('form');
    }, []);

    const resetForm = onReset;

    // ========================================
    // ✨ COMPUTED PROPERTIES
    // ========================================

    const canSubmit = Boolean(formData.original_url && !loading);

    return {
        // Estado
        formData,
        loading,
        errors,
        showAdvanced,
        showUTM,
        step,

        // Callbacks
        onFieldChange,
        onToggleAdvanced,
        onToggleUTM,
        onSubmit,
        onReset,

        // Utilitários
        validateForm,
        resetForm,
        canSubmit
    };
}

export default useCreateLink;
