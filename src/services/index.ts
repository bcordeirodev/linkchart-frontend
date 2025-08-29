/**
 * Índice centralizado de todos os services
 *
 * Exporta todas as instâncias de services e suas funções
 * para fácil acesso e importação em toda a aplicação
 */

// Base Service (for extending)
export { BaseService } from './base.service';
export type { ServiceResponse, PaginatedResponse, ErrorResponse } from './base.service';

// Authentication Service
export { authService, signIn, signUp, getMe, signOut } from './auth.service';
export type { LoginRequest, RegisterRequest } from './auth.service';

// Link Service
export { linkService, save, update, all, findOne, remove, getAnalytics } from './link.service';
export type { CreateLinkRequest, UpdateLinkRequest, CreateLinkResponse } from './link.service';

// Profile Service
export { profileService, getCurrentUser, updateProfile } from './profile.service';
export type { UserProfile, UpdateProfileRequest, UpdateProfileResponse } from './profile.service';

// Analytics Service
export { analyticsService } from './analytics.service';

// Logs Service
export { logsService } from './logs.service';
export type { LogEntry, SystemDiagnostic } from './logs.service';

// Reports Service
export { reportsService } from './reports.service';
export type { DashboardReport, ExecutiveReport } from './reports.service';

// Imports locais para o objeto services
import { authService as _authService } from './auth.service';
import { linkService as _linkService } from './link.service';
import { profileService as _profileService } from './profile.service';
import { analyticsService as _analyticsService } from './analytics.service';

import { logsService as _logsService } from './logs.service';
import { reportsService as _reportsService } from './reports.service';

/**
 * Objeto consolidado com todos os services
 *
 * Uso:
 * import { services } from '@/services';
 * const links = await services.link.all();
 * const analytics = await services.analytics.getAnalytics();
 */
export const services = {
    auth: _authService,
    link: _linkService,
    profile: _profileService,
    analytics: _analyticsService,
    logs: _logsService,
    reports: _reportsService
} as const;

/**
 * Hook helper para usar services em componentes React
 *
 * Uso:
 * const { link, analytics } = useServices();
 * const links = await link.all();
 */
export function useServices() {
    return {
        auth: _authService,
        link: _linkService,
        profile: _profileService,
        analytics: _analyticsService,
        logs: _logsService,
        reports: _reportsService
    };
}