/**
 * Services Barrel Exports
 */

// Auth services
import AuthService from '../auth/auth.service';
export const authService = new AuthService();

// Link services
import LinkService from '../../features/links/services/link.service';
export const linkService = new LinkService();

// Profile services
import ProfileService from '../../features/profile/services/profile.service';
export const profileService = new ProfileService();

// Analytics services
import AnalyticsService from '../../features/analytics/services/analytics.service';
export const analyticsService = new AnalyticsService();

import ReportsService from '../../features/analytics/services/reports.service';
export const reportsService = new ReportsService();

// Utils services
import LogsService from '../utils/logs.service';
export const logsService = new LogsService();

// Types re-exports
export type { UserProfile } from '../../features/profile/types/user';
