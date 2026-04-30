/**
 * Services Barrel Exports - Centralized Services
 *
 * This file centralizes all service exports for easy importing
 * and better organization of the codebase.
 */

// Base service
export { BaseService } from './base.service';

// Auth services
export { default as AuthService } from './auth.service';

// Link services
export { default as LinkService } from './link.service';

// Profile services
export { default as ProfileService } from './profile.service';

// Analytics services
export { default as AnalyticsService } from './analytics.service';

// Service instances (singletons)
import AnalyticsService from './analytics.service';
import AuthService from './auth.service';
import LinkService from './link.service';
import ProfileService from './profile.service';

export const authService = new AuthService();
export const linkService = new LinkService();
export const profileService = new ProfileService();
export const analyticsService = new AnalyticsService();

// Re-export types that might be needed
export type { UserProfile } from '../features/profile/types/user';
