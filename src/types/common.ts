/**
 * 🔧 TIPOS COMUNS
 * Tipos utilitários e comuns usados em toda a aplicação
 */

import { ReactNode } from 'react';

// ========================================
// 🎯 UTILITY TYPES
// ========================================

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string | number;

export type Timestamp = string | Date;

// ========================================
// 📊 DATA TYPES
// ========================================

export interface BaseEntity {
    id: ID;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface TimestampedEntity {
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface SoftDeletableEntity extends TimestampedEntity {
    deleted_at: Timestamp | null;
}

// ========================================
// 🎨 UI TYPES
// ========================================

export type Size = 'small' | 'medium' | 'large';

export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type Color =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'inherit'
    | 'default';

export type Severity = 'error' | 'warning' | 'info' | 'success';

export type Position =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'ltr' | 'rtl';

export type Alignment = 'left' | 'center' | 'right' | 'justify';

export type VerticalAlignment = 'top' | 'middle' | 'bottom';

// ========================================
// 📱 RESPONSIVE TYPES
// ========================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// ========================================
// 🔄 STATE TYPES
// ========================================

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface AsyncState<T = unknown> {
    data: T | null;
    loading: boolean;
    error: string | null;
    status: Status;
}

export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface SortState {
    field: string;
    direction: 'asc' | 'desc';
}

export interface FilterState {
    [key: string]: unknown;
}

// ========================================
// 🎭 EVENT TYPES
// ========================================

export type EventHandler<T = unknown> = (event: T) => void;

export type ChangeHandler<T = unknown> = (value: T) => void;

export type SubmitHandler<T = unknown> = (data: T) => void | Promise<void>;

export type ErrorHandler = (error: Error | string) => void;

export type SuccessHandler<T = unknown> = (data: T) => void;

// ========================================
// 🌐 API TYPES
// ========================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';

export interface RequestConfig {
    method?: HttpMethod;
    headers?: Record<string, string>;
    timeout?: number;
    signal?: AbortSignal;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
}

// ========================================
// 📝 FORM TYPES
// ========================================

export type FieldValue = string | number | boolean | Date | null | undefined;

export type FieldError = string | null;

export interface FieldState {
    value: FieldValue;
    error: FieldError;
    touched: boolean;
    dirty: boolean;
}

export interface FormState<T = Record<string, FieldValue>> {
    values: T;
    errors: Partial<Record<keyof T, FieldError>>;
    touched: Partial<Record<keyof T, boolean>>;
    dirty: boolean;
    valid: boolean;
    submitting: boolean;
}

// ========================================
// 🔍 SEARCH TYPES
// ========================================

export interface SearchState {
    query: string;
    filters: FilterState;
    sort: SortState;
    pagination: PaginationState;
}

export interface SearchResult<T = unknown> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ========================================
// 📊 CHART TYPES
// ========================================

export type ChartType =
    | 'line'
    | 'area'
    | 'bar'
    | 'column'
    | 'pie'
    | 'donut'
    | 'scatter'
    | 'bubble'
    | 'heatmap'
    | 'radar';

export interface ChartPoint {
    x: string | number | Date;
    y: number;
    label?: string;
    color?: string;
}

export interface ChartSeries {
    name: string;
    data: ChartPoint[];
    color?: string;
    type?: ChartType;
}

// ========================================
// 🗂️ MENU TYPES
// ========================================

export interface MenuItem {
    id: string;
    label: string;
    icon?: ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    divider?: boolean;
    children?: MenuItem[];
}

export interface MenuSection {
    title?: string;
    items: MenuItem[];
}

// ========================================
// 🎨 THEME TYPES
// ========================================

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
    mode: ThemeMode;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
    borderRadius: number;
}

// ========================================
// 🔔 NOTIFICATION TYPES
// ========================================

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: Severity;
    duration?: number;
    actions?: NotificationAction[];
    timestamp: Date;
}

export interface NotificationAction {
    label: string;
    onClick: () => void;
    color?: Color;
}

// ========================================
// 🎯 ANALYTICS TYPES
// ========================================

export interface AnalyticsEvent {
    name: string;
    properties?: Record<string, unknown>;
    timestamp?: Date;
    userId?: string;
    sessionId?: string;
}

export interface AnalyticsPageView {
    page: string;
    title?: string;
    referrer?: string;
    timestamp?: Date;
    userId?: string;
    sessionId?: string;
}

// ========================================
// 🔐 PERMISSION TYPES
// ========================================

export type Permission = string;

export type Role = string;

export interface User {
    id: ID;
    name: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
}

// ========================================
// 📱 DEVICE TYPES
// ========================================

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
    type: DeviceType;
    os: string;
    browser: string;
    version: string;
    userAgent: string;
}

// ========================================
// 🌍 LOCATION TYPES
// ========================================

export interface Location {
    country: string;
    countryCode: string;
    region: string;
    city: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
}

// ========================================
// ⏰ TIME TYPES
// ========================================

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export type TimeRange = {
    start: Date;
    end: Date;
};

export type RelativeTimeRange =
    | 'last_hour'
    | 'last_24_hours'
    | 'last_7_days'
    | 'last_30_days'
    | 'last_90_days'
    | 'last_year'
    | 'all_time';

// ========================================
// 🎨 STYLE TYPES
// ========================================

export interface StyleProps {
    className?: string;
    style?: React.CSSProperties;
}

export interface SpacingProps {
    m?: number | string;
    mt?: number | string;
    mr?: number | string;
    mb?: number | string;
    ml?: number | string;
    mx?: number | string;
    my?: number | string;
    p?: number | string;
    pt?: number | string;
    pr?: number | string;
    pb?: number | string;
    pl?: number | string;
    px?: number | string;
    py?: number | string;
}

// ========================================
// 🔄 ASYNC TYPES
// ========================================

export interface AsyncOperation<T = unknown> {
    execute: () => Promise<T>;
    cancel?: () => void;
    retry?: () => Promise<T>;
}

export interface RetryOptions {
    maxAttempts: number;
    delay: number;
    backoff?: 'linear' | 'exponential';
    onRetry?: (attempt: number, error: Error) => void;
}

// ========================================
// 📦 COMPONENT TYPES
// ========================================

export interface ComponentWithChildren {
    children: ReactNode;
}

export interface ComponentWithClassName {
    className?: string;
}

export interface ComponentWithTestId {
    'data-testid'?: string;
}

export type BaseProps = ComponentWithChildren & ComponentWithClassName & ComponentWithTestId;

// ========================================
// 🔧 CONFIGURATION TYPES
// ========================================

export interface AppConfig {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    apiUrl: string;
    features: Record<string, boolean>;
}

export interface FeatureFlag {
    name: string;
    enabled: boolean;
    description?: string;
    rolloutPercentage?: number;
}
