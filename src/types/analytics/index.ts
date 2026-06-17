/**
 * @fileoverview Exports centralizados dos tipos de Analytics
 * @author Link Charts Team
 * @version 1.0.0
 */

// Re-exports de tipos base de analytics
export type {
  AnalyticsData,
  AnalyticsProps,
  MetricsProps,
  ChartsProps,
  AnalyticsTab,
  UseAnalyticsOptions,
  UseAnalyticsReturn,
  AnalyticsApiResponse,
} from "./base";

// Re-exports de tipos geográficos
export type {
  GeographicData,
  ContinentData,
  GeographicAnalysisProps,
  GeographicChartProps,
  GeographicInsightsProps,
  GeographicMetricsProps,
} from "./geographic";

// Re-exports de tipos temporais
export type {
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
} from "./temporal";

// Re-exports de tipos de audiência
export type {
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
} from "./audience";

// Re-exports de tipos core (para compatibilidade)
export type {
  DeviceData,
  CountryData,
  StateData,
  CityData,
  HourlyData,
  DayOfWeekData,
  HeatmapPoint,
} from "../core/api";

// Re-exports de tipos de dashboard
export type {
  DashboardData,
  DashboardSummary,
  DashboardLink,
  ActivityData,
  GeographicSummary,
  DeviceSummary,
  PerformanceIndicator,
  DashboardStats,
  UseDashboardDataOptions,
  UseDashboardDataReturn,
  DashboardAnalyticsProps,
  DashboardMetricsProps,
  TopLinksProps,
  DashboardViewConfig,
  DashboardFilters,
  DashboardApiResponse,
} from "./dashboard";

// Re-exports de tipos de insights
export type {
  BusinessInsight,
  InsightType,
  InsightPriority,
  InsightsData,
  InsightsSummary,
  InsightCategories,
  InsightTrend,
  InsightsStats,
  UseInsightsDataOptions,
  UseInsightsDataReturn,
  BusinessInsightsProps,
  InsightCardProps,
  InsightsMetricsProps,
  InsightAction,
  InsightGenerationConfig,
  InsightsFilters,
  InsightsApiResponse,
  InsightContext,
} from "./insights";
