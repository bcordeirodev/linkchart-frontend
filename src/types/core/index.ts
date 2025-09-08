/**
 * @fileoverview Exports centralizados dos tipos core
 * @author Link Chart Team
 * @version 1.0.0
 */

// Re-exports de tipos comuns
export type {
    ID,
    ISODateString,
    Percentage,
    ApiResponse,
    PaginationMeta,
    PaginatedResponse,
    LoadingState,
    Priority,
    Trend,
    TimePeriod,
    FilterConfig,
    SortConfig,
    BaseDataProps,
    BaseTitleProps,
    BaseConfigProps
} from './common';

// Re-exports de tipos da API
export type {
    DeviceData,
    CountryData,
    StateData,
    CityData,
    HourlyData,
    DayOfWeekData,
    BusinessInsight,
    HeatmapPoint,
    LinkInfo,
    OverviewMetrics
} from './api';

// Re-exports de tipos de autenticação
export type {
    User,
    UserResponse,
    LoginResponse,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest
} from './auth';

// Re-exports de tipos de links
export type {
    LinkCreateRequest,
    LinkUpdateRequest,
    LinkResponse,
    LinkStats,
    LinkFilters,
    LinksListResponse
} from './links';

// Re-exports de tipos de gráficos
export type {
    ChartType,
    ChartPoint,
    ChartSeries,
    ChartOptions,
    AxisConfig,
    ChartData,
    BaseChartProps
} from './charts';

// Re-exports de tipos de métricas
export type {
    MetricsTimeframe,
    MetricsFilter,
    MetricsTrend,
    MetricsComparison,
    MetricsDashboardResponse,
    MetricsCategoryResponse
} from './metrics';
