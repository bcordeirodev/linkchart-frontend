/**
 * 🎯 CREATE LINK TYPES
 * Tipos específicos para criação de links
 */

import { LinkFormData } from '../../components/forms/LinkFormSchema';

// ========================================
// 🎯 CREATE-SPECIFIC TYPES
// ========================================

export interface CreateLinkFormData extends LinkFormData {
    // Campos específicos para criação (se houver)
}

export interface CreateLinkState {
    formData: CreateLinkFormData;
    loading: boolean;
    errors: Record<string, string>;
    showAdvanced: boolean;
    showUTM: boolean;
    step: 'form' | 'preview' | 'success';
}

export interface CreateLinkCallbacks {
    onFieldChange: (field: keyof CreateLinkFormData, value: any) => void;
    onToggleAdvanced: (show: boolean) => void;
    onToggleUTM: (show: boolean) => void;
    onSubmit: () => Promise<void>;
    onReset: () => void;
}

// ========================================
// 🎨 UI TYPES
// ========================================

export interface CreateLinkPageProps {
    // Props específicas da página de criação
}

export interface CreateLinkFormProps {
    onSuccess?: (link: any) => void;
    showBackButton?: boolean;
}

// ========================================
// 📊 ANALYTICS TYPES
// ========================================

export interface CreateLinkMetrics {
    totalCreated: number;
    successRate: number;
    avgTimeToCreate: number;
    mostUsedFeatures: string[];
}

export type CreateLinkStep = 'form' | 'preview' | 'success';
export type CreateLinkMode = 'simple' | 'advanced';
