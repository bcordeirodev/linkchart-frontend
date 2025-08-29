import { AnalyticsData } from '@/types/analytics';

// ========================================
// 📊 TIPOS UNIFICADOS PARA ANALYTICS E DASHBOARD
// ========================================

export interface AnalyticsProps {
    data: AnalyticsData | null;
    loading?: boolean;
    error?: string | null;
    linkId?: string;
    showHeader?: boolean;
    showTabs?: boolean;
    linksData?: LinkData[];
    showDashboardTab?: boolean;
}

// DashboardProps removido - funcionalidade integrada ao Analytics

export interface MetricsProps {
    data: AnalyticsData | null;
    totalLinks?: number;
    activeLinks?: number;
    totalClicks?: number;
    avgClicksPerLink?: number;
    variant?: 'dashboard' | 'analytics' | 'both';
}

export interface ChartsProps {
    data: AnalyticsData | null;
    variant?: 'dashboard' | 'analytics' | 'full';
    height?: number;
    showAllCharts?: boolean;
}

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

export interface LinkData {
    id: number;
    title?: string;
    slug: string;
    original_url: string;
    clicks: number;
    is_active: boolean;
}

export interface QuickAction {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
    path: string;
}
