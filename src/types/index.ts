/**
 * 📦 TIPOS CENTRALIZADOS
 * Exportação centralizada de todos os tipos da aplicação
 * Organize importações: import { Type1, Type2 } from '@/types'
 */

// ========================================
// 🌐 API TYPES
// ========================================

export type {
    // Base API
    ApiResponse,
    ApiError,
    PaginatedResponse,

    // Auth API
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserResponse,

    // Links API
    LinkCreateRequest,
    LinkUpdateRequest,
    LinkResponse,

    // Analytics API
    AnalyticsResponse,
    HeatmapPoint,
    CountryData,
    StateData,
    CityData,
    HourlyData,
    DayOfWeekData,
    DeviceData,
    BusinessInsight,

    // Metrics API
    MetricsDashboardResponse,
    MetricsCategoryResponse,

    // Performance API
    LinkPerformanceResponse,
} from './api';

// ========================================
// 🧩 COMPONENT TYPES
// ========================================

export type {
    // Base Components
    BaseComponentProps,
    LoadingProps,
    DataComponentProps,

    // Analytics Components
    AnalyticsProps,
    MetricsProps,
    ChartsProps,

    // Chart Components
    ChartDataPoint,
    ChartSeries,
    ChartOptions,
    ChartProps,
    ApexChartWrapperProps,

    // Metric Card
    MetricCardProps,

    // Form Components
    FormFieldProps,
    LinkFormProps,
    LinkFormData,
    URLShortenerFormProps,

    // Table Components
    TableColumn,
    TableProps,

    // Layout Components
    LayoutProps,
    BreadcrumbItem,
    HeaderProps,

    // UI Components
    TabPanelProps,
    TabsProps,
    TabItem,
    ModalProps,

    // Link Components
    LinkData,
    LinksHeaderProps,
    LinksFiltersProps,

    // Redirect Components
    RedirectProps,
    RedirectStatsProps,

    // Profile Components
    ProfileFormProps,
    UserProfileData,

    // Search Components
    SearchProps,

    // Theme Components
    ThemeToggleProps,
    ColorSchemeProps,
} from './components';

// ========================================
// 🎣 HOOK TYPES
// ========================================

export type {
    // Base Hooks
    UseAsyncState,
    UseAsyncActions,
    UseAsync,

    // Links Hooks
    UseLinksState,
    UseLinksActions,
    UseLinks,
    LinkCreateData,
    LinkUpdateData,

    // Analytics Hooks
    UseAnalyticsState,
    UseAnalyticsActions,
    UseAnalytics,
    UseAnalyticsOptions,

    // Metrics Hooks
    UseMetricsState,
    UseMetricsActions,
    UseMetrics,

    // Performance Hooks
    UsePerformanceState,
    UsePerformanceActions,
    UsePerformance,

    // Auth Hooks
    UseAuthState,
    UseAuthActions,
    UseAuth,
    AuthUser,
    RegisterData,

    // Form Hooks
    UseFormState,
    UseFormActions,
    UseForm,
    UseFormOptions,
    ValidationSchema,
    ValidationRule,

    // Link Form Hooks
    UseLinkFormState,
    UseLinkFormActions,
    UseLinkForm,
    LinkFormValues,

    // Utility Hooks
    UseClipboardState,
    UseClipboardActions,
    UseClipboard,
    UseDebounceOptions,
    UseLocalStorageOptions,
    UseLocalStorage,

    // API Hooks
    UseApiOptions,
    UseApiState,
    UseApiActions,
    UseApi,
    RequestOptions,

    // Responsive Hooks
    UseBreakpointState,
    UseMediaQueryState,

    // Redirect Hooks
    UseRedirectOptions,
    UseRedirectState,
    UseRedirectActions,
    UseRedirect,
} from './hooks';

// ========================================
// 🔧 COMMON TYPES
// ========================================

export type {
    // Utility Types
    OptionalFields,
    RequiredFields,
    DeepPartial,
    DeepRequired,
    Nullable,
    Optional,
    ID,
    Timestamp,

    // Data Types
    BaseEntity,
    TimestampedEntity,
    SoftDeletableEntity,

    // UI Types
    Size,
    Variant,
    Color,
    Severity,
    Position,
    Orientation,
    Direction,
    Alignment,
    VerticalAlignment,

    // Responsive Types
    Breakpoint,
    ResponsiveValue,

    // State Types
    Status,
    LoadingState,
    AsyncState,
    PaginationState,
    SortState,
    FilterState,

    // Event Types
    EventHandler,
    ChangeHandler,
    SubmitHandler,
    ErrorHandler,
    SuccessHandler,

    // API Types
    HttpMethod,
    ContentType,
    RequestConfig,

    // Form Types
    FieldValue,
    FieldError,
    FieldState,
    FormState,

    // Search Types
    SearchState,
    SearchResult,

    // Chart Types
    ChartType,
    ChartPoint,

    // Menu Types
    MenuItem,
    MenuSection,

    // Theme Types
    ThemeMode,
    ThemeConfig,

    // Notification Types
    Notification,
    NotificationAction,

    // Analytics Types
    AnalyticsEvent,
    AnalyticsPageView,

    // Permission Types
    Permission,
    Role,
    User,

    // Device Types
    DeviceType,
    DeviceInfo,

    // Location Types
    Location,

    // Time Types
    TimeUnit,
    TimeRange,
    RelativeTimeRange,

    // Style Types
    StyleProps,
    SpacingProps,

    // Async Types
    AsyncOperation,
    RetryOptions,

    // Component Types
    ComponentWithChildren,
    ComponentWithClassName,
    ComponentWithTestId,
    BaseProps,

    // Configuration Types
    AppConfig,
    FeatureFlag,
} from './common';

// ========================================
// 📊 DOMAIN-SPECIFIC TYPES
// ========================================

// Analytics
export type {
    AnalyticsData,
    ClicksByDay,
    ClicksByCountry,
    ClicksByCity,
    ClicksByDevice,
    ClicksByUserAgent,
    ClicksByReferer,
    ClicksByCampaign,
    ClicksGroupedByLinkAndDay,
    TopLink,
    LinksCreatedByDay,
} from './analytics';

// Links
export type {
    LinkStats,
    LinkAnalytics,
    LinkFilters,
    LinkBulkAction,
} from './link';

// Performance
export type {
    LinkPerformanceSummary,
    LinkHourlyData,
    LinkPerformanceDetails,
    LinkPerformanceDashboard,
    PerformanceComponentProps,
} from './linkPerformance';

// Metrics
export type {
    MetricsTimeframe,
    MetricsFilter,
    MetricsTrend,
    MetricsComparison,
} from './metrics';

// Shortener
export type {
    IShortUrl,
    ShortenRequest,
    ShortenResponse,
    URLValidationResult,
    ShortenStats,
} from './shorter';

// User
export type {
    IUser,
    UserProfile,
    UserPreferences,
    UserSession,
    UserActivity,
} from './user';

// ========================================
// 🔄 RE-EXPORTS FOR BACKWARD COMPATIBILITY
// ========================================

// Global interfaces (mantidas para compatibilidade)
import type { LinkCreateRequest, LinkUpdateRequest, LinkResponse } from './api';

export type ILinkCreate = LinkCreateRequest;
export type ILinkUpdate = LinkUpdateRequest;
export type ILinkResponse = LinkResponse;
