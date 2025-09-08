/**
 * ✏️ EDIT LINK TYPES
 * Tipos específicos para edição de links
 */

import { LinkFormData } from '../../components/forms/LinkFormSchema';
import { LinkResponse } from '@/types';

// ========================================
// ✏️ EDIT-SPECIFIC TYPES
// ========================================

export interface EditLinkFormData extends LinkFormData {
    // Campos específicos para edição (se houver)
    id?: string;
}

export interface EditLinkState {
    formData: EditLinkFormData;
    originalData: LinkResponse | null;
    loading: boolean;
    fetchingData: boolean;
    errors: Record<string, string>;
    showAdvanced: boolean;
    showUTM: boolean;
    hasChanges: boolean;
}

export interface EditLinkCallbacks {
    onFieldChange: (field: keyof EditLinkFormData, value: any) => void;
    onToggleAdvanced: (show: boolean) => void;
    onToggleUTM: (show: boolean) => void;
    onSubmit: () => Promise<void>;
    onReset: () => void;
    onCancel: () => void;
}

// ========================================
// 🎨 UI TYPES
// ========================================

export interface EditLinkPageProps {
    linkId: string;
}

export interface EditLinkFormProps {
    linkId: string;
    onSuccess?: (link: any) => void;
    showBackButton?: boolean;
}

export interface EditLinkLoadingProps {
    message?: string;
}

export interface EditLinkErrorProps {
    error: string;
    onRetry?: () => void;
    onCancel?: () => void;
}

// ========================================
// 📊 ANALYTICS TYPES
// ========================================

export interface EditLinkMetrics {
    totalEdited: number;
    fieldsChanged: Record<string, number>;
    avgTimeToEdit: number;
    revertRate: number;
}

export type EditLinkStep = 'loading' | 'form' | 'saving' | 'success' | 'error';
export type EditLinkMode = 'basic' | 'advanced';
