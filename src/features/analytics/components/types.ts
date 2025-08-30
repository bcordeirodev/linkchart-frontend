/**
 * 📊 TIPOS UNIFICADOS PARA ANALYTICS
 * Re-exporta tipos centralizados e adiciona configurações específicas
 * @deprecated Use types from @/types instead
 */

import { ReactNode } from 'react';

// ========================================
// 📊 RE-EXPORTS FROM CENTRALIZED TYPES
// ========================================

// Local component types
export interface AnalyticsProps {
    data?: any;
    loading?: boolean;
    error?: string | null;
    linkId?: string;
    showHeader?: boolean;
    showTabs?: boolean;
    linksData?: any[];
    showDashboardTab?: boolean;
}

export interface MetricsProps {
    summary?: any;
    loading?: boolean;
}

export interface ChartsProps {
    data?: any;
    loading?: boolean;
    variant?: 'analytics' | 'dashboard' | 'full';
    height?: number;
    showAllCharts?: boolean;
}

export interface LinkData {
    id: string;
    url: string;
    clicks: number;
    created_at: string;
}

// ========================================
// 🎯 UNIFIED ANALYTICS SPECIFIC TYPES
// ========================================

export interface DashboardViewConfig {
    showMetrics: boolean;
    showTopLinks: boolean;
    showQuickActions: boolean;
    showCharts: boolean;
    chartsVariant: 'dashboard' | 'analytics' | 'full';
}

export interface AnalyticsViewConfig {
    showHeader: boolean;
    showMetrics: boolean;
    showTabs: boolean;
    showSpecializedAnalysis: boolean;
    defaultTab: number;
}

export interface QuickAction {
    title: string;
    description: string;
    icon: ReactNode;
    color: string;
    gradient: string;
    path: string;
}

export interface AnalyticsTab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}

export interface AnalyticsSection {
    id: string;
    title: string;
    description?: string;
    component: ReactNode;
    loading?: boolean;
    error?: string | null;
}
