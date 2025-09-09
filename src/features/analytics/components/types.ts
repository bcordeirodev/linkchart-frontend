/**
 * 📊 ANALYTICS COMPONENT TYPES
 * Tipos específicos para componentes de analytics
 */

import type { AnalyticsData } from '@/types';

export interface ChartsProps {
	data: AnalyticsData | null;
	variant?: 'dashboard' | 'analytics' | 'full';
	height?: number;
	showAllCharts?: boolean;
}

export interface AnalyticsProps {
	data: AnalyticsData | null;
	linkId?: string;
	showHeader?: boolean;
	showTabs?: boolean;
	linksData?: any[];
	showDashboardTab?: boolean;
}

export interface MetricsProps {
	data: AnalyticsData | null;
	totalLinks?: number;
	activeLinks?: number;
	totalClicks?: number;
	avgClicksPerLink?: number;
	variant?: 'dashboard' | 'analytics' | 'both';
	categories?: string[];
	showTitle?: boolean;
}
