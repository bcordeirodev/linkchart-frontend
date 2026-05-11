/**
 * Shared hook return-shape and option types.
 *
 * Conventions:
 * - `Use<Domain>State` and `Use<Domain>Actions` are kept separate so consumers
 *   can re-use just the state (e.g. for context values) or just the action
 *   surface (e.g. for ref-based imperative APIs).
 * - The merged `Use<Domain>` interface (extending both halves) is the typical
 *   public contract returned by the corresponding hook implementation in this
 *   folder.
 *
 * Hook implementations live next to this file (`useClipboard`, `useDebounce`,
 * etc.); add a new section here whenever a hook gains a non-trivial public
 * shape so consumers can `import type` instead of restating the type inline.
 */

import type { LinkResponse, MetricsDashboardResponse } from "@/types";

// ========================================
// 🔄 BASE HOOK TYPES
// ========================================

export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseAsyncActions<T> {
  execute: () => Promise<void>;
  reset: () => void;
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface UseAsync<T> extends UseAsyncState<T>, UseAsyncActions<T> {}

// ========================================
// 🔗 LINKS HOOKS TYPES
// ========================================

export interface UseLinksState {
  links: LinkResponse[];
  loading: boolean;
  error: string | null;
}

export interface UseLinksActions {
  loadLinks: () => Promise<void>;
  createLink: (data: LinkCreateData) => Promise<LinkResponse>;
  updateLink: (id: string, data: LinkUpdateData) => Promise<LinkResponse>;
  deleteLink: (id: number) => Promise<void>;
  getLink: (id: string) => Promise<LinkResponse>;
}

export interface UseLinks extends UseLinksState, UseLinksActions {}

export interface LinkCreateData {
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

export interface LinkUpdateData {
  original_url?: string;
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

// ========================================
// 📊 ANALYTICS HOOKS TYPES
// ========================================

export interface UseAnalyticsState {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface UseAnalyticsActions {
  loadAnalytics: (linkId?: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  clearAnalytics: () => void;
}

export interface UseAnalytics extends UseAnalyticsState, UseAnalyticsActions {}

export interface UseAnalyticsOptions {
  linkId?: string;
  autoLoad?: boolean;
  refreshInterval?: number;
  onError?: (error: string) => void;
  onSuccess?: (data: Record<string, unknown>) => void;
}

// ========================================
// 📈 METRICS HOOKS TYPES
// ========================================

export interface UseMetricsState {
  dashboard: MetricsDashboardResponse | null;
  category: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

export interface UseMetricsActions {
  loadDashboard: (timeframe?: string) => Promise<void>;
  loadCategory: (category: string, timeframe?: string) => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

export interface UseMetrics extends UseMetricsState, UseMetricsActions {}

// ========================================
// 🚀 PERFORMANCE HOOKS TYPES
// ========================================

export interface UsePerformanceState {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

export interface UsePerformanceActions {
  loadPerformance: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
}

export interface UsePerformance
  extends UsePerformanceState,
    UsePerformanceActions {}

// ========================================
// 🔐 AUTH HOOKS TYPES
// ========================================

export interface UseAuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UseAuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export interface UseAuth extends UseAuthState, UseAuthActions {}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role?: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ========================================
// 📋 FORM HOOKS TYPES
// ========================================

export interface UseFormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface UseFormActions<T> {
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>,
  ) => (e?: React.FormEvent) => void;
  reset: (values?: Partial<T>) => void;
  validate: () => boolean;
}

export interface UseForm<T> extends UseFormState<T>, UseFormActions<T> {}

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule[];
};

export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern";
  value?: unknown;
  message: string;
}

// ========================================
// 🎯 LINK FORM HOOKS TYPES
// ========================================

export interface UseLinkFormState {
  values: LinkFormValues;
  errors: Partial<Record<keyof LinkFormValues, string>>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface UseLinkFormActions {
  handleSubmit: (
    onSubmit: (values: LinkFormValues) => void | Promise<void>,
  ) => (e?: React.FormEvent) => void;
  setValue: (field: keyof LinkFormValues, value: unknown) => void;
  reset: () => void;
  generateSlug: () => void;
}

export interface UseLinkForm extends UseLinkFormState, UseLinkFormActions {}

export interface LinkFormValues {
  original_url: string;
  title: string;
  slug: string;
  description: string;
  expires_at: string;
  starts_in: string;
  is_active: boolean;
  click_limit: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

// ========================================
// 🛠️ UTILITY HOOKS TYPES
// ========================================

export interface UseClipboardState {
  copied: boolean;
  error: string | null;
}

export interface UseClipboardActions {
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

export interface UseClipboard extends UseClipboardState, UseClipboardActions {}

export interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface UseLocalStorage<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// ========================================
// 🌐 API HOOKS TYPES
// ========================================

export interface UseApiOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: unknown) => void;
  onSuccess?: (data: unknown) => void;
}

export interface UseApiState {
  loading: boolean;
  error: string | null;
}

export interface UseApiActions {
  get: <T>(url: string, options?: RequestOptions) => Promise<T>;
  post: <T>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ) => Promise<T>;
  put: <T>(url: string, data?: unknown, options?: RequestOptions) => Promise<T>;
  patch: <T>(
    url: string,
    data?: unknown,
    options?: RequestOptions,
  ) => Promise<T>;
  delete: <T>(url: string, options?: RequestOptions) => Promise<T>;
}

export interface UseApi extends UseApiState, UseApiActions {}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

// ========================================
// 📱 RESPONSIVE HOOKS TYPES
// ========================================

export interface UseBreakpointState {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  current: "xs" | "sm" | "md" | "lg" | "xl";
}

export interface UseMediaQueryState {
  matches: boolean;
}

// ========================================
// 🔄 REDIRECT HOOKS TYPES
// ========================================

export interface UseRedirectOptions {
  delay?: number;
  showCountdown?: boolean;
  onRedirect?: () => void;
  onError?: (error: string) => void;
}

export interface UseRedirectState {
  countdown: number;
  redirecting: boolean;
  error: string | null;
}

export interface UseRedirectActions {
  startRedirect: (url: string) => void;
  cancelRedirect: () => void;
}

export interface UseRedirect extends UseRedirectState, UseRedirectActions {}
