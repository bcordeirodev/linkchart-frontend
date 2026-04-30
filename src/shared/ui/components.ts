/**
 * 🧩 TIPOS DE COMPONENTES
 * Props e tipos para todos os componentes da aplicação
 */

import type { AnalyticsData, LinkResponse, ChartOptions, ChartSeries } from '@/types';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

// ========================================
// 🎨 COMMON COMPONENT TYPES
// ========================================

export interface BaseComponentProps {
	children?: ReactNode;
	className?: string;
	sx?: SxProps<Theme>;
}

export interface LoadingProps {
	loading?: boolean;
	error?: string | null;
}

export interface DataComponentProps<T = unknown> extends BaseComponentProps, LoadingProps {
	data: T | null;
}

// ========================================
// 📊 ANALYTICS COMPONENT TYPES
// ========================================

export interface AnalyticsProps extends DataComponentProps<AnalyticsData> {
	linkId?: string;
	showHeader?: boolean;
	showTabs?: boolean;
	linksData?: LinkData[];
	showDashboardTab?: boolean;
}

export interface MetricsProps extends DataComponentProps<AnalyticsData> {
	totalLinks?: number;
	activeLinks?: number;
	totalClicks?: number;
	avgClicksPerLink?: number;
	variant?: 'dashboard' | 'analytics' | 'both';
	categories?: string[];
	showTitle?: boolean;
}

export interface ChartsProps extends DataComponentProps<AnalyticsData> {
	variant?: 'dashboard' | 'analytics' | 'full';
	height?: number;
	showAllCharts?: boolean;
}

// ========================================
// 📈 CHART COMPONENT TYPES
// ========================================

// ChartDataPoint, ChartSeries e ChartOptions movidos para @/types/core/charts
// @deprecated Use types from @/types instead

export interface ChartProps extends BaseComponentProps {
	series: ChartSeries[];
	options: ChartOptions;
	type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'heatmap';
	height?: number;
	width?: string | number;
}

export interface ApexChartWrapperProps extends BaseComponentProps {
	series: unknown[];
	options: Record<string, unknown>;
	type: string;
	height?: number;
	width?: string | number;
}

// ========================================
// 🎯 METRIC CARD TYPES
// ========================================

export interface MetricCardProps extends BaseComponentProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: ReactNode;
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

// ========================================
// 📋 FORM COMPONENT TYPES
// ========================================

export interface FormFieldProps extends BaseComponentProps {
	name: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
}

export interface LinkFormProps extends BaseComponentProps {
	initialData?: Partial<LinkResponse>;
	onSubmit: (data: LinkFormData) => void | Promise<void>;
	loading?: boolean;
	mode?: 'create' | 'edit';
}

export interface LinkFormData {
	original_url: string;
	title?: string;
	slug?: string;
	description?: string;
	expires_at?: string;
	starts_in?: string;
	is_active?: boolean;
	click_limit?: number;
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;
}

export interface URLShortenerFormProps extends BaseComponentProps {
	onSubmit: (url: string) => void | Promise<void>;
	loading?: boolean;
	placeholder?: string;
}

// ========================================
// 🗃️ TABLE COMPONENT TYPES
// ========================================

export interface TableColumn<T = unknown> {
	id: keyof T;
	label: string;
	minWidth?: number;
	align?: 'left' | 'right' | 'center';
	format?: (value: unknown) => string | ReactNode;
	sortable?: boolean;
}

export interface TableProps<T = unknown> extends BaseComponentProps {
	data: T[];
	columns: TableColumn<T>[];
	loading?: boolean;
	onRowClick?: (row: T) => void;
	pagination?: boolean;
	pageSize?: number;
	searchable?: boolean;
	selectable?: boolean;
	onSelectionChange?: (selectedIds: string[] | number[]) => void;
}

// ========================================
// 📱 LAYOUT COMPONENT TYPES
// ========================================

export interface LayoutProps extends BaseComponentProps {
	title?: string;
	breadcrumbs?: BreadcrumbItem[];
	actions?: ReactNode;
	sidebar?: ReactNode;
	footer?: ReactNode;
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
	icon?: ReactNode;
	current?: boolean;
}

export interface HeaderProps extends BaseComponentProps {
	title?: string;
	subtitle?: string;
	actions?: ReactNode;
	breadcrumbs?: BreadcrumbItem[];
}

// ========================================
// 🎭 UI COMPONENT TYPES
// ========================================

export interface TabPanelProps extends BaseComponentProps {
	value: number;
	index: number;
	children: ReactNode;
}

export interface TabsProps extends BaseComponentProps {
	tabs: TabItem[];
	value: number;
	onChange: (value: number) => void;
	orientation?: 'horizontal' | 'vertical';
	variant?: 'standard' | 'scrollable' | 'fullWidth';
}

export interface TabItem {
	label: string;
	content: ReactNode;
	disabled?: boolean;
	icon?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	fullWidth?: boolean;
	actions?: ReactNode;
}

// ========================================
// 🔗 LINK COMPONENT TYPES
// ========================================

export interface LinkData {
	id: number;
	title?: string;
	slug: string;
	original_url: string;
	clicks: number;
	is_active: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface LinksHeaderProps extends BaseComponentProps {
	title?: string;
	subtitle?: string;
	showCreateButton?: boolean;
	onCreateClick?: () => void;
}

export interface LinksFiltersProps extends BaseComponentProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	dateRange?: [Date | null, Date | null];
	onDateRangeChange?: (range: [Date | null, Date | null]) => void;
}

// ========================================
// 🎯 REDIRECT COMPONENT TYPES
// ========================================

export interface RedirectProps extends BaseComponentProps {
	slug: string;
	delay?: number;
	showCountdown?: boolean;
	onRedirect?: () => void;
}

export interface RedirectStatsProps extends BaseComponentProps {
	slug: string;
	showDetails?: boolean;
}

// ========================================
// 👤 PROFILE COMPONENT TYPES
// ========================================

export interface ProfileFormProps extends BaseComponentProps {
	initialData?: UserProfileData;
	onSubmit: (data: UserProfileData) => void | Promise<void>;
	loading?: boolean;
}

export interface UserProfileData {
	name: string;
	email: string;
	current_password?: string;
	password?: string;
	password_confirmation?: string;
}

// ========================================
// 🔍 SEARCH COMPONENT TYPES
// ========================================

export interface SearchProps extends BaseComponentProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	debounceMs?: number;
	onSearch?: (value: string) => void;
}

// ========================================
// 🎨 THEME COMPONENT TYPES
// ========================================

export interface ThemeToggleProps extends BaseComponentProps {
	variant?: 'icon' | 'switch' | 'button';
}

export interface ColorSchemeProps {
	mode: 'light' | 'dark';
	toggleMode: () => void;
}
