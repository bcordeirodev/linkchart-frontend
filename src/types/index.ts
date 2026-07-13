/**
 * @fileoverview Entry point principal para todos os tipos da aplicação
 * @author Link Charts Team
 * @version 1.0.0
 */

// ========================================
// 🏗️ TIPOS CORE (Base da aplicação)
// ========================================
export type {
  // Tipos comuns
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

  // Props base para componentes
  BaseDataProps,
  BaseTitleProps,
  BaseConfigProps,

  // Tipos básicos da API
  DeviceData,
  CountryData,
  StateData,
  CityData,
  HourlyData,
  DayOfWeekData,
  BusinessInsight,
  HeatmapPoint,
  LinkInfo,
  OverviewMetrics,
  MetricsDashboardResponse,
  MetricsCategoryResponse,

  // Tipos de autenticação
  User,
  UserResponse,
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,

  // Tipos de links
  LinkCreateRequest,
  LinkUpdateRequest,
  LinkResponse,
  LinkStats,
  LinkFilters,
  LinksListResponse,

  // Tipos de tags
  Tag,
  TagCreateRequest,
  TagUpdateRequest,

  // Tipos de gráficos
  ChartType,
  ChartPoint,
  ChartSeries,
  ChartOptions,
  AxisConfig,
  ChartData,
  BaseChartProps,
} from "./core";

// ========================================
// 🔗 TIPOS DE META DE LINKS
// ========================================
export type {
  SparklinePoint,
  LinkTrend,
  LinkPreviewMeta,
  LinkHealthStatus,
  LinkHealth,
  LinkMeta,
  BatchMetaResponse,
} from "./core/link-meta";

// ========================================
// 📊 TIPOS DE ANALYTICS (Módulo completo)
// ========================================
export type {
  // Analytics base
  AnalyticsData,
  AnalyticsProps,
  MetricsProps,
  ChartsProps,
  AnalyticsTab,
  UseAnalyticsOptions,
  UseAnalyticsReturn,
  AnalyticsApiResponse,

  // Geographic
  GeographicData,
  ContinentData,
  GeographicAnalysisProps,
  GeographicChartProps,
  GeographicInsightsProps,
  GeographicMetricsProps,

  // Temporal
  TemporalData,
  DailyData,
  MonthlyData,
  TemporalStats,
  TemporalAnalysisProps,
  TemporalChartProps,
  TemporalInsightsProps,
  TemporalPeriodConfig,
  UseTemporalDataOptions,
  UseTemporalDataReturn,
  TemporalPattern,
  // Enhanced temporal types
  HourlyPatternData,
  WeekendVsWeekdayData,
  BusinessHoursData,
  // Advanced temporal types (from unified endpoint)
  PeakAnalysis,
  TimezoneAnalysis,
  AdvancedTemporalData,

  // Audience
  BrowserData,
  OSData,
  ReferrerData,
  AudienceData,
  AudienceStats,
  AudienceAnalysisProps,
  AudienceChartProps,
  AudienceInsightsProps,
  AudienceMetricsProps,
  UseAudienceDataOptions,
  UseAudienceDataReturn,
  AudienceApiResponse,
  AudienceSegment,
  // NEW: Enhanced audience types
  DevicePerformanceData,
  LanguageData,
} from "./analytics";

// ========================================
// 📝 NOTA PARA DESENVOLVEDORES
// ========================================
/**
 * COMO USAR ESTA ESTRUTURA DE TIPOS:
 *
 * 1. IMPORTAÇÃO SIMPLES (Recomendado):
 *    import type { AnalyticsData, DeviceData } from '@/types';
 *
 * 2. IMPORTAÇÃO ESPECÍFICA (Para casos específicos):
 *    import type { GeographicData } from '@/types/analytics/geographic';
 *
 * 3. IMPORTAÇÃO DE CORE (Para tipos base):
 *    import type { ApiResponse, ID } from '@/types/core';
 *
 * ORGANIZAÇÃO:
 * - /types/core/        → Tipos base compartilhados
 * - /types/analytics/   → Tipos específicos de analytics
 * - /types/index.ts     → Entry point principal (este arquivo)
 *
 * BENEFÍCIOS:
 * ✅ Zero duplicação de tipos
 * ✅ Imports consistentes e limpos
 * ✅ Fácil manutenção e evolução
 * ✅ IntelliSense melhorado
 * ✅ Estrutura modular e escalável
 */
