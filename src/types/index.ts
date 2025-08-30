/**
 * 📄 GLOBAL TYPES EXPORTS
 * Barrel exports para tipos globais
 */

// Re-export main types (avoiding conflicts)
export type { ApiError } from './api';
export * from './common';

// Re-export specific types to avoid conflicts
export type { AnalyticsData } from '../features/analytics/types/analytics';
export type { LinkPerformanceDashboard } from '../features/analytics/types/linkPerformance';
export type { LinkCreateRequest, LinkUpdateRequest, LinkResponse } from '../features/links/types/link';
export type { IShortUrl, ShortenRequest } from '../features/links/types/shorter';
export type { User, UserProfile, LoginResponse, UserResponse } from '../features/profile/types/user';
